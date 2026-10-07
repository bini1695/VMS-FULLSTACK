/**
 * Convert an array of objects to a CSV string and trigger a download.
 *
 * @param {Array<Object>} rows        - Data rows (array of flat objects)
 * @param {Array<Object>} columns     - [{ key, label }] — defines order + headers
 * @param {string}        filename    - Output filename (without extension)
 * @param {Object}        [options]   - { delimiter = ',', includeDate = true }
 */
export function exportToCsv(rows, columns, filename = 'export', options = {}) {
  const { delimiter = ',', includeDate = true } = options;

  if (!Array.isArray(rows) || rows.length === 0) {
    console.warn('exportToCsv: no rows to export');
    return;
  }

  // Build header row from column labels
  const headers = columns.map((c) => escapeCsv(c.label ?? c.key, delimiter));

  // Build body rows, respecting column order and safely escaping values
  const body = rows.map((row) =>
    columns.map((c) => {
      const value = row[c.key];
      return escapeCsv(formatValue(value), delimiter);
    })
  );

  // Compose CSV
  const csvContent = [headers, ...body]
    .map((line) => line.join(delimiter))
    .join('\r\n');

  // Add UTF-8 BOM so Excel opens it correctly
  const blob = new Blob(['\uFEFF' + csvContent], {
    type: 'text/csv;charset=utf-8;',
  });

  // Filename: name-YYYY-MM-DD.csv
  const dateSuffix = includeDate
    ? '-' + new Date().toISOString().slice(0, 10)
    : '';
  const finalName = `${filename}${dateSuffix}.csv`;

  // Trigger download
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = finalName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return finalName;
}

/* ---------------- helpers ---------------- */

function escapeCsv(value, delimiter = ',') {
  const str = String(value ?? '');
  const needsQuotes =
    str.includes(delimiter) ||
    str.includes('"') ||
    str.includes('\n') ||
    str.includes('\r');

  if (!needsQuotes) return str;
  return `"${str.replace(/"/g, '""')}"`;
}

function formatValue(value) {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'object') return JSON.stringify(value);
  return value;
}