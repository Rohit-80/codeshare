import { Component, OnInit } from '@angular/core';
import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen';
import {fill} from "@cloudinary/url-gen/actions/resize";
import { CloudinaryService } from './cloudinary.service';
import { HttpserviceService } from './services/httpservice.service';
import { SafeResourceUrl, DomSanitizer } from "@angular/platform-browser";
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  rowData = [
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
  ];

  // Column Definitions: Defines the columns to be displayed.
  colDefs: ColDef[] = [
    { field: "make" },
    { field: "model" },
    { field: "price" },
    { field: "electric" }
  ];


  
  src = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  cloudName = "djjxgxipp"; // replace with your own cloud name
  uploadPreset = "cu0julqm"; // replace with your own upload preset
  myWidget : any;
  img! : CloudinaryImage;
  imgArray! : any;
  pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";

  // name = "Angular " + VERSION.major;
  // url = 'https://view.officeapps.live.com/op/embed.aspx?src=http://localhost:5000/assets/file-sample_1MB.doc';

  urlDoc: string = `https://view.officeapps.live.com/op/embed.aspx?src=https://stackblitz.com/storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBdkpMIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--e75389b18343665404852ed4cba8bd25938fa9bd/file-sample_1MB.doc`;

  urlxl: string =
    "https://view.officeapps.live.com/op/embed.aspx?src=https://go.microsoft.com/fwlink/?LinkID=521962";

  urlppt: string =
    "https://view.officeapps.live.com/op/embed.aspx?src=  http://www.dickinson.edu/download/downloads/id/1076/sample_powerpoint_slides.pptx";

  urlSafe!: SafeResourceUrl;
 

   
  constructor(private cloudinary: CloudinaryService, private http : HttpserviceService,public sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.urlDoc);

    const cld = new Cloudinary({cloud: {cloudName: 'djjxgxipp'}});
    this.img = cld.image('codeshareimages');
    
    this.http.getAllImages().subscribe(data=>{
       this.imgArray = Object.entries(data)
      //  console.log(this.imgArray)
    });
  

    // Resize to 250 x 250 pixels using the 'fill' crop mode.
    // this.img.resize(fill().width(250).height(250));



    // this.myWidget =  this.cloudinary.createUploadWidget(
    //   {
    //     cloudName: this.cloudName,
    //     uploadPreset: this.uploadPreset
    //     // cropping: true, //add a cropping step
    //     // showAdvancedOptions: true,  //add advanced options (public_id and tag)
    //     // sources: [ "local", "url"], // restrict the upload sources to URL and local files
    //     // multiple: false,  //restrict upload to a single file
    //     // folder: "user_images", //upload files to the specified folder
    //     // tags: ["users", "profile"], //add the given tags to the uploaded files
    //     // context: {alt: "user_uploaded"}, //add the given context data to the uploaded files
    //     // clientAllowedFormats: ["images"], //restrict uploading to image files only
    //     // maxImageFileSize: 2000000,  //restrict file size to less than 2MB
    //     // maxImageWidth: 2000, //Scales the image down to a width of 2000 pixels before uploading
    //     // theme: "purple", //change to a purple theme
    //   },
    //   (error: any, result: { event: string; info: { secure_url: string; }; }) => {
    //     if (!error && result && result.event === "success") {
    //       console.log("Done! Here is the image info: ", result.info);
    //        this.http.addImage(result.info.secure_url).subscribe(res=>console.log(res))
    //       // document
    //       //   .getElementById("uploadedimage")
    //       //   .setAttribute("src", result.info.secure_url);
    //     }
    //   }
    // ).subscribe(widget => this.myWidget = widget);;


   


  }
  openWidget() {
    console.log(this.myWidget)
    this.myWidget?.open();
  }
 
 ok(){
       let val:any = document.querySelector('#test');
       val.focus()
       val.selectionEnd = val.selectionStart = val.value.length
 }
}
