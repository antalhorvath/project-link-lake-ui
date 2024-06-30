import {
  ChangeDetectorRef,
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';
import {Store} from "@ngrx/store";
import {AppState} from "../../../reducers";
import {ToastMessageComponent} from "../../../shared/components/toast-message/toast-message.component";
import {selectCurrentNotification} from "../../../reducers/root.selectors";
import {filter} from "rxjs/operators";
import {ToastMessageModel} from "../../../shared/components/toast-message/toast-message.model";

@Component({
  selector: 'app-toast-notifications',
  standalone: true,
  imports: [ToastMessageComponent],
  templateUrl: './toast-notifications.component.html'
})
export class ToastNotificationsComponent implements OnInit {

  @ViewChildren(ToastMessageComponent)
  toastMessages!: QueryList<ToastMessageComponent>;

  @ViewChild('container', {read: ViewContainerRef, static: true})
  container!: ViewContainerRef;

  constructor(private store: Store<AppState>,private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.store.select(selectCurrentNotification)
      .pipe(filter(present => !!present))
      .subscribe((toastMessage) => {
        if(toastMessage !== undefined) {
          this.createToastMessage(toastMessage)
        }
      });
  }

  private createToastMessage(toastMessage: ToastMessageModel) {
    const component = this.container.createComponent<ToastMessageComponent>(ToastMessageComponent);
    component.instance.type = toastMessage?.type ?? '';
    component.instance.message = toastMessage?.message ?? '';
    component.instance.onDismiss = () => component.destroy();
  }
}
