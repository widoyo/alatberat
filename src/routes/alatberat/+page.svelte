<script lang="ts">
  import * as Table from "$lib/components/ui/table";
  import { Button } from "$lib/components/ui/button";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import ResponsiveModal from "$lib/components/ResponsiveModal.svelte";
  import { Ellipsis } from "@lucide/svelte";
  import { enhance } from "$app/forms";

  let { data, form } = $props();

  let activeDialog = $state<"add" | null>(null);

  let editState = $state({
    isOpen: false,
    selectedAset: null as any,
  });

  function handleEdit(asetId: number) {
    // Cari data operator dari array yang sudah di-load (tanpa fetch lagi)
    const op = data.asets.find((o) => o.id === asetId);
    if (op) {
      editState.selectedAset = op;
      editState.isOpen = true;
    }
  }
</script>

<header class="flex justify-between items-center">
  <h2 class="h2 font-bold tracking-tight">Daftar Alat Berat</h2>
  {#if data.user}
    <Button variant="outline" onclick={() => (activeDialog = "add")}>
      + Alat Berat
    </Button>
  {/if}
</header>

<div class="rounded-md border border-black overflow-hidden">
  <Table.Root>
    <Table.Header>
      <Table.Row class="border-b-2 border-black">
        <Table.Head class="font-bold">Nama</Table.Head>
        <Table.Head class="font-bold">Alat Berat</Table.Head>
        <Table.Head class="font-bold">Lokasi</Table.Head>
        <Table.Head></Table.Head>
      </Table.Row>
    </Table.Header>
    {#each data.asets as aset (aset.id)}
      <Table.Row>
        <Table.Cell><a href="/alatberat/{aset.nup}">{aset.nup}</a></Table.Cell>
        <Table.Cell>
          {aset.deskripsi}
          <br />
          <span class="text-sm">{aset.merk} - {aset.tipe}</span>
        </Table.Cell>
        <Table.Cell>
          {aset.lokasiSaatIni}
        </Table.Cell>
        <Table.Cell class="sticky right-0 bg-white z-10 w-12 text-center">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Ellipsis />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content
              align="end"
              class="w-48 bg-white border-black shadow-xl"
            >
              <DropdownMenu.Label class="text-[12px] font-bold border-b-2">
                {aset.nup}
              </DropdownMenu.Label>
              <DropdownMenu.Item
                class="cursor-pointer"
                onclick={() => handleEdit(aset.id)}
              >
                <span>Edit...</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Table.Cell>
      </Table.Row>
    {:else}
      <Table.Row>
        <td colspan="3" class="text-center italic opacity-50 py-10">
          Belum ada data aset.
        </td>
      </Table.Row>
    {/each}
  </Table.Root>
</div>

<ResponsiveModal
  title="Tambah Alat Berat"
  bind:open={() => activeDialog === "add", (v) => !v && (activeDialog = null)}
  description="Penjelasan"
>
  <form method="POST" action="?/add" use:enhance class="space-y-4">
    <div class="grid gap-2">
      <label for="deskripsi">Nama</label>
      <input
        id="deskripsi"
        name="deskripsi"
        type="text"
        class="border p-2 rounded"
        value=""
      />
    </div>

    <div class="grid gap-2">
      <label for="nama" class="text-muted-foreground">Model</label>
      <input
        id="tipe"
        name="tipe"
        type="text"
        class="border p-2 rounded"
        value=""
      />
    </div>

    <div class="flex justify-end gap-2">
      <Button variant="outline" onclick={() => (activeDialog = null)}
        >Batal</Button
      >
      <Button type="submit">Simpan</Button>
    </div>
  </form>
</ResponsiveModal>

<ResponsiveModal
  title="Edit Alat Berat"
  bind:open={editState.isOpen}
  description=""
>
  {#if editState.selectedAset}
    <form method="POST" action="?/updateAset" class="space-y-4">
      <input type="hidden" name="id" value={editState.selectedAset.id} />

      <div class="grid gap-2">
        <label for="nama">Nama</label>
        <input
          id="deskripsi"
          name="deskripsi"
          type="text"
          class="border p-2 rounded"
          value={editState.selectedAset.deskripsi}
        />
      </div>

      <div class="grid gap-2">
        <label for="nama" class="text-muted-foreground">Model</label>
        <input
          id="tipe"
          name="tipe"
          type="text"
          class="border p-2 rounded"
          value={editState.selectedAset.tipe}
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
