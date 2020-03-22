import https from 'https';
import http from 'http';
import querystring from 'querystring';

export default class ApiBase {
  protected apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  public setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  protected sendRequest(method: 'GET' | 'POST' | 'PUT' | 'DELETE', uri: string, headers: http.OutgoingHttpHeaders, body: Object) {
    return new Promise<any>((resolve, reject) => {
      const bodyPayload: string = method !== 'GET' ? JSON.stringify(body) : '';
      let composedUri: string = `/v3/${uri}`;
      if (method === 'GET' && !!body) {
        composedUri += `?${querystring.encode(body as querystring.ParsedUrlQueryInput)}`;
      }

      const options = {
        hostname: 'api.sendinblue.com',
        port: 443,
        path: composedUri,
        method,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': bodyPayload.length,
          'Accept': 'application/json',
          'api-key': this.apiKey,
          ...headers,
        },
      };

      const req = https.request(options, (res) => {

        let responseBody = '';

        res.on('data', (chunk) => {
          responseBody += chunk.toString();
        });

        res.on('end', () => {
          if (res.statusCode) {
            if (Math.floor(res.statusCode / 100) === 4 || Math.floor(res.statusCode / 100) === 5) {
              reject({
                statusCode: res.statusCode,
                statusMessage: res.statusMessage,
                error: JSON.parse(responseBody),
              });
              return;
            }
          }
          resolve(JSON.parse(responseBody));
        })
      });

      req.on('error', error => {
        reject(error);
      });

      if (body !== null) {
        req.write(bodyPayload);
      }

      req.end();
    });
  }
}
