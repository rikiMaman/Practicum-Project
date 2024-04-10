import { Component,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-role-error-dialog',
  template: `<h1>Error</h1><p>{{ data.message }}</p>`,
  standalone: true,
  imports: [MatDialogModule,
    MatSlideToggleModule,
    MatButtonModule],
  templateUrl: './role-error-dialog.component.html',
  styleUrl: './role-error-dialog.component.css'
})
export class RoleErrorDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<RoleErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  onCloseClick(): void {
    this.dialogRef.close();
  }
}




