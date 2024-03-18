import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
const OAuth2 = google.auth.OAuth2;

@Injectable()
export class MailerService {

    private async createTransporter() {
        const oauth2Client = new OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            "https://developers.google.com/oauthplayground"
        );

        oauth2Client.setCredentials({
            refresh_token: process.env.REFRESH_TOKEN
        });

        const accessToken = await new Promise((resolve, reject) => {
            oauth2Client.getAccessToken((err, token) => {
                if (err) {
                    reject();
                }
                resolve(token);
            });
        });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            secure:false,
            auth: {
                type: "OAuth2",
                user: process.env.EMAIL,
                accessToken,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN
            }
        } as nodemailer.TransportOptions);

        return transporter;
    };

    async sendMain(emailOptions: any) {
        let emailTransporter = await this.createTransporter();
        await emailTransporter.sendMail(emailOptions);
    };

}
