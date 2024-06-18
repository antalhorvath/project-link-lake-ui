import {AfterViewInit, Component, EventEmitter, Output} from '@angular/core';
import {Dropdown} from "flowbite";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-user-profile-context',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './user-profile-context.component.html',
})
export class UserProfileContextComponent implements AfterViewInit {

  @Output()
  onSignOut: EventEmitter<any> = new EventEmitter();

  logout(): void {
    this.onSignOut.next(true);
  }

  ngAfterViewInit(): void {
    this.initDropdown();
  }

  private initDropdown(): void {
    const dropdownButton = document.getElementById('user-menu-button');
    const dropdownMenu = document.getElementById('user-dropdown');
    if (dropdownButton && dropdownMenu) {
      new Dropdown(dropdownMenu, dropdownButton);
    }
  }
}
