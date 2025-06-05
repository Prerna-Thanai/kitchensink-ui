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
  private searchMembersUrl = environment.searchMembersUrl;

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

  searchMembersByCriteria(params: {
  name?: string;
  email?: string;
  role?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: string;
  showInactiveMembers?: boolean;
}): Observable<any> {

  let sortColumn = params.sortBy || 'id';

  if (sortColumn === 'joiningDate') {
    sortColumn = 'createdAt';
  }

  let httpParams = new HttpParams()
    .set('page', params.page?.toString() || '0')
    .set('size', params.size?.toString() || '10')
    .set('showInactiveMembers', params.showInactiveMembers?.toString() || 'false')
    .set('sort', `${sortColumn},${params.sortDirection}`);

  // Prepare the request body
  const body: any = {};
  if (params.name) body.name = params.name;
  if (params.email) body.email = params.email;
  if (params.role) body.role = params.role;

  return this.http.post<any>(
    this.searchMembersUrl,
    body,
    {
      params: httpParams,
      withCredentials: true
    }
  );
}

  

}
