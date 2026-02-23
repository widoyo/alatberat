<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import {
		FieldGroup,
		Field,
		FieldLabel,
		FieldDescription,
	} from "$lib/components/ui/field/index.js";
    import { enhance } from '$app/forms';
    import type { ActionData } from './$types';
    let { form }: { form: ActionData } = $props();
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
<Card.Root class="mx-auto w-[365px] border-black">
  <Card.Header>
    <Card.Title class="text-2xl">Login</Card.Title>
  </Card.Header>
  <Card.Content>
    <form method="POST" action="?/login" use:enhance>
      <FieldGroup>
        <Field>
          <FieldLabel for="username">Username</FieldLabel>
          <Input id="username" type="text" name="username" required />
        </Field>
        <Field>
          <div class="flex items-center">
            <FieldLabel for="password">Password</FieldLabel>
          </div>
          <Input id="password" name="password" type="password" required />
        </Field>
        <Field>
          <Button type="submit" class="w-full py-5">Login</Button>
        </Field>
      </FieldGroup>
    </form>
  </Card.Content>
</Card.Root>
<p style="color: red">{form?.message ?? ''}</p>
</div>