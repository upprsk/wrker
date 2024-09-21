<script lang="ts">
  import { dev } from '$app/environment';
  import { goto } from '$app/navigation';
  import { zMakeErrorDataSchema } from '$lib/models';
  import { pb, processError } from '$lib/pocketbase';
  import { Control, Description, Field, FieldErrors, Label } from 'formsnap';
  import SuperDebug, { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { zRegisterSchema, type RegisterSchema } from './schema';

  export let data: SuperValidated<Infer<RegisterSchema>>;

  const zError = zMakeErrorDataSchema(zRegisterSchema.keyof());

  const form = superForm(data, {
    validators: zodClient(zRegisterSchema),
    SPA: true,
    async onUpdate({ form }) {
      console.log(form.data);

      try {
        await pb.collection('users').create({ ...form.data, role: 'viewer' });
        await pb.collection('users').authWithPassword(form.data.email, form.data.password);
      } catch (e) {
        console.error(e);

        return processError(form, e, zError);
      }

      goto('/');
    },
  });

  const { form: formData, errors, enhance } = form;
</script>

<form class="card-body" method="POST" use:enhance>
  <h4 class="card-title">Registrar</h4>

  <label class="form-control w-full max-w-xs">
    <Field {form} name="email">
      <Control let:attrs>
        <div class="label">
          <Label class="label-text">Email</Label>
          <!-- <span class="label-text-alt">Top Right label</span> -->
        </div>
        <input
          {...attrs}
          type="email"
          class="input input-bordered w-full max-w-xs"
          bind:value={$formData.email}
        />
      </Control>
      <div class="label">
        <Description class="label-text-alt"
          >Use um email ao qual voce tenha acesso e seja reconhecido por seus colegas</Description
        >
        <!--   <span class="label-text-alt">Bottom Right label</span> -->
      </div>
      <FieldErrors class="text-error" />
    </Field>
  </label>

  <label class="form-control w-full max-w-xs">
    <Field {form} name="fullName">
      <Control let:attrs>
        <div class="label">
          <Label class="label-text">Nome completo</Label>
          <!-- <span class="label-text-alt">Top Right label</span> -->
        </div>
        <input
          {...attrs}
          type="text"
          class="input input-bordered w-full max-w-xs"
          bind:value={$formData.fullName}
        />
      </Control>
      <FieldErrors class="text-error" />
    </Field>
  </label>

  <label class="form-control w-full max-w-xs">
    <Field {form} name="password">
      <Control let:attrs>
        <div class="label">
          <Label class="label-text">Senha</Label>
          <!-- <span class="label-text-alt">Top Right label</span> -->
        </div>
        <input
          {...attrs}
          type="password"
          class="input input-bordered w-full max-w-xs"
          bind:value={$formData.password}
        />
      </Control>
      <FieldErrors class="text-error" />
    </Field>
  </label>

  <label class="form-control w-full max-w-xs">
    <Field {form} name="passwordConfirm">
      <Control let:attrs>
        <div class="label">
          <Label class="label-text">Confirme a Senha</Label>
          <!-- <span class="label-text-alt">Top Right label</span> -->
        </div>
        <input
          {...attrs}
          type="password"
          class="input input-bordered w-full max-w-xs"
          bind:value={$formData.passwordConfirm}
        />
      </Control>
      <FieldErrors class="text-error" />
    </Field>
  </label>

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
    <button type="submit" class="btn btn-primary">Confirmar</button>
  </div>
</form>

{#if dev}
  <SuperDebug data={$formData} />
{/if}
