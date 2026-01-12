describe('Responsive Layout Tests', () => {
    beforeEach(() => {
      // Configuramos mock para evitar errores de red, aunque probamos UI
      cy.visit('/', {
        onBeforeLoad(win) {
          win.localStorage.setItem('i18nextLng', 'en');
        },
      });
    });
  
    it('Se adapta a viewport móvil (iPhone X)', () => {
      // 1. Configurar viewport móvil
      cy.viewport('iphone-x'); // 375 x 812
      
      // 2. Verificar elementos clave
      cy.contains('Welcome to my Portfoliosss').should('be.visible');
      
      // 3. Verificar que el header sigue siendo accesible
      // En este diseño simple, el menú usa CSS Grid, verificamos que no se rompa
      cy.get('a[href="/dashboard"]').should('be.visible');
      
      // 4. Verificar scroll (si aplica)
      cy.scrollTo('bottom');
      // En vez de verificar que NO es visible, verifiquemos que PODEMOS hacer scroll
      cy.window().then(($window) => {
        expect($window.scrollY).to. be.greaterThan(0);
      });
    });
  
    it('Se adapta a viewport Tablet (iPad)', () => {
      cy.viewport('ipad-2'); // 768 x 1024
      cy.contains('Welcome to my Portfoliosss').should('be.visible');
    });
  
    it('Se adapta a Desktop Wide', () => {
      cy.viewport(1920, 1080);
      cy.contains('Welcome to my Portfoliosss').should('be.visible');
    });
  });