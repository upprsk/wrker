<script lang="ts">
  import { currentUser } from '$lib/stores/user';
  import type { zPollSchema } from '$lib/models'; // Ajuste o caminho conforme seu projeto
  import { onMount } from 'svelte';
  import { pb } from '$lib/pocketbase.js'; // Conexão com o PocketBase
  import { z } from 'zod';

  // Define o tipo usando o schema do Poll
  type PollType = z.infer<typeof zPollSchema>;

  // Variável para armazenar as pesquisas visíveis ao usuário
  let userPolls: PollType[] = [];

  // Função para carregar as pesquisas do usuário logado
  async function loadUserPolls() {
    try {
      const records = await pb.collection('polls').getFullList({
        filter: `owner = "${$currentUser?.id}"`,
        expand: 'audience', // Expande os dados de audiência
      });

      userPolls = records.map((record: any) => ({
        ...record,
        description: extractText(record.description),
        closingDate: formatDate(record.closingDate),
        audienceCount: record.expand?.audience?.length || 0, // Conta os participantes
      })) as PollType[];
    } catch (error) {
      console.error('Erro ao carregar as pesquisas do usuário:', error);
    }
  }

  // Extrai o texto de um campo 'description' (JSON ou string)
  function extractText(description: any): string {
    if (typeof description === 'string') {
      return description; // Já é texto simples
    } else if (description?.ops) {
      return description.ops.map((op: any) => op.insert).join('');
    }
    return '[Descrição indisponível]';
  }

  // Formata a data de fechamento em um formato legível
  function formatDate(dateStr: string | null): string {
    if (!dateStr) return 'Data não definida';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  onMount(() => {
    if ($currentUser) {
      loadUserPolls();
    }
  });
</script>

<!-- Interface -->
{#if $currentUser}
  <!-- Verifica o papel do usuário -->
  {#if $currentUser.role === 'viewer'}
    <div class="user-info text-2xl font-bold text-center p-4">
      Olá, {$currentUser.fullName}! <br> Você não tem permissão para criar pesquisas.
    </div>
  {:else}
    <div class="user-info text-3xl font-bold p-4 text-center">
      Olá, {$currentUser.fullName}! Aqui estão as pesquisas que você criou:
    </div>

    <div class="poll-list w-full max-w-6xl mx-auto space-y-6 px-4">
      {#each userPolls as poll}
        <div class="poll-item bg-gradient-to-r from-blue-100 to-blue-200 shadow-lg p-6 border border-gray-200 rounded-lg hover:shadow-xl transition-all">
          <h2 class="poll-title text-2xl font-bold text-gray-800 mb-2">{poll.name}</h2>
          <p class="poll-description text-gray-600 text-lg">{poll.description}</p>
          <div class="poll-details mt-4 text-sm">
            <p>
              <span class="font-bold">Status:</span> 
              <span class="{poll.open ? 'text-green-600' : 'text-red-600'}">
                {poll.open ? 'Aberta' : 'Fechada'}
              </span>
            </p>
            <p>
              <span class="font-bold">Fecha em:</span> {poll.closingDate}
            </p>
            <p>
              <span class="font-bold">Participantes:</span> 
              <span class="text-blue-700">{poll.audienceCount}</span>
            </p>
          </div>
          <div class="poll-actions mt-6 flex justify-end space-x-4">
            <a 
              href={`/polls/${poll.id}`} 
              class="btn btn-primary bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded-full shadow-md transition-all"
            >
              Ver Pesquisa
            </a>
          </div>
        </div>
      {/each}
    </div>
  {/if}
{:else}
  <div class="no-user-message italic font-bold text-center p-6">
    Você não está autenticado.
  </div>
{/if}


