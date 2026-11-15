import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Expense } from './expense.model';
import { ExpenseForm } from './expense-form/expense-form';

@Component({
  selector: 'app-edit-expense-dialog',
  imports: [MatDialogModule, MatButtonModule, ExpenseForm],
  template: `
    <h2 mat-dialog-title>ویرایش خرج</h2>
    <mat-dialog-content>
      <app-expense-form
        [expense]="data"
        submitLabel="ذخیره تغییرات"
        (submitted)="dialogRef.close($event)" />
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>انصراف</button>
    </mat-dialog-actions>
  `,
})
export class EditExpenseDialog {
  protected readonly data = inject<Expense>(MAT_DIALOG_DATA);
  protected readonly dialogRef = inject<MatDialogRef<EditExpenseDialog>>(MatDialogRef);
}