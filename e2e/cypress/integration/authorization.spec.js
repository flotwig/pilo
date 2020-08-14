/// <reference types='cypress'/>

context('authorization', () => {
  it('returns a 401 when loading without authorization', () => {
    cy.request({
      url: '/',
      failOnStatusCode: false
    })
    .its('status').should('eq', 401)
  })

  it('websocket returns 401 without authorization', (done) => {
    const ws = new WebSocket(Cypress.config('baseUrl').replace(/^http/, 'ws'))

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

  })
})
