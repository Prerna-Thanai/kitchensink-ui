import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module'; // Import AppRoutingModule
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
// import { CookieService } from 'ngx-cookie-service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from './loader/loader.component';
// import { LoadingInterceptor } from './shared/interceptors/loading.interceptor';
// import { TokenInterceptor } from './shared/interceptors/token.interceptor';
// import { SharedModule } from './shared/shared.module';
// import { CoreModule } from './core/core.module';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent
    // LoaderComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    // SharedModule,
    // CoreModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
//   providers: [CookieService, {
//     provide: HTTP_INTERCEPTORS,
//     useClass: LoadingInterceptor,
//     multi: true
//   },
//   {
//     provide: HTTP_INTERCEPTORS,
//     useClass: TokenInterceptor,
//     multi: true
//   }
// ],
  bootstrap: [AppComponent]
})
export class AppModule { }