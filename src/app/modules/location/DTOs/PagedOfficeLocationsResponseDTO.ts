export interface PagedOfficeLocationsResponseDTO {
    statusCode: number;
    payload: OfficeLocationDTO[];
    message: string;
    status: boolean;
    pageIndex: number;
    pageSize: number;
    count: number;
}

export interface OfficeLocationDTO {
    id: number;
    officeLocationName: string;
    color: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    zipCode: number;
    phoneNumber: string;
    logoUrl: string;
    states: any; // Update with the actual type
    timeZone: any; // Update with the actual type
    bussinessHours: any[]; // Update with the actual type
  }