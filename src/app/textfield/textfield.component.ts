import { MatDividerModule } from '@angular/material/divider';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';

import { HttpserviceService } from '../services/httpservice.service';
import 'ag-grid-community';
import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import { NgZone } from '@angular/core';
import { take } from 'rxjs/operators';
import * as moment from 'moment';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ColDef, ColGroupDef, GridApi } from 'ag-grid-community';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthserviceService } from '../services/authservice.service';
import { Subject, pipe } from 'rxjs';
import { NotiferService } from '../services/notifier.service';
import { DatePipe } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';

let subject = new Subject<any>();

@Component({
  selector: 'app-textfield',
  templateUrl: './textfield.component.html',
  styleUrls: ['./textfield.component.css'],
})
export class TextfieldComponent implements OnInit {
  curPageNo: number = 0;
  isLogged: boolean = this.auth.isLogged;
  undoRedoCellEditing = true;
  undoRedoCellEditingLimit = 20;
  tooltipInteraction = true;

  txtData: any;
  mainData: any;

  private gridApi!: GridApi<any>;
  router: Router = inject(Router);
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;
  @ViewChild('textfield') textInput!: ElementRef;
  @ViewChild('textheader') textHeader!: ElementRef;
  threeLenRequired: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    if (control.value?.length < 3) return { less: true };
    return null;
  };
  tenLenRequired: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    if (control.value?.length < 10) return { less: true };
    return null;
  };

  inputForm = new FormGroup({
    header: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      this.threeLenRequired,
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      this.tenLenRequired,
    ]),
    tag: new FormControl('data'),
  });

  constructor(
    public http: HttpserviceService,
    public auth: AuthserviceService,
    private _ngZone: NgZone,
    public dialog: MatDialog
  ) {}

  call(event: any) {}

  paginationChanged(e: any) {
    this.curPageNo = this.gridApi?.paginationGetCurrentPage();
    if (this.gridApi) {
      this.refreshTextData(this.curPageNo);
    }
  }

  columnDef: ColDef[] | ColGroupDef[] = [
    {
      headerName: 'TextList',
      field: 'header',
      flex: 1,

      resizable: true,
      sortable: true,
      wrapText: true,
      wrapHeaderText: true,
      cellStyle: { wordBreak: 'normal' },
      autoHeight: true,
      cellRenderer: (params) => {
        return `<div>
        <span> ${params.data.header}</span>
        <em class="mat-divider" style="background-color : rgb(255,255,255,0.1)"></em> 
      <span style="font-size:0.7rem"> ${moment(params.data.time).format(
        'ddd, MMM d, y | h:mm a '
      )} </span>
      <em class="mat-divider" style="background-color : rgb(255,255,255,0.7)"></em>
      </div> 
      `;
      },
      // cellRenderer: (params: any) => {
      //   let eIconGui = document.createElement('span');
      //   return (eIconGui.innerHTML =
      //     params.data.header +
      //     '<em class="material-icons" style="border : 1px solid #707070;">insert_invitation</em>'
      //     +
      //     ' ' +
      //     '<em class="mat-divider" style="background-color : rgb(255,255,255,0.1)"></em>' +
      //     '' +
      //     '<em class="material-icon-button" ><em class="material-icons"> favorite </em></em>' +
      //     ' ' +
      //     params.data.time);
      // },
    },
  ];

  rowData = [];

  openDialog(data: any) {
    console.log(data)
    this.dialog.open(DialogBox, {
      data: data,
      width: '100%',
        height: '90%',
    });
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable
      .pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  row(p: any) {
    let row = this.gridApi.getSelectedRows();

    let txtData = this.mainData.find((id: any[]) => id[0] == row[0].id);
    txtData = {
       header : txtData[1].header,
       time : txtData[1].time,
       txt : txtData[1].txt,
       id : txtData[0]
    }
    console.log(txtData);


    this.dialog
      .open(ShowDialogBox, {
        data: txtData,
        // disableClose: true,
        width: '100%',
        height: '90%',
      })
      .afterClosed()
      .subscribe((res) => console.log);
    // console.log(this.mainData);
  }

  refreshTextData(pageNo: number) {
    // this.txtData = this.mainData.slice(pageNo*8,pageNo*8 + 8);
    // console.log(this.txtData,this.rowData)
    this.txtData = this.rowData;
  }

  getData(pageNo: number) {
    //  console.log('get Called')
    this.http.getAllTextData().subscribe((txtdata) => {
      this.mainData = Object.entries(txtdata);
      // this.txtData = this.mainData.slice(pageNo*8,pageNo*8 + 8);
      let rowArray: any = [];
      this.mainData.forEach((element: any) => {
        rowArray.push({
          header: element[1].header,
          id: element[0],
          time: element[1].time,
          txt: element[1].txt,
        });
      });
      this.rowData = rowArray;
    });
  }

  removeFilter() {
    this.getData(this.curPageNo);
  }

  activeroute: ActivatedRoute = inject(ActivatedRoute);
  notify: NotiferService = inject(NotiferService);

  ngOnInit(): void {
    this.notify.removeTextFilterObs.subscribe(() => this.removeFilter());

    this.activeroute.queryParams.subscribe((params) => {
      // console.log(params)
      if (params['catalog']?.split(',').find((val) => val == 'text')) {
        if (params['searchBy'] == 'date') {
          const [MM, DD, YY] = params['date'].split('/');
          let rowArray: any = [];
          // console.log(MM,DD,YY);
          let txtData = this.mainData.filter((txt) => {
            let [d, m, y] = txt[1].time.split('::')[0].split('-');
            // console.log(d,m,y,MM,DD,YY)

            if (+d == +DD && +m == +MM && +YY == +y) {
              rowArray.push({
                header: txt[1].header,
                id: txt[0],
                time: txt[1].time,
              });
              return true;
            }

            return false;
          });
          let o = Array.from(txtData);

          o.forEach((element: any) => {});
          this.rowData = rowArray;
          this.refreshTextData(this.curPageNo);
        }
      }
    });

    this.getData(this.curPageNo);

    subject.subscribe((res) => this.getData(this.curPageNo));

    if (sessionStorage.getItem('specialUser') == 'yes') {
      this.auth.setUser();
      this.auth.sub.next(178);
      this.isLogged = this.auth.isLogged;
    }
    this.auth.sub.subscribe((isuser) => {
      // console.log('called2',isuser)
      this.isLogged = this.auth.isLogged;
    });
  }
  selectedChip = 'data';
  c(chip: string) {
    this.inputForm.controls.tag.patchValue(chip);
    this.selectedChip = chip;
  }
  doneText() {
  
    console.log(this.textInput?.nativeElement.value);
    const currentDate = new Date();

    const currentDayOfMonth = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const currhour = currentDate.getHours();
    const currmin = currentDate.getMinutes();
    const currsec = currentDate.getSeconds();

    const dateString =
      currentDayOfMonth +
      '-' +
      (currentMonth + 1) +
      '-' +
      currentYear +
      ' :: ' +
      currhour +
      ':' +
      currmin +
      ':' +
      currsec;

    let data = {
      header: this.textHeader.nativeElement.value,
      txt: this.textInput.nativeElement.value,
      time: dateString,
    };

    this.textHeader.nativeElement.value = '';
    this.textInput.nativeElement.value = '';

    this.http
      .addTextData(data)
      .subscribe((res) => this.getData(this.curPageNo));
  }

  clearText() {
    console.log(this.inputForm.value);
    this.inputForm.reset();
  }
  cancelText() {
    this.accordion.closeAll();
  }

  deleteTxt(id: string) {
    this.http.deleteTxt(id).subscribe((res) => this.getData(this.curPageNo));
  }
}

