import { FormControl } from '@angular/forms';

export function validateEmail(input: FormControl) {
  // tslint:disable-next-line:max-line-length
  const email = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const res = input.value ? email.test(input.value.toString()) : true;
  return res ? null : { validateEmail: true };

}


