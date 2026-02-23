// src/lib/hooks/media-query.svelte.ts
export function useMediaQuery(query: string) {
    let matches = $state(false);

    $effect(() => {
        const media = window.matchMedia(query);
        matches = media.matches;

        const listener = (e: MediaQueryListEvent) => (matches = e.matches);
        media.addEventListener("change", listener);
        return () => media.removeEventListener("change", listener);
    });

    return {
        get value() { return matches; }
    };
}