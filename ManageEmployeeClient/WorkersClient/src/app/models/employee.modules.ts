import { RoleModule } from "./role.modules"

// using System.Text: any.Json.Serialization;

export enum Sex {
    Male=0,
    Female =1
}

export class EmployeeModule {
    firstName!: string
    lastName!: string
    indetity!: string
    startDate!: Date
    birthDate!: Date
    sex!: Sex
    isActive: boolean = false
    roles: RoleModule[] = []
}
  


