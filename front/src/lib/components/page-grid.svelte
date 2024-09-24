<div class="grid w-full grid-cols-1 p-5 sm:grid-cols-2">
  <div>
    <div class="breadcrumbs text-sm">
      <slot name="breadcrumbs" />
    </div>
  </div>

  <div class="flex items-center justify-end gap-2">
    <slot name="actions" />
  </div>

  <div class="col-span-2">
    <slot />
  </div>
</div>
