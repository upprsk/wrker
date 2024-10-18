<script lang="ts">
  import { currentUser } from '$lib/stores/user';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  const drawerId = 'my-drawer';

  const logout = () => {
    dispatch('logout');
    checked = false;
  };

  let checked = false;
</script>

<div class="drawer lg:drawer-open">
  <input id={drawerId} bind:checked type="checkbox" class="drawer-toggle" />
  <div class="drawer-content flex flex-col items-center justify-start overflow-y-auto">
    <slot {drawerId} />
  </div>
  <div class="drawer-side">
    <label for={drawerId} aria-label="close sidebar" class="drawer-overlay"></label>
    <ul class="menu min-h-full w-80 bg-base-100 p-4 text-base-content shadow-sm">
      <!-- Logo do site inserida no lugar da palavra "wrker" -->
      <li class="hidden lg:block">
        <a href="/">
          <img src="/front/src/logo_wrker2.webp" alt="Logo wrker" class="w-full h-auto" />
        </a>
      </li>

      <li class:disabled={!$currentUser} class:pointer-events-none={!$currentUser}>
        <a href="/polls">Pesquisas</a>
      </li>

      {#if $currentUser}
        <li>
          <button type="button" on:click={logout}>Logout</button>
        </li>
      {:else}
        <li><a href="/login" class="font-bold">Login</a></li>
        <li><a href="/register" class="font-bold">Register</a></li>
      {/if}
    </ul>
  </div>
</div>
