import { Response } from 'express';

import Mailer from '../../services/mailer';
import ControllerTypes from './controllerTypes';

export const addSubscription = async (req: ControllerTypes.AddSubscription.Request, res: Response) => {
  try {
    const { email } = req.body;
    const mailer = new Mailer();

    await mailer.createOrUpdateContact(email);
    mailer.sendEmailTemplate(Mailer.NEWSLETTER_WELCOME_TEMPLATE_ID, {}, email);

    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    res.json({
      error: e.message
    });
  }
};
