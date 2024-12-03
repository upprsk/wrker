describe("Página de Pesquisas", () => {
  const loginUser = (email, password) => {
    // Visita a página de login
    cy.visit("http://localhost:4173/login");

    // Preenche os campos de login
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);

    // Submete o formulário
    cy.get('button[type="submit"]').click();

  };


  it("Somente Editores podem criar pesquisa", () => {
    // Realiza o login como editor
    loginUser("editor@teste.com", "senha123");

    cy.get('.navbar > :nth-child(1) > .btn').click();
    cy.visit("http://localhost:4173/polls/");

    // Verifica que o botão "Nova Pesquisa" está visível
    cy.contains("Nova Pesquisa").should("exist");

  });

  it("Não deve exibir o botão 'Nova Pesquisa' para viewers", () => {
    // Realiza o login como viewer
    loginUser("viewer@teste.com", "senha123");

    cy.get('.navbar > :nth-child(1) > .btn').click();
    cy.visit("http://localhost:4173/polls/");

    // Verifica que o botão "Nova Pesquisa" não está visível
    cy.contains("Nova Pesquisa").should("not.exist");

    cy.visit("http://localhost:4173/");
    // Verifica que a mensagem de restrição aparece
    cy.contains("Você não tem permissão para criar pesquisas.").should("exist");
  });

  it("Viewer deve ser capaz de ver a Pesquisa da qual ele está participando", () => {
    // Realiza o login como viewer
    loginUser("viewer@teste.com", "senha123");

    cy.get('.navbar > :nth-child(1) > .btn').click();
    cy.visit("http://localhost:4173/polls/");

    // Verifica que o botão "Nova Pesquisa" não está visível
    cy.contains("Pesquisa Teste").should("exist");
    cy.get('.text-right > .btn').click();
  });

  it("Viewer NÃO deve ser capaz de ver a Pesquisa da qual ele NÃO está participando", () => {
    // Realiza o login como viewer
    loginUser("viewer@teste.com", "senha123");

    cy.get('.navbar > :nth-child(1) > .btn').click();
    cy.visit("http://localhost:4173/polls/");

    // Verifica que o botão "Nova Pesquisa" não está visível
    cy.contains("Pesquisa Teste 2").should("not.exist");
  });

  it("Editores devem ser capazes de criar pesquisa", () => {
    // Realiza o login como editor
    loginUser("editor@teste.com", "senha123");

    cy.get('.navbar > :nth-child(1) > .btn').click();
    cy.visit("http://localhost:4173/polls/");

    // Verifica que o botão "Nova Pesquisa" está visível
    cy.contains("Nova Pesquisa").should("exist");
    cy.get('.flex > .btn').click();

    cy.get('input[name="name"]').type('PesquisaDoEditor');
    cy.get('.ql-editor').type('PesquisaDoEditor');
    cy.get('.btn-primary').click();

  });

  it("Editores devem ser capazes de editar Pesquisas", () => {
    // Realiza o login como editor
    loginUser("editor@teste.com", "senha123");

    cy.get('.navbar > :nth-child(1) > .btn').click();
    cy.visit("http://localhost:4173/polls/");

    cy.get(':nth-child(1) > .text-right > .btn-primary').click();
    cy.get('.btn-secondary').click();

    cy.get('.mt-24 > .btn').click();
    cy.get('.ql-editor').type('Pergunta');

    cy.get(':nth-child(1) > .input').type('1');
    cy.get(':nth-child(2) > .input').type('1');
    cy.get('.rounded > .flex > .btn').click();

    cy.get('form.flex > :nth-child(1) > .input').type('2');
    cy.get('form.flex > :nth-child(2) > .input').type('2');
    cy.get('form.flex > .btn').click();

    cy.get('.modal-action > .btn').click();

  });
});
