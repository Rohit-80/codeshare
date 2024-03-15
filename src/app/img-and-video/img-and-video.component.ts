import { AuthserviceService } from './../services/authservice.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CloudinaryService } from './cloudinary.service';
import { HttpserviceService } from '../services/httpservice.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen';
import { FormControl, FormGroup, Validators } from '@angular/forms';
//dsfhajjflsjfjdsah sfj sj oi 835i 98t jwlkkj 95 jglk fjfj 0-4 f ji 940-9t9389043859438509438509348593509435034509384
@Component({
  selector: 'app-img-and-video',
  templateUrl: './img-and-video.component.html',
  styleUrls: ['./img-and-video.component.css'],
})
export class ImgAndVideoComponent implements OnInit {
  @ViewChild('uploadSelect') upSelect!: ElementRef;
  uploadSelect = 'None';
  cloudName = 'djjxgxipp';
  uploadPreset = 'cu0julqm';
  myWidget: any;
  img!: CloudinaryImage;
  imgForm: any;

  imgArray!: any;
  videoArray!: any;
  mainImgData: any;

  curPageNo: number = 0;

  rowDataImg = [{}];
  rowDataVideo = [{}];
  columnDefImg = [
    {
      field: 'imgName',
      flex: 1,
      resizable: true,
      sortable: true,
      wrapText: true,
      autoHeight: true,
      cellRenderer: (params: any) => {
        let eIconGui = document.createElement('span');
        return (eIconGui.innerHTML =
          params.data.imgName +
          ' ' +
          '<br>' +
          '<em class="material-icons" style="border : 1px solid #707070;">insert_invitation</em>' +
          ' ' +
          params.data.time);
      },
    },
  ];
  columnDefVideo = [
    {
      field: 'videoName',
      width: 300,
      flex: 1,
      resizable: true,
      sortable: true,
      wrapText: true,
      autoHeight: true,
      cellRenderer: (params: any) => {
        let eIconGui = document.createElement('span');
        return (eIconGui.innerHTML =
          params.data.videoName +
          ' ' +
          '<br>' +
          '<em class="material-icons" style="border : 1px solid #707070;">insert_invitation</em>' +
          ' ' +
          params.data.time);
      },
    },
  ];
  mainVideoData: any;

  call(event: any) {}

  constructor(
    private cloudinary: CloudinaryService,
    private http: HttpserviceService,
    public sanitizer: DomSanitizer,
    private auth: AuthserviceService
  ) {}

  async downloadImage(imageSrc: string) {
    const image = await fetch(imageSrc);
    const imageBlog = await image.blob();
    const imageURL = URL.createObjectURL(imageBlog);

    const link = document.createElement('a');
    link.href = imageURL;
    link.download = 'image file name here';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  deleteImage(id: string) {
    this.http.deleteImg(id).subscribe((res) => this.getData());
  }
  deleteVideo(id: string) {
    this.http.deleteVideo(id).subscribe((res) => this.getData());
  }

  refreshImgData(pageNo: number) {
    this.imgArray = this.mainImgData?.slice(pageNo * 8, pageNo * 8 + 8);
  }

  refreshVideoData(pageNo: number) {
    this.videoArray = this.mainVideoData?.slice(pageNo * 8, pageNo * 8 + 8);
  }

  getData() {
    this.http.getAllImages().subscribe((data) => {
      let dataObj = Object.entries(data);

      this.imgArray = dataObj.filter(
        (item: { type: string }[]) => item[1].type == 'img'
      );
      this.mainImgData = Array.from(this.imgArray);
      this.videoArray = dataObj.filter(
        (item: { type: string }[]) => item[1].type == 'video'
      );
      this.mainVideoData = Array.from(this.videoArray);

      let arr: any[] = [];
      this.imgArray.forEach(
        (element: { filename: string; id: string; time: string }[]) => {
          // console.log(element);
          arr.push(
            {
              imgName: `${element[1].filename}`,
              id: element[0],
              time: element[1].time,
            } ?? ''
          );
        }
      );
      arr.reverse();
      this.rowDataImg = arr;
      arr = [];
      this.videoArray.forEach(
        (element: { filename: string; id: string; time: string }[]) => {
          arr.push({
            videoName: element[1].filename,
            id: element[0],
            time: element[1].time,
          });
        }
      );
      arr.reverse();
      this.rowDataVideo = arr;
    });
  }

  isLogged = this.auth.isLogged;

  pageImgEvent(event: any) {
    this.curPageNo = event;
    this.refreshImgData(this.curPageNo);
  }

  pageVideoEvent(event: any) {
    this.curPageNo = event;
    this.refreshVideoData(this.curPageNo);
  }

  ngOnInit() {
    // this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.urlDoc);
    if (sessionStorage.getItem('specialUser') == 'yes') {
      this.isLogged = true;
      this.auth.setUser();
    }

    this.auth.sub.subscribe((res) => (this.isLogged = this.auth.isLogged));

    this.imgForm = new FormGroup({
      upload: new FormControl(null, Validators.required),
    });

    const cld = new Cloudinary({ cloud: { cloudName: 'djjxgxipp' } });
    this.img = cld.image('codeshareimages');

    this.getData();

    // Resize to 250 x 250 pixels using the 'fill' crop mode.
    // this.img.resize(fill().width(250).height(250));

    this.myWidget = this.cloudinary
      .createUploadWidget(
        {
          cloudName: this.cloudName,
          uploadPreset: this.uploadPreset,
          // cropping: true, //add a cropping step
          // showAdvancedOptions: true,  //add advanced options (public_id and tag)
          // sources: [ "local", "url"], // restrict the upload sources to URL and local files
          // multiple: false,  //restrict upload to a single file
          // folder: "user_images", //upload files to the specified folder
          // tags: ["users", "profile"], //add the given tags to the uploaded files
          // context: {alt: "user_uploaded"}, //add the given context data to the uploaded files
          // clientAllowedFormats: ["images"], //restrict uploading to image files only
          // maxImageFileSize: 2000000,  //restrict file size to less than 2MB
          // maxImageWidth: 2000, //Scales the image down to a width of 2000 pixels before uploading
          // theme: "purple", //change to a purple theme
        },
        (
          error: any,
          result: {
            event: string;
            info: { secure_url: string; original_filename: string };
          }
        ) => {
          if (!error && result && result.event === 'success') {
            console.log('Done! Here is the image info: ', result.info);
            this.http
              .addImage(
                result.info.secure_url,
                this.uploadval,
                result.info.original_filename
              )
              .subscribe((res) => console.log(res));
          }
        }
      )
      .subscribe((widget) => (this.myWidget = widget));
  }
  openWidget() {
    console.log(this.myWidget);
    this.myWidget?.open();
  }
  uploadval: string = '';
  imgFormSubmit() {
    this.uploadval = this.imgForm.value.upload;

    this.openWidget();
  }
}
