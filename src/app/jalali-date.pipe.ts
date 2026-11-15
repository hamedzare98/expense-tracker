import { Pipe, PipeTransform } from '@angular/core';
import { JALALI_MONTHS, isoToJalali } from './expense.model';

const digits = new Intl.NumberFormat('fa-IR', { useGrouping: false });

@Pipe({ name: 'jalaliDate' })
export class JalaliDatePipe implements PipeTransform {
  transform(iso: string): string {
    const { jy, jm, jd } = isoToJalali(iso);
    return `${digits.format(jd)} ${JALALI_MONTHS[jm - 1]} ${digits.format(jy)}`;
  }
}