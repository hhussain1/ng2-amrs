import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { AppSettingsService } from '../app-settings/app-settings.service';
import { UserService } from '../openmrs-api/user.service';
import { User } from '../models/user.model';
import { LocalStorageService } from '../utils/local-storage.service';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class UserDefaultPropertiesService {

  locationSubject = new BehaviorSubject<any>('');

  private user: User;

  constructor(private userService: UserService
    , private localStorage: LocalStorageService
    , private http: Http
    , private appSettingsService: AppSettingsService) { }

  getLocations(): Observable<any> {

    let api = this.appSettingsService.getOpenmrsServer() + '/ws/rest/v1/location?v=default';

    return this.http.get(api);

  }

  getCurrentUserDefaultLocation() {

    let userDisplay = this.getAuthenticatedUser().display;
    let location = this.localStorage.getItem('userDefaultLocation' + userDisplay);
    return JSON.parse(location) ? JSON.parse(location).display : undefined;
  }

  getCurrentUserDefaultLocationObject() {
    let userDisplay = this.getAuthenticatedUser().display;
    let location = this.localStorage.getItem('userDefaultLocation' + userDisplay);
    if (location) {
      return JSON.parse(location);
    }
    return null;
  }
  getAuthenticatedUser(): User {
    return this.userService.getLoggedInUser();
  }

  setUserProperty(propertyKey: string, property: string) {

    if (propertyKey === 'userDefaultLocation') {
      propertyKey = propertyKey + this.getAuthenticatedUser().display;

      this.locationSubject.next(property);
      this.localStorage.setItem(propertyKey, property);
    }
  }

}
