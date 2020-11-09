import SendInBlue, { SmtpApiTypes } from './sendInBlue'
import { config } from '../admin'

export default class Mailer {
  static _instance: Mailer | null = null
  private sendInBlue: SendInBlue

  static NEWSLETTER_UPDATES_LIST_ID = 3
  static RSVP_GUESTS_LIST_ID = 4
  static NEWSLETTER_WELCOME_TEMPLATE_ID = 9
  static RSVP_GUEST_ADDED_TEMPLATE_ID = 10

  static getInstance() {
    if (!Mailer._instance) {
      Mailer._instance = new Mailer()
    }
    return Mailer._instance
  }

  constructor() {
    this.sendInBlue = new SendInBlue(config.sendinblue.key)
  }

  async sendEmailTemplate(templateId: number, templateData: {[key: string]: any} | null, email: string, name?: string): Promise<void> {
    const target: SmtpApiTypes.SendEmailTo = { email }
    if (name) {
      target.name = name
    }
    const sendTransacEmailParams: SmtpApiTypes.SendTransacEmailParams = {
      to: [ target ],
      templateId: templateId,
    }
    if (templateData) {
      sendTransacEmailParams.params = templateData
    }

    const { messageId } = await this.sendInBlue.SmtpApi.sendTransacEmail(sendTransacEmailParams)

    // Might want to log to logging tool like Sentry
    console.log(messageId)
  }

  async createOrUpdateContact(email: string, firstName: string = '', lastName: string = '', listIds: Array<number> = []) {
    const createContactData = {
      email,
      attributes: {
        FIRSTNAME: firstName,
        LASTNAME: lastName,
      },
      listIds,
      updateEnabled: true,
    }

    if (listIds.length === 0) {
      delete(createContactData.listIds)
    }

    await this.sendInBlue.ContactsApi.createContact(createContactData)

    // Might want to log to logging tool like Sentry
    console.log('Added person to Email Campaign platform')
  }
}
