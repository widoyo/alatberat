<script lang="ts">
  import Card from "$lib/components/Card.svelte";
  import { ChevronLeft, ChevronRight, Clock } from "@lucide/svelte";
  import { fade, fly } from "svelte/transition";
  let { data } = $props();

  let searchQuery = $state("");
  let filterKategori = $state("Semua");
  let filterLokasi = $state("Semua");
  let filterKondisi = $state("Semua");

  const kategoriAlat = ["Semua", "Excavator", "Dump Truck", "Ampibi", "Pompa"];
  const opsiKondisi = ["Semua", "baik", "rusak", "perbaikan"];
  const daftarLokasi = $derived([
    "Semua",
    ...new Set(data?.asets?.map((item) => item.lokasi).filter(Boolean)),
  ]);

  // Logika Filter Reaktif (Hati Baja)
  let filteredAset = $derived(
    data?.asets?.filter((item) => {
      const matchKategori =
        filterKategori === "Semua" ||
        item.nama.toLowerCase().includes(filterKategori.toLowerCase());

      const matchLokasi =
        filterLokasi === "Semua" || item.lokasi === filterLokasi;
      const matchKondisi = 
        filterKondisi === "Semua" || item.kondisi === filterKondisi;
      return matchKategori && matchLokasi && matchKondisi;
    }),
  );

  let currentYear = $state(2026);

  // Data dummy untuk visualisasi
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  // Baris 1: Simulasi total jam kerja per bulan
  const yearlyUtilization = [
    450, 520, 300, 480, 600, 550, 400, 350, 500, 420, 380, 410,
  ];

  // Baris 2: Simulasi 27 unit alat berat
  const fleetData = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    name:
      i < 20
        ? `Excavator Type ${String.fromCharCode(65 + (i % 3))} - ${101 + i}`
        : `Mobile Pump MP-${201 + i}`,
    hours: Math.floor(Math.random() * 2000) + 500,
  }));
</script>

