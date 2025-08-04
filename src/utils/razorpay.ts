// src/utils/razorpay.ts

import Razorpay from 'razorpay';
import { razorpayConfig } from '@/config/razorpay.config';



const razorpay = new Razorpay({
  key_id: razorpayConfig.key_id,
  key_secret: razorpayConfig.key_secret,
});

// Add a custom interface for what we return from createOrder()
export interface CreateRazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
}

export const createOrder = async (
  amount: number,
  currency: string = razorpayConfig.currency
): Promise<CreateRazorpayOrderResponse> => {
  const order = await razorpay.orders.create({
    amount: amount * 100, // convert to paise
    currency,
    payment_capture: true,
  });

  return {
    id: order.id,
    amount: Number(order.amount),
    currency: order.currency,
  };
};

export const fetchPayment = async (paymentId: string) : Promise<unknown> => {
  return await razorpay.payments.fetch(paymentId);
};

export const verifySignature = async (
  orderId: string,
  razorpayPaymentId: string,
  signature: string
): Promise<boolean> => {
  const crypto = await import('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', razorpayConfig.key_secret)
    .update(`${orderId}|${razorpayPaymentId}`)
    .digest('hex');

  return expectedSignature === signature;
};
