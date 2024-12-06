export interface CreateEvetDto {
    eventType?: string;
    eventPriority?: string;
    eventName?: string;
    eventStatus?: string;
    startDate?: Date;
    endDate?: Date;
    estimatedDuration?: string;
    description?: string;
    tags?: string;
    lastStatusChangeDate?: Date;
    jobId?: number;
    id?: number;
}

export interface EventDTO {
    eventType: string;
    eventPriority: string;
    eventName: string;
    eventStatus: string;
    startDate: string;
    endDate: string;
    estimatedDuration: string;
    description: string;
    tags: string;
    lastStatusChangeDate: string;
    jobId: number;
    id?: any
  }
  