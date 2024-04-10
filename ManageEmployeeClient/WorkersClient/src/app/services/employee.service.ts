import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Observable } from 'rxjs';
import {  EmployeeModule, Sex } from '../models/employee.modules';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService{
  constructor(private _http: HttpClient) {
  }
  getEmployeeList(): Observable<EmployeeModule[]> {
    return this._http.get<EmployeeModule[]>('/api/Employee')
  }
  addEmployee(employee: EmployeeModule): Observable<EmployeeModule> {
    return this._http.post<EmployeeModule>('https://localhost:7210/api/Employee', employee);
  }
  updateEmployee(id: number,employee: EmployeeModule): Observable<EmployeeModule>{
    return this._http.put<EmployeeModule>(`https://localhost:7210/api/Employee/${id}`,employee)
  }
  getEmployeeById(id:number):Observable<EmployeeModule>{
    return this._http.get<EmployeeModule>(`https://localhost:7210/api/Employee/${id}`);
  }
  deleteById(id: number): Observable<HttpResponse<any>> {
    return this._http.delete<any>(`https://localhost:7210/api/Employee/${id}`, { observe: 'response' });
  }
  
  private mapEmployeeForSubmission(employee: EmployeeModule): any {
    return {
      ...employee,
      sex: Sex[employee.sex] // ממיר את הערך המספרי של ה-Enum למחרוזת
    };
  }
}