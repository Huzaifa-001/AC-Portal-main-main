import { CreatePhoneNumbersDto } from "./CreatePhoneNumbersDto";

export interface CreateContactDto {
    id?:number;
    firstName: string;
    lastName: string;
    company: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    zipCode?: number;
    email?: string;
    website?: string;
    faxNo?: string;
    displayName?: string;
    startDate?: Date;
    endDate?: Date;
    discription?: string;
    file?: any;
    sourceId?: number;
    stateId?: number;
    salesRepId?: number;
    subContractorId?: number;
    teamMembers?: number[];
    officeLocationId?: number;
    workFlowId?: number;
    statusId?: number;
    relatedContacts?: number[];
    tags?: string[];
    note?: CreateNotesDto;
    phoneNumbers?: CreatePhoneNumbersDto[];
    customFields?: CreateCustomFieldsDto[];
    customFieldValues: any
  }
  
  export interface CreateNotesDto {
    text: string;
  }
  
  export interface CreateCustomFieldsDto {
    name: string;
    value: string;
  }
  




  
  