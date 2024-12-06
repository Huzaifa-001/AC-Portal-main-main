
export interface CreateOfficeLocationDto {
    officeLocationName: string;
    color?: string | null;
    addressLine1: string;
    addressLine2?: string | null;
    city: string;
    zipCode?: number | null;
    phoneNumber?: string | null;
    logoUrl?: string | null;
    stateId: number;
    timeZoneId: number;
}
