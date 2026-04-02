export async function loadFixtureModule<T>(path: string): Promise<T> {
  const mod = (await import(path)) as { default?: T };
  return (mod.default ?? mod) as T;
}
