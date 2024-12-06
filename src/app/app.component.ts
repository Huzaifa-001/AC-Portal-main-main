import { Component } from '@angular/core';
import { LoadingService } from './core/services/loading.service';
import { delay } from 'rxjs';
import { NotificationService } from './core/services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Prime';
  loading: boolean = false;

  constructor(private _loading: LoadingService, private _noti: NotificationService) {
    this._noti.requestPermission()
    this.listenToLoading();
  }

  /**
 * Listen to the loadingSub property in the LoadingService class. This drives the
 * display of the loading spinner.
 */
  listenToLoading(): void {
    this._loading.loadingSub
      .pipe(delay(0)) // This prevents a ExpressionChangedAfterItHasBeenCheckedError for subsequent requests
      .subscribe((loading) => {
        this.loading = loading;
      });
  }
}
