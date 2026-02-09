<script lang="ts">
	import { fly } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	let isMenuOpen = $state(false); // Mobile toggle
	let activeMegaMenu = $state(null); // Desktop megamenu toggle

	const asetCategories = [
		{ name: 'Alat Berat', desc: 'Excavator, Bulldozer, Grader', icon: '🚜', href: '/aset/alat-berat' },
		{ name: 'Kendaraan', desc: 'Dump Truck, Pick Up, DT', icon: '🚛', href: '/aset/kendaraan' },
		{ name: 'Peralatan', desc: 'Genset, Pompa, Vibrator', icon: '⚙️', href: '/aset/peralatan' },
		{ name: 'Suku Cadang', desc: 'Stok Filter, Ban, Oli', icon: '🔧', href: '/aset/sparepart' }
	];
</script>

<nav class="hidden md:flex items-center gap-6">
	<a href="/" class="text-sm font-medium hover:text-yellow-600">Dashboard</a>

	<div 
		class="relative group py-4"
		onmouseenter={() => activeMegaMenu = 'aset'}
		onmouseleave={() => activeMegaMenu = null}
		role="menuitem"
		tabindex="0"
	>
		<button class="flex items-center gap-1 text-sm font-medium group-hover:text-yellow-600"
			aria-expanded={activeMegaMenu === 'aset'}
			aria-haspopup="true"
		>
			Aset 
			<svg class="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
		</button>

		{#if activeMegaMenu === 'aset'}
			<div transition:fly={{ y: -15, duration: 500, easing: cubicInOut }}
			class="absolute top-full -left-20 w-[500px] bg-white shadow-2xl border-t-4 border-yellow-400 p-6 grid grid-cols-2 gap-4 rounded-b-xl animate-in fade-in zoom-in-95 duration-200 z-50">
				{#each asetCategories as cat}
					<a href={cat.href} class="flex items-start gap-3 p-3 rounded-lg hover:bg-yellow-50 transition-colors">
						<span class="text-2xl">{cat.icon}</span>
						<div>
							<div class="font-bold text-gray-800">{cat.name}</div>
							<div class="text-xs text-gray-500">{cat.desc}</div>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>

	<a href="/monitoring" class="text-sm font-medium hover:text-yellow-600">Monitoring</a>
	<a href="/laporan" class="text-sm font-medium hover:text-yellow-600">Laporan</a>
</nav>

<button class="md:hidden p-2" onclick={() => isMenuOpen = !isMenuOpen}>
	<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
</button>

{#if isMenuOpen}
	<div class="absolute top-full left-0 w-full bg-white border-b-2 border-yellow-400 md:hidden z-50 overflow-y-auto max-h-[80vh]">
		<div class="flex flex-col p-4">
			<a href="/" class="p-3 font-semibold border-b">Dashboard</a>
			
			<div class="p-3 font-semibold bg-gray-50 uppercase text-xs text-gray-400">Kategori Aset</div>
			{#each asetCategories as cat}
				<a href={cat.href} class="p-3 pl-6 flex items-center gap-3 border-b hover:bg-yellow-50">
					<span>{cat.icon}</span> {cat.name}
				</a>
			{/each}

			<a href="/monitoring" class="p-3 font-semibold border-b">Monitoring</a>
			<a href="/laporan" class="p-3 font-semibold border-b">Laporan</a>
		</div>
	</div>
{/if}