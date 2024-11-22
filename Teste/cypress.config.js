const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: false,
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports', // Diretório onde o relatório será salvo
      overwrite: false,            // Não sobrescreve relatórios anteriores
      html: true,                  // Gera relatório em HTML
      json: true,                  // Gera relatório em JSON
    },
  },
});
