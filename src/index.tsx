// @refresh reload

import { render } from 'solid-js/web'
import App from '@/app'
import '@/styles.css'

const root = document.getElementById('root')

if (!(root instanceof HTMLElement)) {
  throw new Error('The app root element was not found.')
}

render(() => <App />, root)
