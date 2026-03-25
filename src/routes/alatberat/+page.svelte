<script lang="ts">
	import ResponsiveModal from '$lib/components/ResponsiveModal.svelte';
	import { Ellipsis, Plus, Search, MapPin, Construction } from '@lucide/svelte';
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	let activeDialog = $state<'add' | null>(null);
	let searchQuery = $state('');

	let editState = $state({
		isOpen: false,
		selectedAset: null as any
	});

	// Filter sederhana di sisi klien
	let filteredAsets = $derived(
		data.asets.filter((a: any) =>
			a.deskripsi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			a.nup?.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	function handleEdit(asetId: number) {
		const target = data.asets.find((o: any) => o.id === asetId);
		if (target) {
			editState.selectedAset = target;
			editState.isOpen = true;
		}
	}
</script>

<div class="space-y-6">
	<header class="flex flex-col md:flex-row md:items-center justify-between gap-4">
		<div>
			<h2 class="text-2xl font-bold tracking-tight">Daftar Alat Berat</h2>
			<p class="text-sm opacity-70">Total: {data.asets.length} unit terdaftar</p>
		</div>

		<div class="flex items-center gap-2">
			<div class="relative">
				<Search class="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" size={18} />
				<input
					type="text"
					placeholder="Cari NUP atau nama..."
					bind:value={searchQuery}
					class="input input-bordered pl-10 w-full md:w-64"
				/>
			</div>
			<button class="btn btn-primary" onclick={() => (activeDialog = 'add')}>
				<Plus size={18} /> Alat Berat
			</button>
		</div>
	</header>

	<div class="overflow-x-auto rounded-box border border-base-300 bg-base-100 shadow-sm">
		<table class="table table-zebra w-full">
			<thead class="bg-base-200/50">
				<tr>
					<th class="w-24">NUP</th>
					<th>Informasi Alat</th>
					<th>Lokasi Terakhir</th>
					<th class="text-center">Aksi</th>
				</tr>
			</thead>
			<tbody>
				{#each filteredAsets as aset (aset.id)}
					<tr class="hover:bg-base-200/30 transition-colors">
						<td class="font-mono font-bold text-primary">
							<a href="/alatberat/{aset.nup}" class="hover:underline">{aset.nup}</a>
						</td>
						<td>
							<div class="flex flex-col">
								<span class="font-semibold text-base-content">{aset.deskripsi}</span>
								<span class="text-xs opacity-60 uppercase tracking-wider">
                                    {aset.merk || '-'} • {aset.tipe || '-'}
                                </span>
							</div>
						</td>
						<td>
							<div class="flex items-center gap-2 text-sm">
								<MapPin size={14} class="text-error" />
								<span>{aset.lokasiSaatIni || 'Gudang Pusat'}</span>
							</div>
						</td>
						<td class="text-center">
							<div class="dropdown dropdown-left dropdown-end">
								<button tabindex="0" class="btn btn-ghost btn-sm btn-circle">
									<Ellipsis size={20} />
								</button>
								<ul tabindex="-1" class="dropdown-content z-[20] menu p-2 shadow-xl bg-base-100 border border-base-300 rounded-box w-40">
									<li class="menu-title border-b border-base-200 mb-1">{aset.nup}</li>
									<li><button onclick={() => handleEdit(aset.id)}>Edit Data</button></li>
									<li><a href="/alatberat/{aset.nup}">Riwayat HM</a></li>
									<li><button class="text-error">Hapus</button></li>
								</ul>
							</div>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="4" class="py-20 text-center">
							<div class="flex flex-col items-center opacity-30">
								<Construction size={48} />
								<p class="mt-2 italic">Data tidak ditemukan atau belum ada aset.</p>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<ResponsiveModal
	title="Tambah Alat Berat Baru"
	bind:open={() => activeDialog === 'add', (v) => !v && (activeDialog = null)}
>
	<form method="POST" action="?/add" use:enhance class="space-y-6 p-4">
		<div class="form-control w-full">
			<label class="label" for="deskripsi">
				<span class="label-text font-semibold">Nama / Deskripsi Alat</span>
			</label>
			<input
				id="deskripsi"
				name="deskripsi"
				type="text"
				placeholder="Contoh: Excavator PC200"
				class="input input-bordered w-full"
				required
			/>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div class="form-control">
				<label class="label" for="merk">
					<span class="label-text">Merk</span>
				</label>
				<input id="merk" name="merk" type="text" class="input input-bordered" />
			</div>
			<div class="form-control">
				<label class="label" for="tipe">
					<span class="label-text">Model / Tipe</span>
				</label>
				<input id="tipe" name="tipe" type="text" class="input input-bordered" />
			</div>
		</div>

		<div class="modal-action">
			<button type="button" class="btn btn-ghost" onclick={() => (activeDialog = null)}>Batal</button>
			<button type="submit" class="btn btn-primary px-8">Simpan Aset</button>
		</div>
	</form>
</ResponsiveModal>

<ResponsiveModal title="Edit Detail Alat" bind:open={editState.isOpen}>
	{#if editState.selectedAset}
		<form method="POST" action="?/updateAset" use:enhance class="space-y-6 p-4">
			<input type="hidden" name="id" value={editState.selectedAset.id} />

			<div class="bg-base-200 p-3 rounded-lg flex justify-between items-center mb-4">
				<span class="text-xs font-bold opacity-50 uppercase">NUP Aset</span>
				<span class="font-mono font-bold text-primary">{editState.selectedAset.nup}</span>
			</div>

			<div class="form-control w-full">
				<label class="label" for="edit-deskripsi">
					<span class="label-text font-semibold">Deskripsi</span>
				</label>
				<input
					id="edit-deskripsi"
					name="deskripsi"
					type="text"
					class="input input-bordered w-full"
					value={editState.selectedAset.deskripsi}
				/>
			</div>

			<div class="form-control w-full">
				<label class="label" for="edit-tipe">
					<span class="label-text font-semibold">Model / Tipe</span>
				</label>
				<input
					id="edit-tipe"
					name="tipe"
					type="text"
					class="input input-bordered w-full"
					value={editState.selectedAset.tipe}
				/>
			</div>

			<div class="modal-action">
				<button type="button" class="btn btn-ghost" onclick={() => (editState.isOpen = false)}>Batal</button>
				<button type="submit" class="btn btn-primary px-8">Update</button>
			</div>
		</form>
	{/if}
</ResponsiveModal>