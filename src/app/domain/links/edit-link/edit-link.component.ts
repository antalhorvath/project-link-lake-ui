import {Component, OnInit} from '@angular/core';
import {FormFieldComponent} from "../../../shared/components/form-field/form-field.component";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CustomValidators} from "../../../shared/util/custom.validators";
import {NgClass} from "@angular/common";
import {simpleUuid} from "../../../shared/util/uuid.helper";
import {Store} from "@ngrx/store";
import {LinkState, selectSelectedLink} from "../state/link.reducer";
import {Link} from "../state/link.model";
import {first} from "rxjs";
import {filter} from "rxjs/operators";
import {
  AutocompleteComponent,
  AutocompleteOption
} from "../../../shared/components/autocomplete/autocomplete.component";
import {LinkPageActions} from "../state/link.actions";

@Component({
  selector: 'app-edit-link',
  standalone: true,
  imports: [FormFieldComponent, ReactiveFormsModule, NgClass, AutocompleteComponent, FormsModule],
  templateUrl: './edit-link.component.html',
  styleUrl: './edit-link.component.scss'
})
export class EditLinkComponent implements OnInit {

  options: AutocompleteOption[] = [];
  mockOptions: AutocompleteOption[] = [
    {
      id: '91f8fc12e477499e9694191c241947f9',
      text: 'java'
    },
    {
      id: '7481f674e080451ea6ecdeff47b3e8a0',
      text: 'spring'
    },
    {
      id: 'b9489a2ac5524045ad9c9e8d8679f922',
      text: 'architecture'
    },
    {
      id: '77ca7eeb65f34f1a93234b46a2cb6045',
      text: 'javascript'
    },
    {
      id: 'f79981825dba4a52898e6c7ef3b2e13b',
      text: 'ddd'
    },
    {
      id: '8020533d80094ef2b94df5207be6963c',
      text: 'sql'
    },
    {
      id: '4b0f77af6871468794bc27e070f69a8f',
      text: 'unit testing'
    },
    {
      id: '3281d27741254486872da7b8cb53b907',
      text: 'angular'
    }
  ];

  genericErrorMessages: { [index: string]: string } = {
    required: 'Required'
  }

  fieldErrorMessages: { [index: string]: { [index: string]: string } } = {
    link: {
      validUrl: 'Link must be a valid URL'
    }
  }

  tags: AutocompleteOption[] = [];

  linkForm = this.formBuilder.group({
    linkId: [simpleUuid()],
    link: ['', {
      validators: [Validators.required, CustomValidators.validUrl],
      updateOn: 'blur'
    }
    ],
    name: ['', Validators.required],
    tags: [this.tags]
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
        link: form.link ?? '',
        tags: (form.tags ?? []).map(option => ({tagId: option.id, name: option.text}))
      };
      this.store.dispatch(LinkPageActions.saveLink({link}));
    }
  }

  onCompleteRequest(textToComplete: string) {
    this.options = this.mockOptions
      .filter(op => op.text.toLowerCase().includes(textToComplete.toLowerCase()));
  }
}
