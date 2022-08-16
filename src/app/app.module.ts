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
import { InteractionType, IPublicClientApplication, LogLevel, PublicClientApplication } from '@azure/msal-browser';

function MSALInstanceFactory(): IPublicClientApplication {
    return new PublicClientApplication({
        auth: {
            clientId: '980ef833-2fe9-4d9a-b727-de25fac8ff95',
            authority: 'https://login.microsoftonline.com/cbaf2168-de14-4c72-9d88-f5f05366dbef',
            redirectUri: 'http://localhost:4200/auth'
        },
        cache: {
            cacheLocation: 'localStorage',
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
        authRequest: {
            scopes: ["user.read"]
        }
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
