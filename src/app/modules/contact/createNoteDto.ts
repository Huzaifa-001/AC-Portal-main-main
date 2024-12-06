export interface createNoteDto {
    note: string;
    typeId: number;
    contactId: number;
}

export interface updateNoteDto {
    note: string;
    typeId: number;
    id: number;
}