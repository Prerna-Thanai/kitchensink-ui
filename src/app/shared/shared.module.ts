import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { CapitalizeFirstWordPipe } from './pipe/capitalize-first-word.pipe';
import { LoaderComponent } from './loader/loader.component';
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  declarations: [
    LoaderComponent,
    HeaderComponent,
    CapitalizeFirstWordPipe     
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgxSpinnerModule
  ],
  exports: [LoaderComponent, HeaderComponent, CapitalizeFirstWordPipe]
})
export class SharedModule { }