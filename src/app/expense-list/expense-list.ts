import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExpenseService } from '../expense.service';
import { CATEGORY_ICONS, CATEGORY_LABELS, Expense } from '../expense.model';
import { FaNumberPipe } from '../fa-number.pipe';
import { JalaliDatePipe } from '../jalali-date.pipe';
import { ConfirmDialog, ConfirmDialogData } from '../confirm-dialog';
import { EditExpenseDialog } from '../edit-expense-dialog';

@Component({
  selector: 'app-expense-list',
  imports: [FaNumberPipe, JalaliDatePipe],
  templateUrl: './expense-list.html',
})
export class ExpenseList {
  protected readonly expenseService = inject(ExpenseService);
  private readonly dialog = inject(MatDialog);
  protected readonly labels = CATEGORY_LABELS;
  protected readonly icons = CATEGORY_ICONS;

  confirmDelete(e: Expense) {
    this.dialog
      .open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, {
        data: {
          title: 'حذف خرج',
          message: `«${e.note || this.labels[e.category]}» حذف بشه؟ این کار برگشت‌پذیر نیست.`,
          confirmText: 'حذف',
        },
        direction: 'rtl',
        width: '380px',
      })
      .afterClosed()
      .subscribe((ok) => {
        if (ok) this.expenseService.remove(e.id);
      });
  }

  edit(e: Expense) {
    this.dialog
      .open<EditExpenseDialog, Expense, Omit<Expense, 'id'>>(EditExpenseDialog, {
        data: e,
        direction: 'rtl',
        width: '560px',
        maxWidth: '95vw',
      })
      .afterClosed()
      .subscribe((changes) => {
        if (changes) this.expenseService.update(e.id, changes);
      });
  }
}