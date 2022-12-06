import { AbstractControl, FormGroup } from '@angular/forms';

export class ExtendedValidators {

    static note(control: AbstractControl) {
        const length = control.value.length;
        const numberOfLineBreaks = (control.value.match(/\n/g) || []).length;
        if (length === 1 && numberOfLineBreaks == 1) {
            return { isRequired: true };
        }
        if (length > 0 && control.value.trim().length == 0) {
            return { invalidNote: true };
        }
    }
    static text(control: AbstractControl) {
        if (control.value.trim().length == 0) {
            return { isRequired: true };
        }
    }
    // static number(control: AbstractControl) {
    //     const numberComplete = /^[-]?\d*$/;
    //     if ( control.value.length > 0 && !numberComplete.test(control.value)) {
    //         return { invalidNumber: true };
    //     }
    // }
    static number(control: AbstractControl) {
        if (control.value.length > 0 && control.value.replace(/[^0-9]/g, '').length === 0) {
            return { invalidNumber: true };
        }
    }
}
