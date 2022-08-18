import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

import { Profile } from './profile';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {

    constructor(private msalService: MsalService, private httpClient: HttpClient) { }

    getProfile(): Promise<Profile> {
        return new Promise((resolve, reject) => {
            this.httpClient.get('https://graph.microsoft.com/v1.0/me')
                .subscribe(
                    (response: any) => {
                        resolve(response);
                    },
                    (error: any) => {
                        if (error.status === 401) {
                            if (error.headers.get('www-authenticate')) {
                                this.handleClaimsChallenge(error);
                            }
                        }
                        reject(error);
                    }
                );
        });
    }

    handleClaimsChallenge(response: any): void {
        const authenticateHeader: string = response.headers.get('www-authenticate');

        const claimsChallenge: any = authenticateHeader
            ?.split(' ')
            ?.find((entry) => entry.includes('claims='))
            ?.split('claims="')[1]
            ?.split('",')[0];

        sessionStorage.setItem(`claimsChallenge`, claimsChallenge);

        this.msalService.instance.acquireTokenRedirect({
            account: this.msalService.instance.getActiveAccount()!,
            scopes: ['user.read'],
            claims: window.atob(claimsChallenge),
        });
    }
}
