export interface CreateBusinessHoursDto {
    day?: string | null;
    officeStartTime?: string | null;
    breakStartTime?: string | null;
    breakEndTime?: string | null;
    officeEndTime?: string | null;
    officeLocationId: number;
}
