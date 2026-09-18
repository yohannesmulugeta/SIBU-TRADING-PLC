const base = import.meta.env.BASE_URL.replace(/\/$/, "");

export function withBase(pathname: string): string {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${base}${normalized}`;
}
