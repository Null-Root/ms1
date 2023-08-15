import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountModel } from 'src/app/models';
import { MatDialog } from '@angular/material/dialog';
import { PopupDialogRegister } from './register-popup/popup-dialog-register';
import { ActivatedRoute } from '@angular/router';
import { ALLOWED_REDIRECTS } from 'src/app/consts';

interface DialogData {
	accountModel?: AccountModel,
	nextLink?: string
}

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
	dialogData: DialogData;
	stepperOrientation: Observable<StepperOrientation>;

	// First Form Group: Basic Info
	firstFormGroup = this._formBuilder.group({
		FN_Ctrl: ['', Validators.required],
		LN_Ctrl: ['', Validators.required],
		DoB_Ctrl: ['', Validators.required],
	});

	// Second Form Group: Credentials
	secondFormGroup = this._formBuilder.group({
		Email_Ctrl: ['', Validators.required],
		Passwd_Ctrl: ['', Validators.required],
	});

	constructor(
		public dialog: MatDialog,
		private _formBuilder: FormBuilder,
		breakpointObserver: BreakpointObserver,
		private route: ActivatedRoute
	) {
		this.stepperOrientation = breakpointObserver
			.observe('(min-width: 800px)')
			.pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
		
			this.dialogData = {}
	}

	ngOnInit(): void {
		this.onChanges();

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

	onChanges() {
		this.firstFormGroup.valueChanges.subscribe(control => {
			// Remove any leading or trailing spaces and convert names to lowercase
			const cleanedFirstName = control.FN_Ctrl!.trim().toLowerCase();
			const cleanedLastName = control.LN_Ctrl!.trim().toLowerCase();

			// Generate the username by combining the first letter of the first name
			// with the last name
			const generatedEmail = cleanedFirstName.charAt(0) + cleanedLastName + '@someemail.com';

			// Set generated email to field
			this.secondFormGroup.get('Email_Ctrl')?.setValue(generatedEmail);
		});
	}

	back() {
		window.location.href = this.dialogData.nextLink!;
	}

	register() {
		// Get Values From Controls
		const FirstName = this.firstFormGroup.get('FN_Ctrl')?.value as string;
		const LastName = this.firstFormGroup.get('LN_Ctrl')?.value as string;
		const DateOfBirth = this.firstFormGroup.get('DoB_Ctrl')?.value as string;
		const Email = this.secondFormGroup.get('Email_Ctrl')?.value as string;
		const Password = this.secondFormGroup.get('Passwd_Ctrl')?.value as string;

		// Make Object
		const accountModel = new AccountModel();
		accountModel.first_name = FirstName;
		accountModel.last_name = LastName;
		accountModel.date_of_birth = new Date(DateOfBirth);
		accountModel.email = Email;
		accountModel.password = Password;

		this.dialogData.accountModel = accountModel;

		// Call Popup Dialog
		this.dialog.open(PopupDialogRegister, {
			disableClose: true,
			width: '500px',
			data: this.dialogData
		});
	}
}