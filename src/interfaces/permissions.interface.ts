export interface IPermissionRepository {
  getUserPermissions(userId: string): Promise<string[]>;
}
