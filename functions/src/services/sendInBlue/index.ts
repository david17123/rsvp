import SmtpApi from './smtpApi';
import ContactsApi from './contactsApi';

/**
 * A simple (partial) wrapper to the SendInBlue Rest API endpoints. The wrapper
 * functions will return rejected promises if the API request fails, which has
 * to be handled properly.
 */
export default class SendInBlue {
  public SmtpApi: SmtpApi;
  public ContactsApi: ContactsApi;

  constructor(apiKey: string) {
    this.SmtpApi = new SmtpApi('');
    this.ContactsApi = new ContactsApi('');
    this.setApiKey(apiKey);
  }

  public setApiKey(apiKey: string) {
    this.SmtpApi.setApiKey(apiKey);
    this.ContactsApi.setApiKey(apiKey);
  }
}

export * from './smtpApi';
export * as SmtpApiTypes from './smtpApiTypes';
export * from './contactsApi';
export * as ContactsApiTypes from './contactsApi';
