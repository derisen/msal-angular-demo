import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';

import { MsalGuard, MsalRedirectComponent } from '@azure/msal-angular';

const routes: Routes = [
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [MsalGuard]
    },
    {
        path: 'auth',
        component: MsalRedirectComponent
    },
    {
        path: '',
        component: HomeComponent,
        canActivate: [MsalGuard]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
