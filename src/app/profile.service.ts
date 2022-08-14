import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Profile } from './profile';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {

    constructor() { }

    getProfile(): Observable<Profile> {
        return new Observable<Profile>(observer => {
            observer.next({
                displayName: "John Doe",
                givenName: "John",
                id: "1",
                jobTitle: "Software Engineer",
                mail: "jdoe@azure.net",
                surname: "Doe",
                userPrincipalName: "jdoe@azure.net"
            });
        })
    }
}
