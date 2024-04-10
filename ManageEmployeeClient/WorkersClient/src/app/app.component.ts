import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgModule } from '@angular/core';
import { routes } from './app.routes';
import { AnalyticsDashboardComponent } from "./analytics-dashboard/analytics-dashboard.component";
import { HomeComponent } from "./home/home.component";
// import { ToastrModule } from 'ngx-toastr';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, CommonModule,
        HttpClientModule, MatTableModule, MatIconModule, MatFormFieldModule,
        MatSelectModule, MatInputModule, MatCardModule, MatDatepickerModule,
        MatButtonModule, AnalyticsDashboardComponent, HomeComponent]
})
export class AppComponent {
  title = 'WorkersClient';
}
