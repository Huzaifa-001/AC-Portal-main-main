
export interface TeamMemberCreateRequestDto {
    firstName: string;
    lastName?: string | null;
    email: string;
    password: string;
    isSubContractor: boolean;
    accountColor?: string | null;
    pictureUrl?: string | null;
    enableLogin: boolean;
    state: number;
    isTeamMember: boolean;
    timeZone: number;
    businessLocation: number;
}
