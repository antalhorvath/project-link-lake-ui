import {Component, OnInit} from '@angular/core';
import {FormFieldComponent} from "../../../shared/components/form-field/form-field.component";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CustomValidators} from "../../../shared/util/custom.validators";
import {AsyncPipe, NgClass} from "@angular/common";
import {simpleUuid} from "../../../shared/util/uuid.helper";
import {Store} from "@ngrx/store";
import {LinkState, selectExistingTags, selectSelectedLink} from "../state/link.reducer";
import {Link} from "../state/link.model";
import {first, map, Observable, of} from "rxjs";
import {filter} from "rxjs/operators";
import {
  AutocompleteComponent,
  AutocompleteOption
} from "../../../shared/components/autocomplete/autocomplete.component";
import {LinkPageActions} from "../state/link.actions";

@Component({
  selector: 'app-edit-link',
  standalone: true,
  imports: [FormFieldComponent, ReactiveFormsModule, NgClass, AutocompleteComponent, FormsModule, AsyncPipe],
  templateUrl: './edit-link.component.html',
  styleUrl: './edit-link.component.scss'
})
export class EditLinkComponent implements OnInit {

  options: Observable<AutocompleteOption[]> = of([]);
  allOptions: Observable<AutocompleteOption[]> = of([]);

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
    this.allOptions = this.store.select(selectExistingTags)
      .pipe(
        map(tags => [...tags.map(tag => ({
          id: tag.tagId,
          text: tag.name
        }))]
        )
      );
    this.store.select(selectSelectedLink)
      .pipe(first(), filter(link => !!link))
      .subscribe((link) => {
        if (link) {
          this.linkForm.get('linkId')?.setValue(link?.linkId);
          this.linkForm.get('link')?.setValue(link?.link);
          this.linkForm.get('name')?.setValue(link?.name);
          this.linkForm.get('tags')?.setValue(link?.tags.map(tag => ({id: tag.tagId, text: tag.name})))
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

  onCompleteRequest(textToComplete: string): void {
    this.options = this.allOptions.pipe(
      map(allOpt => allOpt.filter(op => op.text.toLowerCase().includes(textToComplete.toLowerCase())))
    )
  }

  get selectedOptions(): AutocompleteOption[] {
    return this.linkForm.get('tags')?.value || [];
  }
}
