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

/** Data structure for holding telephone number. */
export class MyTel {
  constructor(
    public area: string,
    public exchange: string,
    public subscriber: any
  ) {}
}

/** Custom `MatFormFieldControl` for telephone number input. */
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
  @ViewChild('area') areaInput: HTMLInputElement;
  @ViewChild('exchange') exchangeInput: HTMLInputElement;
  @ViewChild('subscriber') subscriberInput: HTMLInputElement;

  @Input('firstPart') firstPart;
  @Input('secondPart') secondPart;
  @Input('thirdPart') thirdPart;
  @Input('clearDate') clearDate: Observable<any>;
  @Output() validDateFormate: EventEmitter<any> = new EventEmitter();
  // trueCheck : ValidatorFn = (formGroup: AbstractControl) :  ValidationErrors | null => {

  //   // // let date = this.formGroup. + '/' + this.parts.value.area + '/' + this.parts.value.subscriber;
  //   // let val = new Date(date)
  //   // if('Invalid Date' != val.toString()){
  //   //    return {err : true};     
  //   // }else {
  //   //   return null;
  //   // }
  // }

  parts = this._formBuilder.group({
    area: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(2),
        Validators.pattern(/^(0[1-9])|(1[012])$/),
      ],
    ],
    exchange: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(2),
        Validators.pattern(/^(0[1-9])|([12][0-9])|(3[01])$/),
      ],
    ],
    subscriber: [
      '',
      [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(4),
        Validators.pattern(/^\d{4}$/),
        
      ],
      
    ],
    
  });
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
        let date = this.parts.value.exchange + '/' + this.parts.value.area + '/' + this.parts.value.subscriber;
        let val = new Date(date)
        if('Invalid Date' != val.toString()){
          this.validDateFormate.emit(this.parts.value);      
        }else {
          
        }
        
      }
    });

    this.clearDate.subscribe((res) => {
      this.parts.reset();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['firstPart'] || changes['secondPart'] || changes['thirdPart']) {
      this.parts.controls['area'].setValue(this.firstPart);
      this.parts.controls['exchange'].setValue(this.secondPart);
      this.parts.controls['subscriber'].setValue(this.thirdPart);
    }
  }

  get empty() {
    const {
      value: { area, exchange, subscriber },
    } = this.parts;

    return !area && !exchange && !subscriber;
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
        value: { area, exchange, subscriber },
      } = this.parts;
      return new MyTel(area!, exchange!, subscriber!);
    }
    return null;
  }
  set value(tel: MyTel | null) {
    const { area, exchange, subscriber } = tel || new MyTel('', '', '');
    this.parts.setValue({ area, exchange, subscriber });
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
    if (this.parts.controls.subscriber.valid) {
      this._focusMonitor.focusVia(this.subscriberInput, 'program');
    } else if (this.parts.controls.exchange.valid) {
      this._focusMonitor.focusVia(this.subscriberInput, 'program');
    } else if (this.parts.controls.area.valid) {
      this._focusMonitor.focusVia(this.exchangeInput, 'program');
    } else {
      this._focusMonitor.focusVia(this.areaInput, 'program');
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
