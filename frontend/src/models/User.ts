import { RoleInterface } from "./Role";

export interface UserInterface{
    ID: number,
    Name: string,
    Username: string,
    Password  : string,

    RoleID:number,
    Role: RoleInterface,
}