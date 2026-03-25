<script lang="ts">
  import { IdCardLanyardIcon } from "@lucide/svelte";
  import { Ellipsis } from "@lucide/svelte";
  import ResponsiveModal from "$lib/components/ResponsiveModal.svelte";
  import { applyAction, enhance } from "$app/forms";
  import FormFields from "$lib/components/FormFields.svelte";
  import { invalidateAll } from '$app/navigation';
  

  let activeDialog = $state<"add" | "edit" | null>(null);
  let isLoading = $state(false);

  const handleEnhance = () => {
    isLoading = true;
    return async ({ result }) => {
        if (result.type === 'success') {
            await invalidateAll();
            activeDialog = null;
        }

        await applyAction(result);
        isLoading = false;
    };
  };

  let editState = $state({
    isOpen: false,
    selectedOperator: null as any,
  });

  function handleEdit(operatorId: number) {
    // Cari data operator dari array yang sudah di-load (tanpa fetch lagi)
    const op = data.operators.find((o) => o.id === operatorId);
    if (op) {
      editState.selectedOperator = op;
      editState.isOpen = true;
    }
  }
  // Mengambil data 'operators' dari load function (+page.server.ts)
  let { data, form } = $props();
</script>

<div class="min-h-screen">
  <div class="container mx-auto space-y-6">
    <header class="flex justify-between items-center">
      <h3>Daftar Operator</h3>
      {#if data.user}
      <button class="btn preset-filled-primary-500" onclick={() => (activeDialog = "add")}>
        + Operator
      </button>
      {/if}
    </header>

    <div class="rounded-md border border-black overflow-hidden">
    <table class="table table-zebra w-full border-separate border-spacing-0">
      <thead>
        <tr class="border-b-2 border-black">
          <th class="font-bold">Nama</th>
          <th class="font-bold">Alat Berat</th>
          <th class="font-bold">WhatsApp</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {#each data.operators as o (o.id)}
        <tr>
          <td>{o.nama}</td>
          <td>{o.alatBerat}</td>
          <td><a href={`https://wa.me/${o.whatsapp}`} target="_blank" rel="noopener noreferrer">{o.whatsapp}</a></td>
          <td>
          </td>
        </tr>
        {/each}
      </tbody>
    </table>
    </div>
  </div>
</div>

<ResponsiveModal
  title="Tambah Operator"
  bind:open={() => activeDialog === "add", (v) => !v && (activeDialog = null)}
  description="Personil yang menjalankan Alat Berat"
>
<FormFields { form }>
    {#snippet children({inputField, checkboxField})}
  <form method="POST" use:enhance={handleEnhance} action="?/add">
    {@render inputField({ name: "nama", label: "Nama Lengkap", placeholder: "Placeholder", required: true})}
    {@render checkboxField({name: "jenis", label: "Pegawai Internal", value: "internal", description: "Operator internal dari Balai"})}
    {@render inputField({ name: "whatsapp", label: "No WA", placeholder: "Nomor WhatsApp" })}
    {@render inputField({ name: "lisensi", label: "SIM Alat Berat", placeholder: "Nomor SIM" })}
    <Button type="submit">{#if isLoading}Menyimpan...{:else}Simpan{/if}</Button>
  </form>
  {/snippet}
  </FormFields>
</ResponsiveModal>

<ResponsiveModal
  title="Edit Operator"
  bind:open={editState.isOpen}
  description=""
>
  {#if editState.selectedOperator}
    <form method="POST" action="?/updateOperator" class="space-y-4">
      <input type="hidden" name="id" value={editState.selectedOperator.id} />

      <div class="grid gap-2">
        <label for="nama">Nama Operator</label>
        <input
          id="nama"
          name="nama"
          type="text"
          class="border p-2 rounded"
          value={editState.selectedOperator.nama}
        />
      </div>

      <div class="grid gap-2">
        <label for="nama" class="text-muted-foreground">WhatsApp</label>
        <input
          id="whatsapp"
          name="wahatsapp"
          type="text"
          class="border p-2 rounded"
          value={editState.selectedOperator.whatsapp}
        />
      </div>

      <div class="flex justify-end gap-2">
        <Button variant="outline" onclick={() => (editState.isOpen = false)}
          >Batal</Button
        >
        <Button type="submit">Simpan Perubahan</Button>
      </div>
    </form>
  {/if}
</ResponsiveModal>
