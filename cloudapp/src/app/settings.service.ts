import { Injectable } from "@angular/core";
import { CloudAppSettingsService } from "@exlibris/exl-cloudapp-angular-lib";
import { Observable, of } from "rxjs";
import { Settings } from "./models/settings";
import { map, tap } from "rxjs/operators";

export interface Option {
  code: string;
  desc: string;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  _settings: Settings;

  constructor( 
    private settingsService: CloudAppSettingsService
  ) {  }

  get(): Observable<Settings> {
    if (this._settings) {
      return of(this._settings);
    } else {
      return this.settingsService.get()
        .pipe(
          map((settings: Settings) => this.migrate(settings)),
          tap(settings=>this._settings=settings)
        );
    }
  }

  set(val: Settings) {
    this._settings = val;
    return this.settingsService.set(val);
  }

  clear() {
    return this.settingsService.remove();
  }

  migrate(settings: Settings) {
    /* Handle changes to Settings */
    if (Object.keys(settings).length == 0)
      return new Settings();
    else {
      return settings;
    }
  }
}
