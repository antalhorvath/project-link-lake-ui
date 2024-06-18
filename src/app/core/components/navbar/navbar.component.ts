import {Component} from '@angular/core';
import {MobileHamburgerMenuComponent} from "./mobile-hamburger-menu/mobile-hamburger-menu.component";
import {UserProfileContextComponent} from "./user-profile-context/user-profile-context.component";
import {SignUpInButtonsComponent} from "./sign-up-in-buttons/sign-up-in-buttons.component";
import {MenuItemsComponent} from "./menu-items/menu-items.component";
import {map, Observable} from "rxjs";
import {AsyncPipe, NgIf} from "@angular/common";
import {AuthService} from "@auth0/auth0-angular";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MobileHamburgerMenuComponent,
    UserProfileContextComponent,
    SignUpInButtonsComponent,
    MenuItemsComponent,
    AsyncPipe,
    NgIf
  ],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {

  isSignedIn: Observable<boolean> = this.auth.isAuthenticated$;
  isAnonymous = this.isSignedIn.pipe(map(v => !v));

  constructor(public auth: AuthService) {
  }

  signIn() {
    this.auth.loginWithRedirect();
  }

  signOut() {
    this.auth.logout();
  }
}
