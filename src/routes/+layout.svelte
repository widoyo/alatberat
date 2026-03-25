<script lang="ts">
  import "./layout.css";
  import { onMount } from "svelte";
  import { Moon, Sun, Menu, LayoutDashboard, Construction, Users, Info } from "@lucide/svelte";
  import { page } from "$app/state";
  import { scale } from "svelte/transition";
  import { cubicOut } from "svelte/easing";

  let { children } = $props();
  let theme = $state("light");
  let drawerOpen = $state(false); 

  // Cek apakah route diawali dengan /op
  let isOpRoute = $derived(page.url.pathname.startsWith('/op'));

  onMount(() => {
    const savedTheme = localStorage.getItem("theme") || 
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    theme = savedTheme;
  });

  $effect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    }
  });

  function toggleTheme() {
    theme = theme === "light" ? "dark" : "light";
  }
</script>

{#if isOpRoute}
  <div class="min-h-screen bg-base-100 flex flex-col font-sans antialiased overflow-x-hidden">
    <main class="flex-1 w-full max-w-md mx-auto shadow-sm min-h-screen bg-base-100">
      {@render children()}
    </main>
  </div>

{:else}
  <div class="drawer lg:drawer-open min-h-screen bg-base-200">
    <input id="main-drawer" type="checkbox" class="drawer-toggle" bind:checked={drawerOpen} />
    
    <div class="drawer-content flex flex-col">
      <header class="navbar bg-base-100 border-b border-base-300 sticky top-0 z-30 px-4">
        <div class="flex-none lg:hidden">
          <label for="main-drawer" class="btn btn-square btn-ghost">
            <Menu />
          </label>
        </div>
        <div class="flex-1 px-2">
          <span class="text-xl font-bold tracking-tight">siMantab <span class="text-xs font-normal opacity-50">Admin</span></span>
        </div>
        <div class="flex-none">
          {@render ThemeToggle()}
        </div>
      </header>

      <main class="p-4 md:p-8 flex-1">
        <div class="max-w-[1400px] mx-auto">
          {@render children()}
        </div>
        
        <footer class="mt-20 py-8 border-t border-base-300 text-center opacity-70">
          <p class="text-sm">Hak Cipta © 2026 BBWS Sumatera VIII</p>
        </footer>
      </main>
    </div> 

    <aside class="drawer-side z-40">
      <label for="main-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
      <div class="menu p-4 w-72 min-h-full bg-base-100 border-r border-base-300 text-base-content">
        <div class="mb-10 px-4 py-4 flex items-center gap-3">
          <div class="size-10 bg-primary rounded-lg flex items-center justify-center text-primary-content">
            <Construction size={24} />
          </div>
          <span class="text-2xl font-black tracking-tighter italic">SI-MANTAB</span>
        </div>
        
        <ul class="space-y-1">
          <li>
            <a href="/" class={page.url.pathname === '/' ? 'active' : ''}>
              <LayoutDashboard size={18}/> Dashboard Utama
            </a>
          </li>
          <div class="divider text-[10px] opacity-50 uppercase tracking-widest">Manajemen</div>
          <li>
            <details open>
              <summary><Construction size={18}/> Aset Alat Berat</summary>
              <ul class="before:opacity-20">
                <li><a href="/alatberat" class={page.url.pathname === '/alatberat' ? 'active text-primary' : ''}>Daftar Unit</a></li>
                <li><a href="/alatberat/lokasi">Peta Lokasi</a></li>
              </ul>
            </details>
          </li>
          <li>
            <a href="/operator" class={page.url.pathname.startsWith('/operator') ? 'active' : ''}>
              <Users size={18}/> Personel Operator
            </a>
          </li>
          <div class="divider text-[10px] opacity-50 uppercase tracking-widest">Sistem</div>
          <li><a href="/about"><Info size={18}/> Informasi Bantuan</a></li>
        </ul>

        <div class="mt-auto p-4 text-center italic opacity-30 text-xs">
          "Slow and Low"
        </div>
      </div>
    </aside>
  </div>
{/if}

{#snippet ThemeToggle()}
  <button onclick={toggleTheme} class="btn btn-ghost btn-circle" aria-label="Toggle Theme">
    {#if theme === "light"}
      <div transition:scale={{ duration: 200, easing: cubicOut }}><Moon size={20} /></div>
    {:else}
      <div transition:scale={{ duration: 200, easing: cubicOut }}><Sun size={20} /></div>
    {/if}
  </button>
{/snippet}