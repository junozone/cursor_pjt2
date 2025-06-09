import '@testing-library/jest-dom'

// NextResponseのモック
jest.mock('next/server', () => {
  const originalModule = jest.requireActual('next/server')
  return {
    ...originalModule,
    NextResponse: {
      json: (data, init) => {
        const response = new Response(JSON.stringify(data), init)
        response.json = () => Promise.resolve(data)
        return response
      },
    },
    NextRequest: class MockNextRequest {
      constructor(input, init = {}) {
        const url = new URL(input)
        Object.defineProperties(this, {
          url: {
            value: url.toString(),
            writable: false,
          },
          method: {
            value: init.method || 'GET',
            writable: false,
          },
          body: {
            value: init.body,
            writable: false,
          },
          headers: {
            value: new Headers(init.headers),
            writable: false,
          },
          cookies: {
            value: {
              get: () => null,
              getAll: () => [],
              set: () => {},
              delete: () => {},
            },
            writable: false,
          },
        })
      }

      json() {
        return Promise.resolve(JSON.parse(this.body))
      }

      text() {
        return Promise.resolve(this.body)
      }
    },
  }
})

// Web API のポリフィル
if (typeof global.Request === 'undefined') {
  global.Request = class MockRequest {
    constructor(url, options = {}) {
      Object.defineProperty(this, 'url', {
        value: url,
        writable: false,
      })
      Object.defineProperty(this, 'method', {
        value: options.method || 'GET',
        writable: false,
      })
      Object.defineProperty(this, 'body', {
        value: options.body,
        writable: false,
      })
    }
  }
}

if (typeof global.Response === 'undefined') {
  global.Response = class MockResponse {
    constructor(body, options = {}) {
      this.body = body
      this.status = options.status || 200
      this.json = () => Promise.resolve(JSON.parse(body))
    }
  }
} 