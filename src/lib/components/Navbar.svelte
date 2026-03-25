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
 

 </script>
 
