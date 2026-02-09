<script lang="ts">
  import './layout.css';
  //import favicon from '$lib/assets/favicon.ico';
  import Navbar from '$lib/components/Navbar.svelte';
  import favicon from '$lib/assets/pu.ico';
  import Excavator from '$lib/assets/excavator.svg';
  import { enhance } from '$app/forms';
  
  let { children, data } = $props();
  let isMenuOpen = $state(false); // Menggunakan Svelte 5 runes
  
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  let isFlipped = $state(false);

	$effect(() => {
		// Menghasilkan angka random antara 3000ms (3 detik) hingga 7000ms (7 detik)
		const randomDelay = Math.floor(Math.random() * (7000 - 2000 + 1)) + 2000;

		const timer = setTimeout(() => {
			isFlipped = true;
		}, randomDelay);

		return () => clearTimeout(timer);
	});

</script>
<svelte:head><link rel="icon" type="image/x-icon" href="{favicon}" /></svelte:head>
<style>
/* scaleX(-1) akan membalik gambar secara horizontal */
	.flipped {
		transform: scaleX(-1);
	}
</style>
<!-- For best results, preview this in either the full-width or full-screen preview modes. -->

<div class="grid grid-rows-[auto_1fr_auto]">
  <!-- Header -->
  <header class="sticky top-0 p-2 border-b-yellow-400 border-b-4 mb-4 bg-white/80 backdrop-blur z-50 relative">
  <div class="container mx-auto flex items-center justify-between">
    <a href="/" class="block w-max">
       <img src={Excavator} width="40" alt="Logo">
    </a>
    
    <div class="flex items-center gap-6">
      <Navbar />
      <div class="flex items-center gap-4">
        {#if data.user}
          <form method="POST" action="?/logout" use:enhance>
          <button class="btn btn-sm">Sign Out</button>
          </form>
        {:else}
          <a href="/login" class="btn preset-filled-primary">Login</a>
        {/if}
      </div>
    </div>

  </div>
</header>
  <!-- Page -->
  <div class="container mx-auto items-center p-4">
	{@render children()}
  </div>
  <!-- Footer -->
  <footer class=" p-4">Hak Cipta © 2026 BBWS Sumatera VIII</footer>
</div>
