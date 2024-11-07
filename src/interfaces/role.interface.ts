export interface IRoleRepository {
  getUserRoles(userId: string): Promise<string[]>;
}
