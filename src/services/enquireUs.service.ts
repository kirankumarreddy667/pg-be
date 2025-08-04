import { EnquireUs } from '@/models/enquireUs.model'
import { addToEmailQueue } from '@/queues/email.queue'

export class EnquireUsService {
  static async create(data: {
    first_name: string
    last_name?: string
    email: string
    phone: string
    query: string
  }): Promise<EnquireUs> {
    const enquiry = await EnquireUs.create({
      first_name: data.first_name,
      last_name: data.last_name ?? '',
      email: data.email,
      phone_number: data.phone,
      query: data.query,
    })

    void addToEmailQueue({
      to: 'saniya8537@gmail.com',
      subject: `Enquiry from ${data.first_name}`,
      template: 'enquiryNotification',
      data: {
        first_name: data.first_name,
        last_name: data.last_name ?? '',
        email: data.email,
        phone: data.phone,
        query: data.query,
      },
    })

    return enquiry
  }

  static async listAll(): Promise<EnquireUs[]> {
    return EnquireUs.findAll({
      order: [['created_at', 'DESC']],
    })
  }
}
