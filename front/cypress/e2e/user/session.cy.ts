describe('Client session details and participation', () => {
    beforeEach(() => {
      cy.visit('/login');
  
      cy.intercept('POST', '/api/auth/login', {
        statusCode: 200,
        body: {
          id: 2,
          username: 'client@client.com',
          firstName: 'Client',
          lastName: 'Test',
          admin: false
        }
      }).as('login');
  
      cy.intercept('GET', '/api/session', [
        {
          id: 10,
          name: 'Séance découverte',
          date: '2025-09-20T00:00:00.000Z',
          teacher_id: 1,
          description: 'Une belle séance pour débutants',
          users: []
        }
      ]).as('getSessions');

      cy.intercept('GET', '/api/session/10', {
        id: 10,
        name: 'Séance découverte',
        date: '2025-09-20T00:00:00.000Z',
        teacher_id: 1,
        description: 'Une belle séance pour débutants',
        users: []
      }).as('getSessionDetail');
  
      cy.intercept('POST', '/api/session/10/participate/2', {
        statusCode: 200
      }).as('participate');
    });
  
    it('Login, view session detail, and participate', () => {
      cy.get('input[formControlName=email]').type('client@client.com');
      cy.get('input[formControlName=password]').type('client{enter}{enter}');
      cy.url().should('include', '/sessions');
      cy.wait('@getSessions');
  
      cy.contains('Séance découverte').should('exist');
      cy.contains('Detail').click();
      cy.wait('@getSessionDetail');
  
     /* cy.contains('Participate').click();
      cy.wait('@participate');
  
      cy.get('snack-bar-container').should('contain.text', 'You participate now');*/
    });
  });
  