import {Component, OnInit} from '@angular/core';
import {FormFieldComponent} from "../../../shared/components/form-field/form-field.component";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {CustomValidators} from "../../../shared/util/custom.validators";
import {NgClass} from "@angular/common";
import {simpleUuid} from "../../../shared/util/uuid.helper";
import {Store} from "@ngrx/store";
import {LinkState, selectSelectedLink} from "../state/link.reducer";
import {LinkPageActions} from "../state/link.actions";
import {Link} from "../state/link.model";
import {first} from "rxjs";
import {filter} from "rxjs/operators";

@Component({
  selector: 'app-edit-link',
  standalone: true,
  imports: [FormFieldComponent, ReactiveFormsModule, NgClass],
  templateUrl: './edit-link.component.html',
  styleUrl: './edit-link.component.scss'
})
export class EditLinkComponent implements OnInit {

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
    link: ['', {
      validators: [Validators.required, CustomValidators.validUrl],
      updateOn: 'blur'
    }
    ],
    name: ['', Validators.required]
  });

  constructor(private formBuilder: FormBuilder,
              private store: Store<LinkState>) {
  }

  ngOnInit(): void {
    this.initializeFormValues();
  }

  private initializeFormValues() {
    this.store.select(selectSelectedLink)
      .pipe(first(), filter(link => !!link))
      .subscribe((link) => {
        if (link) {
          this.linkForm.get('linkId')?.setValue(link?.linkId);
          this.linkForm.get('link')?.setValue(link?.link);
          this.linkForm.get('name')?.setValue(link?.name);
        }
      });
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
      const form = this.linkForm.value;
      const link: Link = {
        linkId: form.linkId ?? '',
        name: form.name ?? '',
        link: form.link ?? ''
      };
      this.store.dispatch(LinkPageActions.saveLink({link}));
    }
  }
}
