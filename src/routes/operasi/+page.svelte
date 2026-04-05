<script lang="ts">
    import { Ellipsis  } from '@lucide/svelte';
    import ResponsiveModal from "$lib/components/ResponsiveModal.svelte";
    import { enhance } from '$app/forms';
  
    let { data, form } = $props();

    let activeDialog = $state<"add" | null>(null);
</script>
<div class="min-h-screen">
  <div class="container mx-auto space-y-6">
    <header class="flex justify-between items-center">
      <h1>Penggunaan Alat Berat</h1>
      {#if data.user}
        
          + Rencana Penggunaan
        
      {/if}
    </header>

    <div class="rounded-md border border-black overflow-hidden">
      <table>
      <thead>
          <tr class="border-b-2 border-black">
            <th class="font-bold p-2">Nama</th>
            <th class="font-bold p-2">Alat Berat</th>
            <th class="font-bold p-2">WhatsApp</th>
            <th class="font-bold p-2"></th>
          </tr>
        </thead>
        <tbody>
        {#each data.penggunaan as p (p.id)}
          <tr>
            <td class="p-2">
              <span>{p.pengguna}</span>
              {#if p.pic === null}
                <div
                  class="text-blue-600 flex-shrink-0"
                  title="Pegawai Internal"
                >
                </div>
              {/if}
            </td>
            <td class="p-2">
              <a href="/alatberat/{p.asetId}">{p.tanggalMulai}</a>
            </td>
            <td class="p-2">{p.estimasiSelesai}</td>
            <td class="p-2">a</td>
          </tr>
        {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
<ResponsiveModal
  title="Tambah Rencana Penggunaan"
  bind:open={() => activeDialog === "add", (v) => !v && (activeDialog = null)}
  description="Penjelasan"
>
  <form method="POST" use:enhance action="?/add" class="space-y-4">
      <div class="grid gap-2">
        <label for="nama">Nama Pengguna</label>
        <input
          id="nama"
          name="nama"
          type="text"
          class="border p-2 rounded"
          value=""
        />
      </div>

      <div class="grid gap-2">
        <label for="pic" class="text-muted-foreground">Penanggung Jawab</label>
        <input
          id="pic"
          name="pic"
          type="text"
          class="border p-2 rounded"
          value=""
        />
      </div>

      <div class="grid gap-2">
        <label for="operator" class="text-muted-foreground">Operator</label>
        <input
          id="operator"
          name="operator"
          type="text"
          class="border p-2 rounded"
          value=""
        />
      </div>
      <div class="flex justify-end gap-2">
        <Button variant="outline" onclick={() => activeDialog = null}
          >Batal</Button
        >
        <Button type="submit">Simpan</Button>
      </div>
    </form>
</ResponsiveModal>
