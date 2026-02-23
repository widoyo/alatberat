<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog";
    import * as Drawer from "$lib/components/ui/drawer";
    import { useMediaQuery } from "$lib/hooks/media-query.svelte";

    let { open = $bindable(), title, description, children } = $props();
    const isDesktop = useMediaQuery("(min-width: 768px)");

    // Pilih set komponen berdasarkan ukuran layar
    const Root = $derived(isDesktop.value ? Dialog.Root : Drawer.Root);
    const Content = $derived(isDesktop.value ? Dialog.Content : Drawer.Content);
    const Header = $derived(isDesktop.value ? Dialog.Header : Drawer.Header);
    const Title = $derived(isDesktop.value ? Dialog.Title : Drawer.Title);
    const Description = $derived(isDesktop.value ? Dialog.Description : Drawer.Description);
</script>

<Root bind:open>
    <Content class="sm:max-w-[425px]">
        <Header>
            <Title>{title}</Title>
            {#if description}
                <Description>{description}</Description>
            {/if}
        </Header>
        <div class="p-4 md:p-0">
            {@render children()}
        </div>
    </Content>
</Root>