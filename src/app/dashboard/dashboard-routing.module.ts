import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { NgModule } from "@angular/core";
// import { ProfileComponent } from "./profile/profile.component";
// import { UsersComponent } from "./users/users.component";
// import { authGuard } from "../shared/guards/auth.guard";
// import { ReportComponent } from "./report/report.component";

const routes: Routes = [
    {
      path: '',
      component: DashboardComponent,
      children: [
        // { path: 'profile', component: ProfileComponent },
        // { path: 'users', component: UsersComponent },
        // { path: 'report', component: ReportComponent },
        { path: '', redirectTo: 'profile', pathMatch: 'full' }
      ]
    }
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class DashboardRoutingModule {}