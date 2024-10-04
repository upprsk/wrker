<script lang="ts">
  import { zMakeErrorDataSchema } from '$lib/models';
  import { processError } from '$lib/pocketbase';
  import {
    zEditPollQuestionSchema,
    zEditPollSchema,
    type EditPollQuestionSchema,
  } from '$lib/schemas';
  import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import Quill from './quill.svelte';
  import { Field, Control, Label, FieldErrors } from 'formsnap';

  export let data: SuperValidated<Infer<EditPollQuestionSchema>>;
  export let action: (data: Infer<EditPollQuestionSchema>) => PromiseLike<unknown>;

  const zError = zMakeErrorDataSchema(zEditPollQuestionSchema.keyof());

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

  let key = '';
  let value = '';
</script>

<form class="card-body" method="POST" use:enhance>
  <h4 class="card-title"><slot /></h4>

  <div class="form-control w-full max-w-2xl">
    <div class="label">
      <div class="label-text">Pergunta</div>
    </div>

    <Quill bind:contents={$formData.question} />
  </div>

  <div class="form-control w-full max-w-xs">
    <Field {form} name="options.kind">
      <Control let:attrs>
        <div class="label cursor-pointer">
          <Label class="label-text">Tipo de pergunta</Label>
        </div>

        <select {...attrs} class="select select-bordered" bind:value={$formData.options.kind}>
          <option value="single">Unico</option>
          <option value="multiple">Multiplo</option>
        </select>
      </Control>
      <FieldErrors class="text-error" />
    </Field>
  </div>

  <div class="rounded border p-5">
    {#each $formData.options.entries as opt, idx (opt.key)}
      <div class="flex w-full grid-cols-5 flex-wrap items-end gap-2 sm:grid">
        <label class="form-control col-span-2 w-full max-w-xs">
          <Field {form} name="options.entries[{idx}].key">
            <Control let:attrs>
              <div class="label">
                <Label class="label-text">Alternativa {idx + 1}</Label>
              </div>
              <input
                {...attrs}
                type="text"
                class="input input-bordered w-full max-w-xs"
                bind:value={opt.key}
              />
            </Control>
            <FieldErrors class="text-error" />
          </Field>
        </label>

        <label class="form-control col-span-2 w-full max-w-xs">
          <Field {form} name="options.entries[{idx}].value">
            <Control let:attrs>
              <div class="label">
                <Label class="label-text">Valor</Label>
              </div>
              <input
                {...attrs}
                type="text"
                class="input input-bordered w-full max-w-xs"
                bind:value={opt.value}
              />
            </Control>
            <FieldErrors class="text-error" />
          </Field>
        </label>

        <button
          type="button"
          on:click={() =>
            ($formData.options.entries = $formData.options.entries.filter(
              (it) => it.key !== opt.key,
            ))}
          class="btn">Remover</button
        >
      </div>
    {/each}

    <form
      on:submit={(e) => {
        e.preventDefault();
        $formData.options.entries = [...$formData.options.entries, { key, value }];

        key = '';
        value = '';
      }}
      class="flex w-full grid-cols-5 flex-wrap items-end gap-2 sm:grid"
    >
      <label class="form-control col-span-2 w-full max-w-xs">
        <div class="label">
          <span class="label-text">Nova Alternativa</span>
        </div>
        <input type="text" class="input input-bordered w-full max-w-xs" bind:value={key} />
      </label>

      <label class="form-control col-span-2 w-full max-w-xs">
        <div class="label">
          <span class="label-text">Valor</span>
        </div>
        <input type="text" class="input input-bordered w-full max-w-xs" bind:value />
      </label>

      <button class="btn" disabled={key === '' || value === ''}>Adicionar</button>
    </form>
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

  <div class="modal-action">
    <button type="submit" class="btn btn-primary" class:btn-warning={key !== '' || value !== ''}>
      Salvar
    </button>
  </div>
</form>
