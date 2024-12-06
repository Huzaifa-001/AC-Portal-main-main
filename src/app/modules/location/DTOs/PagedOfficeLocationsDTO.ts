
export interface PagedOfficeLocationsDTO {
    pageIndex: number;
    pageSize: number;
    officeLocationId?: number;
    sort?: string;
    search?: string;
}
