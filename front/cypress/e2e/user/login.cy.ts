describe('Login spec', () => {
    it('Login successfull', () => {
      cy.visit('/login')
  
      cy.intercept('POST', '/api/auth/login', {
        body: {
          id: 2,
          username: 'client@client.com',
          firstName: 'Client',
          lastName: 'User',
          admin: false
        },
      })
  
      cy.intercept(
        {
          method: 'GET',
          url: '/api/session',
        },
        []).as('session')
  
      cy.get('input[formControlName=email]').type("client@client.com")
      cy.get('input[formControlName=password]').type(`${"client"}{enter}{enter}`)
  
      cy.url().should('include', '/sessions')
    })
  });
  