import { AbstractControl, ValidationErrors } from '@angular/forms';

export class PasswordValidators {

    static passwordStrength(control: AbstractControl) : ValidationErrors | null {
        let passwordIsValid : boolean = false;
        let hasNumbers = /\d/.test(control.value);
        let hasLowerCase = /[a-z]/.test(control.value);
        let hasUpperCase = /[A-Z]/.test(control.value);
        let hasSpecialSymbols = /[.,!@#]/.test(control.value);
        let hasMinimumLength = (<string>control.value).length >= 8;

        if(hasNumbers && hasUpperCase && hasLowerCase && hasSpecialSymbols && hasMinimumLength) {
            passwordIsValid = true;
            return null;
        } else { 
            return { passwordValidity : passwordIsValid, rules : {
                hasNumbers : hasNumbers,
                hasLowerCase : hasLowerCase,
                hasUpperCase : hasUpperCase,
                hasSpecialSymbols : hasSpecialSymbols,
                hasMinimumLength : hasMinimumLength 
            }};
        }
    }

}