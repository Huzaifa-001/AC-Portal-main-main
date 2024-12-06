import { EventEmitter, Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AppConfig } from '../app-config';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from 'angular-web-storage';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  refreshNotifications = new EventEmitter<void>();
  token: string;
  private unreadCountSubject = new BehaviorSubject<number>(0); // BehaviorSubject for unread count
  private audio = new Audio('../../../assets/sounds/message-pop-alert.mp3');

  constructor(private afMessaging: AngularFireMessaging, private http: HttpClient,private accountService: AccountService,) {
    //this.requestPermission()
    this.fetchUnreadCount()
    this.receiveMessage()
  }

  requestNotificationsUpdate() {
    this.refreshNotifications.emit();
  }
  
  
  requestPermission() {
    this.afMessaging.requestToken.subscribe(
      (token) => {
        this.token = token
        this.addDeviceId(token)
        console.log(token);
      },
      (error) => {
        console.error('Unable to get permission to notify.', error);
      }
    );
  }

  private addDeviceId(deviceId: string) {
    const user = this.accountService.getUser()
    if (user && user.token && deviceId) {
      let request = {
        token: user.token,
        deviceId: deviceId
      }
      this.http.post(AppConfig.auth.AddUserDeviceId, request)
        .subscribe(
          response => console.log('Device ID added successfully', response),
          error => console.error('Error adding device ID', error)
        );

    }
  }

  private updateDeviceId(deviceId: string) {
    const user = this.accountService.getUser()
    if (user && user.token && deviceId) {
      let request = {
        token: user.token,
        deviceId: deviceId
      }
      this.http.put(AppConfig.auth.UpdateUserDeviceId, request)
        .subscribe(
          response => console.log('Device ID updated successfully', response),
          error => console.error('Error updating device ID', error)
        );
    }
  }

  getToken(): string | null {
    return this.token;
  }

  receiveMessage() {
    this.afMessaging.messages.subscribe(
      (payload) => {
        console.log("Message received. ", payload);
        if (payload && payload.data && payload.data['UnreadCount']) {
          const unreadCount = parseInt(payload.data['UnreadCount'], 10);
          this.updateUnreadCount(unreadCount);
          this.playNotificationSound()
        }
        // this.currentMessage.next(payload);
      }
    );
  }

  playNotificationSound() {
    this.audio.play().catch(error => {
    });
  }

  updateUnreadCount(count: number) {
    this.unreadCountSubject.next(count);
  }

  getUnreadCount(): Observable<number> {
    return this.unreadCountSubject.asObservable();
  }

  sendNotification(notification: any): Observable<any> {
    return this.http.post(AppConfig.Notification.Send, notification);
  }

  getAllNotifications(): Observable<any> {
    return this.http.get(AppConfig.Notification.GetAll);
  }

  fetchUnreadCount(): void {
    this.http.get<any>(AppConfig.Notification.GetUnreadCount)
      .pipe(
        tap(response => {
          this.updateUnreadCount(response.data.unreadCount);
        })
      )
      .subscribe();
  }

  getNotificationById(id: string): Observable<any> {
    return this.http.get(AppConfig.Notification.GetById(id));
  }

  markNotificationAsRead(id: string): Observable<any> {
    return this.http.put(AppConfig.Notification.MarkAsRead(id), {})
      .pipe(
        tap(() => this.fetchUnreadCount()) // Update unread count after marking as read
      );
  }

  markAllNotificationsAsRead(): Observable<any> {
    return this.http.patch(AppConfig.Notification.MarkAllAsRead, {})
      .pipe(
        tap(() => this.fetchUnreadCount()) // Update unread count after marking all as read
      );
  }

  deleteNotification(id: string): Observable<any> {
    return this.http.delete(AppConfig.Notification.Delete(id))
      .pipe(
        tap(() => this.fetchUnreadCount()) // Update unread count after deletion
      );
  }

  deleteAllNotifications(): Observable<any> {
    return this.http.delete(AppConfig.Notification.DeleteAll)
      .pipe(
        tap(() => this.fetchUnreadCount()) // Update unread count after deletion
      );
  }
}
