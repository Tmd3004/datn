import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const config = {
  service: 'gmail',
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
};

export const transporter = nodemailer.createTransport(config);
