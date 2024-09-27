<div class="grid w-full grid-cols-1 p-5 sm:grid-cols-2">
  <div>
    <div class="breadcrumbs hidden text-sm sm:block" class:col-span-2={!$$slots.actions}>
      <slot name="breadcrumbs" />
    </div>

    <div>
      <button on:click={() => history.back()} type="button" class="btn btn-error btn-xs sm:hidden">
        voltar
      </button>
    </div>
  </div>

  {#if $$slots.actions}
    <div class="flex items-center justify-end gap-2">
      <slot name="actions" />
    </div>
  {/if}

  <div class="col-span-2">
    <slot />
  </div>
</div>
