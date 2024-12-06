

export class TaskCreateUpdateRequestDto {
  id?: number;
  taskName: string;
  taskType: string;
  priority: string;
  startDate: Date;
  endDate: Date;
  relatedSubcontractors: number[];
  relatedContacts: number[];
  relatedJobs: number[];
  assignedTeamMembers: number[];
  estimatedDuration: string;
  tags: string;
  description: string;
}
