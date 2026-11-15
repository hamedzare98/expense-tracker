import { Component, computed, effect, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { MoneyInput } from '../money-input';
import { jalaaliMonthLength, toJalaali } from 'jalaali-js';
import {
  CATEGORY_ICONS, CATEGORY_LABELS, Category, Expense, JALALI_MONTHS, JalaliDate,
  isoToJalali, jalaliToISO, todayJalali,
} from '../expense.model';
import { FaNumberPipe } from '../fa-number.pipe';

function jalaliDaysAgo(n: number): JalaliDate {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toJalaali(d);
}

function sameDay(a: JalaliDate, b: JalaliDate) {
  return a.jy === b.jy && a.jm === b.jm && a.jd === b.jd;
}

@Component({
  selector: 'app-expense-form',
  imports: [ReactiveFormsModule, FaNumberPipe,MoneyInput],
  templateUrl: './expense-form.html',
})
export class ExpenseForm {
  readonly expense = input<Expense | null>(null);
  readonly submitLabel = input('ثبت خرج');
  readonly submitted = output<Omit<Expense, 'id'>>();

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly today = todayJalali();
  private readonly yesterday = jalaliDaysAgo(1);
  protected readonly quickAmounts = [10_000, 50_000, 100_000, 500_000];

  protected readonly categories = (Object.keys(CATEGORY_LABELS) as Category[]).map((key) => ({
    key,
    label: CATEGORY_LABELS[key],
    icon: CATEGORY_ICONS[key],
  }));
  protected readonly months = JALALI_MONTHS;
  protected readonly years = [this.today.jy, this.today.jy - 1];

  protected readonly form = this.fb.group({
    amount: this.fb.control<number | null>(null, [Validators.required, Validators.min(1)]),
    category: this.fb.control<Category>('food'),
    date: this.fb.group({
      jy: [this.today.jy],
      jm: [this.today.jm],
      jd: [this.today.jd],
    }),
    note: [''],
  });

  private readonly dateGroup = this.form.controls.date;

  private readonly dateValue = toSignal(
    this.dateGroup.valueChanges.pipe(map(() => this.dateGroup.getRawValue())),
    { initialValue: this.dateGroup.getRawValue() },
  );

  protected readonly amountValue = toSignal(this.form.controls.amount.valueChanges, {
    initialValue: null,
  });

  protected readonly days = computed(() => {
    const { jy, jm } = this.dateValue();
    return Array.from({ length: jalaaliMonthLength(jy, jm) }, (_, i) => i + 1);
  });

  protected readonly quickPick = computed(() => {
    const value = this.dateValue();
    if (sameDay(value, this.today)) return 'today';
    if (sameDay(value, this.yesterday)) return 'yesterday';
    return null;
  });

  constructor() {
    effect(() => {
      const max = this.days().length;
      const jd = this.dateGroup.controls.jd;
      if (jd.value > max) jd.setValue(max);
    });

    effect(() => {
      const e = this.expense();
      if (!e) return;
      this.form.setValue({
        amount: e.amount,
        category: e.category,
        date: isoToJalali(e.date),
        note: e.note,
      });
    });
  }

  protected setDaysAgo(n: number) {
    this.dateGroup.setValue(n === 0 ? this.today : jalaliDaysAgo(n));
  }
    protected addAmount(value: number) {
    const control = this.form.controls.amount;
    control.setValue((control.value ?? 0) + value);
    control.markAsTouched();
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { amount, category, date, note } = this.form.getRawValue();
    this.submitted.emit({ amount: amount!, category, date: jalaliToISO(date), note });
    if (!this.expense()) this.form.reset();
  }
}