<script lang="ts">
  import { enhance } from '$app/forms';
  let { data } = $props();

  let showBbmModal = $state(false);
  let showServiceModal = $state(false);
  
  let bbmDialog: HTMLDialogElement;
  let serviceDialog: HTMLDialogElement;

  let showModal = $state(false);
  let loading = $state(false);
  let dialogElement: HTMLDialogElement;

  let newBbm = $state({
    tanggal: new Date().toISOString().slice(0, 10),
    liter: "",
    harga: ""
  });

  let newService = $state({
    tanggal: new Date().toISOString().slice(0, 10),
    jenisPemeliharaan: "",
    deskripsiPekerjaan: ""
  });

  // State untuk form (sesuai skema penggunaanAset)
  let newUsage = $state({
    pengguna: "",
    pic: "",
    operatorId: "",
    proyek: "",
    intern: true,
    tanggalMulai: new Date().toISOString().slice(0, 16),
    tanggalSelesai: "", // format untuk datetime-local
  });

  $effect(() => {
    if (showModal) dialogElement.showModal(); else dialogElement?.close();
    if (showBbmModal) bbmDialog.showModal(); else bbmDialog?.close();
    if (showServiceModal) serviceDialog.showModal(); else serviceDialog?.close();
  });
</script>

<div class="flex flex-col gap-12 font-sans">
  <section id="detail">
    <div class="text-xs  uppercase tracking-wide">
      {data.unit.merk}
      {#if data.unit.noLambung}
        - {data.unit.noLambung}{/if}
      {#if data.unit.kondisi === "baik"}
        <span class="text-green-600 text-xs"> ● baik </span>
      {:else if data.unit.kondisi === "rusak"}
        <span class="text-red-600 text-xs"> ● rusak </span>
      {:else if data.unit.kondisi === "perbaikan"}
        <span class="text-yellow-600 text-xs"> ● perbaikan </span>
      {/if}
    </div>
    <div class="text-sm tracking-wide">Lokasi {data.unit.lokasi}</div>
    <h1 class="text-2xl font-bold mb-6">{data.unit.nama}</h1>
  </section>
  <section id="penggunaan">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-sm uppercase tracking-wide">
        Riwayat Penggunaan
        {#if data.user && data.unit.kondisi === "baik"}
          <button
            onclick={() => (showModal = true)}
            class="btn btn-primary btn-outline btn-xs ml-4 rounded-full font-normal"
          >
            + Rencana Penggunaan
          </button>
        {:else}
          <button class="btn btn-disabled" disabled>
            + Rencana Penggunaan
          </button>
        {/if}
      </h2>
      {#if data.user}{/if}
    </div>
    <div class="border-l-2 border-slate-100 ml-2 pl-6 space-y-8">
      {#each data.logs as log}
        <div class="relative">
          <div
            class="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow-sm"
          ></div>
          <div class="text-sm font-semibold">{log.pengguna}</div>
          <div class="text-[10px] text-slate-400">
            {log.tanggalMulai} — {log.tanggalSelesai || "Sekarang"}
          </div>
          <div class="mt-1 text-sm text-slate-600">{log.lokasi}</div>
        </div>
      {/each}
    </div>
  </section>

  <section id="bbm" class="bg-slate-50 -mx-6 px-6 py-8">
    <h2 class="text-sm uppercase tracking-wide">
      Log Bahan Bakar
              {#if data.user }
          <button
            onclick={() => (showBbmModal = true)}
            class="btn btn-primary btn-outline btn-xs ml-4 rounded-full font-normal"
          >
            + Bahan Bakar
          </button>
        {:else}
          <button class="btn btn-disabled" disabled>
            + Bahan Bakar
          </button>
        {/if}
    </h2>
    <div class="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
      {#each data.bbm as bbm}
        <div
          class="min-w-[140px] bg-white p-4 rounded-2xl border border-slate-100 shadow-sm"
        >
          <div class="text-lg font-bold">{bbm.liter} L</div>
          <div class="text-[10px] text-slate-400 uppercase">{bbm.tanggal}</div>
          {#if data.user}
            <div
              class="mt-2 pt-2 border-t border-slate-50 text-[10px] font-mono text-green-600"
            >
              Rp {bbm.harga.toLocaleString()}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </section>

  <section id="service">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-sm uppercase tracking-wide text-gray-500">
        Pemeliharaan & Part
                {#if data.user }
          <button
            onclick={() => (showServiceModal = true)}
            class="btn btn-primary btn-outline btn-xs ml-4 rounded-full font-normal"
          >
            + Pemeliharaan
          </button>
        {:else}
          <button class="btn btn-disabled" disabled>
            + Pemeliharaan
          </button>
        {/if}

      </h2>
      {#if data.user}
        <button
          class="text-[10px] bg-slate-900 text-white px-3 py-1 rounded-full"
          >Input Service</button
        >
      {/if}
    </div>
    <div class="space-y-4">
      {#each data.service as s}
        <div class="p-4 rounded-2xl border border-slate-100">
          <div class="flex justify-between items-start">
            <div class="text-sm font-bold">{s.jenisPemeliharaan}</div>
            <div class="text-[10px] text-slate-400 uppercase">{s.tanggal}</div>
          </div>
          <p class="text-xs text-slate-500 mt-1">{s.deskripsiPekerjaan}</p>

        </div>
      {/each}
    </div>
  </section>
</div>

<dialog
  bind:this={dialogElement}
  onclose={() => (showModal = false)}
  class="modal modal-bottom sm:modal-middle p-0 backdrop:bg-slate-900/50"
>
  <div
    class="bg-white p-6 rounded-t-[2rem] sm:rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
  >
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-lg font-bold text-slate-900">Entry Penggunaan</h3>
      <button
        onclick={() => (showModal = false)}
        class="btn btn-sm btn-circle btn-ghost">✕</button
      >
    </div>

    <form method="POST" action="?/createUsage" class="space-y-4"
    use:enhance={() => {
    loading = true;
    return async ({ update }) => {
      loading = false;
      showModal = false; // Tutup modal setelah submit
      await update();
    };
  }}
  >
      <input type="hidden" name="asetId" value={data.unit.id} />
      <div class="flex items-end gap-4">
        <fieldset class="flex-1 fieldset">
          <legend class="fieldset-legend">Unit pengguna / Instansi</legend>
          <input
            type="text"
            name="pengguna"
            bind:value={newUsage.pengguna}
            placeholder="Contoh: OP 1, Dinas PUPR Kab. Lahat"
            class="input"
            required
          />
        </fieldset>
        <fieldset class="flex-none fieldset">
          <label class="label cursor-pointer gap-2">
            <input
              type="checkbox"
              name="intern"
              bind:checked={newUsage.intern}
              class="checkbox checkbox-sm"
            />
            <span class="text-xs font-medium text-slate-600">Intern Balai</span>
          </label>
        </fieldset>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Contact Person</legend>
          <input
            type="text"
            name="pic"
            bind:value={newUsage.pic}
            placeholder="Nama Personil"
            class="input"
            required
          />
        </fieldset>
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Operator ({data.operators?.length})</legend>
          <select
            name="operatorId"
            id="operatorId"
            bind:value={newUsage.operatorId}
            class="select"
            required
          >
            <option value="" disabled selected>Pilih Operator</option>
            {#each data.operators as op}
              <option value={op.id}>{op.nama}</option>
            {/each}
          </select>
          <p class="label">Personil yang mengoperasikan alat</p>
        </fieldset>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Tanggal Mulai</legend>
          <input
            type="date"
            name="tanggalMulai"
            bind:value={newUsage.tanggalMulai}
            placeholder="Tanggal Mulai"
            class="input"
            required
          />
        </fieldset>
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Tanggal Selesai</legend>
          <input
            type="date"
            name="tanggalSelesai"
            bind:value={newUsage.tanggalSelesai}
            placeholder="Tanggal Selesai"
            class="input"
          />
        </fieldset>
      </div>

      <fieldset class="fieldset">
        <legend class="fieldset-legend">Proyek / Aktivitas</legend>
        <textarea
          name="proyek"
          bind:value={newUsage.proyek}
          class="textarea"
          placeholder="Deskripsi pekerjaan..."
        ></textarea>
      </fieldset>

      <button
        type="submit"
        class="btn btn-primary"
      >
        Simpan Data Penggunaan
      </button>
    </form>
  </div>
</dialog>

<dialog bind:this={bbmDialog} onclose={() => (showBbmModal = false)} class="modal modal-bottom sm:modal-middle p-0 backdrop:bg-slate-900/50">
  <div class="bg-white p-6 rounded-t-[2rem] sm:rounded-3xl w-full max-w-md shadow-2xl">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-lg font-bold">Input Bahan Bakar</h3>
      <button onclick={() => (showBbmModal = false)} class="btn btn-sm btn-circle btn-ghost">✕</button>
    </div>
    <form method="POST" action="?/createBbm" class="space-y-4" use:enhance={() => {
      loading = true;
      return async ({ update }) => { loading = false; showBbmModal = false; await update(); };
    }}>
      <input type="hidden" name="asetId" value={data.unit.id} />
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Tanggal Pengisian</legend>
        <input type="date" name="tanggal" bind:value={newBbm.tanggal} class="input w-full" required />
      </fieldset>
      <div class="grid grid-cols-2 gap-4">
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Jumlah (Liter)</legend>
          <input type="number" step="0.01" name="liter" bind:value={newBbm.liter} class="input w-full" placeholder="0.00" required />
        </fieldset>
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Total Harga (Rp)</legend>
          <input type="number" name="harga" bind:value={newBbm.harga} class="input w-full" placeholder="Contoh: 500000" required />
        </fieldset>
      </div>
      <button type="submit" class="btn btn-primary w-full" disabled={loading}>Simpan Log BBM</button>
    </form>
  </div>
</dialog>

<dialog bind:this={serviceDialog} onclose={() => (showServiceModal = false)} class="modal modal-bottom sm:modal-middle p-0 backdrop:bg-slate-900/50">
  <div class="bg-white p-6 rounded-t-[2rem] sm:rounded-3xl w-full max-w-md shadow-2xl">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-lg font-bold">Input Pemeliharaan</h3>
      <button onclick={() => (showServiceModal = false)} class="btn btn-sm btn-circle btn-ghost">✕</button>
    </div>
    <form method="POST" action="?/createService" class="space-y-4" use:enhance={() => {
      loading = true;
      return async ({ update }) => { loading = false; showServiceModal = false; await update(); };
    }}>
      <input type="hidden" name="asetId" value={data.unit.id} />
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Tanggal Service</legend>
        <input type="date" name="tanggal" bind:value={newService.tanggal} class="input w-full" required />
      </fieldset>
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Jenis Pemeliharaan</legend>
        <input type="text" name="jenisPemeliharaan" bind:value={newService.jenisPemeliharaan} class="input w-full" placeholder="Contoh: Ganti Oli, Perbaikan Hidrolik" required />
      </fieldset>
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Deskripsi Pekerjaan</legend>
        <textarea name="deskripsiPekerjaan" bind:value={newService.deskripsiPekerjaan} class="textarea w-full h-24" placeholder="Detail perbaikan yang dilakukan..."></textarea>
      </fieldset>
      <button type="submit" class="btn btn-primary w-full" disabled={loading}>Simpan Data Service</button>
    </form>
  </div>
</dialog>

<style>
  /* Menghilangkan scrollbar default dialog agar lebih rapi */
  dialog::backdrop {
    animation: fadeIn 0.3s ease-out;
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
