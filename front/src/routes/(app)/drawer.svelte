<script lang="ts">
  import { currentUser } from '$lib/stores/user';
  import { createEventDispatcher } from 'svelte';
  import logo from '../../icons/logo_svg_icon.svg';
  import worker from '../../icons/LogoWorker.png';
  import workerHover from '../../icons/LogoWorkerHover.png';

  const dispatch = createEventDispatcher();
  const drawerId = 'my-drawer';
  let currentImage = worker;

  function handleMouseEnter() {
    currentImage = workerHover;
  }

  function handleMouseLeave() {
    currentImage = worker;
  }

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
  <div class="drawer-side bg-cyan-100"> <!-- Fundo azul ciano claro aplicado aqui -->
    <label for={drawerId} aria-label="close sidebar" class="drawer-overlay"></label>
    <ul class="menu min-h-full w-80 p-4 text-base-content shadow-sm">
      <li class="hidden lg:block hover:bg-transparent">
        <a
          href="/"
          class="btn btn-ghost flex w-full font-serif text-2xl !bg-transparent !shadow-none"
        >
          <img 
            src={currentImage} 
            alt="LogotipoSite" 
            class="w-32 mx-auto mb-4" 
            on:mouseenter={handleMouseEnter}
            on:mouseleave={handleMouseLeave}
          >
        </a>
      </li>

      <li class:disabled={!$currentUser} class:pointer-events-none={!$currentUser}>
        <a href="/polls" class="font-bold">Pesquisas</a>
      </li>

      {#if $currentUser}
        <li>
          <button class="font-bold" type="button" on:click={logout}>Logout</button>
        </li>
      {:else}
        <li><a href="/login" class="font-bold">Login</a></li>
        <li><a href="/register" class="font-bold">Register</a></li>
      {/if}

    </ul>

    <div class="absolute bottom-0 w-full isolate">
      <img src={logo} alt="LogotipoCaptalis" class="w-32 mx-auto mb-4">
    </div>
  </div>
</div>
