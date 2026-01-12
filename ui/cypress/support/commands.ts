/// <reference types="cypress" />

Cypress.Commands.add('mockLoginApi', (options = {}) => {
  const { success = true, delay = 0 } = options;
  
  // Función helper para codificar en Base64Url
  const base64Url = (obj: any): string => {
    return btoa(JSON.stringify(obj))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  };

  // Generar token dinámico (1 hora de validez para evitar overflow en setTimeout)
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    _id: 'user123',
    email: 'test@test.com',
    iat: now,
    exp: now + 3600 // 1 hour
  };

  const mockToken = `${base64Url(header)}.${base64Url(payload)}.mockSignature`;

  cy.intercept('POST', '**/auth/login', (req) => {
    req.reply({
      delay,
      statusCode: success ? 200 : 400,
      body: success ? { token: mockToken } : { message: 'Invalid Login' }
    });
  }).as('loginRequest');
});

Cypress.Commands.add('mockDashboardApi', (options = {}) => {
  const { delay = 0, error = false } = options;
  const statusCode = error ? 500 : 200;

  cy.intercept('GET', '**/v1/aboutme/', (req) => {
    req.reply({
      delay,
      statusCode,
      fixture: error ? undefined : 'aboutme.json'
    });
  }).as('getAboutMe');

  cy.intercept('GET', '**/v1/projects/', (req) => {
    req.reply({
      delay,
      statusCode,
      fixture: error ? undefined : 'projects.json'
    });
  }).as('getProjects');
});

Cypress.Commands.add('visitWithMocks', (path: string, options = {}) => {
  cy.mockDashboardApi(options);
  cy.visit(path);
});

Cypress.Commands.add('getByTestId', (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`);
});

Cypress.Commands.add('checkAuth', () => {
  const token = localStorage.getItem('token'); // Use const instead of let
  const tokenObj = token ? JSON.parse(token) : null;
  expect(tokenObj).to.not.be.null;
  expect(tokenObj.accessToken).to.exist;
});

declare global {
  namespace Cypress {
    interface Chainable {
      mockLoginApi(options?: { success?: boolean; delay?: number }): Chainable<void>;
      mockDashboardApi(options?: { delay?: number; error?: boolean }): Chainable<void>;
      visitWithMocks(path: string, options?: { delay?: number; error?: boolean }): Chainable<void>;
      getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
      checkAuth(): Chainable<void>;
    }
  }
}

