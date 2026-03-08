export function getRegionBadgeClass(region: string): string {
  const map: Record<string, string> = {
    'Americas': 'badge-americas',
    'Europe':   'badge-europe',
    'Asia':     'badge-asia',
    'Africa':   'badge-africa',
    'Oceania':  'badge-oceania',
  };
  return map[region] ?? 'badge-default';
}