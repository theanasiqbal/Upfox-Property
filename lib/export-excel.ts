import * as XLSX from 'xlsx';

export interface ExcelColumn {
    key: string;
    label: string;
}

/**
 * Generates and downloads an Excel .xlsx file from an array of row objects.
 * @param rows    Array of plain objects (each key corresponds to a column key)
 * @param columns Column definitions: { key, label }
 * @param filename Base filename (without extension), e.g. "enquiries-2025-01-01"
 */
export function exportToExcel(
    rows: Record<string, unknown>[],
    columns: ExcelColumn[],
    filename: string
): void {
    // Build worksheet data: first row is the header
    const header = columns.map(c => c.label);
    const data = rows.map(row => columns.map(c => row[c.key] ?? ''));

    const ws = XLSX.utils.aoa_to_sheet([header, ...data]);

    // Auto-width for columns
    const colWidths = columns.map((col, i) => {
        const maxLen = Math.max(
            col.label.length,
            ...data.map(row => String(row[i] ?? '').length)
        );
        return { wch: Math.min(maxLen + 2, 50) };
    });
    ws['!cols'] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Export');
    XLSX.writeFile(wb, `${filename}.xlsx`);
}

export interface ExportFilters {
    status: string;   // 'all' or specific value
    dateFrom: string; // YYYY-MM-DD or ''
    dateTo: string;   // YYYY-MM-DD or ''
}
