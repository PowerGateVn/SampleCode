import { FormControl } from '@angular/forms';

export function validateEmail(input: FormControl) {
  // tslint:disable-next-line:max-line-length
  const email = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const res = input.value ? email.test(input.value.toString()) : true;
  return res ? null : { validateEmail: true };

}

export function validateNumberComplete(input: FormControl) {
  // tslint:disable-next-line:max-line-length
  const numberComplete = /^[1-9][0-9]?$|^100$/;
  const res = input.value ? numberComplete.test(input.value) : true;
  return res ? null : { validateEmail: true };

}


