describe('Dashboard Page', () => {
  beforeEach(() => {
    // Forzamos idioma inglés
    cy.visit('/login', {
      onBeforeLoad(win) {
        win.localStorage.setItem('i18nextLng', 'en');
      },
    });

    // Login mock
    cy.mockLoginApi();
    cy.get('input[name="email"]').type('test@test.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[type="submit"]').click();
    
    // Esperamos a salir del login
    cy.url().should('not.include', '/login');

    // Verificar autenticación
    cy.checkAuth();
  });

  it('Carga de datos con fixtures', () => {
    cy.visitWithMocks('/dashboard');
    
    // Esperar peticiones
    cy.wait(['@getAboutMe', '@getProjects']);
    
    // Verificar datos AboutMe usando data-testid
    cy.getByTestId('about-me-section').should('contain', 'Johany Flores');
    cy.contains('Full Stack Developer').should('be.visible');
    
    // Verificar datos Projects
    cy.contains('Project Alpha').should('be.visible');
    cy.contains('Project Beta').should('be.visible');
    cy.contains('A revolutionary project').should('be.visible');
  });

  it('Estado de loading', () => {
    // Mock con delay
    cy.visitWithMocks('/dashboard', { delay: 1000 });
    
    // Verificar loading visible usando data-testid
    cy.getByTestId('loader').should('be.visible');
    
    // Esperar a que termine
    cy.wait(['@getAboutMe', '@getProjects']);
    cy.getByTestId('about-me-section').should('be.visible');
  });

  it('Manejo de errores', () => {
    // Mock con error
    cy.visitWithMocks('/dashboard', { error: true });
    
    cy.wait(['@getAboutMe', '@getProjects']);
    
    // Verificar mensaje de error usando data-testid
    cy.getByTestId('error-message').should('be.visible');
    cy.getByTestId('error-message').should('contain', 'Error loading data');
  });

  it('Navegación desde dashboard', () => {
    cy.visitWithMocks('/dashboard');
    cy.wait(['@getAboutMe', '@getProjects']);

    // Navegación a Home (Landing)
    // Asumiendo que hay un link Home en el Header o similar.
    // Revisemos App Structure. Normalmente hay un Header.
    // Si no lo vemos, buscaremos un link o botón 'Home'
    cy.get('a[href="/"]').click();
    
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});
