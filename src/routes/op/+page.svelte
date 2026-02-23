<script lang="ts">
  import * as InputOTP from "$lib/components/ui/input-otp/index.js";
  import { REGEXP_ONLY_DIGITS } from "bits-ui";
  import { enhance } from "$app/forms";
  import type { PageProps } from "./$types";
  import { Button } from '$lib/components/ui/button';

  let { data, form }: PageProps = $props();
  let otpValue = $state("");
  let formElement: HTMLFormElement;

  function handleComplete() {
    setTimeout(() => {
      console.log("formComplete");
      formElement.requestSubmit();
    }, 100);
  }
</script>

{#if data.isAuthorized}
<div class="w-full min-h-screen bg-gray-50 px-4"> 
  
  <div class="max-w-[768px] mx-auto p-8 bg-white shadow-sm">
    
    <header class="mb-6 border-b pb-4">
        <h1 class="text-2xl font-bold">{data.operator?.nama}</h1>
        {JSON.stringify(data)}
    </header>

    <section class="space-y-6">
        <div class="p-4 rounded-lg">
            <h2 class="">Aktifitas Seminggu Lalu</h2>
            </div>

        <div class="border p-4 rounded-lg">
            <h3 class="font-medium mb-3">Input Aktifitas Baru</h3>
            <p class="text-sm text-gray-500 italic text-low">"Slow and Low" - Catat dengan teliti.</p>
        </div>

        <div class="border p-4 rounded-lg ">
            <h3 class="font-medium">Laporan Gejala Alat</h3>
            </div>
    </section>

    <footer class="mt-10 pt-6 border-t flex justify-end">
        <form method="POST" action="?/logout">
            <button type="submit" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                Logout
            </button>
        </form>
    </footer>
    
  </div>
</div>
{:else}
  <div class="flex w-full items-center px-4">
    <h1 class="mx-auto">Masuk</h1>
    <div class="flex flex-col w-full items-center px-4">
      <form
        bind:this={formElement}
        method="POST"
        action="?/verifyOtp"
        use:enhance={() => {
          return async ({ update }) => {
            // Reset OTP jika terjadi error agar operator bisa input ulang
            await update({ reset: false });
            if (form?.error) otpValue = "";
          };
        }}
        class="mb-5"
      >
        <InputOTP.Root
          maxlength={4}
          pattern={REGEXP_ONLY_DIGITS}
          bind:value={otpValue}
          onComplete={handleComplete}
        >
          {#snippet children({ cells })}
            <InputOTP.Group>
              {#each cells as cell (cell)}
                <InputOTP.Slot
                  {cell}
                  class="text-4xl font-bold font-block w-16 h-20 border-2 transition-colors {form?.error
                    ? 'border-red-500'
                    : 'border-gray-200'}"
                />
              {/each}
            </InputOTP.Group>
          {/snippet}
        </InputOTP.Root>
        <input type="hidden" name="otp" value={otpValue} />
        <p class="text-xs text-gray-400 font-mono italic">
          Menunggu input 4 digit kode alat...
        </p>
        <div class="h-6">
          {#if form?.error}
            <p
              class="text-sm font-bold text-red-600 bg-red-50 px-4 py-1 rounded-full animate-in fade-in slide-in-from-top-1"
            >
              {form.error}
            </p>
          {:else}
            <p
              class="text-xs text-gray-400 font-mono tracking-widest uppercase"
            >
              Masukkan 4 Digit Kode Unit
            </p>
          {/if}
        </div>
      </form>
    </div>
  </div>
{/if}
