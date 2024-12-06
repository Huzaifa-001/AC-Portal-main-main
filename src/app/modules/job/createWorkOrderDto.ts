export interface createWorkOrderDto {
    id?: number;
    name: string;
    workflowId: number;
    workOrderStatus: number;
    teamMemberId: number[];
    subContractorId: number[];
    workOrderPriority: string;
    jobId: number;
    startDate: string;
    dueDate: string;
    lineItems: LineItem[];
    notes: Note[];
    lastStatusChangeDate: string;
    contactId: number;
    customFieldValues:any
  }
  
  export interface LineItem {
    id?: number;
    name: string;
    description: string;
    quantity: number;
  }
  
  export interface Note {
    id?: number;
    type: string;
    content: string;
    jobId?: number;
    workOrderId?: number;
    attachments: Attachment[];
  }
  
  export interface Attachment {
    id?: number;
    filePath: string;
  }
  