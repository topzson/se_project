import { TreatmentInterface } from "./Treatment";
import { UserInterface } from "./User";
import { MedicalProductInterface } from "./MedicalProduct";

export interface MedRecordInterface{
    ID :number,
    Amount: number,

    TreatmentID: number,
    Treatment: TreatmentInterface,

    UserPharmacistID : number,
    UserPharmacist: UserInterface

    MedicalProductID: number,
    MedicalProduct: MedicalProductInterface,
}