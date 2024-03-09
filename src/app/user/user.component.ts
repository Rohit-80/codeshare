import { DialogBox } from './../textfield/textfield.component';
import { Component, Inject, NgModule, NgZone, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { HttpserviceService } from '../services/httpservice.service';
import { AuthserviceService } from '../services/authservice.service';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { NgModel } from '@angular/forms';
import { MatLabel } from '@angular/material/form-field';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor(
    public http: HttpserviceService,
    private _ngZone: NgZone,
    public dialog: MatDialog,
    private auth : AuthserviceService
  ) {}


  user : string = 'Normal User';
  isLogged : boolean = false;
 
  ngOnInit(): void {
   
    let userCon = sessionStorage.getItem('specialUser');
    if(userCon == 'yes'){
          this.auth.setUser();
          this.isLogged = this.auth.isLogged;
    } 

    this.auth.sub.subscribe(isUser=>{
       this.isLogged = this.auth.isLogged;
    })

  
  }
  
  sessionOut(){
     this.auth.clearUser()
  }

  changeUser(){
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
  // templateUrl : 'dog.html'
  
  template: `
    <h1 mat-dialog-title> 4 + 8 = ?</h1>
    <div mat-dialog-content>
      <input #inputVal type="text">
    </div>

    <div mat-dialog-actions  >
      <button  mat-button cdkFocusInitial (click)="sessionIn(inputVal.value)">Session In</button>
      <button mat-button mat-dialog-close (click)="onNoClick()">Close</button>
    </div>
  `,
  
})
export class DialogBoxer {
  constructor(
    public dialogRef: MatDialogRef<DialogBoxer>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private auth : AuthserviceService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  sessionIn(ele : any){
    
     if(ele == '12'){
          sessionStorage.setItem('specialUser', 'yes');
          this.auth.setUser();
          
     }
    this.dialogRef.close();
  }
}

