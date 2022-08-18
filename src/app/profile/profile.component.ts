import { Component, OnInit } from '@angular/core';
import { Profile } from '../profile';
import { ProfileService } from '../profile.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

    profile: Profile = {};

    constructor(private profileService: ProfileService) { }

    ngOnInit(): void {
        this.getProfile();
    }

    getProfile(): void {
        this.profileService.getProfile().then((profile: Profile) => {
            this.profile = profile;
        }).catch((error: any) => {
            console.log(error);
        });
    }
}
