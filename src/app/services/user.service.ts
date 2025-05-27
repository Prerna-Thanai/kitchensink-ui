import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

    private userUrl = environment.userUrl;

    constructor(private http: HttpClient, private router: Router) {}
    
    getUser(): Observable<any> {
            return this.http.get(`${this.userUrl}`,{ withCredentials: true });
          }

}