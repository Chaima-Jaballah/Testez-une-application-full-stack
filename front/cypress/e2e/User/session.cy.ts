   //Test session User
    describe('User views session details, participates in a session, and then unparticipates', () => {
      beforeEach(() => {
        cy.intercept('GET', '/api/session', [
          {
            id: 3,
            name: 'Yoga session',
            date: '2025-05-08T00:00:00.000Z',
            teacher_id: 1,
            description: 'aaa',
            users: [],
            createdAt: '2025-05-03T08:00:00.000Z',
            updatedAt: '2025-05-03T08:00:00.000Z'
          }
        ]).as('getSessions');
    
        cy.intercept('GET', '/api/teacher/1', {
          id: 1,
          firstName: 'Margot',
          lastName: 'DELAHAYE'
        }).as('getTeacher');
    
        cy.intercept('POST', '/api/session/3/participate/29', { statusCode: 200 }).as('participate');
        cy.intercept('DELETE', '/api/session/3/participate/29', { statusCode: 200 }).as('unParticipate');
      });
    
      it('User views session details and participates, "Create" and "Delete" buttons should not exist', () => {
        cy.intercept('GET', '/api/session/3', {
          id: 3,
          name: 'Yoga session',
          date: '2025-05-08T00:00:00.000Z',
          teacher_id: 1,
          description: 'aaa',
          users: [],
          createdAt: '2025-05-03T08:00:00.000Z',
          updatedAt: '2025-05-03T08:00:00.000Z'
        }).as('getSessionDetailById');
    
        cy.loginAsUser();
        cy.wait('@getSessions');
        cy.contains('button', 'Create').should('not.exist');
        cy.contains('Detail').click();
        cy.wait('@getSessionDetailById');
        cy.contains('button', 'Delete').should('not.exist');
        cy.contains('0 attendees').should('exist');
    
        cy.intercept('GET', '/api/session/3', {
          id: 3,
          users: [29]
        }).as('getSessionAfterParticipate');
    
        cy.contains('Participate').click({ force: true });
        cy.wait('@participate');
        cy.wait('@getSessionAfterParticipate');
        cy.contains('1 attendees').should('exist');
        cy.contains('Do not participate').should('exist');
      });
    
      it('User unParticipates from a session', () => {
        cy.intercept('GET', '/api/session/3', {
          id: 3,
          users: [29]
        }).as('getSessionDetailById');
    
        cy.loginAsUser();
        cy.wait('@getSessions');
        cy.contains('Detail').click();
        cy.wait('@getSessionDetailById'); 
        cy.contains('1 attendees').should('exist');
    
        cy.intercept('GET', '/api/session/3', {
          id: 3,
          users: []
        }).as('getSessionAfterUnParticipate');
    
        cy.contains('Do not participate').click({ force: true });
        cy.wait('@unParticipate');
        cy.wait('@getSessionAfterUnParticipate'); 
        cy.contains('0 attendees').should('exist');
        cy.contains('Participate').should('exist');
      });  
      
    });