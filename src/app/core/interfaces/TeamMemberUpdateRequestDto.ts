
export interface TeamMemberUpdateRequestDto {
    id: number;
    firstName: string;
    lastName?: string | null;
    isSubContractor: boolean;
    accountColor?: string | null;
    pictureUrl?: string | null;
    enableLogin: boolean;
    state: number;
    isTeamMember: boolean;
    timeZone: number;
    businessLocation: number;
}
