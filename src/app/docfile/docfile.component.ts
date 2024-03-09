import { GridApi } from 'ag-grid-community';

import { Component, OnInit, inject } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { CloudinaryService } from '../img-and-video/cloudinary.service';
import { HttpserviceService } from '../services/httpservice.service';
import { AuthserviceService } from '../services/authservice.service';

@Component({
  selector: 'app-docfile',
  templateUrl: './docfile.component.html',
  styleUrls: ['./docfile.component.css'],
})
export class DocfileComponent implements OnInit {
  docArray!: any;
  excelArray!: any;
  pptArray!: any;

  rowDataDoc = [{}];
  rowDataExcel = [{}];
  rowDataPpt = [{}];
  columnDefDoc = [
    {
      field: 'docName',
      width: 300,
      flex: 1,
      resizable: true,
      sortable: true,
      wrapText: true,
      autoHeight: true,
      cellRenderer: (params: any) => {
        let eIconGui = document.createElement('span');
        return (eIconGui.innerHTML =
          params.data.docName +
          ' ' +
          '<br>' +
          '<em class="material-icons" style="border : 1px solid #707070;">insert_invitation</em>' +
          ' ' +
          params.data.time);
      },
    },
  ];
  columnDefExcel = [
    {
      field: 'excelName',
      width: 300,
      flex: 1,
      resizable: true,
      sortable: true,
      wrapText: true,
      autoHeight: true,
      cellRenderer: (params: any) => {
        let eIconGui = document.createElement('span');
        return (eIconGui.innerHTML =
          params.data.excelName +
          ' ' +
          '<br>' +
          '<em class="material-icons" style="border : 1px solid #707070;">insert_invitation</em>' +
          ' ' +
          params.data.time);
      },
    },
  ];
  columnDefPpt = [
    {
      field: 'pptName',
      width: 300,
      flex: 1,
      resizable: true,
      sortable: true,
      wrapText: true,
      autoHeight: true,
      cellRenderer: (params: any) => {
        let eIconGui = document.createElement('span');
        return (eIconGui.innerHTML =
          params.data.pptName +
          ' ' +
          '<br>' +
          '<em class="material-icons" style="border : 1px solid #707070;">insert_invitation</em>' +
          ' ' +
          params.data.time);
      },
    },
  ];

  mainDocArray = [];
  mainExcelArray = [];
  mainPptArray = [];

  public gridApi: any = GridApi<any>;
  fileName: any;
  isLogged: boolean = false;
  auth = inject(AuthserviceService);
  row(p: any) {
    let row = this.gridApi.getSelectedRows();
    this.docArray = this.mainDocArray.filter((data) => data[0] == p.data.id);
  }

  call(p: any, type: string) {
    if (type == 'doc') {
      this.urlDoc = this.docArray.filter(
        (item: any[]) => item[0] == p[0].id
      )[0][1].url;
      this.docId = p[0].id;
      console.log(this.docArray, p);
      this.fileName = this.docArray.filter(
        (item: any[]) => item[0] == p[0].id
      )[0][1].filename;
    } else if (type == 'excel') {
      this.urlxl = this.excelArray.filter(
        (item: any[]) => item[0] == p[0].id
      )[0][1].url;
      this.docId = this.excelArray.filter(
        (item: any[]) => item[0] == p[0].id
      )[0][1].id;
      this.fileName = this.excelArray.filter(
        (item: any[]) => item[0] == p[0].id
      )[0][1].filename;
    } else {
      this.urlppt = this.pptArray.filter(
        (item: any[]) => item[0] == p[0].id
      )[0][1].url;
      this.docId = this.pptArray.filter(
        (item: any[]) => item[0] == p[0].id
      )[0][1].id;
      this.fileName = this.pptArray.filter(
        (item: any[]) => item[0] == p[0].id
      )[0][1].filename;
    }
  }
  onGridReady(p: any) {
    this.gridApi = p.api;
  }

  cloudName = 'djjxgxipp'; // replace with your own cloud name
  uploadPreset = 'cu0julqm'; // replace with your own upload preset
  myWidget: any;
  docId: string = '';
  imgArray!: any;

  urlDoc: string = `https://docs.google.com/viewerng/viewer?url=https://res.cloudinary.com/djjxgxipp/raw/upload/v1709807175/codeshareimages/pnbjj4bi3k10yuxdjneg.doc`;

  urlxl: string =
    'https://view.officeapps.live.com/op/embed.aspx?src=https://go.microsoft.com/fwlink/?LinkID=521962';

  urlppt: string =
    'https://view.officeapps.live.com/op/embed.aspx?src=  http://www.dickinson.edu/download/downloads/id/1076/sample_powerpoint_slides.pptx';

  urlSafe!: SafeResourceUrl;

  constructor(
    private cloudinary: CloudinaryService,
    private http: HttpserviceService,
    public sanitizer: DomSanitizer
  ) {}

  getData() {
    this.http.getAllImages().subscribe((data) => {
      let dataObj = Object.entries(data);
      this.docArray = dataObj.filter(
        (item: { type: string }[]) => item[1].type == 'doc'
      );
      this.excelArray = dataObj.filter(
        (item: { type: string }[]) => item[1].type == 'excel'
      );
      this.pptArray = dataObj.filter(
        (item: { type: string }[]) => item[1].type == 'ppt'
      );

      let arr: any[] = [];
      this.docArray.forEach((element: { filename: string; id: string, time : string }[]) => {
        arr.push({ docName: element[1].filename, id: element[0] , time : element[1].time});
      });
      arr.reverse();
      this.rowDataDoc = arr;
      arr = [];
      this.excelArray.forEach((element: { filename: string; id: string , time : string}[]) => {
        arr.push({ excelName: element[1].filename, id: element[0] , time : element[1].time});
      });
      arr.reverse();
      this.rowDataExcel = arr;
      arr = [];
      this.pptArray.forEach((element: { filename: string; id: string , time : string}[]) => {
        arr.push({ pptName: element[1].filename, id: element[0] , time : element[1].time });
      });
      arr.reverse();
      this.rowDataPpt = arr;
    });
  }

  ngOnInit(): void {
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.urlDoc);
    if (sessionStorage.getItem('specialUser') == 'yes') {
      this.isLogged = true;
      this.auth.setUser();
    }

    this.auth.sub.subscribe((res) => (this.isLogged = this.auth.isLogged));
    this.getData();
  }

  downloadDoc(url: string) {}

  deleteDoc(id: string) {
    console.log(id);
    this.http.deleteImg(id).subscribe((res) => this.getData());
  }

  pdflist = ['first', 'second', 'third', 'fourth'];

  docType: string = 'doc';
  selectDocumentType(type: any) {
    switch (type) {
      case 'doc':
        this.docType = 'doc';
        this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(
          this.urlDoc
        );
        break;

      case 'xl':
        (this.docType = 'xl'),
          (this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(
            this.urlxl
          ));
        break;
      case 'ppt':
        (this.docType = 'ppt'),
          (this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(
            this.urlppt
          ));
        break;
      default:
        (this.docType = 'doc'),
          (this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(
            this.urlDoc
          ));
    }
  }
}
