export enum Roles
{
    Manager,
    Teacher,
    Supervisor,
    Secretary 
}

export class RoleModule {
    [x: string]: any; 
    public roleId!: number;
    public isAdministrative!: boolean;
    public startDate!: Date
}
export class Role{
    public id!: number;
    public  Name!: string;
}