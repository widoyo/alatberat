<script lang="ts">
  import Card from "$lib/components/Card.svelte";
  import { ChevronLeft, ChevronRight, Clock } from "@lucide/svelte";

  let currentYear = $state(2026);
  
  // Data dummy untuk visualisasi
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  
  // Baris 1: Simulasi total jam kerja per bulan
  const yearlyUtilization = [450, 520, 300, 480, 600, 550, 400, 350, 500, 420, 380, 410];

  // Baris 2: Simulasi 27 unit alat berat
  const fleetData = Array.from({ length: 27 }, (_, i) => ({
    id: i + 1,
    name: i < 20 ? `Excavator Type ${String.fromCharCode(65 + (i % 3))} - ${101 + i}` : `Mobile Pump MP-${201 + i}`,
    hours: Math.floor(Math.random() * 2000) + 500
  }));
</script>

<div class="flex flex-col gap-8">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold">Dashboard Utilisasi</h1>
      <p class="opacity-70">Ringkasan operasional 27 unit alat berat</p>
    </div>
    <div class="join border border-base-300">
      <button class="btn join-item" onclick={() => currentYear--}><ChevronLeft size={18}/></button>
      <button class="btn join-item no-animation">Tahun {currentYear}</button>
      <button class="btn join-item" onclick={() => currentYear++}><ChevronRight size={18}/></button>
    </div>
  </div>

  <div class="card bg-base-100 shadow-xl border border-base-300">
    <div class="card-body">
      <h2 class="card-title mb-4"><Clock class="text-primary"/> Total Jam Kerja Alat (Jan - Des {currentYear})</h2>
      <div class="flex items-end justify-between gap-2 h-48 w-full bg-base-200/50 p-4 rounded-xl">
        {#each yearlyUtilization as hours, i}
          <div class="flex flex-col items-center flex-1 group">
            <div class="w-full bg-primary/80 rounded-t-md transition-all group-hover:bg-primary" 
                 style="height: {(hours / 650) * 100}%">
              <div class="opacity-0 group-hover:opacity-100 text-[10px] text-center bg-base-content text-base-100 rounded px-1 -mt-6">
                {hours}h
              </div>
            </div>
            <span class="text-xs mt-2 font-semibold">{months[i]}</span>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <div class="card bg-base-100 shadow-xl border border-base-300">
    <div class="card-body">
      <h2 class="card-title mb-4">Utilisasi Per Unit (Jan {currentYear} - Sekarang)</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {#each fleetData as unit}
          <div class="flex flex-col p-4 border border-base-200 rounded-lg hover:bg-base-200/30 transition-colors">
            <div class="flex justify-between items-start mb-2">
              <span class="font-bold text-sm truncate w-40">{unit.name}</span>
              <div class="badge badge-outline badge-sm">Unit {unit.id}</div>
            </div>
            <div class="flex items-center gap-3">
              <progress class="progress progress-primary flex-1" value={unit.hours} max="2500"></progress>
              <span class="text-xs font-mono font-bold">{unit.hours} HM</span>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
    <Card title="Alat Berat Idle">
      <p class="text-sm opacity-70">5 Unit memerlukan penugasan segera.</p>
      <div class="card-actions justify-end mt-4">
        <button class="btn btn-primary btn-sm">Booking Alat</button>
      </div>
    </Card>
    <Card title="Pemeliharaan">
      <p class="text-sm opacity-70">3 unit (EXC-104, MP-202) masuk jadwal servis.</p>
    </Card>
    <Card title="Status Sparepart">
      <div class="badge badge-error gap-2">2 Kritis</div>
    </Card>
  </div>
</div>