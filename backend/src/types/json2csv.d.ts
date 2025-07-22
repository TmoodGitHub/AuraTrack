declare module 'json2csv' {
  export class Parser<T = any> {
    constructor(
      opts?: Partial<{
        fields: string[];
        delimiter: string;
        eol: string;
        quote: string;
        escapedQuote: string;
        header: boolean;
        withBOM: boolean;
        transforms: Array<(item: any) => any>;
      }>
    );
    parse(input: T[]): string;
  }
}
