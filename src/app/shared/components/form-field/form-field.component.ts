import {AfterViewInit, Component, ElementRef, Input, OnChanges, Renderer2, SimpleChanges} from '@angular/core';

@Component({
  selector: 'form-field',
  standalone: true,
  imports: [],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss'
})
export class FormFieldComponent implements OnChanges, AfterViewInit {

  initialised = false;

  labelCommonCss = [
    'block',
    'mb-2',
    'text-sm',
    'font-medium'
  ];

  labelValidCss = [
    'text-gray-900',
    'dark:text-white'
  ];

  labelInvalidCss = [
    'text-red-700',
    'dark:text-red-500'
  ];

  inputCommonCss = [
    'border',
    'block',
    'w-full',
    'p-2.5',
    'dark:bg-gray-700',
    'text-sm',
    'rounded-lg'
  ];

  inputValidCss = [
    'bg-gray-50',
    'border-gray-300',
    'text-gray-900',
    'focus:ring-blue-500',
    'focus:border-blue-500',
    'dark:border-gray-600',
    'dark:text-white',
    'dark:placeholder-gray-400',
    'dark:focus:ring-blue-500',
    'dark:focus:border-blue-500'
  ];

  inputInvalidCss = [
    'bg-red-50',
    'border-red-500',
    'text-red-900',
    'focus:ring-red-500',
    'focus:border-red-500',
    'dark:text-red-500',
    'dark:placeholder-red-500',
    'placeholder-red-700'
  ];

  errorMessageCss = [
    'mt-2',
    'text-sm',
    'text-red-600',
    'dark:text-red-500'
  ];

  @Input()
  hasError: boolean = false;

  input: any = null;
  label: any = null;
  error: any = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(!this.initialised) {
      this.initElements();
      this.applyCommonCss();
    }

    if (changes['hasError']) {
      this.applyCss();
    }
  }

  private applyCss() {
    if (this.hasError) {
      this.indicateFieldError();
    } else {
      this.indicateFieldCorrectness();
    }
  }

  private indicateFieldCorrectness() {
    this.renderer.addClass(this.error, 'hidden');
    this.labelValidCss.forEach(clazz => this.renderer.addClass(this.label, clazz));
    this.inputValidCss.forEach(clazz => this.renderer.addClass(this.input, clazz));
    this.labelInvalidCss.forEach(clazz => this.renderer.removeClass(this.label, clazz));
    this.inputInvalidCss.forEach(clazz => this.renderer.removeClass(this.input, clazz));
  }

  private indicateFieldError() {
    this.renderer.removeClass(this.error, 'hidden');
    this.labelValidCss.forEach(clazz => this.renderer.removeClass(this.label, clazz));
    this.inputValidCss.forEach(clazz => this.renderer.removeClass(this.input, clazz));
    this.labelInvalidCss.forEach(clazz => this.renderer.addClass(this.label, clazz));
    this.inputInvalidCss.forEach(clazz => this.renderer.addClass(this.input, clazz));
  }

  ngAfterViewInit(): void {
    this.initElements();
    this.applyCommonCss();
  }

  private initElements() {
    this.label = this.el.nativeElement.querySelector('label');
    this.input = this.el.nativeElement.querySelector('input');
    this.error = this.el.nativeElement.querySelector('p');
    this.initialised = true;
  }

  private applyCommonCss() {
    this.labelCommonCss.forEach(clazz => this.renderer.addClass(this.label, clazz));
    this.inputCommonCss.forEach(clazz => this.renderer.addClass(this.input, clazz));
    this.errorMessageCss.forEach(clazz => this.renderer.addClass(this.error, clazz));
    this.applyCss();
  }
}
