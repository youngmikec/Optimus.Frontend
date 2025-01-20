import {
  Directive,
  HostListener,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';

@Directive({
  selector: 'input[appCommaSeperated]',
})
export class CommaSeperatedDirective {
  private el: HTMLInputElement;

  @Output() unformattedNumberChange = new EventEmitter<number | null>();

  constructor(private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
  }

  @HostListener('input', ['$event'])
  onInputChange(event: Event) {
    const initialValue = this.el.value;

    // Remove all non-digit characters, except for the decimal point
    const numberValue = initialValue.replace(/[^0-9.]/g, '');

    // If needed, store the unformatted number internally or emit it
    const unformattedNumber = numberValue ? parseFloat(numberValue) : null;
    this.unformattedNumberChange.emit(unformattedNumber);

    // Format the number with commas
    const formattedValue = this.formatNumberWithCommas(numberValue);

    // Update the input value
    this.el.value = formattedValue;

    // Trigger Angular change detection if the value has changed
    if (initialValue !== this.el.value) {
      event.stopPropagation();
    }
  }

  private formatNumberWithCommas(value: string): string {
    const parts = value.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Format the integer part with commas
    return parts.join('.');
  }
}
