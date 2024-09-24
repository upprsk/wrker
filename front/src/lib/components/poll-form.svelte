<script lang="ts">
  import { zMakeErrorDataSchema } from '$lib/models';
  import { processError } from '$lib/pocketbase';
  import { zEditPollSchema, type EditPollSchema } from '$lib/schemas';
  import { Control, Field, FieldErrors, Label } from 'formsnap';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import Quill from './quill.svelte';

  export let data: SuperValidated<Infer<EditPollSchema>>;
  export let action: (data: Infer<EditPollSchema>) => PromiseLike<unknown>;

  const zError = zMakeErrorDataSchema(zEditPollSchema.keyof());

  const form = superForm(data, {
    validators: zodClient(zEditPollSchema),
    SPA: true,
    dataType: 'json',
    async onUpdate({ form }) {
      console.log(form.data);

      try {
        await action(form.data);
      } catch (e) {
        console.error(e);

        return processError(form, e, zError);
      }
    },
  });

  const { form: formData, errors, enhance } = form;

  const getToday = () => {
    const d = new Date(new Date().toDateString()).toISOString();
    return d.slice(0, d.length - 1);
  };

  $: console.log('formData.description:', $formData.description, getToday());
</script>

<form class="card-body" method="POST" use:enhance>
  <h4 class="card-title"><slot /></h4>

  <label class="form-control w-full max-w-xs">
    <Field {form} name="name">
      <Control let:attrs>
        <div class="label">
          <Label class="label-text">Titulo</Label>
          <!-- <span class="label-text-alt">Top Right label</span> -->
        </div>
        <input
          {...attrs}
          type="text"
          class="input input-bordered w-full max-w-xs"
          bind:value={$formData.name}
        />
      </Control>
      <!-- <div class="label"> -->
      <!-- <Description class="label-text-alt"></Description> -->
      <!--   <span class="label-text-alt">Bottom Right label</span> -->
      <!-- </div> -->
      <FieldErrors class="text-error" />
    </Field>
  </label>

  <div class="form-control w-full max-w-2xl">
    <div class="label">
      <div class="label-text">Descricao</div>
    </div>

    <Quill bind:contents={$formData.description} />
  </div>

  <label class="form-control w-full max-w-xs">
    <Field {form} name="closingDate">
      <Control let:attrs>
        <div class="label">
          <Label class="label-text">Data de termino</Label>
        </div>
        <input
          {...attrs}
          type="datetime-local"
          class="input input-bordered w-full max-w-xs"
          min={getToday()}
          bind:value={$formData.closingDate}
        />
      </Control>
      <FieldErrors class="text-error" />
    </Field>
  </label>

  <div class="form-control w-full max-w-xs">
    <Field {form} name="anonymous">
      <Control let:attrs>
        <div class="label cursor-pointer">
          <Label class="label-text">Anonimo</Label>

          <input {...attrs} type="checkbox" class="toggle" bind:checked={$formData.anonymous} />
        </div>
      </Control>
      <FieldErrors class="text-error" />
    </Field>
  </div>

  <div class="form-control w-full max-w-xs">
    <Field {form} name="open">
      <Control let:attrs>
        <div class="label cursor-pointer">
          <Label class="label-text">Aberto</Label>

          <input {...attrs} type="checkbox" class="toggle" bind:checked={$formData.open} />
        </div>
      </Control>
      <FieldErrors class="text-error" />
    </Field>
  </div>

  {#if $errors._errors}
    {#each $errors._errors as err}
      <div role="alert" class="alert alert-error">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{err}</span>
      </div>
    {/each}
  {/if}

  <div class="card-actions justify-end">
    <button type="submit" class="btn btn-primary">Salvar</button>
  </div>
</form>
