import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmployeeModule } from '../models/employee.modules';

import { ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, ReactiveFormsModule, } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgModule } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { EmployeeService } from '../services/employee.service';
import { Sex } from '../models/employee.modules';
import { FilterPipe } from "../filter.pipe";
import { ToolbarComponent } from "../toolbar/toolbar.component";
import { ModalService } from "../services/modal.service"
import { EmployeeFormComponent } from "../employee-form/employee-form.component";

@Component({
    selector: 'app-employee-table',
    standalone: true,
    templateUrl: './employee-table.component.html',
    styleUrl: './employee-table.component.css',
    imports: [CommonModule, ReactiveFormsModule, FilterPipe, MatRippleModule, MatSelectModule,
        MatFormFieldModule, MatOptionModule, MatSortModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatTableModule, ToolbarComponent, EmployeeFormComponent]
})
export class EmployeeTableComponent {
  dataSource = new MatTableDataSource<EmployeeModule>([]);
  @Input() employeeData?: EmployeeModule;
  @Output() saveEmployee = new EventEmitter<EmployeeModule>();
  @Output() cancel = new EventEmitter();
  employeeForm!: FormGroup;
  editingEmployeeId!: number;
  displayedColumns: string[] = ['firstName', 'lastName', 'identity', 'startWorkDate', 'edit', 'delete'];
  @ViewChild(MatSort, { static: true }) sort!: MatSort
  filteredEmployees: EmployeeModule[] = []; // המערך של העובדים המסוננים להצגה
  employees: EmployeeModule[] = [];
  employee!: EmployeeModule;
  currentEmployee: any = null;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  // בתוך EmployeeFormComponent
  filterEmployees(queryOrEvent: string | Event) {
    let filterValue: string;
    if (typeof queryOrEvent === 'string') {
      filterValue = queryOrEvent;
    } else {
      const inputElement = queryOrEvent.target as HTMLInputElement;
      filterValue = inputElement.value;
    }
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  constructor(private fb: FormBuilder, private employeeService: EmployeeService, public modalService: ModalService) {
    this.createForm();
  }
  ngOnInit(): void {
    this.dataSource.filterPredicate = (data: EmployeeModule, filter: string) => {
      const transformedFilter = filter.trim().toLowerCase();
      return data.firstName.toLowerCase().includes(transformedFilter) ||
        data.lastName.toLowerCase().includes(transformedFilter) ||
        data.indetity.toString().toLowerCase().includes(transformedFilter) ||
        this.formatDate(data.startDate).includes(transformedFilter);
    };
    this.employees = [];
    this.loadEmployees();
    console.log(this.employees);
    this.filteredEmployees = this.employees.filter(e => e.isActive);
    // this.loadEmployees();
  }
  loadEmployees() {
    this.employeeService.getEmployeeList().subscribe(
      (e) => {
        this.dataSource.data = e.filter(employee => employee.isActive == true);
      },
      (error) => {
        console.error('Error loading employees', error);
      }
    );
  }
  openModalForEdit(employeeId: number) {
    this.employeeService.getEmployeeById(employeeId).subscribe(employeeData => {
      this.modalService.openModal({ action: 'edit', employeeData: employeeData });
    });
    this.editingEmployeeId = employeeId;
    console.log(employeeId);
  }
  deleteEmployee(employeeId: number): void {
    this.employeeService.deleteById(employeeId).subscribe({
      next: (response) => {
        // בדיקה של קוד המענה
        if (response.status === 200 || response.status === 204) {
          // המחיקה הצליחה
          // טעינה מחדש של הנתונים
          this.loadEmployees();
        } else {
          // טיפול בתגובות אחרות
          console.log('Response received, but not a success status:', response.status);
        }
      },
      error: (error) => {
        console.error('Error deleting employee:', error);
      }
    });
  }
  ngOnChanges() {
    if (this.employeeData) {
      this.employeeForm.patchValue(this.employeeData);
    }
  }
  closeModal() {
    this.modalService.closeModal();
    this.loadEmployees();
  }
  createForm() {
    this.employeeForm = this.fb.group({
      // ...הגדר את השדות הנדרשים כאן
    });
  }
  get Roles(): FormArray {
    return this.employeeForm.get('Roles') as FormArray;
  }
  onSortChange(sortBy: string) {
    if (this.dataSource && this.dataSource.sort) {
      if (sortBy !== this.dataSource.sort.active) {
        this.dataSource.sort.active = sortBy;
      }
      this.dataSource.sort.direction = 'asc';
      this.dataSource.sort.sortChange.emit();
    }
  }
  onSubmit() {
    if (this.employeeForm.valid) {
      this.saveEmployee.emit(this.employeeForm.value);
    }
  }
  formatDate(date: Date | string): string {
    if (!date) return '';

    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

}
