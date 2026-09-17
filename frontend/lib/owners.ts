/**
 * A problem can be owned by more than one citizen: when government merges duplicate reports,
 * each candidate owner who accepts (and is approved by the original owner) becomes a co-owner
 * with the same rights. The original reporter stays first in the list.
 */

export function ownerNames(citizenName: string, coOwners?: string[]): string[] {
  return [citizenName, ...(coOwners ?? [])].filter(Boolean);
}

export function formatOwners(citizenName: string, coOwners?: string[]): string {
  const names = ownerNames(citizenName, coOwners);
  if (names.length <= 1) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")} & ${names[names.length - 1]}`;
}

export function isOwner(citizenName: string, coOwners: string[] | undefined, viewerName: string): boolean {
  return ownerNames(citizenName, coOwners).includes(viewerName);
}
