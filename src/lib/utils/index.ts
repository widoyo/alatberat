// place files you want to import through the `$lib` alias in this folder.
export function getDuration(start: string | Date, end: string | Date | null) {
    if (!end) return "";
    
    const d1 = new Date(start);
    const d2 = new Date(end);
    
    let months = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
    let days = d2.getDate() - d1.getDate();

    // Penyesuaian jika hari bernilai negatif
    if (days < 0) {
        months -= 1;
        const lastMonth = new Date(d2.getFullYear(), d2.getMonth(), 0);
        days += lastMonth.getDate();
    }

    const parts = [];
    if (months > 0) parts.push(`${months} bln`);
    if (days > 0) parts.push(`${days} hari`);
    
    return parts.join(" - ");
}