import { ScreeningInterface } from "./Screening";

export interface TreatmentInterface{
    ID: number,
    ToothNumber: number,
    Date: Date,
    PrescriptionRaw  : string,
	PrescriptionNote : string,
    ScreeningID: number,
    Screening: ScreeningInterface,
}