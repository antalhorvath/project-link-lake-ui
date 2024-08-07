import {Component, OnInit} from '@angular/core';
import {initFlowbite} from 'flowbite';
import {RouterModule} from "@angular/router";
import {NavbarComponent} from "./core/components/navbar/navbar.component";
import {ToastMessageComponent} from "./shared/components/toast-message/toast-message.component";
import {ToastNotificationsComponent} from "./core/components/toast-notifications/toast-notifications.component";
import {Store} from "@ngrx/store";
import {RootState} from "./reducers";
import {Notification} from "./reducers/root.actions";
import {NotificationModel} from "./shared/models/notification.model";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, NavbarComponent, ToastMessageComponent, ToastNotificationsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {


  constructor(private store: Store<RootState>) {
  }

  ngOnInit(): void {
    initFlowbite();
  }

  pushit() {
    const notification: NotificationModel = {
      type: 'info',
      message: 'asdsadsa'
    };

    this.store.dispatch(Notification({notification}))
  }
}
