import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'commaSeparated',
})
export class CommaSeparatedPipe implements PipeTransform {
  transform(value: number | string): string {
    if (!value) {
      return '';
    }
    const num = Number(value);
    return isNaN(num) ? '' : num.toLocaleString();
  }
}
