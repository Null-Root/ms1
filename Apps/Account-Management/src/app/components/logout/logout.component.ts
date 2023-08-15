import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ALLOWED_REDIRECTS } from 'src/app/consts';
import { AccountModel } from 'src/app/models';
import { ApiService, ServiceType } from 'src/app/services';
import { sleep } from 'src/app/utility';

@Component({
	selector: 'app-logout',
	templateUrl: './logout.component.html',
	styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
	nextLink: string;

	logout_content: string;
	show_loader: boolean = true;

	constructor(
		private apiService: ApiService,
		private cookieService: CookieService,
		private route: ActivatedRoute
	) {
		this.nextLink = "";
		this.logout_content = "Logging out. Please wait...";
		this.show_loader = true;
	}

	async ngOnInit(): Promise<void> {
		this.route.queryParams.subscribe({
			next: (params) => {
				// Get "nextLink"
				// If none, set to empty string
				if (params.hasOwnProperty('nextLink')) this.nextLink = params['nextLink'];
				else this.nextLink = "";

				// Check If Link Provided is in Allowed External Redirects list, Set to empty string if none
				if (this.nextLink == "" || !ALLOWED_REDIRECTS.includes(this.nextLink!)) {
					this.nextLink = "";
				}
			}
		});

		await sleep(1200);
		this.logoutAccount();
	}

	logoutAccount() {
		// Logout
		const email = this.cookieService.get('email');
		const token = this.cookieService.get('user_token');

		const account: AccountModel = new AccountModel();
		account.setEmail(email);
		account.setToken(token);

		const observable_data = this.apiService.makePostRequest(ServiceType.Logout, account);

		observable_data.subscribe({
			next: async (response: any) => {
				this.show_loader = false;
				this.logout_content = response.description;

				await sleep(1200);

				window.location.href = this.nextLink;

				// Set Cookie
				this.cookieService.deleteAll();
			},
			error: async (error: any) => {
				this.show_loader = false;
				this.logout_content = "Error Occurred! \n";

				await sleep(1200);
				
				window.location.href = this.nextLink;
			}
		});
	}
}
