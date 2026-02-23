<script lang="ts">
  import { format } from "date-fns";
  import { Calendar as CalendarIcon, Clock } from "@lucide/svelte";
  import { Calendar } from "$lib/components/ui/calendar";
  import * as Popover from "$lib/components/ui/popover";
  import { Button } from "$lib/components/ui/button";
  import { cn } from "$lib/utils";

  export let value: Date = new Date();

  let selectedDate = value;

  // Daftar menit dengan resolusi 15 menit
  const minutes = ["00", "15", "30", "45"];
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));

  function setHour(h: string) {
    const newDate = new Date(value);
    newDate.setHours(parseInt(h));
    value = newDate;
  }

  function setMinute(m: string) {
    const newDate = new Date(value);
    newDate.setMinutes(parseInt(m));
    value = newDate;
  }

  function handleDateSelect(date: Date) {
    selectedDate = date;
    value = date;
  }
</script>

<div class="flex flex-col gap-2">
  <Popover.Root>
    <Popover.Trigger let:builder>
      <Button
        variant="outline"
        class={cn(
          "w-full justify-start text-left font-normal",
          !value && "text-muted-foreground"
        )}
        {...builder}
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        {value ? format(value, "PPP HH:mm") : "Pilih waktu aktifitas"}
      </Button>
    </Popover.Trigger>
    
    <Popover.Content class="w-auto p-0 flex flex-col md:flex-row">
      <div class="p-2 border-r">
        <Calendar value={selectedDate} onValueChange={handleDateSelect} initialFocus />
      </div>
      
      <div class="flex flex-col h-[300px] w-48 p-2">
        <div class="flex items-center gap-2 mb-2 px-2 text-muted-foreground">
            <Clock class="h-4 w-4" />
            <span class="text-sm font-medium">Waktu (15m)</span>
        </div>
        
        <div class="flex gap-2 overflow-hidden border rounded-md h-full">
            <div class="flex-1 overflow-y-auto scrollbar-hide p-1 bg-slate-50">
                {#each hours as h}
                    <Button 
                        variant={value.getHours() === parseInt(h) ? "default" : "ghost"} 
                        class="w-full text-xs h-8 mb-1"
                        on:click={() => setHour(h)}
                    >
                        {h}
                    </Button>
                {/each}
            </div>
            <div class="flex-1 overflow-y-auto p-1">
                {#each minutes as m}
                    <Button 
                        variant={value.getMinutes() === parseInt(m) ? "default" : "ghost"} 
                        class="w-full text-xs h-8 mb-1"
                        on:click={() => setMinute(m)}
                    >
                        {m}
                    </Button>
                {/each}
            </div>
        </div>
      </div>
    </Popover.Content>
  </Popover.Root>
</div>

<style>
    /* Sembunyikan scrollbar tapi tetap bisa scroll untuk kenyamanan UI */
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
</style>