import type { User } from "@/types";

export const owners: User[] = [
  {
    id: "usr_igor",
    name: "Igor Kraisnik",
    email: "igor@mop.ba",
    initials: "IK",
    role: "Managing Director",
  },
  {
    id: "usr_elma",
    name: "Elma Šemović",
    email: "elma@mop.ba",
    initials: "EŠ",
    role: "Business Development",
  },
  {
    id: "usr_adnan",
    name: "Adnan Ahmethodžić",
    email: "adnan@mop.ba",
    initials: "AA",
    role: "Business Development",
  },
];

export const MARKETING_TEAM_ID = "team_marketing";
export const UNASSIGNED_ID = "unassigned";

export const ownerOptions = [
  ...owners.map((o) => ({ value: o.id, label: o.name })),
  { value: MARKETING_TEAM_ID, label: "Marketing Team" },
  { value: UNASSIGNED_ID, label: "Unassigned" },
];

export function getOwnerName(ownerId: string): string {
  const owner = owners.find((o) => o.id === ownerId);
  if (owner) return owner.name;
  if (ownerId === MARKETING_TEAM_ID) return "Marketing Team";
  if (ownerId === UNASSIGNED_ID) return "Unassigned";
  return "Unknown";
}
