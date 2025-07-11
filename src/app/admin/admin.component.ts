import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Member, MemberRole } from '../models/member.model';
import { UserService } from '../services/user.service';
import { AbstractControl, NgForm, ValidationErrors } from '@angular/forms';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

// Updated PagedModel interface to precisely match your API response JSON
export interface PagedModel<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AdminComponent implements OnInit {

  users: Member[] = [];
  filteredUsers: Member[] = [];
  loading: boolean = true;
  error: string | null = null;

  // currentPage corresponds to the API's 'number' parameter (0-indexed)
  currentPage: number = 0;
  // itemsPerPage corresponds to the API's 'size' parameter
  itemsPerPage: number = 10;
  totalPages: number = 1;
  totalItems: number = 0;

  searchText: string = '';
  selectedRole: MemberRole | '' = '';
  showInactiveMembers: boolean = false; // For the backend parameter

  // --- Sorting properties ---
  sortColumn: keyof Member | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  showEditModal: boolean = false;
  selectedUser: Member | null = null;
  loggedInUser: Member | null = null;
   serverError = '';

  editUserForm: {
    id?: string;
    name: string;
    email: string;
    phoneNumber: string;
    role: MemberRole;
    joiningDate: string;
    blocked?: boolean;
  } = {} as any;

  allAvailableRoles: MemberRole[] = ['ADMIN', 'USER'];
  private phoneUtil = PhoneNumberUtil.getInstance();
phoneNumberError: string = '';
searchChanged = new Subject<string>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.serverError = '';
      this.userService.getUser().subscribe({
        next: (res: Member) => {
          this.loggedInUser = res;
        },
        error: (err) => {
        }
      });
    this.loadUsers();
      this.filteredUsers = [...this.users];
        this.searchChanged.pipe(debounceTime(300)).subscribe(() => {
      this.currentPage = 0;
      this.loadUsers();
      this.filteredUsers = [...this.users];
    });
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;

