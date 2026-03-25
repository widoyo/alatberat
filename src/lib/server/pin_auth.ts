import type { Cookies } from '@sveltejs/kit';
import { operator } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import { db } from './db';

const COOKIE_NAME = 'op_auth';
const COOKIE_MAX_AGE = 20 * 60; // 20 minutes in seconds

// User database - in production, this would come from a real database
export const users = [
    { id: 4321, pin: '1234' },
    { id: 6789, pin: '9876' },
    { id: 2468, pin: '5678' },
    { id: 1357, pin: '4321' }
];

// Store user ID in cookie
export function setAuthCookie(cookies: Cookies, userId: number): void {
    cookies.set(COOKIE_NAME, userId.toString(), {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: COOKIE_MAX_AGE // 20 minutes
    });
}

export async function getAuthenticatedUser(cookies: Cookies): Promise<{} | null> {
    const userId = cookies.get(COOKIE_NAME);
    console.log("getAuthenticatedUser - userId from cookie:", userId);
    if (userId === undefined || userId === null) return null;
    
    const user = await db.select()
        .from(operator)
        .where(eq(sql<string>`substr(${operator.whatsapp}, -4)`, parseInt(userId)))
        .limit(1);
    return user || null;
}

export async function validatePinAndGetUser(pin: string): Promise<{} | null> {
    const user = await db.select()
        .from(operator)
        .where(eq(sql<string>`substr(${operator.whatsapp}, -4)`, parseInt(pin)))
        .limit(1);
    return user || null;
}

export function clearAuthCookie(cookies: Cookies): void {
    console.log("Clearing auth cookie: ", COOKIE_NAME);
    cookies.delete(COOKIE_NAME, { path: '/' });
}