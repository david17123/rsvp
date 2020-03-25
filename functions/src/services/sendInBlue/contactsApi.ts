import ApiBase from './apiBase';

export default class ContactsApi extends ApiBase {
  constructor(apiKey: string) {
    super(apiKey);
  }

  public createContact(params: ContactsApi.CreateContactParams): Promise<ContactsApi.CreateContactReturn> {
    return this.sendRequest('POST', 'contacts', {}, params);
  }
}

export namespace ContactsApi {
  export interface CreateContactParams {
    email: string,
    listIds: Array<number>,
    attributes?: Object,
    emailBlacklisted?: boolean,
    smsBlacklisted?: boolean,
    updateEnabled?: boolean,
    smtpBlacklistSender?: Array<string>,
  }

  export interface CreateContactReturn {
    id: number,
  }
}
