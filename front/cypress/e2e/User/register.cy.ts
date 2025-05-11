//Test Register
  describe('User Register', () => {
    it('Register successfully', () => {
      cy.visit('/register');
  
      cy.intercept('POST', '/api/auth/register', {
        statusCode: 200,
        body: { message: 'User registered successfully!' }
      }).as('register');
  
      cy.get('input[formControlName=email]').type('client@client.com');
      cy.get('input[formControlName=firstName]').type('Client');
      cy.get('input[formControlName=lastName]').type('User');
      cy.get('input[formControlName=password]').type('client');
      cy.get('button[type="submit"]').should('not.be.disabled').click();
      cy.wait('@register');
      cy.intercept('GET', '/api/session', []).as('getSessions');

      cy.loginAsUser();
    });
  
    it('should show error message if registration fails when email already used', () => {
      cy.visit('/register');
    
      cy.intercept('POST', '/api/auth/register', {
        statusCode: 400,
        body: { message: 'An error occurred' }
      }).as('registerFail');
    
      cy.get('input[formControlName=email]').type('client@client.com');
      cy.get('input[formControlName=firstName]').type('Client');
      cy.get('input[formControlName=lastName]').type('User');
      cy.get('input[formControlName=password]').type('client');
    
      cy.get('button[type="submit"]').click();
      cy.wait('@registerFail');
    
      cy.contains('An error occurred').should('be.visible');
    });

    it('Submit button should be disabled if any required field is empty', () => {
      cy.visit('/register');
      //Field First name is empty
      cy.get('input[formControlName=email]').type('client@client.com');
      cy.get('input[formControlName=lastName]').type('User');
      cy.get('input[formControlName=password]').type('client');
    
      cy.get('button[type=submit]').should('be.disabled');
    });
    
  });