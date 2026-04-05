<script lang="ts">
  import "./layout.css";
  import { onMount } from "svelte";
  import {
    Moon,
    Sun,
    Menu,
    LayoutDashboard,
    Tractor,
    Users,
    Info,
    Clock,
  } from "@lucide/svelte";
  import { page } from "$app/state";
  import { scale } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import { enhance } from "$app/forms";
  import { LogOut } from "@lucide/svelte";

  let { data, children } = $props();
  let theme = $state("balai");
  let drawerOpen = $state(false);

  // Cek apakah route diawali dengan /op
  let isOpRoute = $derived(/^\/op($|[\/?])/.test(page.url.pathname));

  onMount(() => {
    const savedTheme =
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "balai");
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

  const menus = [
    { name: "Unit", href: "/aset" },
    { name: "Staff", href: "/operator" },
    { name: "Operasi", href: "/op" },
  ];
</script>

{#if isOpRoute}
  <div
    class="min-h-screen bg-base-100 flex flex-col font-sans antialiased overflow-x-hidden"
  >
    <main
      class="flex-1 w-full max-w-md mx-auto shadow-sm min-h-screen bg-base-100"
    >
      {@render children()}
    </main>
  </div>
{:else}
  <div class="drawer lg:drawer-open min-h-screen bg-base-200">
    <input
      id="main-drawer"
      type="checkbox"
      class="drawer-toggle"
      bind:checked={drawerOpen}
    />

    <div class="drawer-content flex flex-col">
      <header
        class="navbar bg-base-100 border-b border-base-300 sticky top-0 z-30 px-4"
      >
        <div class="flex-1 px-2">
          <span class="text-xl font-bold tracking-tight"
            >siMantab {#if data.user}<span
                class="text-xs font-normal opacity-50">Admin</span
              >{/if}</span
          >
        </div>
        <div class="flex-none">
          {@render ThemeToggle()}
        </div>
      </header>

      <main class="p-4 md:p-8 flex-1">
        <div class="max-w-[1400px] mx-auto">
          {@render children()}
        </div>

        <footer
          class="mt-20 py-8 border-t border-base-300 text-center opacity-70"
        >
          <p class="text-sm">Hak Cipta © 2026 BBWS Sumatera VIII</p>
        </footer>

        <nav
          class="hidden md:flex fixed top-0 left-0 right-0 h-16 
         bg-white/20 backdrop-blur-lg 
         border-b border-gray-100/100 
         px-8 items-center justify-between z-50 
         transition-all duration-300"
        >
          <div class="flex items-center gap-8">
            <a href="/" class="text-xl tracking-[0.1em] lowercase"
              >siMantab</a
            >

            <div class="flex gap-6">
              {#each menus as menu}
                <a
                  href={menu.href}
                  class="{page.url.pathname.startsWith(menu.href)
                    ? 'text-gray-900'
                    : 'text-gray-500'} hover:text-gray-900 transition-colors"
                >
                  {menu.name}
                </a>
              {/each}
            </div>
          </div>

          <div class="flex items-center gap-4">
            {#if data.user}
              <span
                class="text-gray-500 tracking-widest"
                >{data.user.username}</span
              >
              <form method="POST" action="/?/logout">
                <button
                  class="border border-gray-200 px-3 py-1 rounded-full hover:bg-gray-50 transition-all"
                  >Logout</button
                >
              </form>
            {:else}
              <a href="/login" class=" text-slate-900">Login</a
              >
            {/if}
          </div>
        </nav>

        <nav
          class="flex md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-100 items-center justify-around pb-safe z-50"
        >
          <a href="/" class="flex flex-col items-center gap-1">
            <span
              class="tracking-tighter {page.url.pathname === '/'
                ? 'text-slate-900'
                : 'text-slate-400'}">Home</span
            >
          </a>
          {#each menus as menu}
            <a href={menu.href} class="flex flex-col items-center gap-1">
              <span
                class="tracking-tighter {page.url.pathname.startsWith(menu.href)
                  ? 'text-slate-900'
                  : 'text-slate-400'}"
              >
                {menu.name}
              </span>
            </a>
          {/each}
        </nav>

        <div class="h-0 md:h-16"></div>
        <div class="h-16 md:h-0"></div>
      </main>
    </div>
  </div>
{/if}

{#snippet ThemeToggle()}
  <button
    onclick={toggleTheme}
    class="btn btn-ghost btn-circle"
    aria-label="Toggle Theme"
  >
    {#if theme === "light"}
      <div transition:scale={{ duration: 200, easing: cubicOut }}>
        <Moon size={20} />
      </div>
    {:else}
      <div transition:scale={{ duration: 200, easing: cubicOut }}>
        <Sun size={20} />
      </div>
    {/if}
  </button>
{/snippet}
