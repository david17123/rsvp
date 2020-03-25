import { Response } from 'express';

import Mailer from '../../services/mailer';
import * as ControllerTypes from './controllerTypes';

export const addSubscription = async (req: ControllerTypes.AddSubscriptionRequest, res: Response) => {
  try {
    const { email } = req.body;
    const mailer = new Mailer();

    await mailer.createOrUpdateContact(email, '', '', [Mailer.NEWSLETTER_UPDATES_LIST_ID]);
    await mailer.sendEmailTemplate(Mailer.NEWSLETTER_WELCOME_TEMPLATE_ID, null, email);

    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    res.json({
      error: e.message
    });
  }
};