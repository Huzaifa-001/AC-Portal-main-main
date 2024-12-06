export interface BaseResponse<T> {
    statusCode: number;
    payload: T;
    message: string;
    status: boolean;
    errors: null;
}

export enum WorkFlowType {
    contact = 1,
    jobs,
    global,
    workOrder
}


export interface Workflow {
    id: any 
    Request_Type?: string
    FormTitle?: string
    workFlowName: string;
    isVisible: boolean;
    isAccessable: boolean;
    statuses: Status[];
    workFlowType: number;
  }
  
  export interface Status {
    id: number;
    statusName: string;
    workFlowId?: any
  }
  