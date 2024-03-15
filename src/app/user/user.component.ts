import { DialogBox } from './../textfield/textfield.component';
import { AfterViewInit, Component, ElementRef, Inject, NgModule, NgZone, OnInit, TemplateRef, ViewChild, ViewRef } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';
import { HttpserviceService } from '../services/httpservice.service';
import { AuthserviceService } from '../services/authservice.service';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { NgModel } from '@angular/forms';
import { MatLabel } from '@angular/material/form-field';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  constructor(
    public http: HttpserviceService,
    private _ngZone: NgZone,
    public dialog: MatDialog,
    private auth: AuthserviceService
  ) {}

  user: string = 'Normal User';
  isLogged: boolean = false;

  ngOnInit(): void {
    let userCon = sessionStorage.getItem('specialUser');
    if (userCon == 'yes') {
      this.auth.setUser();
      this.isLogged = this.auth.isLogged;
    }

    this.auth.sub.subscribe((isUser) => {
      this.isLogged = this.auth.isLogged;
    });
  }

  sessionOut() {
    this.auth.clearUser();
  }

  changeUser() {
    this.openDialog();
  }
  openDialog() {
    this.dialog.open(DialogBoxer, {
      data: '',
    });
  }
}
@Component({
  selector: 'dialog-elements-example-dialog',
  styleUrls: ['./user.component.css'],

  template: `
    <div class="dialog">
      <h1 mat-dialog-title>4 + 8 = ?</h1>
      <div mat-dialog-content>
        <input type="password" #inputVal cdkFocusInitial placeholder="48" (keyup.enter)="sessionIn(inputVal.value)" />
      </div>

      <div mat-dialog-actions>
        <button mat-stroked-button color="accent" cdkFocusInitial (click)="sessionIn(inputVal.value)">
          Session in
        </button>
        <button mat-stroked-button mat-dialog-close (click)="onNoClick()">Close</button>
      </div>
    </div>
  `,
})
export class DialogBoxer implements AfterViewInit  {
  constructor(
    public dialogRef: MatDialogRef<DialogBoxer>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private auth: AuthserviceService,
    private toastr: ToastrService
  ) {}
 @ViewChild('inputVal') input : ElementRef;

  ngAfterViewInit(): void {
      // this.input?.focus()
      console.log(this.input.nativeElement.focus())
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  sessionIn(ele: any) {
    if (ele.toString().toLowerCase() == '12') {
      sessionStorage.setItem('specialUser', 'yes');
      this.toastr.success('Rohit','Welcome')
      this.auth.setUser();
    }else{
      this.toastr.warning( "You aren't Rohit !! " ,'Oops !! ')
    }
    this.dialogRef.close();
  }
}
