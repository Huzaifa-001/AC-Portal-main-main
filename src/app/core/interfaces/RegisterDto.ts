
export interface RegisterDto {
    firstName: string;
    lastName?: string | null;
    email: string;
    companyName: string;
    password: string;
}


// user.dto.ts
export interface UserDTO {
    userName: string;
    token: string;
    photoUrl: string;
    firstName: string;
    lastName: string;
    mobile: string;
    userId: number;
  }
  