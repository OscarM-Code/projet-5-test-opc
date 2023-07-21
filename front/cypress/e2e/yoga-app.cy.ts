describe('Session spec', () => {
  it('Loginl', () => {
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true,
      },
    });

    cy.intercept('GET', '/api/session', {
      body: [
        {
          id: 1,
          name: 'Workout',
          description: 'A workout session',
          date: '2023-12-30T00:00:00.000+00:00',
          teacher_id: 1,
          users: [],
        },
      ],
    });

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );
  });

  it('create & display sessions', () => {
    cy.url().should('include', '/sessions');

    cy.intercept('GET', '/api/teacher', {
      body: [
        {
          id: 1,
          firstName: 'Margot',
          lastName: 'DELAHAYE',
        },
      ],
    });

    cy.intercept('POST', '/api/session', {
      body: {
        id: 2,
        name: 'Workout',
        date: '2023-08-100T00:00:00.000+00:00',
        teacher_id: 1,
        description: 'A water bike session',
      },
    });

    cy.intercept('GET', '/api/session', {
      body: [
        {
          id: 1,
          name: 'Water Bike',
          description: 'A water bike session',
          date: '2023-08-10T00:00:00.000+00:00',
          teacher_id: 1,
          users: [],
        },
      ],
    });

    cy.get('button[routerLink=create]').click();
    cy.get('input[formControlName=name]').type(`${'Water Bike'}`);
    cy.get('input[formControlName=date]').type(`${'2023-08-10'}`);
    cy.get('mat-select[formControlName=teacher_id]')
      .click()
      .get('mat-option')
      .contains('Margot DELAHAYE')
      .click();
    cy.get('textarea[formControlName=description]').type(
      `${'A water bike session'}`
    );

    cy.get('button[type=submit]').click();
  });

  it('update session', () => {
    cy.url().should('include', '/sessions');

    cy.intercept('GET', '/api/session/1', {
      body: {
        id: 1,
        name: 'Water Bike',
        description: 'A water bike session',
        date: '2023-12-30T00:00:00.000+00:00',
        teacher_id: 1,
        users: [],
      },
    });

    cy.intercept('GET', '/api/teacher', {
      body: [
        {
          id: 1,
          firstName: 'Margot',
          lastName: 'DELAHAYE',
        },
      ],
    });

    cy.get('button[id=edit-btn]').click();

    cy.intercept('PUT', '/api/session/1', {
      body: {
        id: 1,
        name: 'Yoga',
        date: '2023-12-30T00:00:00.000+00:00',
        teacher_id: 1,
        description: 'A yoga session',
      },
    });

    cy.url().should('include', '/sessions/update');

    cy.get('input[formControlName=name]').clear().type(`${'Yoga'}`);
    cy.get('input[formControlName=date]').clear().type(`${'2023-12-30'}`);
    cy.get('textarea[formControlName=description]')
      .clear()
      .type(`${'A Yoga session'}`);

    cy.intercept('GET', '/api/session', {
      body: [
        {
          id: 1,
          name: 'Yoga',
          date: '2023-12-30T00:00:00.000+00:00',
          teacher_id: 1,
          description: 'A yoga session',
          users: [],
        },
      ],
    });

    cy.get('button[type=submit]').click();
  });

  it('delete session', () => {
    cy.url().should('include', '/sessions');

    cy.intercept('GET', '/api/session/1', {
      body: {
        id: 1,
        name: 'Stretching',
        date: '2023-12-30T00:00:00.000+00:00',
        teacher_id: 1,
        description: 'A stretching session',
        users: [],
      },
    });

    cy.intercept('GET', '/api/teacher/1', {
      body: {
        id: 1,
        firstName: 'Margot',
        lastName: 'DELAHAYE',
      },
    });

    cy.get('button[id=detail-btn]').click();

    cy.intercept('DELETE', '/api/session/1', {
      status: 200,
    });

    cy.intercept('GET', '/api/session', {
      body: [],
    });

    cy.get('button[id=delete-btn]').click();

    cy.url().should('include', '/sessions');
  });

  it('Logout', () => {
    cy.url().should('include', '/sessions');
    cy.get('span[id=logout-btn]').click();
  });
});

describe('Register spec', () => {
  it('Register', () => {
    cy.visit('/register');

    cy.intercept('POST', '/api/auth/register', { status: 200 });

    cy.get('input[formControlName=firstName]').type(`${'Mai'}`);
    cy.get('input[formControlName=lastName]').type(`${'Mashiro'}`);
    cy.get('input[formControlName=email]').type('maimashiro@dt.com');
    cy.get('input[formControlName=password]').type(
      `${'password'}{enter}{enter}`
    );

    cy.url().should('include', '/login');
  });

  it('Login', () => {
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: false,
      },
    });

    cy.intercept('GET', '/api/session', {
      body: [
        {
          id: 1,
          name: 'Workout',
          description: 'A workout session',
          date: '2023-12-30T00:00:00.000+00:00',
          teacher_id: 1,
          users: [],
        },
      ],
    });

    cy.get('input[formControlName=email]').type('maimashiro@dt.com');
    cy.get('input[formControlName=password]').type(
      `${'password'}{enter}{enter}`
    );
  });

  it('visit accout page', () => {
    cy.url().should('include', '/sessions');

    cy.intercept('GET', '/api/user/1', {
      body: {
        id: 1,
        email: 'maimashiro@dt.com',
        lastName: 'Mashiro',
        firstName: 'Mai',
        admin: false,
        createdAt: '2023-07-07T18:48:35',
        updatedAt: '2023-07-07T18:48:35',
      },
    });
    cy.get('span[id=account-btn]').click();
  });

  it('delete accout', () => {
    cy.url().should('include', '/me');
    cy.intercept('DELETE', '/api/user/1', {
      status: 200,
    });
    cy.get('button[id=delete-account-btn]').click();
  });
});
