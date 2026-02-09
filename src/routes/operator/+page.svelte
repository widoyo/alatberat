<script lang="ts">
    // Mengambil data 'operators' dari load function (+page.server.ts)
    let { data } = $props();
</script>

<div class="p-8 min-h-screen ">
    <div class="container mx-auto space-y-6">
        
        <header class="flex justify-between items-center">
            <h2 class="h2 font-bold tracking-tight">Daftar Operator</h2>
            <button class="btn bg-mango text-black hover:scale-105 transition-transform">
                + Registrasi Operator
            </button>
        </header>

        <div class="overflow-x-auto border border-white/20 bg-white/10 ">
            <table class="table w-full border-collapse">
                <thead class="bg-white/5">
                    <tr>
                        <th class="p-4 text-left font-semibold text-mango">Nama Operator</th>
                        <th class="p-4 text-left font-semibold text-mango">Lisensi</th>
                        <th class="p-4 text-left font-semibold text-mango">Pengalaman</th>
                        <th class="p-4 text-center font-semibold text-mango">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-white/10">
                    {#each data.operators as op (op.id)}
                        <tr class="hover:bg-white/5 transition-colors">
                            <td class="p-4 font-medium">{op.nama}</td>
                            <td class="p-4">
                                <span class="badge bg-blue-pu/40">
                                    {op.lisensi ?? 'Tidak ada'}
                                </span>
                            </td>
                            <td class="p-4">{op.pengalamanTahun} Tahun</td>
                            <td class="p-4 text-center">
                                <button class="btn btn-sm variant-soft-primary hover:bg-mango/20">Edit</button>
                            </td>
                        </tr>
                    {:else}
                        <tr>
                            <td colspan="4" class="p-10 text-center italic opacity-60">Belum ada data operator.</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>