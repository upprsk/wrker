import type { zUserSchema } from '$lib/models';
import { writable } from 'svelte/store';
import type { z } from 'zod';

export const currentUser = writable<z.infer<typeof zUserSchema> | null>();
