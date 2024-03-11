import twilio from "twilio";

export const setupTwilio = async () => {
  try {
    const account_sid = process.env.TWILIO_ACCOUNT_SID;
    const auth_token = process.env.TWILIO_AUTH_TOKEN;

    const client = twilio(account_sid, auth_token, {
      autoRetry: true,
    });

    const payload = (await client.tokens.create()).iceServers;

    return payload;
  } catch (error) {
    return error;
  }
};
