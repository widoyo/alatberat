import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// src/lib/utils.ts

export function generateWaLink(noHp: string | null, nama: string, pin: string) {
    if (!noHp) return "#"; // Proteksi jika no HP kosong

    const baseUrl = "https://wa.me/";
    // Membersihkan karakter non-angka (seperti + atau spasi)
    const cleanNumber = noHp.replace(/[^0-9]/g, '');
    
    const pesan = `Halo ${nama}, ini adalah PIN akses Anda: *${pin}*.\n\nKlik tautan ini untuk login otomatis:\nhttps://app.anda/op/login?x=${pin}`;
    
    return `${baseUrl}${cleanNumber}?text=${encodeURIComponent(pesan)}`;
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
