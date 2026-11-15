import { Pipe, PipeTransform } from '@angular/core';

const grouped = new Intl.NumberFormat('fa-IR');
const plain = new Intl.NumberFormat('fa-IR', { useGrouping: false });

@Pipe({ name: 'faNumber' })
export class FaNumberPipe implements PipeTransform {
  transform(value: number | null | undefined, grouping = true): string {
    if (value == null) return '';
    return grouping ? grouped.format(value) : plain.format(value);
  }
}