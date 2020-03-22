import SmtpApi from './smtpApi';

/**
 * A simple (partial) wrapper to the SendInBlue Rest API endpoints. The wrapper
 * functions will return rejected promises if the API request fails, which has
 * to be handled properly.
 */
export default class SendInBlue {
  public SmtpApi: SmtpApi;

  constructor(apiKey: string) {
    this.SmtpApi = new SmtpApi('');
    this.setApiKey(apiKey);
  }

  public setApiKey(apiKey: string) {
    this.SmtpApi.setApiKey(apiKey);
  }
}

export * from './smtpApi';
