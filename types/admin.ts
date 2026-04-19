export type AdminRole = "super-admin" | "editor" | "viewer";

export interface AdminNavItem {
  label: string;
  href: string;
  description: string;
}

export interface AdminScaffoldPage {
  title: string;
  description: string;
  nextSteps: string[];
}