<div class="max-w-4xl mx-auto pb-32">
  <header class="py-10 text-center">
    <h1 class="text-3xl tracking-[0.2em] text-gray-900 mb-8">Daftar Unit</h1>


    <div class="flex flex-col items-center mt-6">
  <label for="kondisi" class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Status Unit</label>
  <div class="join border border-gray-200">
    {#each opsiKondisi as kon}
      <input
        type="radio"
        onclick={() => (filterKondisi = kon)}
        name="kondisi"
        class="btn-sm join-item btn"
        checked={filterKondisi === kon}
        aria-label={kon === 'Semua' ? 'Semua' : kon.charAt(0).toUpperCase() + kon.slice(1)}
      />
    {/each}
  </div>
</div>
    <div class="flex flex-col items-center">
      <label for="filter-lokasi" class="mb-3"> Filter Lokasi </label>

      <div class="">
        <select
          id="filter-lokasi"
          bind:value={filterLokasi}
          class="select focus:border-gray-900 focus:outline-none"
        >
          {#each daftarLokasi as lok}
            <option value={lok}>{lok}</option>
          {/each}
        </select>
      </div>
    </div>
  </header>
  <div class="max-w-4xl mx-auto pb-32">
    <ul
      class="list bg-base-100 border border-gray-100 overflow-hidden"
    >
      <li
        class="pb-2 px-4 opacity-60 text-2xl bg-gray-50 border-b border-gray-100"
      >
        {filteredAset?.length} Unit
      </li>

      {#each filteredAset as item (item.id)}
        <li
          class="list-row hover:bg-gray-50 transition-colors items-center gap-4 py-3"
        >
          <div class="hidden sm:block">
            <div
              class="size-12 rounded-full bg-gray-300 border border-dashed flex items-center justify-center"
            >
              {item.id}
            </div>
          </div>

          <div class="flex-1 min-w-0">
            <div
              class="font-bold text-gray-900 text-base truncate lowercase leading-tight"
            >
              {item.nama} <span class="text-gray-300 font-normal my-5">/</span>
              <span class="text-base font-normal">{item.tahunPerolehan}-{item.nup}</span>
              <span class="text-gray-300 font-normal my-5">/</span>
              <span class="text-base font-normal">{item.noLambung}</span>
              <span class="text-gray-300 font-normal my-5">/</span>
            {#if item.kondisi === 'baik'}
              <span
                class="text-green-600 text-xs"
              >
                ● {item.kondisi}
              </span>
            {:else if item.kondisi === 'rusak'}
              <span
                class="text-red-600 text-xs"
              >
                ● {item.kondisi}
              </span>
              {:else if item.kondisi === 'perbaikan'}
                <span
                  class="text-yellow-600 text-xs"
                >
                  ● {item.kondisi}
                </span>
              {/if}
            </div>
            <div
              class="text-[11px] uppercase text-gray-500 tracking-wide mt-0.5"
            >
              📍 {item.lokasi}
            </div>
          </div>

          <div class="hidden md:flex gap-2 text-right mr-4">
            <div class="flex flex-col">
              <span class="text-[9px] font-bold text-gray-400 uppercase"
                >No. Rangka</span
              >
            </div>
          </div>

          <div class="flex gap-1">

            <a aria-label="Lihat detail unit"
              href="/aset/{item.id}"
              class="btn btn-square btn-ghost btn-sm text-gray-900"
            >
              <svg
                class="size-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                ><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg
              >
            </a>
          </div>
        </li>
      {:else}
        <li class="p-10 text-center text-gray-400 italic text-sm">
          Data tidak ditemukan untuk filter ini.
        </li>
      {/each}
    </ul>
  </div>

</div>

<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
  <div
    class="p-6 bg-gray-50 rounded-3xl border border-gray-100 transition-hover hover:border-gray-300"
  >
    <div class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
      Total Aset
    </div>
    <div class="text-4xl font-thin text-gray-900 mt-1">27</div>
  </div>
  <div class="p-6 bg-gray-50 rounded-3xl border border-gray-100">
    <div class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
      Excavator
    </div>
    <div class="text-4xl font-thin text-gray-900 mt-1">20</div>
  </div>
  <div class="p-6 bg-gray-50 rounded-3xl border border-gray-100">
    <div class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
      Dump Truck
    </div>
    <div class="text-4xl font-thin text-gray-900 mt-1">3</div>
  </div>
  <div class="p-6 bg-gray-50 rounded-3xl border border-gray-100">
    <div class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
      Lainnya
    </div>
    <div class="text-4xl font-thin text-gray-900 mt-1">4</div>
  </div>
</div>

<div class="flex flex-col gap-8">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold">Dashboard Utilisasi</h1>
      <p class="opacity-70">Ringkasan operasional 27 unit alat berat</p>
    </div>
    <div class="join border border-base-300">
      <button class="btn join-item" onclick={() => currentYear--}
        ><ChevronLeft size={18} /></button
      >
      <button class="btn join-item no-animation">Tahun {currentYear}</button>
      <button class="btn join-item" onclick={() => currentYear++}
        ><ChevronRight size={18} /></button
      >
    </div>
  </div>

  <div class="card bg-base-100 shadow-xl border border-base-300">
    <div class="card-body">
      <h2 class="card-title mb-4">
        <Clock class="text-primary" /> Total Jam Kerja Alat (Jan - Des {currentYear})
      </h2>
      <div
        class="flex items-end justify-between gap-2 h-48 w-full bg-base-200/50 p-4 rounded-xl"
      >
        {#each yearlyUtilization as hours, i}
          <div class="flex flex-col items-center flex-1 group">
            <div
              class="w-full bg-primary/80 rounded-t-md transition-all group-hover:bg-primary"
              style="height: {(hours / 650) * 100}%"
            >
              <div
                class="opacity-0 group-hover:opacity-100 text-[10px] text-center bg-base-content text-base-100 rounded px-1 -mt-6"
              >
                {hours}h
              </div>
            </div>
            <span class="text-xs mt-2 font-semibold">{months[i]}</span>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  /* Mengatur radius tombol paling kiri */
  .join .join-item:first-child {
    border-top-left-radius: 9999px;
    border-bottom-left-radius: 9999px;
  }
  /* Mengatur radius tombol paling kanan */
  .join .join-item:last-child {
    border-top-right-radius: 9999px;
    border-bottom-right-radius: 9999px;
  }
</style>
