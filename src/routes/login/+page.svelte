<script lang="ts">
    import { enhance } from '$app/forms';
    import type { ActionData } from './$types';
    let { form }: { form: ActionData } = $props();
</script>

<form method="POST" action="?/login" class="w-full max-w-md space-y-4 p-4" use:enhance>
	<label class="label">
		<span class="label-text">Username</span>
		<input name="username" type="text" class="input focus:bg-amber-100 focus:border-black input-primary w-full max-w-xs">
	</label>
	<label class="label">
		<span class="label-text">Password</span>
		<input name="password" type="password" class="input focus:bg-amber-100">
	</label>
	<button class="btn preset-filled">Log in</button>
</form>

<p style="color: red">{form?.message ?? ''}</p>