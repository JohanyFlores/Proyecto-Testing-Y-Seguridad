
describe('Login Flow', () => {
  beforeEach(() => {
    // Forzamos el idioma a inglés antes de cargar la página
    cy.visit('/login', {
      onBeforeLoad(win) {
        win.localStorage.setItem('i18nextLng', 'en');
      },
    });
  });

  it('Validación de campos vacíos', () => {
    // Intentar submit sin llenar campos
    cy.get('input[type="submit"]').click();

    // Verificamos el mensaje exacto definido en en-us.json
    cy.contains('Username and password must not be empty').should('be.visible');
  });

  it('Login exitoso con mock', () => {
    // Simular respuesta exitosa
    cy.mockLoginApi({ success: true });

    // Llenar formulario
    cy.get('input[name="email"]').type('test@test.com');
    cy.get('input[name="password"]').type('password123');
    
    // Enviar
    cy.get('input[type="submit"]').click();

    // Verificar petición interceptada
    // Ajustamos la verificación del body para manejar x-www-form-urlencoded
    cy.wait('@loginRequest').its('request.body').should((body) => {
        expect(body).to.include('email=test%40test.com');
        expect(body).to.include('password=password123');
    });

    // Verificar redirección (asumiendo redirección a /admin o /dashboard)
    cy.url().should('include', '/admin');
  });

  it('Login fallido', () => {
    // Simular respuesta fallida
    cy.mockLoginApi({ success: false });

    // Llenar formulario
    cy.get('input[name="email"]').type('wrong@test.com');
    cy.get('input[name="password"]').type('wrongpassword');
    
    // Enviar
    cy.get('input[type="submit"]').click();

    // Verificar mensaje de error exacto
    cy.wait('@loginRequest');
    cy.contains('Invalid login').should('be.visible');

    // Verificar que seguimos en /login
    cy.url().should('include', '/login');
  });

  it('Estado de loading', () => {
    // Simular respuesta con delay
    cy.mockLoginApi({ success: true, delay: 1000 });

    // Llenar formulario
    cy.get('input[name="email"]').type('test@test.com');
    cy.get('input[name="password"]').type('password123');
    
    // Enviar
    cy.get('input[type="submit"]').click();

    // Verificar indicador de loading
    // Buscamos un texto de loading o el componente Loader
    cy.contains(/Loading|Cargando/i).should('be.visible');
    
    // Esperar a que termine para confirmar que desaparece (opcional pero bueno)
    cy.wait('@loginRequest');
    cy.contains(/Loading|Cargando/i).should('not.exist');
  });

  // Opción B: Test de Navegación con Teclado
  it('Navegación por teclado (Accesibilidad)', () => {
    // 1. Verificar foco inicial (opcional, si tuviera autofocus)
    
    // 2. Navegar usando "Tab" (simulado con type o focus directo)
    // Al no tener el plugin 'cypress-plugin-tab', probamos la funcionalidad de Enter
    
    // Llenar email
    cy.get('input[name="email"]')
      .focus()
      .type('test@test.com')
      .should('have.value', 'test@test.com');
      
    // Simular Tab o ir directo al password
    cy.get('input[name="password"]')
      .focus()
      .type('password123');

    // 3. Enviar formulario presionando ENTER en el campo password
    cy.mockLoginApi({ success: true, delay: 500 }); // Mock para verificar el envío
    cy.get('input[name="password"]').type('{enter}');

    // 4. Verificar que se disparó el submit
    cy.contains(/Loading|Cargando/i).should('be.visible');
    cy.wait('@loginRequest');
    
    // 5. Verificar redirección
    cy.url().should('include', '/admin');
  });
});
