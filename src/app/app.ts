import { Component, inject } from '@angular/core';
import { ExpenseService } from './expense.service';
import { ExpenseForm } from './expense-form/expense-form';
import { ExpenseList } from './expense-list/expense-list';
import { CategorySummary } from './category-summary/category-summary';
import { FaNumberPipe } from './fa-number.pipe';
import { JALALI_MONTHS, todayJalali } from './expense.model';

@Component({
  selector: 'app-root',
  imports: [ExpenseForm, ExpenseList, CategorySummary, FaNumberPipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly expenseService = inject(ExpenseService);

  private readonly today = todayJalali();
  protected readonly monthName = JALALI_MONTHS[this.today.jm - 1];
  protected readonly year = this.today.jy;
}