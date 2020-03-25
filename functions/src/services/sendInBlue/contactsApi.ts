import ApiBase from './apiBase'
import * as ContactsApiTypes from './contactsApiTypes'

export default class ContactsApi extends ApiBase {
  constructor(apiKey: string) {
    super(apiKey)
  }

  public createContact(params: ContactsApiTypes.CreateContactParams): Promise<ContactsApiTypes.CreateContactReturn> {
    return this.sendRequest('POST', 'contacts', {}, params)
  }
}
