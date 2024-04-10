import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { EmployeeService } from '../services/employee.service';
import { EmployeeModule } from '../models/employee.modules';
import { ModalService } from '../services/modal.service';
import { EmployeeFormComponent } from "../employee-form/employee-form.component";
@Component({
  selector: 'app-toolbar',
  standalone: true,
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css',
  imports: [MatRippleModule, MatIconModule, CommonModule, ReactiveFormsModule, EmployeeFormComponent]
})
export class ToolbarComponent implements OnInit {
  // editingEmployeeId!: number;
  isModalOpen: boolean = false;
  employee: EmployeeModule[] = [];
  employees: EmployeeModule[] = []
  filteredEmployees: EmployeeModule[] = []; // המערך של העובדים המסוננים להצגה
  searchQuery: string = '';
  employeeForm!: FormGroup;
  currentEmployee: any = null;
  constructor(public modalService: ModalService, private employeeService: EmployeeService) {
  }
  ngOnInit(): void {

    this.loadEmployees();
    console.log(this.employees);
    this.filteredEmployees = this.employees.filter(e => e.isActive);
  }
  loadEmployees() {
    this.employeeService.getEmployeeList().subscribe(
      (e) => {
        this.employees = e;
        this.employees = this.employees.filter(employee => employee.isActive == true);
        this.filteredEmployees = this.employees;
        // console.log(this.employees);
      },
      (error) => {
        console.error('Error loading employees', error);
      }
    );
  }
  get Roles(): FormArray {
    return this.employeeForm.get('Roles') as FormArray;
  }

  printEmployee(employee: any) {
    window.print();
  }
  openGoogleMaps() {
    window.open('https://www.google.com/maps', '_blank');
  }
  openModalForAdd() {
    this.modalService.openModal({ action: 'add' });
  }
  formatDate(date: Date | string): string {
    if (!date) return 'לא זמין';

    let d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }


  prepareDataForExport(employees: EmployeeModule[]) {
    return employees.map(emp => ({
      "שם פרטי": emp.firstName,
      "שם משפחה": emp.lastName,
      "ת.ז.": emp.indetity,
      "תאריך תחילת עבודה": this.formatDate(emp.startDate),
      "תאריך לידה": this.formatDate(emp.birthDate),
      "מין": emp.sex === 0 ? 'זכר' : 'נקבה',
      "תפקידים": emp.roles?.map(role => {
        const roleStartDate = role['startWork'] ? this.formatDate(role['startWork']) : 'לא זמין';
        return `${role['role'].name} (${role.isAdministrative ? 'ניהולי' : 'לא ניהולי'}, מתחיל ב: ${roleStartDate})`
      }).join("  ")
    }));
  }

  exportAsExcel(): void {
    this.employeeService.getEmployeeList().subscribe(
      (employees) => {
        // עדכון הרשימה עם העובדים הפעילים
        this.filteredEmployees = employees.filter(e => e.isActive);
        // יצירת נתונים לייצוא
        const dataForExport = this.prepareDataForExport(this.filteredEmployees);
        // יצירת קובץ אקסל
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataForExport);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Employees');
        XLSX.writeFile(wb, 'employees.xlsx');
      },
      (error) => {
        console.error('Error loading employees', error);
      }
    );
  }
  closeModal() {
    this.modalService.closeModal();
    this.loadEmployees();
  }
}
