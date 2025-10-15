import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  async sendWelcome(email: string, nickname: string, password: string) {
    console.log(`Placeholder: Email to ${email} - Welcome ${nickname}, pass: ${password}`); // В реале: nodemailer с SMTP
    // Не отправляйте plain password! Используйте reset-token.
  }
}