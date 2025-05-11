 //Test Login and logout
  describe('User Login and Logout', () => {
    it('Login successfull', () => {
      cy.loginAsUser();
    });
  
    it('Logout successfully', () => {
      cy.contains('Logout').click();
      cy.location('pathname').should('eq', '/');
      cy.contains('Login').should('be.visible');
      cy.contains('Register').should('be.visible');
    });

    it('Should show an error message if login information is incorrect', () => {
      cy.visit('/login');

      cy.intercept('POST', '/api/auth/login', {
        statusCode: 400,
        body: { message: 'An error occurred' }
      }).as('loginFail');

      cy.get('input[formControlName=email]').type('client@client.com');
      cy.get('input[formControlName=password]').type('False Password');
    
      cy.get('button[type="submit"]').click();
      cy.wait('@loginFail');
    
      cy.contains('An error occurred').should('be.visible');
    });

    it('Submit button should be disabled if email field is empty', () => {
      cy.visit('/login');
      //Field email is empty
      cy.get('input[formControlName=email]').type('client@client.com');   
      cy.get('button[type=submit]').should('be.disabled');
    });

    it('Submit button should be disabled if password field is empty', () => {
      cy.visit('/login');
      //Field password is empty
      cy.get('input[formControlName=password]').type('client');    
      cy.get('button[type=submit]').should('be.disabled');
    });

  });
  