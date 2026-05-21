import { mockChallenges } from "@/lib/mock-data";
import type { Challenge } from "@/lib/types";

export async function getChallenges(): Promise<Challenge[]> {
  return [...mockChallenges].sort((a, b) => {
    const order = { active: 0, upcoming: 1, ended: 2 };
    return order[a.status] - order[b.status];
  });
}
