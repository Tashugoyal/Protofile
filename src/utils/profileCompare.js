export function profilesEqual(a, b) {
  return JSON.stringify(a ?? {}) === JSON.stringify(b ?? {});
}
