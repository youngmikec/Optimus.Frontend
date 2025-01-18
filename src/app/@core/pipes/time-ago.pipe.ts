import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'timeago.js';

@Pipe({
  name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: string): unknown {
    return format(new Date(value).getTime(), 'en_US');
  }
}
