<script lang="ts">
    let { data, form } = $props();
</script>
<div>
    <h1>Alat Berat</h1>
    <div>
        <table class="table caption-bottom">
            <thead>
                <tr>
                    <th>NUP</th>
                    <th>Nama Aset</th>
                    <th>Lokasi</th>
                </tr>
            </thead>
            <tbody>
                {#each data.asets as aset (aset.id)}
                    <tr>
                        <td><a href="/alatberat/{aset.nup}">{aset.nup}</a></td>
                        <td>{aset.deskripsi}
                            <br>
                            <span class="text-sm">{aset.merk} - {aset.tipe}</span>
                        </td>
                        <td>{aset.lokasiSaatIni}</td>
                    </tr>
                {:else}
                    <tr>
                        <td colspan="3" class="text-center italic opacity-50 py-10">
                            Belum ada data aset.
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
    <pre>{JSON.stringify(data.asets, null, 2)}</pre>
</div>