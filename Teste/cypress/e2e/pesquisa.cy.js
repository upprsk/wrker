describe("Página de Pesquisas", () => {
  beforeEach(() => {
    // Etapa 1: Registra um novo usuário
    cy.visit("http://localhost:4173/register/");

    cy.get('input[name="email"]').type("teste1@example.com");
    cy.get('input[name="fullName"]').type("Teste1 Usuário");
    cy.get('input[name="password"]').type("senha123");
    cy.get('input[name="passwordConfirm"]').type("senha123");
    cy.get('button[type="submit"]').contains("Confirmar").click();

    // Verifica se o registro foi bem-sucedido e redireciona para o login
    cy.url().should("include", "/login");

    // Etapa 2: Realiza login com o novo usuário
    cy.get('input[name="email"]').type("teste1@example.com");
    cy.get('input[name="password"]').type("senha123");
    cy.get('button[type="submit"]').contains("Login").click();

    // Configura o localStorage para simular o contexto correto
    cy.window().then((win) => {
      win.localStorage.setItem(
        "currentUser",
        JSON.stringify({
          id: "currentUser",
          role: "editor",
        })
      );
    });

    // Etapa 3: Intercepta a API de pesquisas
    cy.intercept("GET", "/api/polls", {
      statusCode: 200,
      body: {
        polls: [
          {
            id: "poll1",
            name: "Pesquisa 1",
            audience: ["user1", "user2"],
            closingDate: new Date(Date.now() + 86400000).toISOString(),
            open: true,
            owner: "currentUser",
          },
          {
            id: "poll2",
            name: "Pesquisa 2",
            audience: [],
            closingDate: null,
            open: false,
            owner: "editorUser",
          },
        ],
        questions: [
          { id: "q1", poll: "poll1" },
          { id: "q2", poll: "poll1" },
        ],
        answers: [{ id: "a1", expand: { question: { poll: "poll1" } } }],
      },
    }).as("getPolls");

    // Etapa 4: Visita a página de pesquisas
    cy.visit("http://localhost:5173/polls");
  });

  it("deve exibir a lista de pesquisas", () => {
    cy.wait("@getPolls");

    cy.contains("Pesquisa 1").should("exist");
    cy.contains("Pesquisa 2").should("exist");

    cy.contains("2 convidados").should("exist");
    cy.contains("0 convidados").should("exist");

    cy.contains("em 1 dia").should("exist");
    cy.contains("---").should("exist");
  });

  it("deve permitir alternar a exibição da contagem de convidados", () => {
    cy.wait("@getPolls");

    cy.contains("Pesquisa 1").parent().within(() => {
      cy.contains("2 convidados").click();
    });

    cy.contains("Número de convidados: 2").should("exist");

    cy.contains("2 convidados").click();
    cy.contains("Número de convidados: 2").should("not.exist");
  });

  it("deve exibir ações com base no papel do usuário", () => {
    cy.wait("@getPolls");

    cy.contains("Nova Pesquisa").should("exist");

    cy.contains("Pesquisa 1").parent().within(() => {
      cy.contains("Editar").should("exist");
    });

    cy.contains("Pesquisa 2").parent().within(() => {
      cy.contains("Editar").should("not.exist");
    });
  });

  it("deve navegar para os detalhes de uma pesquisa ao clicar em 'detalhes'", () => {
    cy.wait("@getPolls");

    cy.contains("Pesquisa 1").parent().within(() => {
      cy.contains("detalhes").click();
    });

    cy.url().should("include", "/polls/poll1");
  });
});