@Component({
  selector: 'dialog-elements-example-dialog',
   styleUrls: ['./dialog.css'],
  template: `
   <div mat-dialog-title class="dialog-title">
       <mat-icon>smile</mat-icon>
  <button mat-icon-button aria-label="close dialog" mat-dialog-close style="color: white;" >
    <mat-icon  >close</mat-icon>
  </button>
</div>
    <div class="txt-area">


    <h2 >{{ item.header }}</h2>


      <div style="display:  flex;  justify-content: space-between">
        <h5 style="display: inline-block;">
          {{ item.time | date : 'EEE, MMM d, y | h:mm a ' }}
        </h5>
        <mat-chip color="accent" selected class="chip">Accent fish</mat-chip>
      </div>



      <textarea class="content-txt" [value]="item.txt">
      
      </textarea>
     
      

      <div style="margin-bottom: 0.3rem">
        <button mat-stroked-button color="accent" class="border" (click)="updateData('')"> 
          <mat-icon> update </mat-icon> Update
        </button>
        <button mat-stroked-button color="warn" class="border" (click)="onNoClick()">
          <mat-icon> close </mat-icon> Cancel
        </button>
      </div>

      <mat-divider></mat-divider>
    </div>
  `,
})
export class DialogBox {
  constructor(
    public dialogRef: MatDialogRef<DialogBox>,
    @Inject(MAT_DIALOG_DATA) public item: any,
    private http: HttpserviceService

  ) {}

  updateData(txt: string) {
    this.item.txt = txt;
    this.http
      .updateData(this.item, this.item.id)
      .subscribe((res) => subject.next({}));
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'show-dialog-box',
  styleUrls: ['./dialog.css'],
  template: `
       <div mat-dialog-title class="dialog-title">
       <mat-icon>smile</mat-icon>
  <button mat-icon-button aria-label="close dialog" mat-dialog-close style="color: white;" >
    <mat-icon  >close</mat-icon>
  </button>
</div>
    <div class="txt-area">


    <h2 >{{ item.header }}</h2>


      <div style="display:  flex;  justify-content: space-between">
        <h5 style="display: inline-block;">
          {{ item.time | date : 'EEE, MMM d, y | h:mm a ' }}
        </h5>
        <mat-chip color="accent" selected class="chip">Accent fish</mat-chip>
      </div>

      <pre class="content-txt">
         {{ item.txt }} 
      </pre
      >
      <div style="margin-bottom: 0.3rem">
        <button mat-stroked-button color="accent" class="border" (click)="updateData()"> 
          <mat-icon> edit </mat-icon> Edit
        </button>
        <button mat-stroked-button color="warn" class="border">
          <mat-icon> delete </mat-icon> Delete
        </button>
      </div>

      <mat-divider></mat-divider>
    </div>
  `,
})
export class ShowDialogBox {
  constructor(
    public dialogRef: MatDialogRef<DialogBox>,
    @Inject(MAT_DIALOG_DATA) public item: any,
    private http: HttpserviceService,
    public dialog: MatDialog
  ) {}

  updateData() {
    // this.dd.updateData('')
    this.dialog.open(DialogBox,{
      data : this.item,
      width: '100%',
      height: '90%',
    })
    this.onNoClick();
  }
  onNoClick(): void {
    this.dialogRef.close('Lol');
  }
}
