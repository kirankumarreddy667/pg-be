export interface PaymentRequestBody {
  plan_id: number;
  amount: number;
  currency: string;
  payment_gateway: string;
  number_of_valid_years: number;
  plan_exp_date: string;
  billing_instrument: string;
  offer_id?: number | null;
  coupon_id?: number | null;
}
