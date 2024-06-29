import {ValidatorFn} from "@angular/forms";

export class CustomValidators {

  public static readonly validUrl:  ValidatorFn = control => {
    if (!control.value) {
      return null;
    }
    const linkRegex = /^(ftp|http|https):\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:[0-9]{1,5})?(\/.*)?$/;
    const isInvalid = !linkRegex.test(control.value);

    if (isInvalid) {
      return {
        'validUrl': false
      };
    } else {
      return null;
    }
  };
}
