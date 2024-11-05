import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

class EmailService {
    private transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'host.docker.internal',
        port: parseInt(process.env.SMTP_PORT || '1025'),
    });

    private prisma = new PrismaClient();

    async sendQueuedEmails() {
        const pendingEmails = await this.prisma.emailQueue.findMany({
            where: { status: 'PENDING' },
            take: 10,
        });

        for (const email of pendingEmails) {
            try {
                const emailOption = {
                    from: process.env.DEFAULT_SENDER_EMAIL,
                    to: email.to,
                    subject: email.subject,
                    text: email.body,
                };
                await this.transporter.sendMail(emailOption);

                await this.prisma.emailQueue.update({
                    where: { id: email.id },
                    data: { status: 'SENT' },
                });
            } catch (error) {
                console.error(`Failed to send email to ${email.to}:`, error);
                await this.prisma.emailQueue.update({
                    where: { id: email.id },
                    data: { status: 'FAILED' },
                });
            }
        }
    }
}

export default new EmailService();
