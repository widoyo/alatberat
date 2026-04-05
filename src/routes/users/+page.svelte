<script lang="ts">
	import { enhance } from '$app/forms';

	// Svelte 5 menggunakan $props untuk mengambil data dari load function & form
	let { data, form } = $props();
	
</script>

<div class="container mx-auto p-6 space-y-4">
	<div class="flex justify-between items-center">
		<h2 class="h2">Daftar Pengguna</h2>
		<button class="btn variant-filled-primary">
			+ User Baru
		</button>
	</div>

	{#if form?.message}
		<aside class="alert variant-filled-error mb-4">
			<div class="alert-message">{form.message}</div>
		</aside>
	{/if}

	<div class="table-container">
		<table class="table table-hover">
			<thead>
				<tr>
					<th>Username</th>
					<th>Peran</th>
					<th>No. HP</th>
				</tr>
			</thead>
			<tbody>
				{#each data.users as user (user.id)}
					<tr>
						<td>{user.username}</td>
						<td><span class="badge variant-soft">{user.role}</span></td>
						<td>{user.hp ?? '-'}</td>
					</tr>
				{:else}
					<tr>
						<td colspan="3" class="text-center italic opacity-50 py-10">
							Belum ada data user.
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

	<div class="p-4 space-y-4">
		<h3 class="h3">Tambah User</h3>
		<hr />
		<form 
			method="POST" 
			action="?/create" 
			use:enhance={() => {
				return async ({ result, update }) => {
					if (result.type === 'success') {
					}
					await update();
				};
			}} 
			class="space-y-4"
		>
			<label class="label">
				<span>Username</span>
				<input name="username" class="input" type="text" placeholder="Masukkan username..." required />
			</label>
			
			<label class="label">
				<span>Password</span>
				<input name="password" class="input" type="password" required />
			</label>

			<label class="label">
				<span>Peran</span>
				<select name="role" class="select" required>
					<option value="unit">Unit</option>
					<option value="admin">Admin</option>
					<option value="operator">Operator Alat Berat</option>
				</select>
			</label>

			<label class="label">
				<span>No. HP</span>
				<input name="hp" class="input" type="tel" placeholder="0812..." />
			</label>

			<div class="flex justify-end gap-2 pt-6">
				<button type="button" class="btn variant-soft" >
					Batal
				</button>
				<button type="submit" class="btn bg-mango-500">
					Simpan Data
				</button>
			</div>
		</form>
	</div>

