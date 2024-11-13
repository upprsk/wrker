describe('Register Component', () => {
    beforeEach(() => {
      // Visita a página de registro antes de cada teste
      cy.visit('http://localhost:4173/register/');
    });
  
    it('Renderiza o formulário de registro corretamente', () => {
      // Verifica se os campos de email, nome completo e senha estão presentes
      cy.get('input[name="email"]').should('exist');
      cy.get('input[name="fullName"]').should('exist');
      cy.get('input[name="password"]').should('exist');
      cy.get('input[name="passwordConfirm"]').should('exist');
      // Verifica se o botão de "Confirmar" está presente
      cy.get('button[type="submit"]').contains('Confirmar').should('exist');
    });
  
    it('Exibe erros de validação ao enviar o formulário vazio', () => {
      // Submete o formulário vazio
      cy.get('button[type="submit"]').click();
  
      // Verifica as mensagens de erro exibidas para cada campo
      cy.contains('Invalid email').should('be.visible');
      cy.contains('String must contain at least 1 character(s)').should('be.visible');
      cy.contains('Cannot be blank.').should('be.visible');
    });
  
    it('Exibe erro de email inválido', () => {
      // Insere um email inválido e submete o formulário
      cy.get('input[name="email"]').type('emailinvalido');
      cy.get('button[type="submit"]').click();
  
      // Verifica a mensagem de erro para o campo de email
      cy.contains('Invalid email').should('be.visible');
    });
  
    it('Exibe erro de senha curta', () => {
      // Insere uma senha curta e submete o formulário
      cy.get('input[name="password"]').type('123');
      cy.get('button[type="submit"]').click();
  
      // Verifica a mensagem de erro para o campo de senha
      cy.contains('String must contain at least 1 character(s)').should('be.visible');
    });
  
    it('Navega para a página de login ao clicar no link', () => {
      // Clica no link para fazer login
      cy.contains('Ja tem uma conta?').find('a').click();
  
      // Verifica se a URL foi alterada para a página de login
      cy.url().should('include', '/login');
    });
  });
  