    this.fetchFilteredUsers();

  }

  private getUsersFromApi(): Observable<PagedModel<Member>> {
    let params = new HttpParams();

    // Append pagination parameters (0-indexed page number for backend)
    params = params.append('page', this.currentPage.toString());
    params = params.append('size', this.itemsPerPage.toString());

    // Append the showInactiveMembers parameter
    params = params.append('showInactiveMembers', this.showInactiveMembers.toString());

    // Append sorting parameter if a column is selected
    if (this.sortColumn) {
      // Adjust the sort property name if your backend expects a different name for 'roles'
      // e.g., 'roles[0].name' or just 'roles' if it can infer the sort
      let sortProperty = this.sortColumn === 'roles' ? 'roles' : this.sortColumn;
      // sortProperty = this.sortColumn === 'joiningDate' ? 'createdAt' : this.sortColumn;
      params = params.append('sort', `${sortProperty},${this.sortDirection}`);
    }

    // Make the HTTP GET request to your backend's /all endpoint
    return this.userService.getUsers(params, this.currentPage, this.itemsPerPage);
  }

  /**
   * Triggers a reload of users from the API, applying current filters, sorting, and pagination.
   */
  applyFilterAndPagination(): void {
    this.loadUsers();
  }

  /**
   * Sorts the data by the given column. Toggles sort direction if the same column is clicked.
   * @param column The column to sort by.
   */
  sortData(column: keyof Member): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc'; // Default to ascending when changing sort column
    }
    this.currentPage = 0; // Reset to the first page when applying new sort
    this.applyFilterAndPagination();
  }

  /**
   * Navigates to a specific page.
   * @param page The 0-indexed page number to navigate to.
   */
  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.applyFilterAndPagination();
    }
  }

  /**
   * Navigates to the next page.
   */
  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  /**
   * Navigates to the previous page.
   */
  prevPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  /**
   * Navigates to the first page.
   */
  goToFirstPage(): void {
    this.goToPage(0);
  }

  /**
   * Navigates to the last page.
   */
  goToLastPage(): void {
    this.goToPage(this.totalPages - 1);
  }

  /**
   * Generates an array of page numbers to display in the pagination control.
   * @returns An array of 0-indexed page numbers.
   */
  getPages(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(0, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages - 1, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  /**
   * Handles change in items per page dropdown.
   * @param event The change event.
   */
  onItemsPerPageChange(event: Event): void {
    this.itemsPerPage = +(event.target as HTMLSelectElement).value;
    this.currentPage = 0; // Reset to the first page when items per page changes
    this.applyFilterAndPagination();
  }

  /**
   * Handles changes in the search input.
   */
  onSearchChange(): void {

      this.currentPage = 0; // Reset to first page on search
  // this.fetchFilteredUsers();
this.searchChanged.next(this.searchText);    

  }

  /**
   * Handles changes in the role filter dropdown.
   */
  onRoleFilterChange(): void {

    this.currentPage = 0; // Reset to first page on filter
  this.fetchFilteredUsers();
  
  
  }

  fetchFilteredUsers() {
  this.loading = true;
  this.error = null;
  this.userService.searchMembersByCriteria({
    name: this.searchText || '',
    email: this.searchText || '',
    role: this.selectedRole || '',
    page: this.currentPage,
    size: this.itemsPerPage,
    sortBy: this.sortColumn?.trim() ? `${this.sortColumn}` : '',
    sortDirection: this.sortColumn?.trim() ? `${this.sortDirection}` : 'asc'
    }).subscribe({
    next: (response: any) => {
        this.totalItems = response.page.totalElements;
        this.totalPages = response.page.totalPages;
        this.itemsPerPage = response.page.size;
        this.currentPage = response.page.number;
        this.users = response.content;
        this.filteredUsers = response.content;
      this.loading = false;

      
    },
    error: (err: any) => {
      this.error = 'Failed to load users';
      this.loading = false;
    }
  });
}


  applyFilters(): void {
    const search = this.searchText.toLowerCase();
  this.filteredUsers = this.users.filter(user => {
    const matchesSearch = this.searchText &&
      (user.name.toLowerCase().includes(search) || user.email.toLowerCase().includes(search));

    const matchesRole = this.selectedRole && user.roles[0] === this.selectedRole;

    // If neither filter is active, show all
    if (!this.searchText && !this.selectedRole) return true;

    // If any one matches, include the user
    return matchesSearch || matchesRole;
  });
  }

  /**
   * Handles changes in the 'showInactiveMembers' checkbox.
   */
  onShowInactiveMembersChange(): void {
    this.currentPage = 0; // Reset to the first page when this filter changes
    this.applyFilterAndPagination();
  }

  /**
   * Opens the edit modal for a selected user.
   * @param member The member to edit.
   */
  editUser(member: Member): void {
    this.serverError = '';
    this.selectedUser = { ...member }; // Create a copy to avoid direct mutation
    this.editUserForm = {
      id: member.id,
      name: member.name,
      email: member.email,
      phoneNumber: member.phoneNumber,
      role: member.roles[0] || 'USER', // Assume the first role is the primary one
      joiningDate: member.joiningDate,
      blocked: member.blocked ?? false
    };
    this.showEditModal = true;
  }

  /**
   * Saves the changes made to a user.
   * In a real app, this would send an update request to the backend.
   */
  saveUser(form: NgForm): void {

     if (!this.validPhoneWithLib(this.editUserForm.phoneNumber)) {
    this.phoneNumberError = 'Please enter a valid phone number.';
    form.controls['phoneNumber']?.markAsTouched();
    return;
  }
    if (form.invalid) {
    // Mark all fields as touched to trigger error messages
    Object.values(form.controls).forEach(control => control.markAsTouched());
    return;
  }

    if (this.selectedUser && this.selectedUser.id) { // Ensure selectedUser and its ID exist
      this.loading = true;
      // Prepare the data to send to the backend
      const updatedFormPartialData = {
        name: this.editUserForm.name.trim(),
        phoneNumber: this.editUserForm.phoneNumber.trim(),
        roles: [this.editUserForm.role],
        email: this.selectedUser.email, // Keep the original email
        unBlockMember: (this.selectedUser.blocked && !this.editUserForm.blocked) ?? false
      };

      this.userService.updateMember(this.selectedUser.id, updatedFormPartialData).subscribe({
        next: (updatedMember) => {
          // Update the user in the local array to reflect changes immediately
          const index = this.users.findIndex(m => m.id === updatedMember.id);
          if (index !== -1) {
            this.users[index] = updatedMember;
            this.filteredUsers = [...this.users]; // Re-assign to trigger Angular change detection
          }
          this.closeEditModal();
          this.loading = false;
        },
        error: (err) => {
          console.log('Error updating user:', err);
            this.showEditModal = true;
          this.serverError = err.error?.message || 'Something went wrong';
          this.loading = false;
        }
      });
    } else {
      this.error = 'No user selected for editing or user ID is missing.';
    }
  }

  /**
   * Deletes a user after confirmation.
   * In a real app, this would send a delete request to the backend.
   * @param memberId The ID of the member to delete.
   */
  deleteUser(memberId: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.loading = true;
      this.userService.deleteMember(memberId).subscribe({
        next: (deleteMember) => {
          this.loadUsers(); // Reload all users after deletion to refresh pagination
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          this.error = 'Failed to delete user. Please try again.';
          this.loading = false;
        }
      });
    }
  }

  /**
   * Closes the edit modal and resets the form.
   */
  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedUser = null;
    this.editUserForm = {
      name: '', phoneNumber: '', role: 'USER', blocked: false // Reset blocked as well
    } as any;
    this.serverError = '';
  }

  validPhoneWithLib(phone: string): boolean {
  if (!phone) return false;

  try {
    const phoneRegex = /^[6-9][0-9]{9}$/;
      const isBasicValid= phoneRegex.test(phone); // Check basic format
      if(!isBasicValid){
        console.log('Invalid phone format');
        return true;
      }

    const parsed = this.phoneUtil.parse(phone, 'IN');
    return this.phoneUtil.isValidNumberForRegion(parsed, 'IN');
  } catch (e) {
    return false;
  }
}

onPhoneNumberChange() {
  const isValid = this.validPhoneWithLib(this.editUserForm.phoneNumber);
  this.phoneNumberError = isValid ? '' : 'Please enter a valid phone number.';
}
}