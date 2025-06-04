import { Component } from '@angular/core';
// import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-loader',
  // template: `<div *ngIf="loaderService.loading$ | async" class="loader-overlay"><div class="spinner"></div></div>`,
  templateUrl: './loader.component.html',
  standalone: false,
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  // constructor(public loaderService: LoaderService) {}
}
