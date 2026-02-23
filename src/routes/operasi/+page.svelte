<script lang="ts">
    import * as Table from '$lib/components/ui/table';
    import * as Field from '$lib/components/ui/field';
    import { Button } from '$lib/components/ui/button';
    import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
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
        <Button variant="outline" onclick={() => (activeDialog = "add")}>
          + Rencana Penggunaan
        </Button>
      {/if}
    </header>

    <div class="rounded-md border border-black overflow-hidden">
      <Table.Root>
        <Table.Header>
          <Table.Row class="border-b-2 border-black">
            <Table.Head class="font-bold">Nama</Table.Head>
            <Table.Head class="font-bold">Alat Berat</Table.Head>
            <Table.Head class="font-bold">WhatsApp</Table.Head>
            <Table.Head></Table.Head>
          </Table.Row>
        </Table.Header>
        {#each data.penggunaan as p (p.id)}
          <Table.Row>
            <Table.Cell class="flex items-center gap-2">
              <span>{p.pengguna}</span>
              {#if p.pic === null}
                <div
                  class="text-blue-600 flex-shrink-0"
                  title="Pegawai Internal"
                >
                </div>
              {/if}
            </Table.Cell>
            <Table.Cell
              ><a href="/alatberat/{p.asetId}">{p.tanggalMulai}</a
              ></Table.Cell
            >
            <Table.Cell>{p.estimasiSelesai}</Table.Cell>
            <Table.Cell
              class="sticky right-0 bg-white shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.1)] z-10 w-12 text-center"
            >
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <Ellipsis />
                </DropdownMenu.Trigger>
                <DropdownMenu.Content
                  align="end"
                  class="w-48 bg-white border-black shadow-xl"
                >
                  <DropdownMenu.Label class="text-[12px] font-bold border-b-2">
                    {p.pengguna}
                  </DropdownMenu.Label>
                  <DropdownMenu.Item class="cursor-pointer">
                      <span>Kirim WA: </span>
                      <kbd class="ml-auto text-muted-foreground">{p.pic}</kbd>
                  </DropdownMenu.Item>

                  <DropdownMenu.Item
                    class="cursor-pointer"
                  >
                    <span>Edit...</span>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </Table.Cell>
          </Table.Row>
        {/each}
      </Table.Root>
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
