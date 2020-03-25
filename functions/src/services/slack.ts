import https from 'https'
import url from 'url'

import { config } from '../admin'

export const sendMarkdownMessage = (markdown: string) => {
  return sendMessage({
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: markdown,
        },
      },
    ],
  })
}

export const sendMessage = (payload: Object) => {
  return new Promise<any>((resolve, reject) => {
    const webhookUrl = url.parse(config.slack.webhook)

    const options = {
      method: 'POST',
      hostname: webhookUrl.hostname,
      port: webhookUrl.port,
      path: webhookUrl.path,
      headers: {
        'content-type': 'application/json',
      },
    }

    const req = https.request(options, (res) => {
      const chunks: Array<Uint8Array> = []

      res.on('data', (chunk) => {
        chunks.push(chunk)
      })

      res.on('end', function () {
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

    req.write(JSON.stringify(payload))
    req.end()
  })
}
