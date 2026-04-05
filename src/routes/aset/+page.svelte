<script lang="ts">
  import { enhance } from "$app/forms";
  let { data, form } = $props();

  let selectedAset = $state(null); // State untuk modal Edit/Tambah
  let isEditing = $state(false);
</script>

<div class="p-6 font-thin">
  <div class="flex justify-between items-end mb-8">
    <h1 class="text-3xl tracking-[0.3em]">ASET_UNIT</h1>
    <button
      onclick={() => {
        selectedAset = null;
        isEditing = true;
      }}
      class="border border-black px-4 py-1 hover:bg-black hover:text-white transition-all text-sm"
    >
      + TAMBAH_BARU
    </button>
  </div>

  <table class="w-full border-collapse">
    <thead>
      <tr
        class="border-b-2 border-black text-left opacity-60 text-xs tracking-widest"
      >
        <th class="py-2">NUP / NO. LAMBUNG</th>
        <th>LOKASI</th>
        <th>HM (WORK HOUR)</th>
        <th>BBM (%)</th>
        <th class="text-right">AKSI</th>
      </tr>
    </thead>
    <tbody>
      {#each data.daftarAset as item}
        <tr class="border-b border-zinc-200 hover:bg-zinc-50 group">
          <td class="py-4">
            <div class="font-normal">{item.noLambung || "---"}</div>
            <div class="text-[10px] opacity-50"><a href="/aset/{item.id}">{item.noLambung}</a></div>
          </td>

          <td>
            <form method="POST" action="?/patch" use:enhance>
              <input type="hidden" name="id" value={item.id} />
              <input type="hidden" name="field" value="lokasi" />
              <input
                name="value"
                value={item.lokasi}
                class="bg-transparent border-b border-transparent focus:border-black outline-none w-full"
                onchange={(e) =>
                  (e.target as HTMLInputElement)?.form?.requestSubmit()}
              />
            </form>
          </td>

          <td class="font-mono text-sm">{item.workHour} hr</td>

          <td>
            <div class="w-16 bg-zinc-200 h-1">
              <div
                class="bg-black h-1"
                style="width: {item.volBahanbakar}%"
              ></div>
            </div>
          </td>

          <td class="text-right space-x-4">
            <button
              onclick={() => {
                selectedAset = item;
                isEditing = true;
              }}
              class="text-[10px] underline decoration-dotted opacity-50 hover:opacity-100"
            >
              DETAIL
            </button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

{#if isEditing}
  <div class="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex justify-end">
    <div
      class="w-full max-w-md border-l border-black p-8 shadow-2xl overflow-y-auto"
    >
      <button
        onclick={() => (isEditing = false)}
        class="mb-10 text-xs tracking-tighter opacity-50 underline"
        >KEMBALI</button
      >

      <form
        method="POST"
        action="?/upsert"
        use:enhance={() => {
          isEditing = false;
        }}
      >
        <input type="hidden" name="id" value={selectedAset?.id} />
        <h2 class="text-xl mb-6 tracking-widest">
          {selectedAset ? "UPDATE_ASET" : "REGISTRASI_ASET"}
        </h2>

        <div class="space-y-6 flex flex-col">
          <label for="nup" class="text-[10px] opacity-50">NUP</label>
          <input
            name="nup"
            value={selectedAset?.nup ?? ""}
            required
            class="border-b border-black outline-none py-1"
          />

          <label for="deskripsi" class="text-[10px] opacity-50">DESKRIPSI</label
          >
          <textarea
            name="deskripsi"
            class="border border-zinc-300 outline-none p-2 text-sm"
            >{selectedAset?.deskripsi ?? ""}</textarea
          >

          <label
            for="kategoriAset"
            class="text-[10px] opacity-50 tracking-widest uppercase"
          >
            Kategori Aset <span class="text-red-500">*</span>
          </label>

          <select
            name="kategoriAset"
            class="border-b border-black outline-none py-2 bg-transparent font-thin
                   {form?.missingKategori ? 'border-red-500 bg-red-50' : ''}"
          >
            <option value="">-- Pilih Kategori --</option>
            <option
              value="alat berat"
              selected={selectedAset?.kategoriAset === "alat berat"}
              >Alat Berat</option
            >
            <option
              value="kendaraan operasional"
              selected={selectedAset?.kategoriAset === "kendaraan operasional"}
              >Kendaraan Operasional</option
            >
          </select>

          {#if form?.missingKategori}
            <span class="text-[9px] text-red-500 italic"
              >Bagian ini tidak boleh kosong.</span
            >
          {/if}
          <button
            type="submit"
            class="bg-black text-white py-3 mt-10 tracking-[0.2em] text-sm"
          >
            SIMPAN_DATA
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
