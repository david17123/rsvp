import { Response } from 'express'

import Mailer from '../../services/mailer'
import { sendMarkdownMessage } from '../../services/slack'
import * as ControllerTypes from './controllerTypes'

export const addSubscription = async (req: ControllerTypes.AddSubscriptionRequest, res: Response) => {
  try {
    const { email, firstName } = req.body
    const lastName = req.body.lastName || ''
    const mailer = new Mailer()

    await mailer.createOrUpdateContact(email, firstName, lastName, [Mailer.NEWSLETTER_UPDATES_LIST_ID])
    await mailer.sendEmailTemplate(Mailer.NEWSLETTER_WELCOME_TEMPLATE_ID, null, email)

    const fullName = firstName + (lastName ? ` ${lastName}` : '')
    await sendMarkdownMessage(`*${fullName}* has just signed up for newsletter`)

    res.json({ success: true })
  } catch (e) {
    console.error(e)
    res.statusCode = 500
    res.json({
      error: e.message,
    })
  }
}
