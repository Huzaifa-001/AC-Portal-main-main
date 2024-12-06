export interface TeamMemberCreateRequestDto {
    id?: number; // Optional for update cases
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
    isSubContractor?: boolean;
    accountColor?: string;
    pictureUrl?: string;
    enableLogin?: boolean;
    state: number;
    isTeamMember?: boolean;
    timeZone: number;
    businessLocation: number;
  }
  