<script lang="ts">
  // This is the main page of the application
  import Card from '$lib/components/Card.svelte';
    let { data, form } = $props();
</script>

<h1>Home</h1>
<div class="flex flex-col md:flex-row gap-4 mb-24">
    <div class="flex-1">
        <h2 class="text-xl font-semibold mb-5">Alat Berat Beroperasi</h2>
        <p class="text-sm mb-2">Alat berat yang sedang aktif digunakan</p>
        <div class="table-container mt-2 rounded-2xl">
        <table class="table border  rounded-2xl border-gray-500 w-full mt-2">
            <thead>
                <tr>
                    <th>Nama Aset</th>
                    <th>Lokasi</th>
                    <th>Sejak</th>
                </tr>
            </thead>
            <tbody class="[&>tr]:hover:preset-tonal-primary">
                {#each data.alatBeratOnDuty as aktif (aktif.id)}
                    <tr>
                        <td><a href="/alatberat/{aktif.nup}">{aktif.nup} {aktif.deskripsi}</a></td>
                        <td>{aktif.lokasi}</td>
                        <td>{new Date(aktif.penggunaan[aktif.penggunaan.length - 1].tanggalMulai).toLocaleString()}</td>
                    </tr>
                {:else}
                    <tr>
                        <td colspan="3" class="text-center italic opacity-50 py-10">
                            Belum ada data alat berat.
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
        </div>
    </div>
    <div class="flex-1">
        <h2 class="text-xl font-semibold mb-5">Alat Berat Standby</h2>
        <p>Alat berat yang sedang tidak digunakan.</p>
        <div class="table-container mt-2 rounded-2xl">
        <table class="table border  rounded-2xl border-gray-500 w-full mt-2">
            <thead>
                <tr>
                    <th>Nama Aset</th>
                    <th>Lokasi</th>
                    <th>Terakhir Beroperasi</th>
                </tr>
            </thead>
            <tbody class="[&>tr]:hover:preset-tonal-primary">
                {#each data.alatBeratStandby as aktif (aktif.id)}
                    <tr>
                        <td><a href="/alatberat/{aktif.nup}">{aktif.nup} {aktif.deskripsi}</a></td>
                        <td>{aktif.lokasi}</td>
                        <td>{new Date(aktif.penggunaan && aktif.penggunaan.length > 0 ? aktif.penggunaan[aktif.penggunaan.length - 1].tanggalSelesai : null).toLocaleString()}</td>
                    </tr>
                {:else}
                    <tr>
                        <td colspan="3" class="text-center italic opacity-50 py-10">
                            Belum ada data alat berat.
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>
</div>
<div class="flex flex-row gap-4">
    <Card title="Alat Berat Idle">
        <p>Alat berat yang sedang tidak dioperasikan.</p>
        <button type="button" class="btn preset-filled-primary-500">Booking</button>
    </Card>
    <Card title="Pemeliharaan Terjadwal">
        <p>Daftar pemeliharaan yang sudah dijadwalkan.</p>
    </Card>
    <Card title="Sparepart Kritis">
        <p>Daftar sparepart yang stoknya kritis.</p>
    </Card>
</div>
