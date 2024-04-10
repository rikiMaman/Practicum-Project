import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, ValidationErrors, FormArray } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class ValidationService {

    noRolesValidator(control: AbstractControl): ValidationErrors | null {
        const form = control as FormGroup;
        const roles = form.get('Roles') as FormArray;
        return roles.length === 0 ? { 'noRoles': true } : null;
    }

    atLeastOneRoleValidator(control: AbstractControl): ValidationErrors | null {
        if (control instanceof FormArray) {
            return control.length > 0 ? null : { 'noRoles': true };
        }
        return null;
    }
    identityValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value || '';
        if (!value) {
            // אם השדה ריק, אין צורך לבדוק את התבנית
            return null;
        }
        if (value.length !== 9) {
            return null; // אין צורך לבדוק את התבנית אם האורך לא תקין
        }
        const isValidId = /^\d{9}$/.test(value);
        return isValidId ? null : { 'invalidId': true };
    }
    formatDateToLocale(inputDate: Date): Date {
        if (inputDate instanceof Date) {
            const localTimeOffset = inputDate.getTimezoneOffset() * 60000;
            const localDate = new Date(inputDate.getTime() - localTimeOffset);
            return localDate;
        } else {
            console.log('not a Date:', inputDate);
            // console.error('Invalid date object:', inputDate);
            return new Date(); // או אפשר להחזיר ערך דיפולטיבי אחר
        }
    }
    uniqueRoleValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            let roles = control.value;
            let uniqueRoles = new Set(roles.map((role: { roleName: any; }) => role.roleName));
            return uniqueRoles.size !== roles.length ? { 'duplicateRoles': true } : null;
        };
    }
    birthDateValidator(control: AbstractControl): ValidationErrors | null {
        const birthDate = new Date(control.value);
        const currentDate = new Date();
        const age = currentDate.getFullYear() - birthDate.getFullYear();

        return age > 120 ? { 'invalidBirthDate': true } : null;
    }
    workDateValidator(form: FormGroup): ValidationErrors | null {
        const birthDate = form.get('BirthDate')?.value;
        const startWorkDate = form.get('StartWorkDate')?.value;
        if (!birthDate || !startWorkDate) {
            return null; // או שגיאה אם אחד מהשדות חסר
        }
        const birthDateObject = new Date(birthDate);
        const startWorkDateObject = new Date(startWorkDate);
        let ageAtStartWork = startWorkDateObject.getFullYear() - birthDateObject.getFullYear();
        const monthDifference = startWorkDateObject.getMonth() - birthDateObject.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && startWorkDateObject.getDate() < birthDateObject.getDate())) {
            ageAtStartWork--;
        }
        return ageAtStartWork >= 16 ? null : { 'invalidStartWorkDate': true };
    }
    startDateValidator(control: AbstractControl): ValidationErrors | null {
        const form = control as FormGroup;
        const startWorkDateControl = form.get('StartWorkDate');
        const rolesArray = form.get('Roles') as FormArray;

        if (startWorkDateControl && startWorkDateControl.value && rolesArray) {
            const startWorkDate = new Date(startWorkDateControl.value);
            startWorkDate.setHours(0, 0, 0, 0); // איפוס שעה, דקה, שנייה ומילישנייה

            const invalidRole = rolesArray.controls.some((roleControl: AbstractControl) => {
                const roleGroup = roleControl as FormGroup;
                const roleStartDateControl = roleGroup.get('roleStartDate');
                if (roleStartDateControl && roleStartDateControl.value) {
                    const roleStartDate = new Date(roleStartDateControl.value);
                    roleStartDate.setHours(0, 0, 0, 0); // איפוס שעה, דקה, שנייה ומילישנייה
                    return roleStartDate < startWorkDate;
                }
                return false;
            });
            return invalidRole ? { 'invalidRoleStartDate': true } : null;
        }
        return null;
    }
    roleStartDateValidator(startWorkDateControl: FormControl): ValidatorFn {
        return (roleGroup: AbstractControl): ValidationErrors | null => {
            const roleStartDateControl = roleGroup.get('roleStartDate');
            if (!roleStartDateControl) {
                return null;
            }
            return roleStartDateControl.value >= startWorkDateControl.value ? null : { 'invalidRoleStartDate': true };
        };
    }
    formatDate(date: Date | string): string {
        if (date) {
          let d = new Date(date);
          let month = '' + (d.getMonth() + 1);
          let day = '' + d.getDate();
          let year = d.getFullYear();
    
          if (month.length < 2)
            month = '0' + month;
          if (day.length < 2)
            day = '0' + day;
    
          return [year, month, day].join('-');
        }
        return '';
      }
      
}
