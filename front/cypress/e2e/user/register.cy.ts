describe('Register', () => {
    it('Register new client user successfully', () => {
      cy.visit('/register');
  
      cy.intercept('POST', '/api/auth/register', {
        statusCode: 200,
        body: { message: 'User registered successfully!' }
      }).as('register');
  
      cy.get('input[formControlName=email]').type('client@client.com');
      cy.get('input[formControlName=firstName]').type('Client');
      cy.get('input[formControlName=lastName]').type('Test');
      cy.get('input[formControlName=password]').type('client');
      cy.get('button[type="submit"]').click();
  
      cy.wait('@register');
    });
  });
  