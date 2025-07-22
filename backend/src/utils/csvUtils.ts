import { Parser } from 'json2csv';

/**
 * Convert an array of objects to a CSV string.
 *
 * @param data - Array of objects
 * @param fields - Field definitions to include in CSV
 * @returns CSV string
 */
export function convertToCSV(data: any[], fields: string[]): string {
  const parser = new Parser({ fields });
  return parser.parse(data);
}
