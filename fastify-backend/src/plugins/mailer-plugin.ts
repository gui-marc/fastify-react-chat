import { render } from "@react-email/components";
import { FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";
import nodemailer from "nodemailer";

declare module "fastify" {
  interface FastifyInstance {
    mailer: {
      sendEmail({
        to,
        subject,
        component,
      }: {
        to: string;
        subject: string;
        component: React.ReactElement;
      }): Promise<unknown>;
    };
  }
}

const plugin: FastifyPluginAsync = async (fastify, options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    tls: {
      rejectUnauthorized: process.env.SMTP_SECURE === "true",
    },
    requireTLS: process.env.SMTP_SECURE === "true",
    ...(process.env.SMTP_SECURE === "true"
      ? {
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        }
      : {}),
  });

  async function sendEmail({
    to,
    subject,
    component,
  }: {
    to: string;
    subject: string;
    component: React.ReactElement;
  }) {
    const html = await render(component);
    const messageInfo = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
    });
    return messageInfo;
  }

  fastify.decorate("mailer", { sendEmail });
};

const MailerPlugin = fastifyPlugin(plugin);

export default MailerPlugin;
