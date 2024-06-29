import {Component} from '@angular/core';
import {FormFieldComponent} from "../../../shared/components/form-field/form-field.component";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {CustomValidators} from "../../../shared/util/custom.validators";
import {NgClass} from "@angular/common";
import {simpleUuid} from "../../../shared/util/uuid.helper";
import {Store} from "@ngrx/store";
import {LinkState} from "../state/link.reducer";
import {LinkPageActions} from "../state/link.actions";
import {Link} from "../state/link.model";


@Component({
  selector: 'app-edit-link',
  standalone: true,
  imports: [FormFieldComponent, ReactiveFormsModule, NgClass],
  templateUrl: './edit-link.component.html',
  styleUrl: './edit-link.component.scss'
})
export class EditLinkComponent {

  genericErrorMessages: { [index: string]: string } = {
    required: 'Required'
  }

  fieldErrorMessages: { [index: string]: { [index: string]: string } } = {
    link: {
      validUrl: 'Link must be a valid URL'
    }
  }

  linkForm = this.formBuilder.group({
    linkId: [simpleUuid()],
    name: ['', Validators.required],
    link: ['', {
      validators: [Validators.required, CustomValidators.validUrl],
      updateOn: 'blur'
    }
    ]
  });

  constructor(private formBuilder: FormBuilder,
              private store: Store<LinkState>) {
  }

  hasError(fieldName: string): boolean {
    const field = this.linkForm.get(fieldName);
    if (field) {
      return field.invalid && (field.touched || field.dirty);
    } else {
      return false;
    }
  }

  getErrorMessage(fieldName: string): string {
    const field = this.linkForm.get(fieldName);
    if (field?.errors) {
      const validationError = Object.keys(field.errors)[0];
      return this.fieldErrorMessages[fieldName]?.[validationError] ?? this.genericErrorMessages[validationError];
    } else {
      return 'Invalid input';
    }
  }

  onSubmit() {
    if (this.linkForm.valid) {
      const link = this.linkForm.value;
      const linkToAdd: Link = {
        linkId: link.linkId ?? '',
        name: link.name ?? '',
        link: link.link ?? ''
      };
      this.store.dispatch(LinkPageActions.addLink({link: linkToAdd}));
    }
  }
}
