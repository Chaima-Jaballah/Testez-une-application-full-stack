///Admin 

//Test Login Admin
describe('Login and Logout Admin', () => {
  it('Login successfull', () => {
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
  
      cy.intercept('GET', '/api/session', []).as('session');

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
  
      cy.get('input[formControlName=email]').type('yoga@studio.com');
      cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');
      cy.wait('@session');
      cy.url().should('include', '/sessions');
      cy.contains('Account').click();
      cy.wait('@userInfo');
  
      cy.contains('Name: Admin ADMIN').should('exist');
      cy.contains('Email: yoga@studio.com').should('exist');
      cy.contains('You are admin').should('exist');
      cy.contains('Create at: May 1, 2025').should('exist');
      cy.contains('Last update: May 1, 2025').should('exist');
    });

  
    it('Logout successfully', () => {
      cy.contains('Logout').click();
      cy.location('pathname').should('eq', '/');
      cy.contains('Login').should('be.visible');
      cy.contains('Register').should('be.visible');
    });

  });

   //Test info Account Admin
  describe('Admin Account', () => {
    it('Login and display info account Admin', () => {
      cy.intercept('POST', '/api/auth/login', {
        statusCode: 200,
        body: {
          id: 1,
          email: 'yoga@studio.com',
          firstName: 'Admin',
          lastName: 'ADMIN',
          admin: true
        }
      }).as('login');
  
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
  
      cy.visit('/login');
      cy.get('input[formControlName=email]').type('yoga@studio.com');
      cy.get('input[formControlName=password]').type('test!1234');
      cy.get('button[type=submit]').click();
  
      cy.wait('@login');
      cy.url().should('include', '/sessions');
      cy.contains('Account').click();
      cy.wait('@userInfo');
  
      cy.contains('Name: Admin ADMIN').should('exist');
      cy.contains('Email: yoga@studio.com').should('exist');
      cy.contains('You are admin').should('exist');
      cy.contains('Create at: May 1, 2025').should('exist');
      cy.contains('Last update: May 1, 2025').should('exist');
    });
  });
  

  //Test Create session
  describe('Admin Create session', () => {
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

    it('Create session and verify button is disabled when required fields are missing', () => {
      cy.get('input[formControlName=email]').type('yoga@studio.com');
      cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');
      cy.url().should('include', '/sessions');
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
      cy.get('input[formControlName=email]').type('yoga@studio.com');
      cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');
      cy.url().should('include', '/sessions');
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
      cy.get('input[formControlName=email]').type('yoga@studio.com');
      cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');
      cy.url().should('include', '/sessions');
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



  ///User

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
  
      cy.visit('/login');
  
      cy.intercept('POST', '/api/auth/login', {
        statusCode: 200,
        body: {
          id: 2,
          username: 'client@client.com',
          firstName: 'Client',
          lastName: 'User',
          admin: false
        }
      }).as('login');
  
      cy.intercept('GET', '/api/session', []).as('getSessions');
  
      cy.get('input[formControlName=email]').type('client@client.com');
      cy.get('input[formControlName=password]').type('client');
      cy.get('button[type="submit"]').click();
  
      cy.wait('@login');
      cy.wait('@getSessions');
  
      cy.url().should('include', '/sessions');
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


  //Test Login and logout
  describe('User Login and Logout', () => {
    it('Login successfull', () => {
      cy.visit('/login');
  
      cy.intercept('POST', '/api/auth/login', {
        body: {
          id: 1,
          username: 'userName',
          firstName: 'firstName',
          lastName: 'lastName',
          admin: false
        }
      }).as('login');
  
      cy.intercept('GET', '/api/session', []).as('session');
  
      cy.get('input[formControlName=email]').type('client@client.com');
      cy.get('input[formControlName=password]').type('client{enter}{enter}');
      cy.wait('@session');
      cy.url().should('include', '/sessions');
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
  

    //Test session User
    describe('User views session details, participates in a session, and then unparticipates', () => {
      beforeEach(() => {
        cy.visit('/login');
    
        cy.intercept('POST', '/api/auth/login', {
          body: {
            id: 29,
            username: 'clientUser',
            firstName: 'Client',
            lastName: 'User',
            admin: false
          }
        }).as('login');
    
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
        }).as('getSessionDetailInitial');
    
        cy.get('input[formControlName=email]').type('client@client.com');
        cy.get('input[formControlName=password]').type('client{enter}{enter}');
        cy.wait('@getSessions');
        cy.contains('button', 'Create').should('not.exist');
        cy.contains('Detail').click();
        cy.wait('@getSessionDetailInitial');
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
        }).as('getSessionDetailInitial');
    
        cy.get('input[formControlName=email]').type('client@client.com');
        cy.get('input[formControlName=password]').type('client{enter}{enter}');
        cy.wait('@getSessions');
        cy.contains('Detail').click();
        cy.wait('@getSessionDetailInitial');
    
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


  //Test info account User and Delete account 
  describe('User Account', () => {
    it('Login, display user info and delete account', () => {
      cy.intercept('POST', '/api/auth/login', {
        statusCode: 200,
        body: {
          id: 1,
          email: 'client@client.com',
          firstName: 'client',
          lastName: 'CLIENT',
          admin: false
        }
      }).as('login');
  
      cy.intercept('GET', '/api/user/1', {
        statusCode: 200,
        body: {
          id: 1,
          email: 'client@client.com',
          firstName: 'client',
          lastName: 'CLIENT',
          createdAt: '2025-05-01T10:00:00Z',
          updatedAt: '2025-05-01T10:00:00Z'
        }
      }).as('userInfo');
  
      cy.intercept('DELETE', '/api/user/1', {
        statusCode: 204
      }).as('deleteAccount');
  
      cy.visit('/login');
  
      cy.get('input[formControlName=email]').type('client@client.com');
      cy.get('input[formControlName=password]').type('client');
      cy.get('button[type=submit]').click();
  
      cy.wait('@login');
      cy.url().should('include', '/sessions');
  
      cy.contains('Account').click();
      cy.wait('@userInfo');
  
      cy.contains('Name: client CLIENT').should('exist');
      cy.contains('Email: client@client.com').should('exist');
      cy.contains('Delete my account').should('exist');
      cy.contains('Create at: May 1, 2025').should('exist');
      cy.contains('Last update: May 1, 2025').should('exist');
  
      cy.contains('Detail').click();
      cy.wait('@deleteAccount');
  
      cy.contains('Your account has been deleted !').should('be.visible');

      cy.contains('Login').should('be.visible');
      cy.contains('Register').should('be.visible');
    });
  });
  
  
  
  
  

