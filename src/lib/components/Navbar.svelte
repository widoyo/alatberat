<script lang="ts">
 import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";
 import { cn } from "$lib/utils.js";
 import { navigationMenuTriggerStyle } from "$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte";
 import type { HTMLAttributes } from "svelte/elements";
 import CircleHelpIcon from "@lucide/svelte/icons/circle-help";
 import CircleIcon from "@lucide/svelte/icons/circle";
 import CircleCheckIcon from "@lucide/svelte/icons/circle-check";
 
 import { IsMobile } from "$lib/components/hooks/is-mobile.svelte";
 
 const isMobile = new IsMobile();
 
 const components: { title: string; href: string; description: string }[] = [
  {
   title: "Alat Berat",
   href: "/alatberat",
   description:
    "Seluruh Alat berat yang dikelola."
  },
  {
   title: "Operator",
   href: "/operator",
   description:
    "Operator alat berat, baik internal maupun eksternal"
  },
  {
   title: "Penggunaan Bahan Bakar",
   href: "/bahanbakar",
   description:
    "Informasi penggunaan bahan bakar."
  },
  {
   title: "Penggunaan Suku Cadang",
   href: "/sparepart",
   description:
    "Informasi penggunaan Suku Cadang."
  },
  {
   title: "Riwayat Pemeliharaan",
   href: "/pemeliharaan",
   description:
    "Riwayat pemeliharaan Alat Berat."
  }
 ];
 
 type ListItemProps = HTMLAttributes<HTMLAnchorElement> & {
  title: string;
  href: string;
  content: string;
 };
</script>
 
{#snippet ListItem({
 title,
 content,
 href,
 class: className,
 ...restProps
}: ListItemProps)}
 <li>
  <NavigationMenu.Link>
   {#snippet child()}
    <a
     {href}
     class={cn(
      "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none",
      className
     )}
     {...restProps}
    >
     <div class="text-sm leading-none font-medium">{title}</div>
     <p class="text-muted-foreground line-clamp-2 text-sm leading-snug">
      {content}
     </p>
    </a>
   {/snippet}
  </NavigationMenu.Link>
 </li>
{/snippet}
 
<NavigationMenu.Root viewport={isMobile.current}>
 <NavigationMenu.List class="flex-wrap">
    <NavigationMenu.Item>
   <NavigationMenu.Link>
    {#snippet child()}
     <a href="/" class={navigationMenuTriggerStyle()}>Home</a>
    {/snippet}
   </NavigationMenu.Link>
  </NavigationMenu.Item>

  <NavigationMenu.Item>
   <NavigationMenu.Trigger>Operasi</NavigationMenu.Trigger>
   <NavigationMenu.Content>
    <ul
     class="grid gap-2 p-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]"
    >
     <li class="row-span-3">
      <NavigationMenu.Link
       class="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-4 no-underline outline-hidden select-none focus:shadow-md md:p-6"
      >
       {#snippet child({ props })}
        <a {...props} href="/">
         <div class="mt-4 mb-2 text-lg font-medium">OP Alat Berat</div>
         <p class="text-muted-foreground text-sm leading-tight">
          Informasi Penggunaan dan Pemeliharaan Alat Berat.
         </p>
        </a>
       {/snippet}
      </NavigationMenu.Link>
     </li>
     {@render ListItem({
      href: "/efisiensi",
      title: "Efisiensi Alat Berat",
      content:
       "Usia terhadap waktu kerja alat."
     })}
    </ul>
   </NavigationMenu.Content>
  </NavigationMenu.Item>
  <NavigationMenu.Item>
   <NavigationMenu.Trigger>Data Master</NavigationMenu.Trigger>
   <NavigationMenu.Content class="border border-black">
    <ul
     class="grid w-[300px] gap-2 p-2 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]"
    >
     {#each components as component, i (i)}
      {@render ListItem({
       href: component.href,
       title: component.title,
       content: component.description
      })}
     {/each}
    </ul>
   </NavigationMenu.Content>
  </NavigationMenu.Item>
 
 </NavigationMenu.List>
</NavigationMenu.Root>