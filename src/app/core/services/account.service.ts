import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { BussinessHoursDto } from '../../account/BussinessHoursDto';
import { OfficeLocationDto } from '../../account/OfficeLocationDto';
import { AppConfig } from '../app-config';
import { LoginDto, RegisterDto, UserDTO } from '../interfaces';




@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly USER_KEY = AppConfig.USER_KEY;
  private photoUrlSubject = new BehaviorSubject<string | null>(null);

  updateProfile(formData: FormData) {
    return this.http.post<any>(AppConfig.auth.updateUserInfo, formData);
  }

  updateNotificationSettings(data: any[]){
    return this.http.post<any>(AppConfig.auth.UpdateNotificationSettings, data);
  }

  getNotificationSettings(){
    return this.http.post<any>(AppConfig.auth.getNotificationSettings, {});
  }

  constructor(private http: HttpClient, private router: Router) {
    const user = this.getUser();
    if (user && user.photoUrl) {
      this.photoUrlSubject.next(user.photoUrl);
    }
  }

  login(loginUser: LoginDto): Observable<any> {
    return this.http.post<any>(AppConfig.auth.login, loginUser);
  }

  register(register: RegisterDto): Observable<any> {
    return this.http.post<any>(AppConfig.auth.register, register);
  }

  getUserProfile(): Observable<any> {
    return this.http.get<any>(AppConfig.auth.getUserProfile);
  }

  forgotPassword(forgotPasswordDto: any): Observable<any> {
    return this.http.post<any>(`${AppConfig.auth.forgotpassword}`, forgotPasswordDto);
  }

  changePassword(data: any): Observable<any> {
    return this.http.post<any>(`${AppConfig.auth.changePassword}`, data);
  }
  getPermissions(): Observable<any> {
    return this.http.get<any>(`${AppConfig.auth.getPermissions}`);
  }

  getNotificationMethods(): Observable<any> {
    return this.http.get<any>(`${AppConfig.auth.notificationMethods}`);
  }

  resetPassword(email: string, token: string, newPassword: string): Observable<any> {
    const payload = {
      email: email,
      token: token,
      newPassword: newPassword
    }
    return this.http.post<any>(`${AppConfig.auth.resetpassword}`, payload);
  }

  logout(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.clearUser()
    this.router.navigate(['/login']);
  }


  setUser(user: UserDTO, rememberMe: boolean): void {
    if (rememberMe) {
      sessionStorage.removeItem(this.USER_KEY);
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.USER_KEY);
      sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
    this.photoUrlSubject.next(user.photoUrl || null);
  }

  // Get user details from local or session storage
  getUser(): UserDTO | null {
    const userData = localStorage.getItem(this.USER_KEY);
    if (userData) {
      return JSON.parse(userData) as UserDTO;
    }
    const sessionUserData = sessionStorage.getItem(this.USER_KEY);
    return sessionUserData ? JSON.parse(sessionUserData) as UserDTO : null;
  }

  clearUser(): void {
    localStorage.removeItem(this.USER_KEY);
    sessionStorage.removeItem(this.USER_KEY);
    this.photoUrlSubject.next(null);
  }

  // Get the user name
  getUserName(): string | null {
    const user = this.getUser();
    return user ? user.userName : null;
  }

  isLoggedIn(): boolean {
    return !!this.getUser() && this.isTokenValid(this.getUser().token);
  }

  getPhotoUrl(): Observable<string | null> {
    return this.photoUrlSubject.asObservable();
  }

  getToken(): string | null {
    const user = this.getUser();
    return user ? user.token : null;
  }
  
  // Update the photo URL and store it in local/session storage
  updatePhotoUrl(newPhotoUrl: string): void {
    const user = this.getUser();
    if (user) {
      user.photoUrl = newPhotoUrl;
      this.setUser(user, this.isRememberMe()); // Use the same storage method as before
      this.photoUrlSubject.next(newPhotoUrl);
    }
  }

  private isRememberMe(): boolean {
    return !!localStorage.getItem(this.USER_KEY);
  }

  private isTokenValid(token: string): boolean {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const expiry = decodedToken.exp * 1000;
      return Date.now() < expiry;
    } catch (e) {
      return false;
    }
  }

}
