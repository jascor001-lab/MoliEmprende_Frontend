export type PanelRole = "admin" | "user";

export interface PanelUser {
  id: string;
  username: string;
  passwordHash: string;
  role: PanelRole;
  fullName: string;
  createdAt: string;
  active: boolean;
}

export type PublicPanelUser = Omit<PanelUser, "passwordHash">;
