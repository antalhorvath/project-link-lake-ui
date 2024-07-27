import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'badge',
  standalone: true,
  imports: [],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss'
})
export class BadgeComponent {

  @Input()
  text!: string;

  @Output()
  removed: EventEmitter<any> = new EventEmitter<any>();

  remove() {
    this.removed.emit(true);
  }
}
