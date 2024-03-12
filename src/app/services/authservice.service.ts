import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { baseUrl } from 'src/utils/env';

@Injectable({
  providedIn: 'root',
})
export class AuthserviceService {
  constructor(private http: HttpClient) {}
 
   User : string = 'Normal user';
   isLogged : boolean = false;
   sub = new Subject<any>;
   setUser(){
    // console.log('called')
        this.isLogged = true;
        this.User = 'Special user';
        this.sub.next(10);

       
        
   }
   

   clearUser(){
    
    this.isLogged = false;
    this.sub.next(10);
    this.User = 'Normal user';
    sessionStorage.removeItem('specialUser');
   }

}
