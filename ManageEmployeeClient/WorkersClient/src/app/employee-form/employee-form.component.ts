import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule, FormControl } from '@angular/forms';
import { EventEmitter, Output } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { EmployeeModule, Sex } from '../models/employee.modules';
import Swal from 'sweetalert2';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialog } from '@angular/material/dialog';
import { RoleErrorDialogComponent } from '../role-error-dialog/role-error-dialog.component';
import { ModalData, ModalService } from '../services/modal.service';
import { ValidationService } from '../services/validation.service';
const roleMapping: { [key: string]: number } = {
  'Manager': 1,
  'Teacher': 2,
  'Supervisor': 3,
  'Secretary': 4,
  'Lawyer': 5,
  'Doctor': 6,
  'CPA': 7,
  'Architect': 8,
  'Electrician': 9,
  'Nurse': 10
};
const reverseRoleMapping: { [key: number]: string } = {
  1: 'Manager',
  2: 'Teacher',
  3: 'Supervisor',
  4: 'Secretary',
  5: 'Lawyer',
  6: 'Doctor',
  7: 'CPA',
  8: 'Architect',
  9: 'Electrician',
  10: 'Nurse'
};
@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCheckboxModule,
    MatTableModule, MatIconModule, MatFormFieldModule,
    MatSelectModule, MatInputModule, MatCardModule, MatDatepickerModule,
    MatButtonModule, MatNativeDateModule, MatSlideToggleModule],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css'
})
export class EmployeeFormComponent implements OnInit {
  [x: string]: any;
  isModalOpen = false;
  currentEmployee: any = null;
  employees: EmployeeModule[] = [];
  employee!: EmployeeModule;
  employeeForm: FormGroup;
  filteredEmployees: EmployeeModule[] = [];
  @Output() closeModalEvent = new EventEmitter<void>();
  dataSource = new MatTableDataSource<EmployeeModule>(this.filteredEmployees);
  @Input()
  initialEmployeeData!: EmployeeModule;
  @Input() editingEmployeeId: number | null = null;
  constructor(private fb: FormBuilder, private employeeService: EmployeeService,
    private dialog: MatDialog, private modalService: ModalService, private validationService: ValidationService) {
    this.employeeForm = this.fb.group({
      // FirstName: ['', Validators.required, Validators.minLength(2)],
      FirstName: ['', [Validators.required, Validators.minLength(2)]],
      LastName: ['', [Validators.required, Validators.minLength(2)]],
      identity: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), this.validationService.identityValidator]],
      StartWorkDate: ['', Validators.required],
      BirthDate: ['', [Validators.required, validationService.birthDateValidator]],
      sex: ['', Validators.required],
      Roles: this.fb.array([], [validationService.uniqueRoleValidator()]),
      searchQuery: ['']
    }, { validators: [this.validationService.startDateValidator, this.validationService.noRolesValidator, this.validationService.workDateValidator] });
    this.currentEmployee = null;
  }
  ngOnInit() {
    this.modalService.modalData.subscribe((modalData: ModalData | null) => {
      if (modalData) {
        if (modalData.action === 'add') {
          this.resetForm();
        } else if (modalData.action === 'edit' && modalData.employeeData && modalData.employeeData.roles) {
          this.fillFormWithEmployeeData(modalData.employeeData);
          this.employeeForm.updateValueAndValidity();
        }
      }
    });
  }
  fillFormWithEmployeeData(employeeData: EmployeeModule) {
    if (employeeData && employeeData.roles) {
      const formattedStartDate = employeeData.startDate ? this.validationService.formatDate(employeeData.startDate) : '';
      const formattedBirthDate = employeeData.birthDate ? this.validationService.formatDate(employeeData.birthDate) : '';
      let sexValue = (employeeData.sex === Sex.Male) ? 'male' : 'female';
      this.employeeForm.patchValue({
        FirstName: employeeData.firstName || '',
        LastName: employeeData.lastName || '',
        identity: employeeData.indetity || '',
        StartWorkDate: formattedStartDate,
        BirthDate: formattedBirthDate,
        sex: sexValue
      });
      this.employeeForm.get('StartWorkDate')?.updateValueAndValidity();
      this.employeeForm.get('BirthDate')?.updateValueAndValidity();
      const rolesArray = this.employeeForm.get('Roles') as FormArray;
      rolesArray.clear();
      if (employeeData.roles && employeeData.roles.length > 0) {
        employeeData.roles.forEach(role => {
          const formattedRoleStartDate = role['startWork'] ? this.validationService.formatDate(role['startWork']) : '';
          rolesArray.push(this.fb.group({
            roleName: reverseRoleMapping[role['role'].id] || '',
            isManagement: role.isAdministrative || false,
            roleStartDate: formattedRoleStartDate
          }));
        });
      }
    }
    this.employeeForm.updateValueAndValidity();
  }
  onModalCancel() {
    this.resetForm();
    this.closeModal();
  }
  closeModal() {
    this.resetForm();
    this.closeModalEvent.emit();
  }
  get Roles(): FormArray {
    return this.employeeForm.get('Roles') as FormArray;
  }
  addRole(): void {
    const startWorkDateControl = this.employeeForm.get('StartWorkDate') as FormControl;
    this.Roles.push(this.fb.group({
      roleName: ['', Validators.required],
      isManagement: [false],
      roleStartDate: ['', [Validators.required, this.validationService.roleStartDateValidator(startWorkDateControl)]]
    }));
  }
  resetForm() {
    this.employeeForm.reset();
    const rolesArray = this.employeeForm.get('Roles') as FormArray;
    while (rolesArray.length !== 0) {
      rolesArray.removeAt(0);
    }
    this.currentEmployee = null; // איפוס נתוני העובד הנוכחי
    this.editingEmployeeId = null;
  }
  update(updateEmployee: EmployeeModule, editingEmployeeId: number): void {
    // עדכון עובד קיים
    this.employeeService.updateEmployee(editingEmployeeId, updateEmployee).subscribe({
      next: (response) => {
        console.log('Employee updated successfully', response);
        this.onModalCancel();
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3500,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          }
        });

        Toast.fire({
          icon: 'success',
          title: 'נתוני העובד עודכנו בהצלחה!'
        });
      },
      error: (error) => {
        console.error('Error updating employee', error);
      }
    });
    this.editingEmployeeId = null;
  }
  add(newEmployee: EmployeeModule): void {
    // שליחת האובייקט לשרת להוספה
    this.employeeService.addEmployee(newEmployee).subscribe({
      next: (response) => {
        console.log('Employee added successfully', response);
        this.filteredEmployees.push(response);
        this.onModalCancel();
        Swal.fire({
          title: 'עובד נוסף בהצלחה!',
          text: 'העובד נוסף למערכת בהצלחה.',
          icon: 'success',
          confirmButtonText: 'סגור'
        });
      },
      error: (error) => {
        console.error('Error adding employee', error);
      }
    });
    this.editingEmployeeId = null;
  }
  onSubmit(): void {
    if (this.employeeForm.valid) {
      const roles = this.employeeForm.value.Roles.map((role: any) => ({
        roleId: roleMapping[role.roleName],
        isAdministrative: role.isManagement,
        startDate: this.validationService.formatDate(role.roleStartDate)
      }));
      let startDate = this.employeeForm.value.StartWorkDate;
      let birthDate = this.employeeForm.value.BirthDate;
      // המרת מחרוזת לאובייקט Date
      if (typeof startDate === 'string') {
        startDate = new Date(startDate);
      }
      if (typeof birthDate === 'string') {
        birthDate = new Date(birthDate);
      }
      const formattedBirthDate = this.validationService.formatDateToLocale(this.employeeForm.value.BirthDate);
      // כאן יוצרים אובייקט מתוך הנתונים בטופס
      const newEmployee: EmployeeModule = {
        firstName: this.employeeForm.value.FirstName,
        lastName: this.employeeForm.value.LastName,
        indetity: this.employeeForm.value.identity,
        startDate: this.validationService.formatDateToLocale(startDate),
        birthDate: this.validationService.formatDateToLocale(birthDate),
        sex: this.employeeForm.value.sex === 'male' ? 0 : 1,
        isActive: true,
        roles: roles
      };
      //לפי מצב המשתנה- נדע אם לשלוח לעדכון או להוספה של העובד initialEmployeeData
      if (this.editingEmployeeId != null) {
        this.update(newEmployee, this.editingEmployeeId);
      }
      else {
        this.add(newEmployee);
      }
      this.editingEmployeeId = null;
    }
    else
      this.notValidForm();
  }
  notValidForm() {
    if (this.employeeForm.errors?.['noRoles']) {
      this.dialog.open(RoleErrorDialogComponent, {
        width: '400px',  // או כל גודל אחר שמתאים לך
        // height: '300px', // אפשר להשמיט אם אין צורך בגובה מסוים
        data: { message: 'Please enter at least one role' }
      });
    }
    else if (this.employeeForm.errors?.['invalidStartWorkDate']) {
      this.dialog.open(RoleErrorDialogComponent, {
        width: '400px',
        data: { message: 'Date of starting work must be at least 16 years after date of birth' }
      });
    }
    else if (this.employeeForm.errors?.['invalidRoleStartDate']) {
      this.dialog.open(RoleErrorDialogComponent, {
        width: '400px',  // או כל גודל אחר שמתאים לך
        // height: '300px', // אפשר להשמיט אם אין צורך בגובה מסוים
        data: { message: 'Job entry date must be equal to or later than the job start date!' }
      });
    }
    else {
      // alert("One or more filed are not valdi!");
      this.dialog.open(RoleErrorDialogComponent, {
        width: '400px',  // או כל גודל אחר שמתאים לך
        // height: '300px', // אפשר להשמיט אם אין צורך בגובה מסוים
        data: { message: 'Not all form fields are complete!' }
      });
      // טיפול במצב שבו הטופס לא תקין
      // console.error('Form is not valid');
    }

  }
}
