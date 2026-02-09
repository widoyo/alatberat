<script lang="ts">
    let { data, form } = $props();
</script>
<h1 class="text-2xl font-bold mb-4">Penggunaan Alat Berat</h1>
<div>
    <form action="?/add" method="POST">
        <input type="hidden" name="nup" value="Hallo Nup">
    <input type="submit" class="btn preset-filled" value="Tambah Data Penggunaan">
    </form>
</div>