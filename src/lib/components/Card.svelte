<script lang="ts">
    let { children, title = "" } = $props();
</script>
<div class="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
  <h3 class="text-lg font-semibold mb-2">{title}</h3>
  <div class="mt-2">{@render children()}</div>
</div>