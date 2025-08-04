import { config } from 'dotenv';
config();

export const razorpayConfig = {
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
  currency: 'INR',
} as const;

if (!razorpayConfig.key_id || !razorpayConfig.key_secret) {
  console.error('Razorpay configuration is missing in .env file');
  throw new Error('Missing Razorpay config values in .env');
}


