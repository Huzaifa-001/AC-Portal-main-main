export interface AccessUser {
    boardId: number;
    accessUserId: number;
    id: number;
    userId: number;
  }
  
  export interface WorkFlowStatus {
    workFlowId: number;
    workFlowStatusId: number;
    statusId: number;
    id: number;
  }
  
  export interface Status {
    name: string;
    sortBy: string;
    sortingOrder: string;
    total: string;
    workFlowStatuses: WorkFlowStatus[];
    boardId: number;
    id: number;
    disabled: boolean;
    items: any[];
  }
  
  export interface Board {
    projectName: string;
    projectType: string;
    projectColor: string;
    backgroundImageUrl: string;
    accessUsers: AccessUser[];
    cardTitle: string;
    statuses: Status[];
    id: number;
    folderId: any
  }