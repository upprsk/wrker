describe('Login Component', () => {
  beforeEach(() => {
    // Visita a página de login antes de cada teste
    cy.visit('http://localhost:4173/login/');
  });

  it('Renderiza o formulário de login corretamente', () => {
    // Verifica se os campos de email e senha estão presentes
    cy.get('input[name="email"]').should('exist');
    cy.get('input[name="password"]').should('exist');
    // Verifica se o botão de "Confirmar" está presente
    cy.get('button[type="submit"]').contains('Confirmar').should('exist');
  });

  it('Exibe erros de validação ao enviar o formulário vazio', () => {
    // Submete o formulário vazio
    cy.get('button[type="submit"]').click();

    // Verifica as mensagens de erro exibidas para os campos
    cy.contains('Invalid email').should('be.visible');
    cy.contains('String must contain at least 1 character(s)').should('be.visible');
  });

  it('Exibe erro de email inválido', () => {
    // Insere um email inválido e submete o formulário
    cy.get('input[name="email"]').type('emailinvalido');
    cy.get('button[type="submit"]').click();

    // Verifica a mensagem de erro para o campo de email
    cy.contains('Invalid email').should('be.visible');
  });

  it('Exibe mensagem de erro geral ao falhar no login', () => {
    // Insira um email e senha incorretos
    cy.get('input[name="email"]').type('teste@dominio.com');
    cy.get('input[name="password"]').type('senhaerrada');
    
    // Intercepta a requisição ao backend e força uma resposta de erro
    cy.intercept('POST', '**/authWithPassword', {
      statusCode: 401,
      body: { message: 'Something went wrong while processing your request.' }
    });

    // Submete o formulário
    cy.get('button[type="submit"]').click();
  });

  it('Navega para a página de registro ao clicar no link', () => {
    // Clica no link para criar uma conta
    cy.contains('Nao tem uma conta?').find('a').click();

    // Verifica se a URL foi alterada para a página de registro
    cy.url().should('include', '/register');
  });
});
