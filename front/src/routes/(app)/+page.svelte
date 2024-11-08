<script lang="ts">
  import { currentUser } from '$lib/stores/user';
  import type { zPollSchema } from '$lib/models';// Caminho conforme seu projeto
  import { onMount } from 'svelte';
  import { pb } from '$lib/pocketbase.js'; // Conexão com o PocketBase
  import { writable } from 'svelte/store';
  import { z } from 'zod';

   // Define o tipo usando o schema do Poll
  type PollType = z.infer<typeof zPollSchema>;

  // Variável para armazenar as pesquisas em que o usuário participa
  let userPolls: PollType[] = [];


  // Função para carregar as pesquisas do usuário logado
  async function loadUserPolls() {
    try {
      const records = await pb.collection('polls').getFullList({
        filter: `owner = "${$currentUser?.id}"`
      });
      userPolls = records as PollType[];
    } catch (error) {
      console.error("Erro ao carregar as pesquisas do usuário:", error);
    }
  }


  onMount(() => {
    if ($currentUser) {
      loadUserPolls();
    }
  });
</script>

{#if $currentUser}
  <div class="user-info text-2xl font-bold p-4">
    Olá, {$currentUser.fullName}! Aqui estão suas pesquisas:
  </div>

  <div class="poll-list w-full max-w-4xl mx-auto space-y-4 px-4">
    {#each userPolls as poll}
      <div class="poll-item bg-white shadow-lg p-6 border border-gray-200 rounded-lg">
        <h2 class="poll-title text-xl font-semibold">{poll.name}</h2>
        <p class="poll-description text-gray-600">{poll.description}</p>
        <p class="poll-status mt-2">
          <span class="font-bold">Status:</span> {poll.open ? 'Aberta' : 'Fechada'}
        </p>
        <p class="poll-closing-date text-gray-500 text-sm mt-1">
          Fecha em: {poll.closingDate}
        </p>
        <div class="poll-actions mt-4">
          <a href={`/polls/${poll.id}`} class="btn btn-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
            Ver Pesquisa
          </a>
        </div>
      </div>
    {/each}
  </div>
{:else}
  <div class="no-user-message italic font-bold text-center p-6">
    Você não está autenticado.
  </div>
{/if}
