import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';

import { MsalBroadcastService, MsalGuard, MsalGuardConfiguration, MsalInterceptor, MsalInterceptorConfiguration, MsalRedirectComponent, MsalService, MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG, ProtectedResourceScopes } from '@azure/msal-angular';
import { BrowserCacheLocation, InteractionType, IPublicClientApplication, LogLevel, PublicClientApplication } from '@azure/msal-browser';
import { RouterStateSnapshot } from '@angular/router';

function MSALInstanceFactory(): IPublicClientApplication {
    return new PublicClientApplication({
        auth: {
            clientId: 'ENTER_YOUR_CLIENT_ID',
            authority: 'https://login.microsoftonline.com/ENTER_YOUR_TENANT_ID',
            redirectUri: '/auth',
            postLogoutRedirectUri: '/',
        },
        cache: {
            cacheLocation: BrowserCacheLocation.SessionStorage,
        },
        system: {
            loggerOptions: {
                loggerCallback: (level, message, containsPii) => {
                    console.log(message)
                },
                logLevel: LogLevel.Verbose,
            }
        }
    })
}

function MsalGuardConfigFactory(): MsalGuardConfiguration {
    return {
        interactionType: InteractionType.Redirect,
        authRequest: ((authService: MsalService, state: RouterStateSnapshot) => {
            return {
                scopes: ['user.read'],
                loginHint: state.root.queryParams['userId'] || undefined
            }
        })
    }
}

function MsalInterceptorConfigFactory(): MsalInterceptorConfiguration {

    const myProtectedResourceMap = new Map<string, Array<string | ProtectedResourceScopes> | null>();
    
    myProtectedResourceMap.set('https://graph.microsoft.com/v1.0/me', [
        {
            httpMethod: 'GET',
            scopes: ['user.read']
        }
    ]);

    return {
        interactionType: InteractionType.Popup,
        protectedResourceMap: myProtectedResourceMap
    }
}

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        ProfileComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatButtonModule,
        MatToolbarModule,
        MatListModule,
        MatMenuModule,
        MatCardModule
    ],
    providers: [
        {
            provide: MSAL_INSTANCE,
            useFactory: MSALInstanceFactory
        },
        {
            provide: MSAL_GUARD_CONFIG,
            useFactory: MsalGuardConfigFactory
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: MsalInterceptor,
            multi: true
        },
        {
            provide: MSAL_INTERCEPTOR_CONFIG,
            useFactory: MsalInterceptorConfigFactory
        },
        MsalService,
        MsalBroadcastService,
        MsalGuard
    ],
    bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }
