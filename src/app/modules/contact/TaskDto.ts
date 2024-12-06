export class TaskDto {
  id: number;
  taskName: string;
  taskType: string;
  status: string;
  priority: string;
  startDate: Date;
  endDate: Date;
  relatedSubcontractors: keyValue[]; // You can replace 'any' with a more specific type if needed
  relatedContacts: keyValue[];
  relatedJobs: keyValue[];
  relatedTeamMembers: keyValue[];
  estimatedDuration: string;
  tags: string;
  description: string;
}

export class keyValue {
  id: number;
  name: string;
}



