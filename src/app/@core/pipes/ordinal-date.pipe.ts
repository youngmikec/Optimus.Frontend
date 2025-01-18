// import { Pipe, PipeTransform } from '@angular/core';
// import { DatePipe } from '@angular/common';

// @Pipe({
//   name: 'ordinalDate',
// })
// export class OrdinalDatePipe extends DatePipe implements PipeTransform {
//   // Corrected the method signature and added 'override'
//   override transform(
//     value: Date | string | number | null | undefined,
//     format: string = 'MMMM d, y',
//     timezone?: string,
//     locale?: string
//   ): any {
//     if (!value) return null;

//     // Call the transform method from the base class (DatePipe)
//     const formattedDate = super.transform(value, format, timezone, locale);

//     if (!formattedDate) return null;

//     const day = new Date(value).getDate();
//     const suffix = this.getOrdinalSuffix(day);

//     return formattedDate.replace(day.toString(), `${day}${suffix}`);
//   }

//   private getOrdinalSuffix(day: number): string {
//     if (day > 3 && day < 21) return 'th'; // Handles 11th to 19th
//     switch (day % 10) {
//       case 1:
//         return 'st';
//       case 2:
//         return 'nd';
//       case 3:
//         return 'rd';
//       default:
//         return 'th';
//     }
//   }
// }

import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'ordinalDate',
})
export class OrdinalDatePipe extends DatePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
    super('en-US'); // Specify the locale if needed
  }

  override transform(
    value: Date | string | number | null | undefined,
    format: string = 'd MMMM, y', // Default format with full month name
    timezone?: string,
    locale?: string
  ): any {
    if (!value) return null;

    // Call the transform method from the base class (DatePipe)
    // Ensure the day is displayed without a leading zero using the 'd' format
    const formattedDate = super.transform(value, 'd MMMM, y', timezone, locale);

    if (!formattedDate) return null;

    const day = new Date(value).getDate(); // Get the numeric day (no leading zero)
    const suffix = this.getOrdinalSuffix(day);

    // Format the date to include the superscript suffix
    const formattedWithSuperscript = formattedDate.replace(
      day.toString(),
      `${day}<sup>${suffix}</sup>`
    );

    // Return the safe HTML
    return this.sanitizer.bypassSecurityTrustHtml(formattedWithSuperscript);
  }

  private getOrdinalSuffix(day: number): string {
    if (day > 3 && day < 21) return 'th'; // Handles 11th to 19th
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }
}
