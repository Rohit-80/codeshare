import { FocusMonitor } from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Self,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  AbstractControlOptions,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NgControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  MAT_FORM_FIELD,
  MatFormField,
  MatFormFieldControl,
} from '@angular/material/form-field';
import { Observable, Subject } from 'rxjs';


export class MyTel {
  constructor(
    public day: string,
    public month: string,
    public year: string
  ) {}
}


@Component({
  selector: 'app-formate-date',
  templateUrl: './formate-date.component.html',
  styleUrls: ['./formate-date.component.css'],
  providers: [{ provide: MatFormFieldControl, useExisting: MyTelInput }],
  host: {
    '[class.example-floating]': 'shouldLabelFloat',
    '[id]': 'id',
  },
})
export class MyTelInput
  implements
    ControlValueAccessor,
    MatFormFieldControl<MyTel>,
    OnDestroy,
    OnInit,
    OnChanges
{
  static nextId = 0;
  @ViewChild('day') dayInput: HTMLInputElement;
  @ViewChild('month') monthInput: HTMLInputElement;
  @ViewChild('year') yearInput: HTMLInputElement;

  @Input('firstPart') firstPart;
  @Input('secondPart') secondPart;
  @Input('thirdPart') thirdPart;
  @Input('clearDate') clearDate: Observable<any>;
  @Output() validDateFormate: EventEmitter<any> = new EventEmitter();



 
  dateValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    let date =
      control?.get('year')?.value +
      '/' +
      control?.get('day')?.value +
      '/' +
      control?.get('month')?.value;
    let val = new Date(date);
    if (
      val.getFullYear() != +control.value.year ||
      val.getDate() != +control.value.month ||
      +control.value.day != val.getMonth() + 1
    ) {
      return { notTen: true };
    } else {
      return null;
    }

    
  };

  parts = this._formBuilder.group(
    {
      day: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(2),
          Validators.pattern(/^(0[1-9])|(1[012])$/),
        ],
      ],
      month: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(2),
          Validators.pattern(/^(0[1-9])|([12][0-9])|(3[01])$/),
        ],
      ],
      year: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4),
          Validators.pattern(/^\d{4}$/),
        ],
      ],
    },
    { validator: this.dateValidator } as AbstractControlOptions
  );

  stateChanges = new Subject<void>();
  focused = false;
  touched = false;
  controlType = 'example-tel-input';
  id = `example-tel-input-${MyTelInput.nextId++}`;
  onChange = (_: any) => {};
  onTouched = () => {};

  ngOnInit(): void {
    

    this.parts.statusChanges.subscribe((res) => {
      
      if (res == 'VALID') {
        console.log('valid called')
        this.validDateFormate.emit(this.parts.value);
      }
    });

    this.clearDate.subscribe((res) => {
      this.parts.reset();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['firstPart'] || changes['secondPart'] || changes['thirdPart']) {
      this.parts.controls['day'].patchValue(this.firstPart);
      this.parts.controls['month'].patchValue(this.secondPart);
      this.parts.controls['year'].patchValue(this.thirdPart);
    }
  }

  get empty() {
    const {
      value: { day, month, year },
    } = this.parts;

    return !day && !month && !year;
  }

  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  @Input('aria-describedby') userAriaDescribedBy: string;

  @Input()
  get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  private _placeholder: string;

  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: BooleanInput) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _required = false;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);
    this._disabled ? this.parts.disable() : this.parts.enable();
    this.stateChanges.next();
  }
  private _disabled = false;

  @Input()
  get value(): MyTel | null {
    if (this.parts.valid) {
      const {
        value: { day, month, year },
      } = this.parts;
      return new MyTel(day!, month!, year!);
    }
    return null;
  }
  set value(tel: MyTel | null) {
    const { day, month, year } = tel || new MyTel('', '', '');
    this.parts.patchValue({ day, month, year });
    this.stateChanges.next();
  }

  get errorState(): boolean {
    return this.parts.invalid && this.touched;
  }

  constructor(
    private _formBuilder: FormBuilder,
    private _focusMonitor: FocusMonitor,
    private _elementRef: ElementRef<HTMLElement>,
    @Optional() @Inject(MAT_FORM_FIELD) public _formField: MatFormField,
    @Optional() @Self() public ngControl: NgControl
  ) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  onFocusIn(event: FocusEvent) {
    if (!this.focused) {
      this.focused = true;
      this.stateChanges.next();
    }
  }

  onFocusOut(event: FocusEvent) {
    if (
      !this._elementRef.nativeElement.contains(event.relatedTarget as Element)
    ) {
      this.touched = true;
      this.focused = false;
      this.onTouched();
      this.stateChanges.next();
    }
  }

  autoFocusNext(
    control: AbstractControl,
    nextElement?: HTMLInputElement
  ): void {
    if (!control.errors && nextElement) {
      this._focusMonitor.focusVia(nextElement, 'program');
    }
  }
  cu = false;
  autoFocusPrev(control: AbstractControl, prevElement: HTMLInputElement): void {
    if (control.value.length < 1) {
      this._focusMonitor.focusVia(prevElement, 'program');
    }
  }

  setDescribedByIds(ids: string[]) {
    const controlElement = this._elementRef.nativeElement.querySelector(
      '.example-tel-input-container'
    )!;
    controlElement.setAttribute('aria-describedby', ids.join(' '));
  }

  onContainerClick() {
    if (this.parts.controls.year.valid) {
      // this._focusMonitor.focusVia(this.yearInput, 'program');
    } else if (this.parts.controls.month.valid) {
      // this._focusMonitor.focusVia(this.yearInput, 'program');
    } else if (this.parts.controls.day.valid) {
      // this._focusMonitor.focusVia(this.monthInput, 'program');
    } else {
      this._focusMonitor.focusVia(this.dayInput, 'program');
    }
  }
  twice = false;
  rtwice = false;
  arrowShift(
    key: string,
    ele: HTMLInputElement,
    eleName: string,
    preEle?: any
  ) {
    if (eleName == 'day') {
      if (key == 'ArrowRight' ) {
        //  console.log('rightcalled')
        if (ele.selectionEnd == 2 && this.rtwice) {
          this._focusMonitor.focusVia(this.monthInput, 'program');
          this.rtwice = false;
        }else 
        if(ele.selectionEnd == 2) this.rtwice = true;
      }
    } else if (eleName == 'month') {
      if (key == 'ArrowRight') {
        if (ele.selectionEnd == 2 && this.rtwice) {
          this._focusMonitor.focusVia(this.yearInput, 'program');
          this.rtwice = false;
        }else 
        if(ele.selectionEnd == 2) this.rtwice = true;
      }
      if (key == 'ArrowLeft') {
        if (ele.selectionEnd == 0 && this.twice) {
          this._focusMonitor.focusVia(this.dayInput, 'program');
           this.twice = false;
        }else 
        if(ele.selectionEnd == 0) this.twice = true;
      }
    } else {
      if (key == 'ArrowLeft') {
        if (ele.selectionEnd == 0 &&  this.twice ) {
          this._focusMonitor.focusVia(this.monthInput, 'program');
          this.twice = false;
        }else if(ele.selectionEnd == 0){
           this.twice = true
        }
      }
    }
  }

  writeValue(tel: MyTel | null): void {
    this.value = tel;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  _handleInput(control: AbstractControl, nextElement?: HTMLInputElement): void {
    this.autoFocusNext(control, nextElement);
    this.onChange(this.value);
  }
}

