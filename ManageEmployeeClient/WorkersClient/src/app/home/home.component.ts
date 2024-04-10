import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatSort,MatSortModule  } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { EmployeeTableComponent } from "../employee-table/employee-table.component";
import { EmployeeService } from '../services/employee.service';
import { EmployeeModule, Sex } from '../models/employee.modules';
import { FilterPipe } from "../filter.pipe";
import { ToolbarComponent } from "../toolbar/toolbar.component";
import { ModalService } from "../services/modal.service"
import { EmployeeFormComponent } from "../employee-form/employee-form.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FilterPipe, MatRippleModule, MatSelectModule,
    MatFormFieldModule, MatOptionModule, MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule, ToolbarComponent, EmployeeTableComponent, EmployeeFormComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  [x: string]: any;
  isModalOpen = false;
  currentEmployee: any = null;
  employees: EmployeeModule[] = [];
  employee!: EmployeeModule;
  employeeForm!: FormGroup;
  searchQuery: string = '';
  filteredEmployees: EmployeeModule[] = []; // המערך של העובדים המסוננים להצגה
  editingEmployeeId!: number;
  dataSource = new MatTableDataSource<EmployeeModule>([]);
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  myForm = new FormGroup({
    emailAddress: new FormControl(''),
    // ... ניתן להוסיף שדות נוספים לפי הצורך
  });
  constructor( private employeeService: EmployeeService,public modalService: ModalService, private router: Router) {
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
    // this.loadEmployees();
    console.log(this.employees);
    this.filteredEmployees = this.employees.filter(e => e.isActive);
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.loadEmployees();
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
  get Roles(): FormArray {
    return this.employeeForm.get('Roles') as FormArray;
  }
  closeModal() {
    this.modalService.closeModal();
    this.loadEmployees();
  }
  // הוספת פונקציה להמרת תאריך למחרוזת
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

}
