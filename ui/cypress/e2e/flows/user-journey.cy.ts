describe('User Journey Flow', () => {
  beforeEach(() => {
    // Setup Mocks
    cy.mockDashboardApi();
    cy.mockLoginApi();
    
    // Visit Landing with English locale
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('i18nextLng', 'en');
      },
    });
  });

  it('Completa el flujo de usuario completo: Landing -> Dashboard -> Login', () => {
    // 1. Verificar Landing Page
    cy.contains('Welcome to my Portfoliosss').should('be.visible');

    // 2. Navegar al Dashboard
    cy.get('a[href="/dashboard"]').click();
    cy.url().should('include', '/dashboard');

    // 3. Verificar datos en Dashboard
    cy.wait(['@getAboutMe', '@getProjects']);
    cy.getByTestId('about-me-section').should('contain', 'Johany Flores');
    cy.contains('Project Alpha').should('be.visible');

    // 4. Navegar a Login (via link Admin que es protegido)
    cy.get('a[href="/admin"]').click();
    
    // Verificar redirección automática a login
    cy.url().should('include', '/login');

    // 5. Completar formulario de login
    cy.get('input[name="email"]').type('test@test.com');
    cy.get('input[name="password"]').type('password123');
    
    // 6. Enviar formulario
    cy.get('input[type="submit"]').click();

    // 7. Verificar petición y redirección final
    cy.wait('@loginRequest').its('request.body').should((body) => {
        expect(body).to.include('email=test%40test.com');
        expect(body).to.include('password=password123');
    });

    // Login exitoso redirige a /admin
    cy.url().should('include', '/admin');
    
    // Verificar autenticación post-login
    cy.checkAuth();
  });
});
