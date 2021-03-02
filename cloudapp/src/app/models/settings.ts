import { FormGroupUtil } from "@exlibris/exl-cloudapp-angular-lib";
import { CodeTableRow } from "./alma";

export class Settings {
  categories: CodeTableRow[] = [];
}

export const settingsFormGroup = (settings: Settings) => FormGroupUtil.toFormGroup(Object.assign(new Settings(), settings));