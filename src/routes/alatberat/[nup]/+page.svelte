<script lang="ts">
  import { getDuration } from "$lib/utils/index";
  import { enhance } from "$app/forms";
  import FormFields from "$lib/components/FormFields.svelte";
  let formElement = $state<HTMLFormElement | null>(null);

  import { onMount } from "svelte";
  
  let { data, form } = $props();

  // Form state for validation
  let pengguna = $state("");
  let pic = $state("");
  let lokasi = $state("");
  let tanggalMulai = $state("");
  let estimasiSelesai = $state("");
  
  // Derived value for form validity
  let isFormValid = $derived(
    pengguna.trim() !== "" && 
    tanggalMulai.trim() !== ""
  );
    
  function resetForm() {
    pengguna = "";
    pic = "";
    lokasi = "";
    tanggalMulai = "";
    estimasiSelesai = "";
  }
</script>

<div><span class="text-muted-foreground">BMN</span> {data.alatberat.nup}</div>
<h1>{data.alatberat.deskripsi}</h1>
<p>{data.alatberat.keterangan}</p>

<!-- name of each tab group should be unique -->
<div class="tabs tabs-border my-4">
  <input type="radio" name="my_tabs_2" class="tab font-light" aria-label="Penggunaan" />
  <div class="tab-content border-base-300 bg-base-100 p-10">
    <div class="py-6">
      <h3>Catat Penggunaan</h3>
      <FormFields {form}>
        {#snippet children({ inputField })}
          <form 
            method="POST" 
            use:enhance
            action="?/booking"
            bind:this={formElement}
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              {@render inputField({
                name: "pengguna",
                label: "Pengguna",
                required: true,
                description: "Nama organisasi pengguna alat berat",
                value: pengguna,
                onValueChange: (v:string) => {pengguna = v; console.log("Pengguna:", pengguna, "Is Form Valid?", isFormValid)}
              })}
              {@render inputField({
                name: "pic",
                label: "PIC",
                description: "Personil yang bertanggung jawab",
                value: pic,
                onValueChange: (v:string) => pic = v
              })}
            </div>
            <div>
              {@render inputField({
                name: "lokasi",
                label: "Lokasi",
                description: "Lokasi alat berat digunakan (misal: Desa X, Kecamatan Y)",
                value: lokasi,
                onValueChange: (v:string) => lokasi = v
              })}
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              {@render inputField({
                name: "tanggalMulai",
                label: "Tanggal Mulai",
                required: true,
                type: "date",
                value: tanggalMulai,
                onValueChange: (v:string) => { tanggalMulai = v; console.log("tanggalMulai:", tanggalMulai, "Is Form Valid?", isFormValid) }
              })}
              {@render inputField({
                name: "estimasiSelesai",
                label: "Estimasi Selesai",
                type: "date",
                value: estimasiSelesai,
                onValueChange: (v:string) => estimasiSelesai = v
              })}
            </div>
            
            <!-- Required fields indicator -->
            <div class="text-xs text-gray-500 mt-2">
              <span class="text-red-500">*</span> Required fields
            </div>
            
            <!-- Validation feedback -->
            {#if !isFormValid}
              <div class="text-sm text-amber-600 mt-2">
                Please fill in all required fields (Pengguna and Tanggal Mulai)
              </div>
            {/if}
            
            <button 
              type="submit" 
              class="btn btn-primary mt-4" 
              disabled={!isFormValid}
            >
              Simpan
            </button>
          </form>
        {/snippet}
      </FormFields>
    </div>
    
    <!-- Usage History Table -->
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

  <input type="radio" name="my_tabs_2" class="tab font-light" aria-label="Bahan Bakar" checked="checked" />
  <div class="tab-content border-base-300 bg-base-100 p-10">Tab content 2</div>

  <input type="radio" name="my_tabs_2" class="tab font-light" aria-label="Pemeliharaan" />
  <div class="tab-content border-base-300 bg-base-100 p-10">Tab content 3</div>
</div>

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