import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from 'src/utils/env';

@Injectable({
  providedIn: 'root'
})
export class HttpserviceService {

  constructor(private http : HttpClient) {

   }


   addTextData(data : {[txt : string] : string}){
     return this.http.post(baseUrl+'txt.json',data);

   }

   getAllTextData(){
    return this.http.get(baseUrl+'txt.json');
   }

   deleteTxt(id:string){
     return this.http.delete(baseUrl+'txt/'+ id + '.json');
   }

   deleteImg(id : string){
    return this.http.delete(baseUrl+'images/'+ id + '.json');
   }

   deleteVideo(id : string){
    return this.http.delete(baseUrl+'images/'+ id + '.json');
   }
   updateData(data : any,id : string){
    id = data[0];
    console.log(data)
    return this.http.patch(baseUrl+'txt/'+ id + '.json',{...data[1],txt : data.txt});
     
   }

   addImage(imgurl : string,type : string,filename : string){

    return this.http.post(baseUrl+'images.json',{url : imgurl,type : type,filename : filename , time : getTime()});
   }
  
   getAllImages(){
     return  this.http.get(baseUrl+'images.json');
   }

}


function getTime(){
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

    return dateString
}