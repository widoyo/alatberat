<script lang="ts">
  import { Trigger } from "$lib/components/ui/alert-dialog";
  import { Button, buttonVariants } from "$lib/components/ui/button";
  import { Badge } from "$lib/components/ui/badge";
  import * as Tabs from "$lib/components/ui/tabs";
  import * as Dialog from "$lib/components/ui/dialog";
  import * as Drawer from "$lib/components/ui/drawer/index.js";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label/index.js";
  import { IsMobile } from "$lib/components/hooks/is-mobile.svelte";
  import { getDuration } from "$lib/utils/index";
  import { enhance } from "$app/forms";
  import FormFields from "$lib/components/FormFields.svelte";

  let { data, form } = $props();

  let penggunaanFormOpen = $state();

  const isMobile = new IsMobile();
</script>

<div><span class="text-muted-foreground">BMN</span> {data.alatberat.nup}</div>
<h1>{data.alatberat.deskripsi}</h1>
<p>{data.alatberat.keterangan}</p>

<Tabs.Root value="penggunaan" class="w-full py-6 rounded-none">
  <Tabs.List class="w-full rounded-none">
    <Tabs.Trigger value="penggunaan" class="text-lg rounded-none"
      >Penggunaan <Badge variant="secondary"
        >{data.alatberat.penggunaan.length}</Badge
      ></Tabs.Trigger
    >
    <Tabs.Trigger value="bahanbakar" class="text-lg rounded-none"
      >Bahan Bakar</Tabs.Trigger
    >
    <Tabs.Trigger value="pemeliharaan" class="text-lg rounded-none"
      >Pemeliharaan</Tabs.Trigger
    >
  </Tabs.List>
  <Tabs.Content value="penggunaan">
    <div class="">
      <div class="py-6">
        <h3>Tambah Penggunaan</h3>
        <FormFields {form}>
          {#snippet children({ inputField, checkboxField })}
            <form method="POST" use:enhance action="?/add">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {@render inputField({
                  name: "pengguna",
                  label: "Pengguna",
                  required: true,
                })}
                {@render inputField({
                  name: "pic",
                  label: "PIC",
                })}
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {@render inputField({
                  name: "tanggalMulai",
                  label: "Tanggal Mulai",
                  required: true,
                  type: "date",
                })}
                {@render inputField({
                  name: "estimasiSelesai",
                  label: "Estimasi Selesai",
                  type: "date",
                })}
              </div>
              <Button type="submit" class="mt-4">Simpan</Button>
            </form>
          {/snippet}
        </FormFields>
      </div>
      <table class="w-full table-auto border-collapse border border-gray-900">
        <thead>
          <tr>
            <th>Pengguna</th>
            <th>PIC</th>
            <th>Tanggal Mulai</th>
            <th>Estimasi Selesai</th>
          </tr>
        </thead>
        <tbody>
          {#each data.alatberat.penggunaan as penggunaan}
            <tr>
              <td>{penggunaan.pengguna}</td>
              <td>{penggunaan.pic}</td>
              <td
                >{new Date(penggunaan.tanggalMulai).toLocaleDateString()} ({getDuration(
                  penggunaan.tanggalMulai,
                  penggunaan.estimasiSelesai,
                )})</td
              >
              <td
                >{penggunaan.estimasiSelesai
                  ? new Date(penggunaan.estimasiSelesai).toLocaleDateString()
                  : "-"}</td
              >
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <Dialog.Root>
      <Dialog.Trigger>
        <Button class="mt-4">Tambah Penggunaan</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay class="fixed inset-0 bg-black/50" />
        <Dialog.Content
          class="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded"
        >
          <Dialog.Title>Tambah Penggunaan</Dialog.Title>
          <form
            onsubmit={(e) => {
              e.preventDefault();
              // Handle form submission
              penggunaanFormOpen.set(false);
            }}
            class="space-y-4 mt-4"
          >
            <div>
              <Label for="deskripsi">Deskripsi</Label>
              <Input id="deskripsi" name="deskripsi" required />
            </div>
            <div>
              <Label for="tanggal">Tanggal</Label>
              <Input id="tanggal" name="tanggal" type="date" required />
            </div>
            <Button type="submit">Simpan</Button>
          </form>
          <Dialog.Close>
            <Button variant="outline" size="sm" class="absolute top-2 right-2"
              >X</Button
            >
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  </Tabs.Content>
  <Tabs.Content value="bahanbakar">
    <p>Konten untuk Bahan Bakar</p>
  </Tabs.Content>
  <Tabs.Content value="pemeliharaan">
    <p>Konten untuk Pemeliharaan</p>
  </Tabs.Content>
</Tabs.Root>

<style>
  th {
    font-weight: 300;
    padding: 6px;
    font-size: small;
    border: solid 1px #333;
  }
  td {
    padding: 6px;
    font-size: small;
    border: solid 1px #333;
  }
</style>
