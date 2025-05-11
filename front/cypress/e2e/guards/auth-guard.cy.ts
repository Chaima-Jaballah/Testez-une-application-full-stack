// Test to check that the app starts properly
describe('App Startup', () => {
  it('should load the app root page without error', () => {
    cy.visit('/');
    cy.contains('Login'); 
    cy.contains('Register');
    cy.contains('Login').click(); 
    cy.url().should('include', '/login');
    cy.contains('Register').click(); 
    cy.url().should('include', '/register');    
  });
});


// Check route protection without authentication
describe('AuthGuard - Protected access', () => {
  it('Redirects to /login if not authenticated and accessing /me', () => {
    cy.clearCookies(); 
    cy.visit('/me', { failOnStatusCode: false });
    cy.url().should('include', '/login');
  });

  it('Redirects to /login if not authenticated and accessing /sessions', () => {
    cy.clearCookies();
    cy.visit('/sessions', { failOnStatusCode: false });
    cy.url().should('include', '/login');
  });
});


// Simulate fake session token
describe('Security - forged session attempt', () => {
  it('should deny access if fake token is injected', () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('authToken', 'FAKE-TOKEN-123');
      }
    });

    cy.visit('/me', { failOnStatusCode: false });
    cy.url().should('include', '/login');
    
    cy.visit('/sessions', { failOnStatusCode: false });
    cy.url().should('include', '/login');
  });
});






