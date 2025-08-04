import { RequestHandler } from 'express';
import { EnquireUsService } from '@/services/enquireUs.service';
import RESPONSE from '@/utils/response';

export class EnquireUsController {
  static createEnquiry: RequestHandler = async (req, res, next) => {
    try {
      const enquiry = await EnquireUsService.create(req.body as {
        first_name: string;
        last_name?: string;
        email: string;
        phone: string;
        query: string;
      });

      RESPONSE.SuccessResponse(res, 201, {
        message: 'Enquiry submitted successfully',
        data: enquiry,
      });
    } catch (error) {
      next(error);
    }
  };

  static listAll: RequestHandler = async (_req, res, next) => {
    try {
      const enquiries = await EnquireUsService.listAll();
      RESPONSE.SuccessResponse(res, 200, {
        message: 'All enquiries fetched successfully',
        data: enquiries,
      });
    } catch (error) {
      next(error);
    }
  };
}
