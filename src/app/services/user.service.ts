import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Member, MemberRole } from '../models/member.model';
import { PagedModel } from '../admin/admin.component';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userUrl = environment.userUrl;
  private allUsersUrl = environment.allUsersUrl;
  private userApiUrl = environment.userApiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  getUser(): Observable<any> {
    return this.http.get<any>(this.userUrl, { withCredentials: true });
  }
  
  getUsers(params: HttpParams, currentPage: number, itemsPerPage: number): Observable<any> {
    return this.http.get<PagedModel<Member>>(this.allUsersUrl, { params, withCredentials: true }).pipe(
      catchError(err => {
        console.error('API Error:', err);
        // Return a default PagedModel on error to prevent application crash
        return of({
          content: [],
          page: {
            size: itemsPerPage,
            number: currentPage,
            totalElements: 0,
            totalPages: 0
          }
        });
      })
    );
}

updateMember(memberId: string, updatedFormPartial: {
    name: string;
    phoneNumber: string;
    roles: MemberRole[];
    email: string;
    unBlockMember: boolean;
  }): Observable<Member> {
    // const payload: Partial<Member> = {
    //   name: updatedFormPartial.name,
    //   phoneNumber: updatedFormPartial.phoneNumber,
    //   roles: [updatedFormPartial.role], 
    //   email: originalMember.email,
    //   unblockMember: updatedFormPartial.unblockMember
    // };
    return this.http.put<Member>(`${this.userApiUrl}/${memberId}`, updatedFormPartial, { withCredentials: true });
  }

  /**
   * Deletes a member by ID.
   * @param memberId The ID of the member to delete.
   * @returns An Observable of any (or void if backend returns no content).
   */
  deleteMember(memberId: string): Observable<any> {
    return this.http.delete(`${this.userApiUrl}/${memberId}`, { withCredentials: true });
  }

  

}
