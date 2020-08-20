/// <reference types='cypress'/>

const wsUrl = Cypress.config('baseUrl').replace(/^http/, 'ws')

context('authorization', () => {
  it('returns a 401 when loading without authorization', () => {
    cy.request({
      url: '/',
      failOnStatusCode: false
    })
    .its('status').should('eq', 401)
  })

  it('websocket returns 401 without authorization', (done) => {
    const ws = new WebSocket(wsUrl)

    ws.onerror = (e) => {
      expect(e.type).to.eq('error')
      done()
    }
  })

  it('returns a 401 when loading with bad authorization', () => {
    cy.request({
      url: '/',
      failOnStatusCode: false,
      auth: {
        username: 'foo',
        password: 'bar'
      }
    })
    .its('status').should('eq', 401)
  })

  it('websocket returns 401 with bad authorization', () => {
    cy.task('tryWsConnect', {
      url: wsUrl,
      authSlug: 'foo:bar'
    }).then((res: any) => {
      expect(res.err).to.include('Error: Unexpected server response: 401')
    })
  })

  it('websocket connects with valid authorization', () => {
    cy.task('tryWsConnect', {
      url: wsUrl,
      authSlug: [Cypress.env('APP_USERNAME'), Cypress.env('APP_PASSWORD')].join(':')
    }).then((res: any) => {
      expect(res.succeeded).to.be.true
    })
  })
})
