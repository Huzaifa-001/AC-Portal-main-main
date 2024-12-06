
export interface JobDTO {
  id: number | 0
  name: string;
  address1: string;
  address2: string;
  city: string;
  stateId: number;
  faxNo: string;
  mobileNo: string;
  homeNo: string;
  officeNo: string;
  phoneNo: string;
  jobType: string;
  note: string;
  zip: number;
  jobStatusId: number;
  startDate: string;
  endDate: string;
  description: string;
  leadSourceId: number;
  salesRepsentativeId: number;
  lastStatusChangeDate: string;
  primaryContactId: number;
  officeLocationId: number;
  workFlowId: number;
  subContractorId: number;
  relatedContactId: number[];
  teamMememberId: number[];
  jobStatus?: any
  workFlow?: any
  salesRepName? : any
  primaryContactName?: any
  customFieldValues?: any[]
}



