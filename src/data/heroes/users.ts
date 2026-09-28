import type { Workspace, User } from "@/types";

export const workspace: Workspace = {
  id: "ws_mop",
  name: "Ministry of Programming",
};

export const users: User[] = [
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
