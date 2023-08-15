import { Injectable } from '@angular/core';
import { AccountModel } from '../models';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
class ApiService {
	
	constructor(private http: HttpClient) { }

	public makePostRequest(service: ServiceType, account: AccountModel) {
		const Base_Url = "http://localhost:9000/account-service/v1/";
		let Dest_Url = "";
		
		switch (service) {
			case ServiceType.Register:
				Dest_Url = Base_Url + "register";
				break;
			case ServiceType.Login:
				Dest_Url = Base_Url + "login";
				break;
			case ServiceType.Logout:
				Dest_Url = Base_Url + "logout";
				break;
		}

		return this.http.post(Dest_Url, account);
	}
}

enum ServiceType {
	Register,
	Login,
	Logout
}

export {
	ApiService,
	ServiceType
}