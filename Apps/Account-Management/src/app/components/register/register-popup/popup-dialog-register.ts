import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService, ServiceType } from 'src/app/services';
import { sleep } from 'src/app/utility';

@Component({
    selector: 'popup-dialog-register',
    templateUrl: './popup-dialog-register.html',
    styleUrls: ['./popup-dialog-register.scss']
})
export class PopupDialogRegister implements OnInit {
    dialog_content: string | undefined;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<PopupDialogRegister>,
        private apiService: ApiService
    ) {
        this.dialog_content = "Executing Action, Please Wait...";
    }

    ngOnInit(): void {
        const { accountModel, nextLink } = this.data;

        const observable_data = this.apiService.makePostRequest(ServiceType.Register, accountModel);

        observable_data.subscribe({
            next: async (response: any) => {
                this.dialog_content = response.description;
                await sleep(1500);
                window.location.href = nextLink;
            },
            error: async (error: any) => {
                this.dialog_content = "Error Occurred! \n";
                this.dialog_content += error.error.description;
                await sleep(1500);
            }
        });
    }
}