import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Profile } from './profile';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {

    constructor(private httpClient: HttpClient) { }

    getProfile(): Observable<Profile> {
        return this.httpClient.get<Profile>('https://graph.microsoft.com/v1.0/me');
    }
}
