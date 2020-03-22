import ApiBase from './apiBase';

export default class SmtpApi extends ApiBase {
  constructor(apiKey: string) {
    super(apiKey);
  }

  public async getSmtpTemplates(params: SmtpApiTypes.GetTemplatesParams): Promise<SmtpApiTypes.GetTemplatesReturn> {
    const { templateStatus, ...rest } = params;
    const body = {
      templateStatus: typeof templateStatus === 'boolean' ? templateStatus : true,
      ...rest,
    };

    return this.sendRequest('GET', 'smtp/templates', {}, body);
  }

  public sendTransacEmail(params: SmtpApiTypes.SendTransacEmailParams): Promise<SmtpApiTypes.SendTransacEmailReturn> {
    return this.sendRequest('POST', 'smtp/email', {}, params);
  }
}

export namespace SmtpApiTypes {
  export interface SendEmailSender {
    name?: string,
    email: string,
  }

  export interface SendEmailTo {
    name?: string,
    email: string,
  }

  export interface SendEmailCc {
    name?: string,
    email: string,
  }

  export interface SendEmailBcc {
    name?: string,
    email: string,
  }

  export interface SendEmailReplyTo {
    name?: string,
    email: string,
  }

  export interface SendEmailAttachment {
    /** Absolute URL of the attachment (no local data) */
    url?: string,
    /** Base64 encoded attachment content data */
    content?: Blob,
    /** Name of attachment if passing by content */
    name?: string,
  }

  export interface TemplateOverviewSender {
    name?: string,
    email?: string,
  }

  export interface GetTemplatesParams {
    /** Active or inactive templates */
    templateStatus?: boolean,
    /** Number of documents per page */
    limit?: number,
    /** Index of the first document in the page */
    offset?: number,
  }

  export interface TemplateOverview {
    id: number,
    name: string,
    subject: string,
    isActive: boolean,
    testSent: boolean,
    sender: TemplateOverviewSender,
    replyTo: string,
    toField: string,
    tag: string,
    htmlContent: string,
    createdAt: Date,
    modifiedAt: Date,
  }

  export interface GetTemplatesReturn {
    count?: number,
    templates?: Array<TemplateOverview>,
  }

  export interface SendTransacEmailParams {
    sender?: SendEmailSender,
    to: Array<SendEmailTo>,
    cc?: Array<SendEmailCc>,
    bcc?: Array<SendEmailBcc>,
    htmlContent?: string,
    textContent?: string,
    subject?: string,
    replyTo?: SendEmailReplyTo,
    attachment?: Array<SendEmailAttachment>,
    headers?: Object,
    templateId?: number,
    params?: Object,
    tags?: Array<string>,
  }

  export interface SendTransacEmailReturn {
    messageId: string,
  }
}
