import { Component, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { InteractionStatus } from '@azure/msal-browser';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    isAuthenticated = false;
    private unsubscribe = new Subject<void>();

    constructor(private msalService: MsalService, private msalBroadcastService: MsalBroadcastService) { }

    ngOnInit(): void {
        this.msalBroadcastService.inProgress$
            .pipe(
                filter((status: InteractionStatus) => status === InteractionStatus.None),
                takeUntil(this.unsubscribe)
            )
            .subscribe(() => {
                this.setAuthenticationStatus();
            })
    }

    setAuthenticationStatus(): void {
        this.isAuthenticated = this.msalService.instance.getAllAccounts().length > 0;
    }
}
