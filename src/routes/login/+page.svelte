<script lang="ts">
    import { enhance } from '$app/forms';
    import type { ActionData } from './$types';
    let { form }: { form: ActionData } = $props();
</script>
<div class="hero bg-base-200 min-h-screen">
  <div class="hero-content flex-col lg:flex-row-reverse">
    <div class="card bg-base-100 w-full max-w-md shrink-0 shadow-2xl">
      <div class="card-body">
      <form method="POST" action="?/login" use:enhance>
        <fieldset class="fieldset">
          <label for="username" class="label">Username</label>
          <input name="username" type="text" class="input" placeholder="Username" />
          <label for="password" class="label">Password</label>
          <input name="password" type="password" class="input" placeholder="Password" />
          <button class="btn btn-neutral mt-4">Login</button>
        </fieldset>
      </form>
      </div>
    </div>
  </div>
</div>
<p style="color: red">{form?.message ?? ''}</p>
