export interface CreatePhoneNumbersDto {
    phoneNumber: string;
    typeId: bigint;
}

export interface addPhoneNumber {
    phoneNumber: string;
    typeId: number;
    contactId: number
}

export interface updatePhoneNumber {
    phoneNumber: string;
    typeId: number;
    id: number
}

export interface addRelatedContact {
    contactId: number;
    relatedContactIds: number[];
}

export interface updateRelatedContact {
    contactId: number;
    relatedContactId: number;
    id: number;
}