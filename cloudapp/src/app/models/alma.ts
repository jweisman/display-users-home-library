export interface CodeTable {
  name: string;
  description: string;
  language: {
    desc: string;
    valiue: string;
  };
  row: CodeTableRow[]
}

export interface CodeTableRow {
  code: string;
  description: string;
  default: boolean;
  enabled: boolean;
}