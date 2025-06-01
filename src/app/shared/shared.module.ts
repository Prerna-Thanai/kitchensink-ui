import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../loader/loader.component';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { CapitalizeFirstWordPipe } from './pipe/capitalize-first-word.pipe';

@NgModule({
  declarations: [
    LoaderComponent,
    HeaderComponent,
    CapitalizeFirstWordPipe     
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [LoaderComponent, HeaderComponent, CapitalizeFirstWordPipe]
})
export class SharedModule { }