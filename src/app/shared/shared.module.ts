import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../loader/loader.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    LoaderComponent,
    HeaderComponent     
  ],
  imports: [
    CommonModule
  ],
  exports: [LoaderComponent, HeaderComponent]
})
export class SharedModule { }