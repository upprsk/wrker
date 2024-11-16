describe("Página de Pesquisas", () => {
    beforeEach(() => {
      // Simular a configuração do localStorage com o usuário correto
      cy.window().then((win) => {
        win.localStorage.setItem(
          "currentUser",
          JSON.stringify({
            id: "currentUser",
            role: "editor", // Definindo o papel do usuário como editor
          })
        );
      });
  
      // Interceptar o endpoint de pesquisas para garantir que a resposta simulada seja correta
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
              owner: "currentUser", // O dono da pesquisa é o "currentUser"
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
  
      // Visitar a página de pesquisas
      cy.visit("http://localhost:5173/polls"); // Garantir a URL completa
    });
  
    it("deve exibir a lista de pesquisas", () => {
      cy.wait("@getPolls");
  
      // Verificar os nomes das pesquisas
      cy.contains("Pesquisa 1").should("exist");
      cy.contains("Pesquisa 2").should("exist");
  
      // Verificar a quantidade de convidados
      cy.contains("2 convidados").should("exist");
      cy.contains("0 convidados").should("exist");
  
      // Verificar a data de término da pesquisa
      cy.contains("em 1 dia").should("exist");
      cy.contains("---").should("exist");
    });
  
    it("deve permitir alternar a exibição da contagem de convidados", () => {
      cy.wait("@getPolls");
  
      // Simular o clique para alternar a contagem de convidados
      cy.contains("Pesquisa 1").parent().within(() => {
        cy.contains("2 convidados").click();
      });
  
      // Verificar a exibição do número de convidados
      cy.contains("Número de convidados: 2").should("exist");
  
      // Fechar a exibição
      cy.contains("2 convidados").click();
      cy.contains("Número de convidados: 2").should("not.exist");
    });
  
    it("deve exibir ações com base no papel do usuário", () => {
      cy.wait("@getPolls");
  
      // Verificar que o botão "Nova Pesquisa" está visível para editores
      cy.contains("Nova Pesquisa").should("exist");
  
      // Verificar que o botão "Editar" aparece apenas para o dono da pesquisa
      cy.contains("Pesquisa 1").parent().within(() => {
        cy.contains("Editar").should("exist");
      });
  
      cy.contains("Pesquisa 2").parent().within(() => {
        cy.contains("Editar").should("not.exist");
      });
    });
  
    it("deve navegar para os detalhes de uma pesquisa ao clicar em 'detalhes'", () => {
      cy.wait("@getPolls");
  
      // Simular a navegação para os detalhes
      cy.contains("Pesquisa 1").parent().within(() => {
        cy.contains("detalhes").click();
      });
  
      // Verificar se a navegação ocorreu
      cy.url().should("include", "/polls/poll1");
    });
  });
  