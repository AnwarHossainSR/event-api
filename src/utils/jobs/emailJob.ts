import cron from 'node-cron';
import EmailService from '../emailService';

class EmailJob {
    constructor() {
        this.start();
    }

    async sendQueuedEmails() {
        await EmailService.sendQueuedEmails();
    }

    start() {
        cron.schedule('* * * * *', async () => {
            console.log('Running email queue processor...');
            await this.sendQueuedEmails();
        });
    }
}

export default EmailJob;
