import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { ApiService, ServiceType } from 'src/app/services';
import { redirectWithParams, sleep } from 'src/app/utility';

@Component({
    selector: 'popup-dialog-login',
    templateUrl: './popup-dialog-login.html',
    styleUrls: ['./popup-dialog-login.scss']
})
export class PopupDialogLogin implements OnInit {
    dialog_content: string | undefined;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<PopupDialogLogin>,
        private apiService: ApiService,
        private cookieService: CookieService
    ) {
        this.dialog_content = "Executing Action, Please Wait...";
    }

    ngOnInit(): void {
        const { accountModel, nextLink } = this.data;

        const observable_data = this.apiService.makePostRequest(ServiceType.Login, accountModel);

        observable_data.subscribe({
            next: async (response: any) => {
                this.dialog_content = response.description;
                await sleep(1500);

                // Set Cookie (For Web Apps)
				this.cookieService.set( 'email', accountModel.email );
				this.cookieService.set( 'user_token', response.payload );

                // Redirect with query
                const params = {
                    email: accountModel.email,
                    token: response.payload
                };
                redirectWithParams(nextLink, params);
            },
            error: async (error: any) => {
                this.dialog_content = "Error Occurred! \n";
                this.dialog_content += error.error.description;
                await sleep(1500);
            }
        });
    }
}