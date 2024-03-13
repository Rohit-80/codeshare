import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Observable, Subject } from 'rxjs';
import { MyTel } from '../formate-date/formate-date.component';
import { Router } from '@angular/router';
import { NotiferService } from '../services/notifier.service';

interface FilterForm {
  startDate: FormControl;
  endDate: FormControl;
  txt: FormControl;
  dateType: FormControl;
}

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.html',
  styleUrls: ['./search-filter.css'],
})
export class SerachFilterComponent implements OnInit {
  form: FormGroup = new FormGroup({
    tel: new FormControl(new MyTel('', '', '')),
  });
  @ViewChild('formatedate') formateDate: TemplateRef<any>;

  @Input()
  color: ThemePalette;
  @Output()
  dateInput: EventEmitter<MatDatepickerInputEvent<any, any>>;

  @Output()
  dateChange: EventEmitter<MatDatepickerInputEvent<any, any>>;

  catalogs = this._formBuilder.group({
    text: false,
    image: false,
    video: false,
    doc: false,
    pdf: false,
  });

  clearDate = new Subject<any>();
  

  constructor(private _formBuilder: FormBuilder) {}

  filterForm: FormGroup;
  isDisabled: boolean = true;
  multipleValue: boolean = false;
  router: Router = inject(Router);
  notify : NotiferService = inject(NotiferService)
  isCatalog: boolean = false;
  
  byHand: boolean = false;
  dateObj: { day: string; month: string; year: string };
  
  validFormate(event: any) {
    this.isCatalog = true;
    this.dateObj = event;

    this.catalog();
  }

  catalog() {
    let catalog = Object.entries(this.catalogs.value)
      .filter((val) => val[1] == true)
      .map((val) => val[0])
      .join(',');

    this.router.navigate(['./'], {
      queryParams: {
        catalog: catalog,
        searchBy: 'date',
        date:
          (this.dateObj.day || this.firstPart) +
          '/' +
          (this.dateObj.month || this.secondPart) +
          '/' +
          (this.dateObj.year || this.thirdPart),
      },
    });
  }



  firstPart = null;
  secondPart = null;
  thirdPart = null;

  clear() {
    this.clearDate.next({});
    this.notify.removeTextFilter();
    

  }
  ngOnInit(): void {
    

    this.color = 'accent';

    this.filterForm = new FormGroup({
      startDate: new FormControl(null, [
        Validators.required,
      ]),
      endDate: new FormControl(new Date()),
      dateType: new FormControl(null),
      txt: new FormControl(null, Validators.required),
    });

    this.catalogs.valueChanges.subscribe((res) => {
      let arr = Object.entries(res).filter((pair) => pair[1] == true);
      this.isDisabled = arr.length > 0 ? false : true;

      if (!this.isDisabled && this.isCatalog) {
        this.catalog();
      }
    });

    // this.filterForm.valueChanges.subscribe((res) => {
    //   console.log(res);
    // });

    this.filterForm.get('startDate').valueChanges.subscribe((x) => {
      let year = new Date(x).getFullYear();
      let month = new Date(x).getMonth();
      let day = new Date(x).getDate();

      //  console.log(Dates,month,year)

      this.firstPart =
        month + 1 < 10 ? '0' + (month + 1) : (month + 1).toString();
      this.secondPart = day < 10 ? '0' + day : day.toString();
      this.thirdPart = year < 10 ? '0' + year : year.toString();

      // console.log(day,month,year)
    });
  }

  valueChanged(ev: any) {
    console.log(ev.value);
    if (ev.value == 'between') {
      this.multipleValue = true;
    } else {
      this.multipleValue = false;
    }
  }


}
