import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {Dismiss} from 'flowbite';
import type {DismissOptions} from "flowbite/lib/esm/components/dismiss/types";
import {NgIf} from "@angular/common";
import {simpleUuid} from "../../util/uuid.helper";
import type {InstanceOptions} from "flowbite/lib/esm/dom/types";

@Component({
  selector: 'toast-message',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './toast-message.component.html'
})
export class ToastMessageComponent implements AfterViewInit {

  @ViewChild('toast', {static: true}) toast!: ElementRef<HTMLElement>;
  @ViewChild('close', {static: true}) close!: ElementRef<HTMLElement>;

  @Input()
  message: string = '';

  @Input()
  type: string = '';

  id = simpleUuid();
  toastId: string = `toast-${this.id}`;
  dismissToastId: string = `#${this.toastId}`;
  closeId: string = `close-${this.id}`;

  dismissHandler!: Dismiss;
  onDismiss!: () => void;

  ngAfterViewInit(): void {
    this.initialiseDismissHandler();
    this.scheduleAutoDismiss();
  }

  private initialiseDismissHandler() {
    const dismissOptions: DismissOptions = {
      onHide: (d, e) => {
        this.onDismiss();
      }
    };
    const instanceOptions: InstanceOptions = {
      id: this.toastId,
      override: true
    };
    this.dismissHandler = new Dismiss(this.toast.nativeElement, this.close?.nativeElement, dismissOptions, instanceOptions);
  }

  private scheduleAutoDismiss() {
    setTimeout(() => {
      this.dismissHandler.hide();
    }, 2000);
  }
}
