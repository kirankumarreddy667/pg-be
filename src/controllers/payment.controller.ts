import { RequestHandler } from 'express';
import { UserPaymentService } from '@/services/userPayment.service';
import RESPONSE from '@/utils/response';
import { User } from '@/models/user.model';
import { PaymentRequestBody } from '@/types/payment';

export class UserPaymentController {
  static readonly createUserPayment: RequestHandler = async (req, res, next) => {
    try {
      const user = req.user as User;
      const userId = user.id;
      // Validate and type paymentData
      const paymentData = req.body as PaymentRequestBody;
      const result = await UserPaymentService.createUserPayment(userId, paymentData);
      return RESPONSE.SuccessResponse(res, 201, {
        data: result,
        message: 'Payment initiated successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  public static readonly getUserPaymentDetails: RequestHandler = async (req, res, next) => {
    try {
      const user = req.user as User;
      const userId = user.id;
      const { payment_id } = req.body as { payment_id: string };
      const result = await UserPaymentService.getUserPaymentDetails(userId, payment_id);
      return RESPONSE.SuccessResponse(res, 200, {
        data: result,
        message: 'Payment completed and details saved',
      });
    } catch (error) {
      next(error);
    }
  };

  public static readonly getPlanPaymentHistory: RequestHandler = async (req, res, next) => {
    try {
      const user = req.user as User;
      const userId = user.id;
      const history = await UserPaymentService.getPlanPaymentHistory(userId);
      return RESPONSE.SuccessResponse(res, 200, {
        data: history,
        message: 'Plan payment history fetched successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
