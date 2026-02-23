<script lang="ts">
    const { ...data } = $props();
 import { Button } from "$lib/components/ui/button/index.js";
 import { Label } from "$lib/components/ui/label/index.js";
 import * as Card from "$lib/components/ui/card/index.js";
 import { IdCard } from '@lucide/svelte';
</script>
 
<Card.Root class="-my-4 w-full max-w-sm">
 <Card.Header>
  <Card.Title>
    <div class="flex w-full justify-between">
        <div>{data.nama}</div>
        <div class="font-light text-sm flex items-center gap-1.5">
            <IdCard size={16} strokeWidth={1} class="text-primary" /> 
            <span>{data.lisensi || '-'}</span>
        </div>
    </div>    
  </Card.Title>
 </Card.Header>
</Card.Root>