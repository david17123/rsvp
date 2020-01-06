import React from 'react'
import ReactDOM from 'react-dom'
import firebase from 'firebase'

import App from './App'

firebase.initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
})

const getMountPoint = (id: string = 'root'): HTMLElement => {
  let rootEl = document.getElementById(id)
  if (!rootEl) {
    rootEl = document.createElement('div')
    rootEl.id = id
    document.getElementsByTagName('body')[0].appendChild(rootEl)
  }
  return rootEl
}

ReactDOM.render(<App />, getMountPoint('root'))
