import { PatientInterface } from "./Patient";

export interface ScreeningInterface {
    ID: number, 
    Illnesses: string,
    Datail: string,
    Queue: string,
    PatientID: number,
    Patient: PatientInterface,
}