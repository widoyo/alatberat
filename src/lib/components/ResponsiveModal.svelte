<script lang="ts">
    import { useMediaQuery } from "$lib/hooks/media-query.svelte";

    let { open = $bindable(), title, description, children } = $props();
    const isDesktop = useMediaQuery("(min-width: 768px)");

    // Pilih set komponen berdasarkan ukuran layar
</script>

