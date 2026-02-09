<script lang="ts">
    let { data, form } = $props();
</script>
<div>BMN: {data.alatberat.nup}</div>
<h1 class="text-2xl font-bold mb-4">{data.alatberat.deskripsi}</h1>
<p>{data.alatberat.keterangan}</p>
<div class="flex flex-col md:flex-row gap-4 p-4">
    <div class="flex-1">
        <div class="mb-12">
            <h2 class="font-light text-xl pb-3">Catatan Operasi Harian</h2>
            <p>Belum ada catatan operasi dari Operator alat berat</p>
        </div>
        <div class="mb-6">
            <h2 class="font-light text-xl pb-3">Riwayat Penggunaan</h2>
            <table class="table w-full border border-gray-300">
                <thead>
                    <tr>
                        <th>Pengguna</th>
                        <th>Lokasi</th>
                        <th>Tanggal Mulai</th>
                        <th>Tanggal Selesai</th>
                    </tr>
                </thead>
                <tbody>
                    {#each data.alatberat.penggunaan as penggunaan (penggunaan.id)}
                        <tr>
                            <td>{penggunaan.penanggungJawab}</td>
                            <td>{penggunaan.lokasi}</td>
                            <td>{new Date(penggunaan.tanggalMulai).toLocaleDateString()}</td>
                            <td>{penggunaan.tanggalSelesai ? new Date(penggunaan.tanggalSelesai).toLocaleDateString() : 'Masih digunakan'}</td>
                        </tr>
                    {:else}
                        <tr>
                            <td colspan="4" class="text-center italic opacity-50 py-10">
                                Belum ada riwayat penggunaan.
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>

    </div>
    <div class="flex-1">
    <h2 class="font-light text-xl">Riwayat Pemeliharaan</h2>
    </div>
    
</div>
