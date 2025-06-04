import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private requestCount = 0;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  constructor(private spinner: NgxSpinnerService) {}

  show(): void {
    this.requestCount++;
    if (this.requestCount === 1) {
      this.loadingSubject.next(true);
      this.spinner.show();
    }
  }

  hide(): void {
    this.requestCount = Math.max(this.requestCount - 1, 0);
    if (this.requestCount === 0) {
      this.spinner.hide();
      this.loadingSubject.next(false);
    }
  }

  reset(): void {
    this.requestCount = 0;
    this.loadingSubject.next(false);
    this.spinner.hide();
  }
}