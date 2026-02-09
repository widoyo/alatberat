// scripts/reset-pw.ts
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { hash } from "@node-rs/argon2";
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { users } from "../src/lib/server/db/schema";
import { eq } from "drizzle-orm";

dotenv.config({ path: resolve(process.cwd(), '.env') });
const connectionString = process.env.DATABASE_URL; 

if (!connectionString) {
    throw new Error("DATABASE_URL tidak ditemukan di .env");
}

const db = drizzle(connectionString);

async function reset() {
    // Mengambil argumen dari terminal: npx tsx script.ts [username] [password]
    const username = process.argv[2];
    const newPassword = process.argv[3];

    if (!username || !newPassword) {
        console.error("❌ Error: Gunakan format -> npx tsx scripts/reset-pw.ts [username] [password]");
        process.exit(1);
    }

    try {
        console.log(`\n🔄 Sedang memproses reset untuk user: ${username}...`);
        
        const passwordHash = await hash(newPassword);

        const result = await db.update(users)
            .set({ passwordHash })
            .where(eq(users.username, username))
            .returning({ updatedId: users.id });

        if (result.length === 0) {
            console.error("⚠️  Gagal: User tidak ditemukan di database.");
        } else {
            console.log(`✅ Sukses! Password untuk ID: ${result[0].updatedId} telah diperbarui.`);
        }
    } catch (error) {
        console.error("❌ Terjadi kesalahan:", error);
    } finally {
        process.exit(0);
    }
}

reset();