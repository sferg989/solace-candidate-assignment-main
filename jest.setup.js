import '@testing-library/jest-dom'

// Add TextEncoder/TextDecoder polyfill for Node environment
if (typeof TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder
  global.TextDecoder = require('util').TextDecoder
}

// Mock Web API objects not available in Node.js
if (typeof Request === 'undefined') {
  global.Request = class Request {}
  global.Response = class Response {
    constructor(body, options = {}) {
      this.body = body
      this.status = options.status || 200
      this.headers = new Map()
    }
  }
  global.Headers = class Headers {
    constructor() {
      this.map = new Map()
    }
    get() {}
    set() {}
  }
}

// Mock Next.js App Router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: jest.fn().mockReturnValue('/'),
  useSearchParams: jest.fn().mockReturnValue(new URLSearchParams()),
}))

// Legacy router mock
jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
    route: '/',
  }),
}))

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }) => {
    return children
  }
})

