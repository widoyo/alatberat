<script lang="ts">
  // This is the main page of the application
  import Card from "$lib/components/Card.svelte";
  import * as Table from "$lib/components/ui/table";
  import { slide } from 'svelte/transition';

  let { data, form } = $props();

  let expandedId = $state<number | null>(null);
  function toggle(id: number) {
    expandedId = expandedId === id ? null : id;
  }
</script>

<h1>Home</h1>
<div class="flex flex-col md:flex-row gap-4 mb-24">
  <div class="flex-1">
    <div class="rounded-md border border-black overflow-hidden">
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head>NUP</Table.Head>
            <Table.Head>Nama</Table.Head>
            <Table.Head>Lokasi</Table.Head>
            <Table.Head>Info Terakhir</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
        {#each data.semuaAlatberat as ab (ab.id)}
            <Table.Row>
                <Table.Cell>
                    <a href="/alatberat/{ab.nup}">{ab.nup}</a>
                </Table.Cell>
                <Table.Cell 
                onclick={() => toggle(ab.id)} 
                class="cursor-pointer hover:bg-slate-50 transition-colors"
            >
                    <div class="flex flex-col">
            <span class="font-medium">{ab.deskripsi}</span>
            
            {#if expandedId === ab.id}
              <div transition:slide={{ duration: 200 }} class="mt-2 text-sm text-muted-foreground grid grid-cols-1 gap-1 border-t pt-2">
                <div><span class="font-semibold">Merk:</span> {ab.merk ?? '-'}</div>
                <div><span class="font-semibold">Model:</span> {ab.tipe ?? '-'}</div>
                <div><span class="font-semibold">Kapasitas:</span> {ab.kapasitas ?? '-'} CC</div>
              </div>
            {/if}
          </div>
                </Table.Cell>
                <Table.Cell>{ab.lokasiSaatIni}</Table.Cell>
                <Table.Cell>{new Date(
                  ab.penggunaan && ab.penggunaan.length > 0
                    ? ab.penggunaan[ab.penggunaan.length - 1]
                        .tanggalSelesai
                    : null,
                ).toLocaleString()}</Table.Cell>
            </Table.Row>
        {/each}
        </Table.Body>
      </Table.Root>
      </div>
    </div>
  </div>

<div class="flex flex-row gap-4">
  <Card title="Alat Berat Idle">
    <p>Alat berat yang sedang tidak dioperasikan.</p>
    <button type="button" class="btn preset-filled-primary-500">Booking</button>
  </Card>
  <Card title="Pemeliharaan Terjadwal">
    <p>Daftar pemeliharaan yang sudah dijadwalkan.</p>
  </Card>
  <Card title="Sparepart Kritis">
    <p>Daftar sparepart yang stoknya kritis.</p>
  </Card>
</div>
