  //Test info Account Admin
  describe('Admin Account', () => {
    it('Login and display info account Admin', () => {
      cy.loginAsAdmin();
      cy.intercept('GET', '/api/user/1', {
        statusCode: 200,
        body: {
          id: 1,
          email: 'yoga@studio.com',
          firstName: 'Admin',
          lastName: 'ADMIN',
          admin: true,
          createdAt: '2025-05-01T10:00:00Z',
          updatedAt: '2025-05-01T10:00:00Z'
        }
      }).as('userInfo');
      
      cy.contains('Account').click();
      cy.wait('@userInfo');
  
      cy.contains('Name: Admin ADMIN').should('exist');
      cy.contains('Email: yoga@studio.com').should('exist');
      cy.contains('You are admin').should('exist');
      cy.contains('Create at: May 1, 2025').should('exist');
      cy.contains('Last update: May 1, 2025').should('exist');
    });
  });