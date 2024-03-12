import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root',
  })
  export class NotiferService {
    
     removeTextFilterObs = new Subject<any>();

     removeTextFilter(){
           this.removeTextFilterObs.next({});
     }

     
  }