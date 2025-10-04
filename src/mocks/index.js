// src/mocks/index.js
import { worker } from './browser'

// Start the worker when in development mode
if (import.meta.env.DEV) {
  worker.start({
    onUnhandledRequest: 'bypass', // Allow unhandled requests to pass through
  })
}
