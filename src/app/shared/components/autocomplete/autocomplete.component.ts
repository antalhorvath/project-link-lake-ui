import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import {Dropdown, DropdownOptions} from "flowbite";
import {InstanceOptions} from "flowbite/lib/esm/dom/types";
import {NgClass, NgIf} from "@angular/common";
import {BadgeComponent} from "../badge/badge.component";
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR
} from "@angular/forms";

export interface AutocompleteOption {
  id: string;
  text: string;
}

@Component({
  selector: 'autocomplete',
  standalone: true,
  imports: [
    NgIf,
    BadgeComponent,
    NgClass,
    FormsModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true
    }
  ],
  templateUrl: './autocomplete.component.html'
})
export class AutocompleteComponent implements AfterViewInit , ControlValueAccessor {

  @ViewChild('optionsElement', {static: true})
  optionsElement!: ElementRef<HTMLElement>;

  @ViewChild('autocompleteElement', {static: true})
  autocompleteElement!: ElementRef<HTMLElement>;

  dropdown!: Dropdown;

  dropdownOptions: DropdownOptions = {
    placement: 'bottom',
    triggerType: 'none',
    offsetSkidding: 0,
    offsetDistance: 10,
    delay: 300,
    onHide: () => {
    },
    onShow: () => {
    },
    onToggle: () => {
    },
  };

  instanceOptions: InstanceOptions = {
    id: 'dropdownMenu',
    override: true
  };

  @Input()
  field!: string;

  @Input()
  options: AutocompleteOption[] = [];

  @Output()
  completeRequest: EventEmitter<string> = new EventEmitter<string>();

  indexOfSelectedOption = -1;

  textValue = '';

  selectedOptions: AutocompleteOption[] = [];

  onChange!: (value: AutocompleteOption[]) => void;
  onTouched!: () => void;

  isDisabled = false;

  ngAfterViewInit(): void {
    this.initialize();
  }

  private initialize() {
    const dropdownMenu = this.optionsElement.nativeElement;

    if (dropdownMenu) {
      this.dropdown = new Dropdown(dropdownMenu, this.autocompleteElement.nativeElement, this.dropdownOptions, this.instanceOptions);
    }
  }

  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.textValue = input.value;

    this.emitCompleteRequest();
    this.toggleDropdown();
  }

  private emitCompleteRequest(): void {
    if(this.textValue.length > 1) {
      this.completeRequest.emit(this.textValue);
    } else {
      this.options = [];
      this.dropdown.hide();
    }
  }

  private toggleDropdown(): void {
    if (this.textValue.length > 1 && this.options.length > 0) {
      this.dropdown.show();
    } else {
      this.dropdown.hide();
    }
  }

  onOptionClick(event: Event, selected: number) {
    event.preventDefault();
    this.indexOfSelectedOption = selected;
    this.addSelectedOptionFromDropdown()
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.addSelectedOptionFromDropdown();
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      this.applySelectionInDropdown(event);
    } else if (event.key === 'Escape') {
      this.dropdown.hide();
      this.clearDropdownSelection();
    } else {
      this.clearDropdownSelection();
    }
  }

  private addSelectedOptionFromDropdown() {
    if (this.textValue.length > 1) {
      const optionToAdd = this.optionToAdd();
      if (this.isNotYetSelected(optionToAdd)) {
        const updatedSelectedOptions = [...this.selectedOptions, optionToAdd];
        this.writeValue(updatedSelectedOptions);
      }
      this.resetForNewSelection();
    }
  }

  private optionToAdd(): AutocompleteOption {
    if (this.indexOfSelectedOption >= 0) {
      return this.options[this.indexOfSelectedOption];
    } else {
      return {id: '', text: this.textValue};
    }
  }

  private resetForNewSelection() {
    this.dropdown.hide();
    this.indexOfSelectedOption = -1;
    this.textValue = '';
  }

  private applySelectionInDropdown(event: KeyboardEvent): void {
    event.preventDefault();
    if (event.key === 'ArrowUp') {
      this.indexOfSelectedOption -= 1;
    } else {
      this.indexOfSelectedOption += 1;
    }
    this.alignSelectionWithinBoundaries();
  }

  private clearDropdownSelection(): void {
    this.indexOfSelectedOption = -1;
  }

  private isNotYetSelected(option: AutocompleteOption): boolean {
    return !this.selectedOptions.find(c => c.text === option.text);
  }

  private alignSelectionWithinBoundaries() {
    if (this.indexOfSelectedOption < 0) {
      this.indexOfSelectedOption = this.options.length - 1;
    } else if (this.indexOfSelectedOption >= this.options.length) {
      this.indexOfSelectedOption = 0;
    }
  }

  onTagRemoval(tag: AutocompleteOption) {
    const updatedSelectedOptions = this.selectedOptions.filter(c => {
      if(tag.id) {
        return c.id !== tag.id;
      } else {
        return c.text != tag.text;
      }
    });
    this.writeValue(updatedSelectedOptions);
  }

  registerOnChange(onChangeFunction: (value: AutocompleteOption[]) => void): void {
    this.onChange = onChangeFunction;
  }

  registerOnTouched(onTouchedFunction: any): void {
    this.onTouched = onTouchedFunction;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  writeValue(value: AutocompleteOption[]): void {
    this.selectedOptions = value;
    if(this.onChange) {
      this.onChange(this.selectedOptions);
    }
  }
}
