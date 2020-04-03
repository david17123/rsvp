import admin from 'firebase-admin'
import * as functions from 'firebase-functions'

export interface FunctionsConfig {
  sendinblue: {
    key: string,
  },
  slack: {
    webhook: string,
  }
}

const app = admin.initializeApp()
export const db = admin.firestore()
export const auth = admin.auth()
export const config: FunctionsConfig = functions.config() as FunctionsConfig

export default app
