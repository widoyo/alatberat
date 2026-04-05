<script lang="ts">
  import { enhance } from "$app/forms";

  let { data, form } = $props();
  // State Svelte 5
  let pin = $state<string[]>(["", "", "", ""]);
  let inputs = $state<(HTMLInputElement | null)[]>([]);
  let formElement = $state<HTMLFormElement | null>(null);

  // Derived: Gabungkan array menjadi string utuh untuk input hidden
  const fullPin = $derived(pin.join(""));
  const isComplete = $derived(pin.every((digit) => digit !== ""));

  $effect(() => {
    if (form?.message) {
      pin = ["", "", "", ""];
      inputs[0]?.focus();
    }
  });

  // Effect: Submit form otomatis jika 4 digit terpenuhi
  $effect(() => {
    if (isComplete && formElement) {
      formElement.requestSubmit();
    }
  });

  function handleChange(
    e: Event & { currentTarget: HTMLInputElement },
    i: number,
  ) {
    const value = e.currentTarget.value;
    if (!/^\d*$/.test(value)) {
      pin[i] = "";
      return;
    }
    pin[i] = value.slice(-1);
    if (pin[i] && i < 3) {
      inputs[i + 1]?.focus();
    }
  }

  function handleKeyDown(e: KeyboardEvent, i: number) {
    if (e.key === "Backspace" && !pin[i] && i > 0) {
      inputs[i - 1]?.focus();
    }
  }

  function handlePaste(e: ClipboardEvent) {
    e.preventDefault();
    const pasteData = e.clipboardData?.getData("text") || "";
    const digits = pasteData.match(/\d/g)?.slice(0, 4) || [];

    digits.forEach((digit, i) => {
      if (i < 4) pin[i] = digit;
    });

    const nextFocusIndex = digits.length > 0 ? Math.min(digits.length, 3) : 0;
    inputs[nextFocusIndex]?.focus();
  }
</script>

<div class="op-container">
  {#if !data.authenticated}
    <form
      method="POST"
      action="?/login"
      use:enhance
      bind:this={formElement}
      class="pin-wrapper"
    >
      <input type="hidden" name="pin" value={fullPin} />
      <div class="login-header">
        <h3>Input PIN Operator</h3>

        {#if form?.message}
          <p class="error-msg">{form.message}</p>
        {/if}
      </div>
      <div class="pin-container">
        {#each pin as _, i}
          <input
            type="text"
            inputmode="numeric"
            maxlength="1"
            bind:value={pin[i]}
            bind:this={inputs[i]}
            oninput={(e) => handleChange(e, i)}
            onkeydown={(e) => handleKeyDown(e, i)}
            onpaste={handlePaste}
            autocomplete="one-time-code"
            class:input-error={form?.message}
          />
        {/each}
      </div>

      <noscript>
        <button type="submit">Login</button>
      </noscript>
    </form>
  {:else}
    <header>
      <h1>Dashboard Operator</h1>
      <form method="POST" action="?/logout" use:enhance>
        <button class="btn-logout">Logout</button>
      </form>
    </header>

    <section class="entry-section">
      <form method="POST" action="?/entry" use:enhance>
        <input
          type="text"
          name="catatan"
          placeholder="Entry data mesin..."
          required
        />
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
  .op-container {
    max-width: 600px;
    margin: 2rem auto;
    font-family: sans-serif;
  }
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #eee;
    padding-bottom: 1rem;
  }
  .btn-logout {
    background: #ff4444;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
  }
  .entry-section {
    margin: 2rem 0;
    padding: 1rem;
    background: #f9f9f9;
  }
  .pin-container {
    display: flex;
    gap: 12px;
    justify-content: center;
  }

  .pin-container input {
    width: 45px;
    height: 55px;
    text-align: center;
    font-size: 28px;
    border: 2px solid #ddd;
    border-radius: 12px;
    outline: none;
    transition: all 0.2s ease;
    -webkit-text-security: disc; /* Bullet display */
  }

  input:focus {
    border-color: #ff3e00;
    box-shadow: 0 0 0 4px rgba(255, 62, 0, 0.1);
    transform: scale(1.05);
  }

  .login-header {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .error-msg {
    color: #ff4444;
    font-size: 0.9rem;
    font-weight: bold;
    background: #ffebeb;
    padding: 0.5rem;
    border-radius: 8px;
    margin-top: 0.5rem;
  }

  /* Beri warna merah pada border jika salah */
  .input-error {
    border-color: #ff4444 !important;
  }

  /* Animasi shake sederhana saat error */
  @keyframes shake {
    0%,
    100% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-5px);
    }
    75% {
      transform: translateX(5px);
    }
  }

  .input-error:focus {
    animation: shake 0.2s ease-in-out 0s 2;
    box-shadow: 0 0 0 4px rgba(255, 68, 68, 0.1);
  }
</style>
