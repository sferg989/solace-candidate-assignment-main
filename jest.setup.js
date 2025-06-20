import '@testing-library/jest-dom'

// Add TextEncoder/TextDecoder polyfill for Node environment
if (typeof TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder
  global.TextDecoder = require('util').TextDecoder
}

// Mock Web API objects not available in Node.js
if (typeof Request === 'undefined') {
  global.Request = class Request {
    constructor(input, options = {}) {
      this.url = typeof input === 'string' ? input : input.url
      this.method = options.method || 'GET'
      this.headers = new Headers(options.headers || {})
      this.body = options.body || null
    }
  }
  
  global.Response = class Response {
    constructor(body, options = {}) {
      this.body = body
      this.status = options.status || 200
      this.headers = new Map()
    }
    
    static json(data, options = {}) {
      return new Response(JSON.stringify(data), {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        }
      })
    }
    
    async json() {
      return JSON.parse(this.body)
    }
  }
  
  global.Headers = class Headers {
    constructor(init) {
      this.map = new Map()
      if (init) {
        if (init instanceof Headers) {
          init.forEach((value, key) => this.map.set(key, value))
        } else if (Array.isArray(init)) {
          init.forEach(([key, value]) => this.map.set(key, value))
        } else if (typeof init === 'object') {
          Object.entries(init).forEach(([key, value]) => this.map.set(key, value))
        }
      }
    }
    
    get(name) {
      return this.map.get(name.toLowerCase()) || null
    }
    
    set(name, value) {
      this.map.set(name.toLowerCase(), value)
    }
    
    forEach(callback) {
      this.map.forEach(callback)
    }
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

