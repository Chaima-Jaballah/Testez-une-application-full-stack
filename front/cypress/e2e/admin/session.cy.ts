describe('Admin login and create session only', () => {
  beforeEach(() => {
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true
      }
    }).as('login'); 

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

  it('Login and create session', () => {
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');
    cy.url().should('include', '/sessions');
    cy.wait('@getSessions');

    cy.contains('Create').click();
    cy.get('input[formControlName="name"]').type('Yoga du matin');
    cy.get('input[formControlName="date"]').type('2025-09-15');
    cy.get('mat-select[formControlName="teacher_id"]').click();
    cy.contains('Margot DELAHAYE').click();
    cy.get('textarea[formControlName="description"]').type('Séance dynamique');
    cy.contains('Save').click();
    cy.wait('@createSession');
    cy.get('snack-bar-container').should('contain.text', 'Session created !');
  });
});


describe('Admin update session', () => {
  beforeEach(() => {
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'yoga@studio.com',
        firstName: 'Yoga',
        lastName: 'Admin',
        admin: true
      }
    }).as('login');

    cy.intercept('GET', '**/session**', [
      {
        id: 3,
        name: 'Yoga du soir',
        date: '2025-09-10T00:00:00.000Z',
        teacher_id: 1,
        description: 'Ancienne description',
        users: []
      }
    ]).as('getSessions');

    cy.intercept('GET', '/api/session/3', {
      id: 3,
      name: 'Yoga du soir',
      date: '2025-09-10T00:00:00.000Z',
      teacher_id: 1,
      description: 'Ancienne description',
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

  it('Login and update session', () => {
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');
    cy.url().should('include', '/sessions');
    cy.wait('@getSessions');

    cy.contains('Yoga du soir').should('exist');
    cy.contains('Edit').click();
    cy.wait('@getSessionById');

    cy.get('input[formControlName="name"]').clear().type('Yoga du soir');
    cy.get('input[formControlName="date"]').clear().type('2025-09-16');
    cy.get('mat-select[formControlName="teacher_id"]').click();
    cy.contains('Hélène THIERCELIN').click();
    cy.get('textarea[formControlName="description"]').clear().type('Nouvelle description');

    cy.contains('Save').click();
    cy.wait('@updateSession');
    cy.get('snack-bar-container').should('contain.text', 'Session updated !');

    cy.contains('Yoga du soir').should('exist');
  });
});

