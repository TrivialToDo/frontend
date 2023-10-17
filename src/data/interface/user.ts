export interface User {
  userId: string;
  nickname?: string;
  userType: "user" | "admin";
}

export interface UserDetail extends User {
  // to be added
}

export interface Self {
  user: User;
  jwt: string;
}
