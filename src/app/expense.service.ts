import { Injectable, computed, effect, signal } from '@angular/core';
import { Category, Expense, isoToJalali, todayJalali } from './expense.model';

const STORAGE_KEY = 'expenses';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private readonly _expenses = signal<Expense[]>(this.load());

  readonly expenses = this._expenses.asReadonly();

  readonly sortedExpenses = computed(() =>
    [...this._expenses()].sort((a, b) => b.date.localeCompare(a.date)),
  );

  readonly thisMonthExpenses = computed(() => {
    const { jy, jm } = todayJalali();
    return this._expenses().filter((e) => {
      const j = isoToJalali(e.date);
      return j.jy === jy && j.jm === jm;
    });
  });

  readonly thisMonthTotal = computed(() =>
    this.thisMonthExpenses().reduce((sum, e) => sum + e.amount, 0),
  );

  readonly categoryBreakdown = computed(() => {
    const total = this.thisMonthTotal();
    if (total === 0) return [];

    const sums = new Map<Category, number>();
    for (const e of this.thisMonthExpenses()) {
      sums.set(e.category, (sums.get(e.category) ?? 0) + e.amount);
    }

    return [...sums]
      .map(([category, sum]) => ({
        category,
        total: sum,
        percent: Math.round((sum / total) * 100),
      }))
      .sort((a, b) => b.total - a.total);
  });

  constructor() {
    effect(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this._expenses()));
      } catch {
        // اگه مرورگر اجازه‌ی ذخیره نداد، اپ نباید از کار بیفته
      }
    });
  }

  add(data: Omit<Expense, 'id'>) {
    const expense: Expense = { ...data, id: crypto.randomUUID() };
    this._expenses.update((list) => [expense, ...list]);
  }

  update(id: string, changes: Omit<Expense, 'id'>) {
    this._expenses.update((list) =>
      list.map((e) => (e.id === id ? { ...changes, id } : e)),
    );
  }

  remove(id: string) {
    this._expenses.update((list) => list.filter((e) => e.id !== id));
  }

  private load(): Expense[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}