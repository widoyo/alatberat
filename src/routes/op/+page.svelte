<script lang="ts">
    import { enhance } from '$app/forms';
    export let data;
    export let form;

    let pinInput = "";

    // Reaktif: Kirim form otomatis jika PIN sudah 5 digit
    $: if (pinInput.length === 5) {
        const formEl = document.getElementById('pin-form') as HTMLFormElement;
        formEl?.requestSubmit();
    }
</script>

<div class="op-container">
    {#if !data.authenticated}
        <div class="pin-box">
            <h2>Operator Access</h2>
            <p>Masukkan 5-digit PIN</p>
            
            <form id="pin-form" method="POST" action="?/login" use:enhance>
                <input 
                    type="password" 
                    name="pin" 
                    bind:value={pinInput} 
                    maxlength="5" 
                    inputmode="numeric"
                    autocomplete="one-time-code"
                    autofocus
                    class="pin-input"
                />
            </form>
            {#if form?.message}<p class="error">{form.message}</p>{/if}
        </div>

    {:else}
        <header>
            <h1>Dashboard Operator</h1>
            <form method="POST" action="?/logout" use:enhance>
                <button class="btn-logout">Logout</button>
            </form>
        </header>

        <section class="entry-section">
            <form method="POST" action="?/entry" use:enhance>
                <input type="text" name="catatan" placeholder="Entry data mesin..." required />
                <button type="submit">Simpan</button>
            </form>
        </section>

        <section class="history-section">
            <h3>Entry Terakhir</h3>
            <ul>
                {#each data.history as item}
                    <li><strong>{item.time}</strong>: {item.info}</li>
                {/each}
            </ul>
        </section>
    {/if}
</div>

<style>
    .op-container { max-width: 600px; margin: 2rem auto; font-family: sans-serif; }
    .pin-box { text-align: center; border: 1px solid #ccc; padding: 2rem; border-radius: 8px; }
    .pin-input { font-size: 2.5rem; width: 160px; text-align: center; letter-spacing: 0.5rem; }
    .error { color: red; margin-top: 1rem; }
    header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #eee; padding-bottom: 1rem; }
    .btn-logout { background: #ff4444; color: white; border: none; padding: 0.5rem 1rem; cursor: pointer; }
    .entry-section { margin: 2rem 0; padding: 1rem; background: #f9f9f9; }
</style>