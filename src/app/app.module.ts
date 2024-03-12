import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { PdfViewerModule } from 'ng2-pdf-viewer'; // <- import PdfViewerModule
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DialogBox, ShowDialogBox, TextfieldComponent } from './textfield/textfield.component';
import { HttpClientModule } from '@angular/common/http';
import { CloudinaryModule } from '@cloudinary/ng';
import { AgGridAngular,AgGridModule } from 'ag-grid-angular';
import { ImgAndVideoComponent } from './img-and-video/img-and-video.component';
import { DocfileComponent } from './docfile/docfile.component';
import { PdffilesComponent } from './pdffiles/pdffiles.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDividerModule} from '@angular/material/divider';

import {CdkTextareaAutosize, TextFieldModule} from '@angular/cdk/text-field';
import { NgZone} from '@angular/core';
import {take} from 'rxjs/operators';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {MatRadioModule} from '@angular/material/radio';
import {MatDialogActions, MatDialogContainer, MatDialogContent, MatDialogModule} from '@angular/material/dialog';
import { RouterLink, RouterModule } from '@angular/router';
import { AgGridComponent } from './ag-grid-component';
import { NgModel, ReactiveFormsModule } from '@angular/forms';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { DialogBoxer, UserComponent } from './user/user.component';
import { MaterialExampleModule } from './material.module';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    IndexComponent,
    AppComponent,
    TextfieldComponent,
    TextfieldComponent,
    SerachFilterComponent,
    AgGridComponent,
    ImgAndVideoComponent,
    DocfileComponent,
    DialogBox,
    PdffilesComponent,
         UserComponent,
         DialogBoxer,
         ShowDialogBox,
         MyTelInput
   
  ],
  imports: [
    
    MatIconModule,
    MaterialExampleModule,
    NgxDocViewerModule,
    ReactiveFormsModule,
    RouterLink,
    RouterModule,
    AgGridModule,
    MatDialogModule,
    MatRadioModule,
    MatListModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    TextFieldModule,
    BrowserModule,
    AppRoutingModule,
     HttpClientModule ,
     CloudinaryModule,
     NgxExtendedPdfViewerModule,
     PdfViewerModule,


     BrowserAnimationsModule,MatProgressSpinnerModule,MatDividerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { SerachFilterComponent } from './searchfilter/searchfilter.component';
import { IndexComponent } from './index/index.component';
import { MyTelInput } from './formate-date/formate-date.component';
import { MatDatepickerActions } from '@angular/material/datepicker';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAdl0GflNV8U1jWqD6UKdeuonhSZH1M2zc",
  authDomain: "codeshare-4f844.firebaseapp.com",
  databaseURL: "https://codeshare-4f844-default-rtdb.firebaseio.com",
  projectId: "codeshare-4f844",
  storageBucket: "codeshare-4f844.appspot.com",
  messagingSenderId: "119413844680",
  appId: "1:119413844680:web:41148e069ce7bb4a27d3fd",
  measurementId: "G-N4E16ZVJLT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);