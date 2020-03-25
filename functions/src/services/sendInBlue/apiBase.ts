import https from 'https'
import http from 'http'
import querystring from 'querystring'

export default class ApiBase {
  protected apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  public setApiKey(apiKey: string) {
    this.apiKey = apiKey
  }

  protected sendRequest(method: 'GET' | 'POST' | 'PUT' | 'DELETE', uri: string, headers: http.OutgoingHttpHeaders, body: Object) {
    return new Promise<any>((resolve, reject) => {
      const bodyPayload: string = method !== 'GET' ? JSON.stringify(body) : ''
      let composedUri: string = `/v3/${uri}`
      if (method === 'GET' && !!body) {
        composedUri += `?${querystring.encode(body as querystring.ParsedUrlQueryInput)}`
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
      }

      const req = https.request(options, (res) => {
        const chunks: Array<Uint8Array> = []

        res.on('data', (chunk) => {
          chunks.push(chunk)
        })

        res.on('end', () => {
          const responseBody = Buffer.concat(chunks).toString()
          const parsedResponse = responseBody ? JSON.parse(responseBody) : null

          if (res.statusCode) {
            if (Math.floor(res.statusCode / 100) === 4 || Math.floor(res.statusCode / 100) === 5) {
              reject({
                statusCode: res.statusCode,
                statusMessage: res.statusMessage,
                error: parsedResponse,
              })
              return
            }
          }
          resolve(parsedResponse)
        })
      })

      req.on('error', error => {
        reject(error)
      })

      if (body !== null) {
        req.write(bodyPayload)
      }

      req.end()
    })
  }
}
