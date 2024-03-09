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
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ColDef, ColGroupDef, GridApi } from 'ag-grid-community';
import { Router } from '@angular/router';
import { AuthserviceService } from '../services/authservice.service';
import { Subject } from 'rxjs';

let subject = new Subject<any>


@Component({
  selector: 'app-textfield',
  templateUrl: './textfield.component.html',
  styleUrls: ['./textfield.component.css'],
})
export class TextfieldComponent implements OnInit {
  curPageNo : number = 0;
  isLogged : boolean = this.auth.isLogged;
  undoRedoCellEditing = true;
  undoRedoCellEditingLimit = 20;
  tooltipInteraction = true;

  txtData: any;
  mainData: any;

  private gridApi!: GridApi<any>;
  router: Router = inject(Router);
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;
  @ViewChild('textfield') textInput!: ElementRef;
  @ViewChild('textheader') textHeader!: ElementRef;


  constructor(
    public http: HttpserviceService,
    public auth : AuthserviceService,
    private _ngZone: NgZone,
    public dialog: MatDialog
  ) {}


  call(event: any) {

  }


 paginationChanged(e:any){
  this.curPageNo = this.gridApi?.paginationGetCurrentPage();
  if(this.gridApi){
    this.refreshTextData(this.curPageNo);
  }



 }


  columnDef: ColDef[] | ColGroupDef[] = [
    {
      headerName : 'TextList',
      field: 'serialNo',
      flex: 1,
      
      resizable: true,
      sortable: true,
      wrapText: true,     
      autoHeight: true,   
      cellRenderer: (params:any) => {
        let eIconGui = document.createElement('span');         
          return  eIconGui.innerHTML = params.data.serialNo + ' ' + '<br>' +  '<em class="material-icons" style="border : 1px solid #707070;">insert_invitation</em>'+ ' '  + params.data.time ;          
      },
    },
  ];

  rowData = [];

  openDialog(txtItem: any) {
    this.dialog.open(DialogBox, {
      data: txtItem,
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
  };

  row(p: any) {
    let row = this.gridApi.getSelectedRows();

    let txtData = this.mainData.find((id: any[]) => id[0] == row[0].id);
    console.log(txtData)
    this.dialog.open(ShowDialogBox, {
      data: txtData,
    });
    // console.log(this.mainData);
  }

  refreshTextData(pageNo : number){
    this.txtData = this.mainData.slice(pageNo*8,pageNo*8 + 8);
  }

  getData(pageNo : number){
  //  console.log('get Called')
    this.http.getAllTextData().subscribe((txtdata) => {

      this.mainData =Object.entries(txtdata);
      // this.txtData = this.mainData.slice(pageNo*8,pageNo*8 + 8);
      let rowArray: any = [];
      this.mainData.forEach((element: any) => {
        rowArray.push({ serialNo: element[1].header, id: element[0], time : element[1].time });
      });
      this.rowData = rowArray;
    });

  }
  ngOnInit(): void {

    this.getData(this.curPageNo);
    subject.subscribe(res=>this.getData(this.curPageNo))




    if(sessionStorage.getItem('specialUser') == 'yes'){
       this.auth.setUser();
       this.auth.sub.next(178)
       this.isLogged = this.auth.isLogged

 }
    this.auth.sub.subscribe(isuser=>{
      console.log('called2',isuser)
       this.isLogged = this.auth.isLogged;
    })
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

    this.textHeader.nativeElement.value = ''
    this.textInput.nativeElement.value = ''

    this.http.addTextData(data).subscribe((res) => this.getData(this.curPageNo));

  }

  deleteTxt(id: string) {
    this.http.deleteTxt(id).subscribe((res) => this.getData(this.curPageNo));

  }
}

@Component({
  selector: 'dialog-elements-example-dialog',
  template: `
    <h1 mat-dialog-title> {{ data[1].header }}</h1>
    <div mat-dialog-content>
      <textarea #txt name="" id="" cols="30" rows="10" [value]="data[1].txt">
      </textarea>
    </div>

    <div mat-dialog-actions>
      <button mat-button mat-dialog-close (click)="updateData(txt.value)">Update</button>
      <button mat-button mat-dialog-close (click)="onNoClick()">Close</button>
    </div>
  `,
})
export class DialogBox {
  constructor(
    public dialogRef: MatDialogRef<DialogBox>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http : HttpserviceService
  ) {}

  updateData(txt : string){
    this.data.txt = txt;
    this.http.updateData(this.data,this.data.id).subscribe(res=>subject.next({}))
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'show-dialog-box',
  template: `
    <h1 mat-dialog-title> {{ data[1].header }}</h1>
    <p mat-dialog-subtitle> {{data[1].time}}</p>

    <div mat-dialog-content>
      <p #txt >
      {{data[1].txt}}
      </p>
    </div>

    <div mat-dialog-actions>
      <button mat-button mat-dialog-close (click)="updateData()">Update</button>
      <button mat-button mat-dialog-close (click)="onNoClick()">Close</button>
    </div>
  `,
})
export class ShowDialogBox {
  constructor(
    public dialogRef: MatDialogRef<DialogBox>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http : HttpserviceService,
   
  ) {}

  updateData(){
    // this.dd.updateData('')
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
