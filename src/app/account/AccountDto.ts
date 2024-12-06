export interface RegisterDto {
    firstName: string,
    lastName: string,
    email: string,
    companyName: string,
    password: string,
    confirmPassword?: string
}