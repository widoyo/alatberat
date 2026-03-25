<script lang="ts">

  // untuk mendefinisikan snippet yang bisa dipanggil dari luar
  let { form, children } = $props();
</script>

{#snippet checkboxField({ 
    name, 
    label, 
    description = "", 
    required = false 
}: { 
    name: string, 
    label: string, 
    description?: string, 
    required?: boolean 
})}
  <div class="flex items-start gap-3 mb-4">
    <div class="flex items-center h-5">
      <input
        id={name}
        name={name}
        type="checkbox"
        {required}
        class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        checked={form?.values?.[name] === 'on' || form?.values?.[name] === true || form?.values?.[name] === 1}
      />
      <p class="text-sm text-slate-500">{description}</p>
    </div>
    <div class="text-sm">
      <label for={name} class="font-medium {form?.errors?.[name] ? 'text-red-500' : 'text-slate-700'} cursor-pointer">
        {label} {required ? '*' : ''}
      </label>
      {#if description}
        <p class="text-slate-500 text-xs">{description}</p>
      {/if}
      {#if form?.errors?.[name]}
        <p class="text-[11px] text-red-500 italic mt-1">*{form.errors[name]}</p>
      {/if}
    </div>
  </div>
{/snippet}

{#snippet inputField({ 
    name, 
    label, 
    placeholder = "", 
    required = false, 
    type = "text",
    description = "",
    value = "",
    onValueChange
}: { 
    name: string, 
    label: string, 
    placeholder?: string, 
    required?: boolean, 
    type?: string,
    description?: string,
    value?: string,
    onValueChange?: (value: string) => void
})}
  <div class="grid gap-2 mb-4">
    <label for={name} class="text-sm font-medium {form?.errors?.[name] ? 'text-red-500' : ''}">
      {label} <span class="text-red-500">{required ? '*)' : ''}</span>
    </label>
    <input
      id={name}
      name={name}
      {type}
      {required}
      placeholder={placeholder}
      class="border p-2 rounded {form?.errors?.[name] ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'} focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={form?.values?.[name] ?? value ?? ''}
      oninput={(e) => {
        const newValue = e.currentTarget.value;
        if (onValueChange) {
          onValueChange(newValue);
        }
      }}
    />
    {#if description}
      <p class="text-sm text-slate-500">{description}</p>
    {/if}
    {#if form?.errors?.[name]}
      <p class="text-[11px] text-red-500 italic">*{form.errors[name]}</p>
    {/if}
  </div>
{/snippet}
{#snippet selectField({ 
    name, 
    label, 
    options = [], 
    required = false 
}: { 
    name: string, 
    label: string, 
    options: { value: string | number, label: string }[], 
    required?: boolean 
})}
  <div class="grid gap-2 mb-4">
    <label for={name} class="text-sm font-medium {form?.errors?.[name] ? 'text-red-500' : ''}">
      {label} {required ? '*' : ''}
    </label>
    <select
      id={name}
      name={name}
      {required}
      class="border p-2.5 rounded-md bg-white {form?.errors?.[name] ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'} focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Pilih {label}...</option>
      {#each options as opt}
        <option value={opt.value} selected={String(form?.values?.[name]) === String(opt.value)}>
          {opt.label}
        </option>
      {/each}
    </select>
    
    {#if form?.errors?.[name]}
      <p class="text-[11px] text-red-500 italic">*{form.errors[name]}</p>
    {/if}
  </div>
{/snippet}

{@render children?.({ checkboxField, inputField, selectField })}