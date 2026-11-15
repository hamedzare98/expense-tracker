import { Component, inject } from '@angular/core';
import { ExpenseService } from '../expense.service';
import { CATEGORY_ICONS, CATEGORY_LABELS } from '../expense.model';
import { FaNumberPipe } from '../fa-number.pipe';

@Component({
  selector: 'app-category-summary',
  imports: [FaNumberPipe],
  templateUrl: './category-summary.html',
})
export class CategorySummary {
  protected readonly expenseService = inject(ExpenseService);
  protected readonly labels = CATEGORY_LABELS;
  protected readonly icons = CATEGORY_ICONS;
}