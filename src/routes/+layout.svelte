<script lang="ts">
  import './layout.css';
  import { onMount, type Snippet } from "svelte";
  import Navbar from '$lib/components/Navbar.svelte';
  import * as Button from "$lib/components/ui/button/index.js";
  import favicon from '$lib/assets/pu.ico';
  import Excavator from '$lib/assets/excavator.svg';
  import { Moon, Sun } from '@lucide/svelte';
  import { enhance } from '$app/forms';
  import { IsMobile } from '$lib/components/hooks/is-mobile.svelte.js';
  import { page } from '$app/state';
  import { scale } from "svelte/transition";
	import { cubicOut } from "svelte/easing";

  
  let { children, data } = $props();
  let theme = $state("light");
  const isMobile = new IsMobile();
  let isOpRoute = $derived(/^\/op(\/|$)/.test(page.url.pathname));

  onMount(() => {
// 1. Cek apakah ada tema yang tersimpan sebelumnya
    const savedTheme = localStorage.getItem("theme");
    
    if (savedTheme) {
      // Jika ada di localStorage, gunakan itu
      theme = savedTheme;
    } else {
      // Jika tidak ada (user baru), baru ikuti preferensi sistem
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      theme = systemTheme;
    }
  });

  // Logika flip logo yang tetap Anda pertahankan
  let isFlipped = $state(false);
  $effect(() => {
// Membaca 'theme' di sini membuat effect ini reaktif
    const currentTheme = theme; 
    
    if (typeof window !== 'undefined') {
      // Update class di <html>
      document.documentElement.className = currentTheme;
      
      // Simpan ke localStorage
      localStorage.setItem("theme", currentTheme);
      
      console.log("Effect berjalan, theme sekarang:", currentTheme);
    }
    
    const randomDelay = Math.floor(Math.random() * (5000)) + 2000;
    const timer = setTimeout(() => { isFlipped = true; }, randomDelay);
    return () => clearTimeout(timer);
  });

  function toggleTheme() {
    console.log("Tombol toggle diklik, theme saat ini:", theme);
		theme = theme === "light" ? "dark" : "light";
	}
</script>

<svelte:head>
  <link rel="icon" type="image/x-icon" href="{favicon}" />
  <title>Si Mantab</title>
</svelte:head>

{#if !isOpRoute }
<div class="@container min-h-screen  bg-background text-foreground font-sans antialiased" {theme}>
  
  <div class="mx-auto max-w-[768px] min-h-screen bg-white flex flex-col border-x border-gray-100 shadow-sm">
    
    <header class="sticky top-0 z-50 bg-background border-b-4 border-[#ffbe0b]">
      <div class="px-6 py-4 flex items-center justify-between">
        <a href="/" class="block transition-transform duration-700 {isFlipped ? 'scale-x-[-1]' : ''}">
           <img src={Excavator} width="36" alt="Logo" class="opacity-90">
        </a>
        
        <div class="flex items-center gap-6">
          {#if isMobile.current}
            <span class="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Mobile Mode</span>
          {:else}
            <Navbar />
          {/if}

          <div class="flex items-center">
            {#if data.user}
              <form method="POST" action="/?/logout" use:enhance>
                <button class="hover:text-red-600 transition-colors">Logout</button>
              </form>
            {:else}
              <a href="/login" class="px-4 py-1.5 bg-black text-white text-xs font-bold rounded uppercase tracking-widest hover:bg-gray-800 transition-all">Login</a>
            {/if}
            <div class="ml-4">
            {@render ThemeToggle()}
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="flex-1 bg-background px-6 py-10 md:px-12">
      {@render children()}
    </main>

    <footer class="px-12 py-8 border-t border-black">
      <p class="font-medium text-center">
        Hak Cipta © 2026 BBWS Sumatera VIII
      </p>
    </footer>
  </div>
</div>
{:else}
<div class="@container min-h-screen bg-background text-foreground font-sans antialiased {theme}">
  
  <div class="mx-auto max-w-[768px] min-h-screen bg-white flex flex-col border-x border-gray-100 shadow-sm">
{@render children()}
</div>
</div>
{/if}

{#snippet ThemeToggle()}
	<Button.Root
		onclick={toggleTheme}
		role="switch"
		aria-label="Light Switch"
		aria-checked={theme === "light"}
		title="Toggle {theme === 'dark' ? 'Dark' : 'Light'} Mode"
		class="rounded-input hover:bg-dark-10 focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden relative inline-flex h-10 w-10 items-center justify-center px-2 focus-visible:ring-2 focus-visible:ring-offset-2"
	>
		{#if theme === "light"}
			<div
				class="absolute inline-flex h-full w-full items-center justify-center"
				transition:scale={{
					delay: 50,
					duration: 200,
					start: 0.7,
					easing: cubicOut,
				}}
			>
				<Moon class="size-6" aria-label="Moon" />
			</div>
		{:else}
			<div
				class="absolute inline-flex h-full w-full items-center justify-center"
				transition:scale={{
					delay: 50,
					duration: 200,
					start: 0.7,
					easing: cubicOut,
				}}
			>
				<Sun class="size-6" aria-label="Sun" />
			</div>
		{/if}
	</Button.Root>
{/snippet}