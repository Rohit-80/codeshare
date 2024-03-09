import { GridApi } from 'ag-grid-community';
import { Component, OnInit, inject } from '@angular/core';
import { HttpserviceService } from '../services/httpservice.service';
import { AuthserviceService } from '../services/authservice.service';

@Component({
  selector: 'app-pdffiles',
  templateUrl: './pdffiles.component.html',
  styleUrls: ['./pdffiles.component.css']
})
export class PdffilesComponent implements OnInit {
  auth = inject(AuthserviceService)

  public gridApi : any = GridApi<any>;
  rowDataPdf = [{}]
  columnDefPdf = [{
     field : 'pdfName',
     width : 300,
     flex: 1,
     resizable: true,
     sortable: true,
     wrapText: true,
     autoHeight: true,
     cellRenderer: (params: any) => {
       let eIconGui = document.createElement('span');
       return (eIconGui.innerHTML =
         params.data.pdfName +
         ' ' +
         '<br>' +
         '<em class="material-icons" style="border : 1px solid #707070;">insert_invitation</em>' +
         ' ' +
         params.data.time);
     },

     
  }]
   
  isLogged : boolean = false


  //  gridApi : any = GridApi<any>
  call(p: any) {
    // let row = this.gridApi.getSelectedRows();
    // this.src = event[0].url;
    this.pdfId = p[0].id;
    this.src = this.pdfArray.filter((item: any[])=>item[0] == p[0].id)[0][1].url;
    this.PdfName = this.pdfArray.filter((item: any[])=>item[0] == p[0].id)[0][1].filename;
    

  }

onGridReady(p : any){
   this.gridApi = p.api;
   
}


  constructor(public http : HttpserviceService) { }
  src = 'https://res.cloudinary.com/djjxgxipp/image/upload/v1709812054/codeshareimages/hcs6fydj9qzrttnlenwc.pdf';
  
  page: number = 1;
  totalPages: number = 0;
  isLoaded: boolean = false;

  afterLoadComplete(pdfData: any) {
    this.totalPages = pdfData.numPages;
    this.isLoaded = true;
  }

  nextPage() {
    this.page++;
  }

  prevPage() {
    this.page--;
  }
  pdfArray : any;
  pdfId : string = ''
  PdfName : string = ''

  getData(){
    this.http.getAllImages().subscribe((data) => {

      let dataObj = Object.entries(data);
      this.pdfArray = dataObj.filter((item: { type: string; }[]) => item[1].type == 'pdf');

      let arr: any[] = [];
      this.pdfArray.forEach((element: { filename: string,id : string,url : string , time : string }[]) => {
        arr.push({ pdfName : element[1].filename , id : element[0],url : element[1].url, time : element[1].time});
      });
      arr.reverse()
      this.rowDataPdf =  arr;
      
    });
  }

  ngOnInit(): void {
    if(sessionStorage.getItem('specialUser') == 'yes'){
      this.isLogged = true;
      this.auth.setUser();
    }

    this.auth.sub.subscribe(res=>this.isLogged = this.auth.isLogged)

      this.getData();
    
 
  }

  downloadPdf(url : string){

  }
  deletePdf(id : string){
      this.http.deleteImg(id).subscribe(res=>this.getData())
  }

}
