import ApiBase from './apiBase'
import * as SmtpApiTypes from './smtpApiTypes'

export default class SmtpApi extends ApiBase {
  constructor(apiKey: string) {
    super(apiKey)
  }

  public async getSmtpTemplates(params: SmtpApiTypes.GetTemplatesParams): Promise<SmtpApiTypes.GetTemplatesReturn> {
    const { templateStatus, ...rest } = params
    const body = {
      templateStatus: typeof templateStatus === 'boolean' ? templateStatus : true,
      ...rest,
    }

    return this.sendRequest('GET', 'smtp/templates', {}, body)
  }

  public sendTransacEmail(params: SmtpApiTypes.SendTransacEmailParams): Promise<SmtpApiTypes.SendTransacEmailReturn> {
    return this.sendRequest('POST', 'smtp/email', {}, params)
  }
}
