<script lang="ts">
  import { currentUser } from '$lib/stores/user';

</script>

{#if $currentUser}
  <div class="user-info">
    Olá, {$currentUser.fullName}!
  </div>
{:else}
  <div class="no-user-message italic font-bold">
    Você não está autenticado.
  </div>
{/if}