import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  async sendWelcome(email: string, nickName: string, password: string) {
    console.log(`Placeholder: Email to ${email} - Welcome ${nickName}, pass: ${password}`); // В реале: nodemailer с SMTP
    // Не отправляйте plain password! Используйте reset-token.
  }
}