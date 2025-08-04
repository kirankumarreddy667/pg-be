import db from '@/config/database'
import { PaymentRequestBody } from '@/types/payment'
import { createOrder, fetchPayment } from '@/utils/razorpay'
import { addToEmailQueue } from '@/queues/email.queue'

interface PaymentStatus {
  method?: string
  status: string
}
export class UserPaymentService {
  static async createUserPayment(
    userId: number,
    data: PaymentRequestBody
  ): Promise<Record<string, unknown>> {
    const {
      plan_id,
      coupon_id,
      offer_id,
      currency,
      amount,
      number_of_valid_years,
      plan_exp_date,
      billing_instrument,
    } = data
    const razorpayOrder = await createOrder(amount, currency)
    const user = await db.User.findByPk(userId);
    const payment = await db.UserPayment.create({
      user_id: userId,
      plan_id,
      coupon_id,
      offer_id,
      amount,
      payment_id: razorpayOrder.id,
      num_of_valid_years: number_of_valid_years ?? 1,
      plan_exp_date: plan_exp_date ? new Date(plan_exp_date) : new Date(),
      billing_instrument: billing_instrument ?? '-',
      phone: user?.phone_number ?? '-',
    })
    return {
      ...payment.toJSON(),
      razorpay_order_id: razorpayOrder.id,
      razorpay_amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    }
  }
  static async getUserPaymentDetails(
    userId: number,
    paymentId: string
  ): Promise<{ payment: unknown; expDate: Date }> {
    const user = await db.User.findByPk(userId);

    if (!user) throw new Error('User not found');
    const paymentStatus = (await fetchPayment(paymentId)) as PaymentStatus & {
      order_id: string;
    };
    const orderId = paymentStatus.order_id;
    if (!orderId) throw new Error('Order ID not found in Razorpay payment');
    const payment = await db.UserPayment.findOne({
      where: { user_id: userId, payment_id: orderId },
    });
    if (!payment) throw new Error('Payment record not found');
    const plan = await db.Plan.findByPk(payment.plan_id);
    let quantity = 1;
    let month_year = 'Year';
    let offerTitle = '-';
    let couponCode = '-';
    if (payment.offer_id) {
      const offer = await db.Offer.findByPk(payment.offer_id);
      if (offer) {
        quantity = offer.additional_years || offer.additional_months || 1;
        month_year = offer.additional_months ? 'Months' : 'Year';
        offerTitle = `Offer ID ${offer.id}`;
      }
    }
    if (payment.coupon_id) {
      const coupon = await db.Coupon.findByPk(payment.coupon_id);
      if (coupon && typeof coupon.coupon_code === 'string') {
        couponCode = coupon.coupon_code;
      }
    }
    const latestHistory = await db.UserPaymentHistory.findOne({
      where: { user_id: userId },
      order: [['createdAt', 'DESC']],
    });
    const currentDate = latestHistory?.plan_exp_date
      ? new Date(latestHistory.plan_exp_date)
      : new Date();

    const planExpDate = new Date(currentDate);
    if (month_year === 'Months') {
      planExpDate.setMonth(planExpDate.getMonth() + quantity);
    } else {
      planExpDate.setFullYear(planExpDate.getFullYear() + quantity);
    }
    if (isNaN(planExpDate.getTime())) {
      throw new Error('Invalid plan expiration date calculated');
    }
    //  Save payment history
    const paymentHistory = await db.UserPaymentHistory.create({
      user_id: userId,
      plan_id: payment.plan_id,
      amount: payment.amount,
      payment_id: paymentId,
      num_of_valid_years: quantity,
      plan_exp_date: planExpDate,
      email: user.email ?? '',
      phone: user.phone_number ?? '',
      billing_instrument: paymentStatus.method || '-',
      coupon_id: payment.coupon_id || null,
      offer_id: payment.offer_id || null,
      status: paymentStatus.status,
    });

    // Update or create in user_payment table
    const existingPlan = await db.UserPayment.findOne({
      where: { user_id: userId },
    });

    if (existingPlan) {
      await existingPlan.update({
        plan_id: payment.plan_id,
        num_of_valid_years: quantity,
        plan_exp_date: planExpDate,
        amount: payment.amount,
        payment_history_id: paymentHistory.id,
        payment_id: paymentId,
        billing_instrument: paymentStatus.method || '-',
        phone: user.phone_number,
        email: user.email ?? '',
        coupon_id: payment.coupon_id || null,
        offer_id: payment.offer_id || null,
      });
    } else {
      await db.UserPayment.create({
        user_id: userId,
        plan_id: payment.plan_id,
        num_of_valid_years: quantity,
        plan_exp_date: planExpDate,
        amount: payment.amount,
        payment_history_id: paymentHistory.id,
        payment_id: paymentId,
        billing_instrument: paymentStatus.method || '-',
        phone: user.phone_number,
        email: user.email ?? '',
        coupon_id: payment.coupon_id || null,
        offer_id: payment.offer_id || null,
      });
    }

    //  Update user's status to premium
    await user.update({ payment_status: 'premium' });

    //  Send email to user
    addToEmailQueue({
      to: user.email || '',
      subject: `Thank you ${user.name}, for updating your Powergotha plan`,
      template: 'planPaymentSuccess',
      data: {
        name: user.getDataValue('name'),
        quantity,
        amount: payment.amount,
        coupon: couponCode !== '-' ? 'Yes' : 'No',
        coupon_code: couponCode,
        offer: offerTitle !== '-' ? 'Yes' : 'No',
        offer_name: offerTitle,
        month_year,
      },
    });

    //  Send email to admin
    addToEmailQueue({
      to: 'saniya8537@gmail.com',
      subject: `Powergotha plan update details of ${user.name}`,
      template: 'adminPlanPaymentSuccess',
      data: {
        plan_name: plan?.name || 'Premium Subscription',
        quantity,
        name: user.getDataValue('name'),
        email: user.getDataValue('email') ?? '',
        phone: user.getDataValue('phone_number'),
        amount: payment.amount,
        coupon_code: couponCode,
        offer_name: offerTitle,
        month_year,
      },
    });
    if (!user || !user.getDataValue('name') || !user.getDataValue('email') || !user.getDataValue('phone_number')) {
      throw new Error('User details incomplete — cannot send admin email.');
    }
    return {
      payment,
      expDate: planExpDate,
    };
  }
  static async getPlanPaymentHistory(userId: number): Promise<unknown[]> {
    return await db.UserPaymentHistory.findAll({
      where: { user_id: userId },
      include: [{ model: db.Plan, as: 'plan', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']],
    })
  }
}
