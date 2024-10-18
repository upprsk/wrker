<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  const drawerId = 'my-drawer';

  let checked = false;

  const logout = () => {
    dispatch('logout');
    checked = false; // Fecha o drawer ao deslogar
  };
</script>

<style>
  .drawer {
    background-color: #f8f9fa;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }

  .drawer-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    padding: 2rem;
    min-height: 100vh;
    background-color: #fff;
  }

  .drawer-side {
    background-color: #1e293b;
    color: white;
    width: 80px;
    transition: width 0.2s;
  }

  .drawer-side:hover {
    width: 250px;
  }

  .menu a {
    color: #cbd5e1;
    text-decoration: none;
    display: block;
    padding: 10px 15px;
    font-weight: 500;
    transition: background-color 0.2s;
  }

  .menu a:hover {
    background-color: #334155;
    border-radius: 5px;
  }

  .menu button {
    background-color: #ff4d4f;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .menu button:hover {
    background-color: #f5222d;
  }

  .logo {
    width: 100px;
    margin: 20px auto;
    transition: all 0.3s;
  }

  @media (max-width: 1024px) {
    .drawer-side {
      display: none;
    }

    .drawer-toggle {
      display: block;
    }

    .drawer-toggle:checked ~ .drawer-side {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 10;
    }

    .drawer-content {
      padding-left: 0;
    }
  }
</style>

<div class="drawer lg:drawer-open">
  <input id={drawerId} bind:checked type="checkbox" class="drawer-toggle" />
  
  <!-- Conteúdo do site -->
  <div class="drawer-content">
    <slot {drawerId} />
  </div>

  <!-- Sidebar / Drawer -->
  <div class="drawer-side">
    <label for={drawerId} aria-label="close sidebar" class="drawer-overlay"></label>
    <ul class="menu min-h-full w-80 p-4 text-base-content shadow-sm">
      <!-- Logo -->
      <li class="hidden lg:block">
        <a href="/">
          <img src="/front/src/logo_wrker2.webp" alt="Logo wrker" class="logo" />
        </a>
      </li>

      <!-- Links de navegação -->
      <li class:disabled={!$currentUser} class:pointer-events-none={!$currentUser}>
        <a href="/polls">Pesquisas</a>
      </li>

      <!-- Logout -->
      {#if $currentUser}
        <li>
          <button on:click={logout}>Logout</button>
        </li>
      {:else}
        <li><a href="/login" class="font-bold">Login</a></li>
        <li><a href="/register" class="font-bold">Register</a></li>
      {/if}
    </ul>
  </div>
</div>
