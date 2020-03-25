import express from 'express'
import cors from 'cors'

import {
  addSubscription,
} from './controllers'

const app = express()

app.use(cors())

app.post('/', addSubscription)

export default app
