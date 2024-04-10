import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EmployeeModule } from '../models/employee.modules';
@Injectable({ providedIn: 'root' })
export class ModalService {
  private modalDataSubject = new BehaviorSubject<ModalData | null>(null);
  public modalData = this.modalDataSubject.asObservable();
  private isModalOpenSubject = new BehaviorSubject<boolean>(false);
  public isModalOpen = this.isModalOpenSubject.asObservable();


  openModal(modalData: ModalData) {
    this.modalDataSubject.next(modalData);
    this.isModalOpenSubject.next(true);
  }
  closeModal() {
    this.isModalOpenSubject.next(false);
    this.modalDataSubject.next(null); // איפוס נתוני המודל
  }
}
export interface ModalData {
  action: 'add' | 'edit';
  employeeData?: EmployeeModule;
}

