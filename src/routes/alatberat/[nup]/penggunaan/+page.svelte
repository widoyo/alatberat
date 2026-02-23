<script>
    let searchQuery = "";
    let operators = [];
    let timer;
    let selectedOp = null;
    let isSearching = false; // <-- Tambahkan state ini

    async function searchOperators() {
        if (searchQuery.length < 2) {
            operators = [];
            selectedOp = null;
            isSearching = false;
            return;
        }

        isSearching = true; // Mulai mencari
        clearTimeout(timer);
        timer = setTimeout(async () => {
            const res = await fetch(`/api/operators?q=${searchQuery}`);
            operators = await res.json();
            isSearching = false; // Selesai mencari
        }, 300);
    }

    function selectOperator(op) {
        selectedOp = op;
        searchQuery = op.nama;
        operators = [];
        isSearching = false;
    }

    function resetSelection() {
        selectedOp = null;
        searchQuery = "";
        operators = [];
        isSearching = false;
    }
</script>

<div class="relative">
    <input 
        type="text" 
        name="namaOperator"
        bind:value={searchQuery} 
        on:input={searchOperators} 
        placeholder="Cari nama operator..."
        class="input w-full"
        readonly={!!selectedOp} 
    />

    {#if selectedOp}
        <button 
            type="button" 
            on:click={resetSelection}
            class="absolute right-2 top-2 text-xs text-red-500 underline"
        >
            Ganti
        </button>
    {/if}
</div>

{#if isSearching}
    <p class="text-xs text-gray-400 mt-1">Mengecek database...</p>
{/if}

{#if operators.length > 0 && !selectedOp}
    <ul class="absolute z-10 w-full bg-white border rounded shadow-lg mt-1">
        {#each operators as op}
            <li>
                <button 
                    type="button"
                    class="w-full text-left p-2 hover:bg-blue-50 focus:bg-blue-100 border-b last:border-0"
                    on:click={() => selectOperator(op)}
                >
                    <div class="font-bold">{op.nama}</div>
                    <div class="text-xs text-gray-500">
                        {op.jenis} • {op.lisensi || 'Tanpa Lisensi'}
                    </div>
                </button>
            </li>
        {/each}
    </ul>
{/if}

{#if !isSearching && searchQuery.length >= 2 && operators.length === 0 && !selectedOp}
    <div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p class="text-sm font-bold text-blue-800 mb-2">Operator tidak ditemukan. Daftarkan baru?</p>
        <input type="hidden" name="isNewOperator" value="true" />
        
        <div class="grid grid-cols-1 gap-3">
            <div class="flex gap-2">
                <select name="jenis" class="p-2 border rounded text-sm bg-white">
                    <option value="internal">Internal</option>
                    <option value="eksternal">Eksternal</option>
                </select>
                <input type="text" name="lisensi" placeholder="No. SIO / Lisensi" class="flex-1 p-2 border rounded text-sm bg-white" />
            </div>
            <input type="text" name="whatsapp" placeholder="No. WhatsApp (Contoh: 0812...)" class="w-full p-2 border rounded text-sm bg-white" />
        </div>
    </div>
{/if}

{#if selectedOp}
    <input type="hidden" name="operatorId" value={selectedOp.id} />
    <div class="mt-2 p-2 bg-green-50 text-green-700 text-xs rounded border border-green-200">
        ✓ Terdaftar sebagai operator {selectedOp.jenis}
    </div>
{/if}