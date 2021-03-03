import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { AlertService, CloudAppRestService } from '@exlibris/exl-cloudapp-angular-lib';
import { map, switchMap, tap } from 'rxjs/operators';
import { CodeTable, CodeTableRow } from '../models/alma';
import { SettingsService } from '../settings.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { settingsFormGroup } from '../models/settings';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  form: FormGroup;
  categoryOptions: CodeTableRow[] = [] ;
  loading = false;

  constructor(
    private settingsService: SettingsService,
    private alert: AlertService,
    private restService: CloudAppRestService, 
  ) { }

  ngOnInit() {
    this.restService.call<CodeTable>('/conf/code-tables/UserStatisticalTypes')
    .pipe(
      tap(result=>this.categoryOptions = result.row.sort(sort('description'))),
      switchMap(()=>this.settingsService.get()),
      /* Filter out removed category types */
      map(settings=>{
        settings.categories = settings.categories.filter(c=>this.categoryOptions.some(o=>o.code==c.code));
        return settings;
      }),
      tap(settings=>this.form = settingsFormGroup(settings))
    ).subscribe();
  }

  save() {
    this.loading = true;
    let val = this.form.value;
    this.settingsService.set(val).subscribe(
      () => {
        this.alert.success('Settings successfully saved.');
        this.form.markAsPristine();
      },
      err => this.alert.error(err.message),
      ()  => this.loading = false
    );
  }  

  categoryChanged(event: MatCheckboxChange) {
    const value: CodeTableRow = <any>event.source.value;
    if (event.checked) {
      this.categories.push(new FormControl(value))
    } else {
      const i = this.categories.value.findIndex(v=>v.code === value.code)
      if (~i) this.categories.removeAt(i);
    }
  }

  checked(val: CodeTableRow) {
    return this.categories.value.some((v: CodeTableRow)=>v.code===val.code);
  }

  get categories() {
    return this.form.controls.categories as FormArray;
  }
}

const sort = (field: string) => ( a: any, b: any ) => {
  if ( a[field] < b[field] ) return -1;
  if ( a[field] > b[field] ) return 1;
  return 0;
}

