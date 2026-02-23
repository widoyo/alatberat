<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { IdCardLanyardIcon } from "@lucide/svelte";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import * as Table from "$lib/components/ui/table/index.js";
  import { Ellipsis } from "@lucide/svelte";
  import ResponsiveModal from "$lib/components/ResponsiveModal.svelte";
  import { applyAction, enhance } from "$app/forms";
  import FormFields from "$lib/components/FormFields.svelte";
  import { invalidateAll } from '$app/navigation';
  import { Drop } from "phosphor-svelte";


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
      <h2 class="h2 font-bold tracking-tight">Daftar Operator</h2>
      {#if data.user}
        <Button variant="outline" onclick={() => (activeDialog = "add")}>
          + Operator
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
        {#each data.operators as o (o.id)}
          <Table.Row>
            <Table.Cell class="flex items-center gap-2">
              <span>{o.nama}</span>
              {#if o.isBalai}
                <div
                  class="text-blue-600 flex-shrink-0"
                  title="Pegawai Internal"
                >
                  <IdCardLanyardIcon size={16} strokeWidth={2.5} />
                </div>
              {/if}
            </Table.Cell>
            <Table.Cell
              ><a href="/alatberat/{o.aset?.nup}">{o.aset?.deskripsi}</a
              ></Table.Cell
            >
            <Table.Cell>{o.whatsapp}</Table.Cell>
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
                    {o.nama}
                  </DropdownMenu.Label>
                  <DropdownMenu.Item class="cursor-pointer">
                    <a
                      href="https://wa.me/{o.whatsapp}?text=Hello%20{o.token}"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="flex w-full items-center px-2 py-1.5 cursor-pointer"
                    >
                      <span>Kirim token: </span>
                      <kbd class="ml-auto text-muted-foreground">{o.token}</kbd>
                    </a>
                  </DropdownMenu.Item>

                  <DropdownMenu.Item
                    class="cursor-pointer"
                    on:click={() => {
                      navigator.clipboard.writeText(o.token);
                      alert("Token disalin ke clipboard!");
                    }}><span>Perbarui Token</span>
                    </DropdownMenu.Item>

                  <DropdownMenu.Item
                    class="cursor-pointer"
                    onclick={() => handleEdit(o.id)}
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
