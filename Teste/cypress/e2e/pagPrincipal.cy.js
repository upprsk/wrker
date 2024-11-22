describe('Sidebar Component', () => {
  beforeEach(() => {
    // Simula a visita inicial à página com o Sidebar
    cy.visit('http://localhost:5173');
  });

  it('Exibe login e registro quando o usuário não está logado', () => {
    // Remove o usuário do localStorage para simular estado "não logado"
    cy.window().then((win) => {
      win.localStorage.removeItem('currentUser');
      win.location.reload();
    });

    // Garante que os elementos estão visíveis, mesmo com overflow
    cy.contains('Login').scrollIntoView().should('be.visible');
    cy.contains('Register').scrollIntoView().should('be.visible');
  });

  it('Exibe logout e pesquisas quando o usuário está logado', () => {
    // Configura um usuário logado no localStorage
    cy.window().then((win) => {
      win.localStorage.setItem('currentUser', JSON.stringify({ id: '1', name: 'Test User' }));
      win.location.reload();
    });

    // Garante que "Pesquisas" está visível e não possui classes de desativação
    cy.contains('Pesquisas')
      .scrollIntoView()
      .should('be.visible')
      .and('not.have.class', 'pointer-events-none');

    // Verifica que o botão de logout está visível
    cy.contains('Logout').scrollIntoView().should('be.visible');
  });

  it('Alterna a imagem ao passar o mouse', () => {
    // Verifica se a imagem alterna ao passar o mouse
    cy.get('img[alt="LogotipoSite"]')
      .should('have.attr', 'src', '/icons/LogoWorker.png')
      .trigger('mouseenter')
      .should('have.attr', 'src', '/icons/LogoWorkerHover.png')
      .trigger('mouseleave')
      .should('have.attr', 'src', '/icons/LogoWorker.png');
  });

  it('Desativa o link de pesquisas quando o usuário não está logado', () => {
    // Remove o usuário do localStorage para simular estado "não logado"
    cy.window().then((win) => {
      win.localStorage.removeItem('currentUser');
      win.location.reload();
    });

    // Verifica que o link "Pesquisas" está desativado
    cy.contains('Pesquisas')
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

    // Simula o clique no botão de logout
    cy.contains('Logout').scrollIntoView().click();

    // Verifica que o localStorage foi limpo
    cy.window().its('localStorage.currentUser').should('not.exist');
  });
});
