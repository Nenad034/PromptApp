export interface Category {
  id: string;
  name: string;
  children: Category[];
  files: ImportedFile[];
  content: string;
}

export interface ImportedFile {
  id: string;
  name: string;
  content: string;
  size: number;
  isLink?: boolean;
  path?: string;
}
