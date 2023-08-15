import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AccountModel } from 'src/app/models';
import { PopupDialogLogin } from './login-popup/popup-dialog-login';
import { ALLOWED_REDIRECTS } from 'src/app/consts';

interface DialogData {
	accountModel?: AccountModel,
	nextLink?: string
}

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	dialogData: DialogData;

	// Login Form Group
	loginFormGroup = this._formBuilder.group({
		Email_Ctrl: ['', Validators.required],
		Passwd_Ctrl: ['', Validators.required],
	});

	constructor(
		public dialog: MatDialog,
		private _formBuilder: FormBuilder,
		private route: ActivatedRoute
	) {
		this.dialogData = {}
	}

	ngOnInit(): void {
		this.route.queryParams.subscribe({
			next: (params) => {
				// Get "nextLink"
				// If none, set to empty string
				if (params.hasOwnProperty('nextLink')) this.dialogData.nextLink = params['nextLink'];
				else this.dialogData.nextLink = "";

				// Check If Link Provided is in Allowed External Redirects list, Set to empty string if none
				if (this.dialogData.nextLink == "" || !ALLOWED_REDIRECTS.includes(this.dialogData.nextLink!)) {
					this.dialogData.nextLink = "";
				}
			}
		});
	}

	back() {
		window.location.href = this.dialogData.nextLink!;
	}

	login() {
		// Get Values From Control
		const Email = this.loginFormGroup.get('Email_Ctrl')?.value as string;
		const Password = this.loginFormGroup.get('Passwd_Ctrl')?.value as string;

		// Make Object
		const accountModel = new AccountModel();
		accountModel.email = Email;
		accountModel.password = Password;

		this.dialogData.accountModel = accountModel;

		// Call Popup Dialog
		this.dialog.open(PopupDialogLogin, {
			disableClose: true,
			width: '500px',
			data: this.dialogData
		});
	}
}
