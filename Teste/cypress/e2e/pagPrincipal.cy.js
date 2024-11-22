describe('Sidebar Component', () => {
  beforeEach(() => {
    // Simula a visita inicial à página com o Sidebar
    cy.visit('http://localhost:4173');
  });

  it('Exibe login e registro quando o usuário não está logado', () => {
    // Remove o usuário do localStorage para simular estado "não logado"
    cy.window().then((win) => {
      win.localStorage.removeItem('currentUser');
      win.location.reload();
    });

    // Simula o clique para abrir a barra lateral, se necessário
    cy.get('.navbar > :nth-child(1) > .btn').click(); // Ajuste o seletor conforme o seu código

    // Garante que os elementos estão visíveis, mesmo com overflow
    cy.contains('Login').scrollIntoView().should('be.visible');
    cy.contains('Register').scrollIntoView().should('be.visible');
  });

  it('Exibe logout e pesquisas quando o usuário está logado', () => {
    // Configura um usuário logado no localStorage
    cy.visit('http://localhost:4173/login/');

    // Realiza o login inserindo credenciais válidas
    cy.get('input[name="email"]').type('bla@bla.com');
    cy.get('input[name="password"]').type('12345678');
    cy.get('button[type="submit"]').click();

    cy.url().should('not.include', '/login');

    cy.get('.navbar > :nth-child(1) > .btn').click();

    // Garante que "Pesquisas" está visível e não possui classes de desativação
    cy.contains('Pesquisas')
      .scrollIntoView()
      .should('be.visible')
      .and('not.have.class', 'pointer-events-none');

    // Verifica que o botão de logout está visível
    cy.contains('Logout').scrollIntoView().should('be.visible');
  });

  it('Desativa o link de pesquisas quando o usuário não está logado', () => {
    
    cy.get('.navbar > :nth-child(1) > .btn').click();

    // Verifica que o link "Pesquisas" está desativado
    cy.contains('li','Pesquisas')
    .should('exist') // Certifique-se de que o elemento está no DOM
    .scrollIntoView()
    .should('have.class', 'pointer-events-none')
    .and('have.class', 'disabled');
  });

  it('Despacha o evento de logout ao clicar no botão', () => {
    // Configura um usuário logado no localStorage
    cy.window().then((win) => {
      win.localStorage.setItem('currentUser', JSON.stringify({ id: '1', name: 'Test User' }));
      win.location.reload();
    });

    cy.visit('http://localhost:4173/login/');

    // Realiza o login inserindo credenciais válidas
    cy.get('input[name="email"]').type('bla@bla.com');
    cy.get('input[name="password"]').type('12345678');
    cy.get('button[type="submit"]').click();

    cy.url().should('not.include', '/login');

    cy.get('.navbar > :nth-child(1) > .btn').click();

    // Simula o clique no botão de logout
    cy.contains('Logout').scrollIntoView().click();

  });
});
