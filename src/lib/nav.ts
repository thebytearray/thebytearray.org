const trimSlash = (path: string) => (path.length > 1 ? path.replace(/\/+$/, "") : path);

/** Whether a nav item should be marked current for the given pathname (section match). */
export function isActivePath(pathname: string, href: string): boolean {
  const current = trimSlash(pathname);
  const target = trimSlash(href);

  if (target === "/") return current === "/";

  return current === target || current.startsWith(`${target}/`);
}
