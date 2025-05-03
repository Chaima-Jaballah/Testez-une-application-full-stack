describe('Admin Session spec', () => {
  beforeEach(() => {
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'yoga@studio.com',
        admin: true
      }
    });

    cy.intercept('GET', '/api/session', []).as('session');

    cy.intercept('GET', '/api/teacher', [
      { id: 1, firstName: 'Margot', lastName: 'DELAHAYE' },
      { id: 2, firstName: 'Hélène', lastName: 'THIERCELIN' }
    ]);

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');

    cy.url().should('include', '/sessions');
  });

  it('Create a session successfully', () => {
    cy.contains('Create').should('be.visible').click();

    cy.get('input[formControlName="name"]').should('be.visible').type('nn');
    cy.get('input[formControlName="date"]').should('be.visible').type('2025-08-02');
    cy.get('mat-select[formControlName="teacher_id"]').should('be.visible').click();
    cy.contains('Hélène THIERCELIN').click().should('be.visible');
    cy.get('textarea[formControlName="description"]').should('be.visible').type('nn nn nn');

    cy.intercept('POST', '/api/session', {
      statusCode: 200,
      body: {
        id: 5,
        name: 'nn',
        date: '2025-08-02T00:00:00.000+00:00',
        teacher_id: 2,
        description: 'nn nn nn',
        users: [],
        createdAt: '2025-05-03T04:48:34.067724',
        updatedAt: '2025-05-03T04:48:34.0767163'
      }
    }).as('createSession');

    cy.intercept('GET', '/api/session', [
      {
        id: 5,
        name: 'nn',
        date: '2025-08-02T00:00:00.000+00:00',
        teacher_id: 2,
        description: 'nn nn nn',
        users: [],
        createdAt: '2025-05-03T04:48:34.067724',
        updatedAt: '2025-05-03T04:48:34.0767163'
      }
    ]).as('getSessionsAfterCreate');

    cy.contains('Save').should('be.visible').click();
    cy.wait('@createSession');

    cy.visit('/sessions');
    cy.wait('@getSessionsAfterCreate');

    cy.get('snack-bar-container').should('contain.text', 'Session created !');
    cy.contains('nn').should('exist').should('be.visible');
  });

  it('Update a session successfully', () => {
    cy.intercept('GET', '/api/session', [
      {
        id: 5,
        name: 'nn',
        date: '2025-08-02T00:00:00.000+00:00',
        teacher_id: 2,
        description: 'nn nn nn',
        users: []
      }
    ]).as('getSessions');

    cy.visit('/sessions');
    cy.wait('@getSessions');

    cy.contains('Edit').first().should('be.visible').click();

    cy.get('input[formControlName="name"]').clear().type('Session modifiée').should('be.visible');
    cy.get('input[formControlName="date"]').clear().type('2025-08-10').should('be.visible');
    cy.get('mat-select[formControlName="teacher_id"]').click();
    cy.contains('Margot DELAHAYE').click().should('be.visible');
    cy.get('textarea[formControlName="description"]').clear().type('Description modifiée').should('be.visible');

    cy.intercept('PUT', '/api/session/5', {
      statusCode: 200,
      body: { message: 'Session updated !' }
    }).as('updateSession');

    cy.contains('Save').should('be.visible').click();
    cy.wait('@updateSession');

    cy.get('snack-bar-container').should('contain.text', 'Session updated !');
    cy.contains('Session modifiée').should('be.visible');
  });

  it('Delete a session successfully', () => {
    cy.intercept('GET', '/api/session', [
      {
        id: 5,
        name: 'Session modifiée',
        date: '2025-08-10T00:00:00.000+00:00',
        teacher_id: 1,
        description: 'Description modifiée',
        users: []
      }
    ]).as('getSessions');

    cy.visit('/sessions');
    cy.wait('@getSessions');

    cy.contains('Detail').first().should('be.visible').click();
    cy.url().should('include', '/sessions/detail/');

    cy.intercept('DELETE', '/api/session/5', {
      statusCode: 200,
      body: { message: 'Session deleted !' }
    }).as('deleteSession');

    cy.contains('Delete').should('be.visible').click();
    cy.wait('@deleteSession');

    cy.get('snack-bar-container').should('contain.text', 'Session deleted !');
    cy.url().should('include', '/sessions');
  });
});
