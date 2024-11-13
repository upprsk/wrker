import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173', // Atualize para a porta correta
    setupNodeEvents(on, config) {
      // Evento para registrar falhas com capturas de tela
      on('after:screenshot', (details) => {
        console.log('Screenshot taken:', details.path);
      });

      // Evento para fazer logging de erros de forma detalhada
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
      });

      // Evento para capturar capturas de tela e gerar relatórios de falhas
      on('after:spec', (spec, results) => {
        if (results && results.stats.failures > 0) {
          const screenshots = results.screenshots.map(s => s.path);
          console.log(`Test failed in ${spec.name}. Screenshots:`, screenshots);
        }
      });

      // Outros eventos de uso comum podem ser adicionados aqui
      return config;
    },
    // Configurações adicionais de Cypress
    defaultCommandTimeout: 8000, // Tempo limite para comandos
    retries: 2,                  // Número de tentativas de reexecução em caso de falhas
    video: true,                 // Gravação de vídeos dos testes
  },
});
