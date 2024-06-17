import {Component} from '@angular/core';
import {MobileHamburgerMenuComponent} from "./mobile-hamburger-menu/mobile-hamburger-menu.component";
import {UserProfileContextComponent} from "./user-profile-context/user-profile-context.component";
import {SignUpInButtonsComponent} from "./sign-up-in-buttons/sign-up-in-buttons.component";
import {MenuItemsComponent} from "./menu-items/menu-items.component";
import {BehaviorSubject, map} from "rxjs";
import {AsyncPipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MobileHamburgerMenuComponent,
    UserProfileContextComponent,
    SignUpInButtonsComponent,
    MenuItemsComponent,
    AsyncPipe,
    NgIf,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  isSignedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isAnonymous = this.isSignedIn.pipe(map(v => !v));

  signIn() {
    this.isSignedIn.next(true);
  }

  signOut() {
    this.isSignedIn.next(false);
  }
}
