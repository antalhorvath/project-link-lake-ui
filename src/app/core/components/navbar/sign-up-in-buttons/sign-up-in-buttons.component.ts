import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-sign-up-in-buttons',
  standalone: true,
  imports: [],
  templateUrl: './sign-up-in-buttons.component.html',
})
export class SignUpInButtonsComponent {

  @Output()
  onSignUp: EventEmitter<any> = new EventEmitter();

  @Output()
  onSignIn: EventEmitter<any> = new EventEmitter();

  signIn(): void {
    this.onSignIn.next(true);
  }

  signUp(): void {
    this.onSignUp.next(true);
  }
}
