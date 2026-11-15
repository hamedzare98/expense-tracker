import { Directive, ElementRef, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const formatter = new Intl.NumberFormat('fa-IR');

function toEnglishDigits(text: string): string {
  return text
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
}

@Directive({
  selector: 'input[appMoneyInput]',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MoneyInput), multi: true },
  ],
  host: {
    '(input)': 'onInput()',
    '(blur)': 'onTouched()',
  },
})
export class MoneyInput implements ControlValueAccessor {
  private readonly el = inject<ElementRef<HTMLInputElement>>(ElementRef);
  private onChange: (value: number | null) => void = () => {};
  protected onTouched: () => void = () => {};

  // فرم → اینپوت
  writeValue(value: number | null): void {
    this.el.nativeElement.value = value == null ? '' : formatter.format(value);
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.el.nativeElement.disabled = disabled;
  }

  // اینپوت → فرم
  protected onInput(): void {
    const input = this.el.nativeElement;
    const caretFromEnd = input.value.length - (input.selectionStart ?? input.value.length);

    const digits = toEnglishDigits(input.value).replace(/\D/g, '').slice(0, 13);
    const value = digits ? Number(digits) : null;

    input.value = value == null ? '' : formatter.format(value);
    const caret = Math.max(0, input.value.length - caretFromEnd);
    input.setSelectionRange(caret, caret);

    this.onChange(value);
  }
}