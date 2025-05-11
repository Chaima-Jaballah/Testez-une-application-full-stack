//Test Create session
describe('Admin Create session', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/session**', [
      {
        id: 5,
        name: 'Yoga du matin',
        date: '2025-09-15T00:00:00.000Z',
        teacher_id: 1,
        description: 'Séance dynamique',
        users: []
      }
    ]).as('getSessions');

    cy.intercept('GET', '/api/teacher', [
      { id: 1, firstName: 'Margot', lastName: 'DELAHAYE' },
      { id: 2, firstName: 'Hélène', lastName: 'THIERCELIN' }
    ]);

    cy.intercept('POST', '/api/session', {
      statusCode: 200,
      body: {
        id: 5,
        name: 'Yoga du matin',
        date: '2025-09-15T00:00:00.000Z',
        teacher_id: 1,
        description: 'Séance dynamique',
        users: [],
        createdAt: '2025-05-03T08:00:00.000Z',
        updatedAt: '2025-05-03T08:00:00.000Z'
      }
    }).as('createSession');
  });

  it('Create session and verify button is disabled when required fields are missing', () => {
    cy.loginAsAdmin();
    cy.wait('@getSessions');

    cy.contains('Create').click();
    cy.get('input[formControlName="name"]').type('Yoga du matin');
    cy.get('input[formControlName="date"]').type('2025-09-15');
    cy.get('mat-select[formControlName="teacher_id"]').click();
    cy.contains('Margot DELAHAYE').click();
    cy.contains('button', 'Save').should('be.disabled');
    cy.get('textarea[formControlName="description"]').type('Séance dynamique');
    cy.contains('Save').click();
    cy.wait('@createSession');
    cy.get('snack-bar-container').should('contain.text', 'Session created !');
  });
});


//Test Update session
describe('Admin Update session', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/session**', [
      {
        id: 3,
        name: 'Yoga du soir',
        date: '2025-09-10T00:00:00.000Z',
        teacher_id: 1,
        description: 'description',
        users: []
      }
    ]).as('getSessions');

    cy.intercept('GET', '/api/session/3', {
      id: 3,
      name: 'Yoga du soir',
      date: '2025-09-10T00:00:00.000Z',
      teacher_id: 1,
      description: 'description',
      users: []
    }).as('getSessionById');

    cy.intercept('GET', '/api/teacher', [
      { id: 1, firstName: 'Margot', lastName: 'DELAHAYE' },
      { id: 2, firstName: 'Hélène', lastName: 'THIERCELIN' }
    ]);

    cy.intercept('PUT', '/api/session/3', {
      statusCode: 200,
      body: {
        message: 'Session updated !'
      }
    }).as('updateSession');
  });

  it('Ensure the "Detail" button exists and update session without missing required fields', () => {
    cy.loginAsAdmin();
    cy.wait('@getSessions');

    cy.contains('Yoga du soir').should('exist');
    cy.get('button').contains('Detail').should('exist');
    cy.contains('Edit').click();
    cy.wait('@getSessionById');

    cy.get('input[formControlName="name"]').clear().type('Yoga du soir');
    cy.get('input[formControlName="date"]').clear().type('2025-09-16');
    cy.get('mat-select[formControlName="teacher_id"]').click();
    cy.contains('Hélène THIERCELIN').click();

    cy.get('textarea[formControlName="description"]').clear();
    cy.contains('button', 'Save').should('be.disabled');

    cy.get('textarea[formControlName="description"]').type('description');
    cy.contains('Save').click();

    cy.wait('@updateSession');
    cy.get('snack-bar-container').should('contain.text', 'Session updated !');
    cy.contains('Yoga du soir').should('exist');
  });
});


//Test Delete session
  describe('Admin Delete session', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/session', [
        {
          id: 4,
          name: 'Yoga à supprimer',
          date: '2025-10-01T00:00:00.000Z',
          teacher_id: 2,
          description: 'À tester pour suppression',
          users: []
        }
      ]).as('getSessions');
  
      cy.intercept('GET', '/api/session/4', {
        id: 4,
        name: 'Yoga à supprimer',
        date: '2025-10-01T00:00:00.000Z',
        teacher_id: 2,
        description: 'À tester pour suppression',
        users: []
      }).as('getSessionDetail');
  
      cy.intercept('DELETE', '/api/session/4', {
        statusCode: 200,
        body: {}
      }).as('deleteSession');
    });
  
    it('Delete session', () => {
      cy.loginAsAdmin();
      cy.wait('@getSessions');
  
      cy.contains('Yoga à supprimer')
        .parentsUntil('body')
        .contains('Detail')
        .click();
  
      cy.wait('@getSessionDetail');
  
  
      cy.intercept('GET', '/api/session', []).as('getSessionsAfterDelete');
  
      cy.contains('Delete').click();
      cy.wait('@deleteSession');
      cy.url().should('include', '/sessions');
      cy.wait('@getSessionsAfterDelete');
  
      cy.get('snack-bar-container').should('contain.text', 'Session deleted !');
      cy.contains('Yoga à supprimer').should('not.exist');
    });
  });
