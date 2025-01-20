import {
  AfterContentChecked,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AnswerInterface } from 'src/app/@components/webapp/quote-calculator/quote-calculator.interface';

interface Options {
  icon?: string;
  name: string;
  tagline?: string;
  id?: string | number;
  checked?: boolean;
}

@Component({
  selector: 'app-quote-select',
  templateUrl: './quote-select.component.html',
  styleUrls: ['./quote-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => QuoteSelectComponent),
      multi: true,
    },
  ],
})
export class QuoteSelectComponent
  implements OnInit, AfterContentChecked, ControlValueAccessor
{
  @Input() options: Options[] = [];
  @Input() answer!: AnswerInterface | undefined;
  @Output() selectedOption = new EventEmitter<Options>();
  _selectedOption: Options = {
    name: '',
  };
  @Output() selectedOption2 = new EventEmitter<any>();
  itemDOM!: HTMLCollectionOf<HTMLElement> | any;
  @Input() disabled = false;
  @Input() type:
    | 'SELECT'
    | 'SingleSelection'
    | 'RealEstateInvestmentType'
    | 'SELECT2'
    | 'RADIO'
    | 'TRUEFALSE'
    | 'INPUT' = 'SELECT';
  showSelect = true;

  value: any = null;

  trueFalseSelect1: boolean = false;
  trueFalseSelect2: boolean = false;

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor() {}

  ngOnInit() {
    this.showSelect = true;
    this.itemDOM = Array.from(document.getElementsByClassName('option-items'));
    if (this.disabled) {
      this.itemDOM.forEach((i: any) => {
        i.classList.add('disabled');
        i.parentElement.style.add('disabled-parent');
      });
    } else {
      this.itemDOM.forEach((i: any) => {
        i.classList.remove('disabled');
        i.parentElement.style.remove('disabled-parent');
      });
    }
    if (this.type === 'RADIO' || this.type === 'TRUEFALSE') {
      this.options = [
        { name: 'Yes', id: 'yes', icon: 'assets/icons/yes.svg' },
        { name: 'No', id: 'no', icon: 'assets/icons/no.svg' },
      ];
    }

    if (this.answer) {
      this.selectTrueFalse(this.answer?.answer);
    }
  }

  ngAfterContentChecked(): void {
    if (this.itemDOM && this.itemDOM.length < 1) {
      this.itemDOM = Array.from(
        document.getElementsByClassName('option-items')
      );
      if (this.disabled) {
        this.itemDOM.forEach((i: any) => {
          i.classList.add('disabled');
          i.parentElement.style.cursor = 'not-allowed';
        });
      } else {
        this.itemDOM.forEach((i: any) => {
          i.classList.remove('disabled');
          i.parentElement.style.cursor = 'default';
        });
      }
    }
  }

  select(selectedItem: Options, i: number) {
    this.itemDOM.forEach((item: HTMLElement, index: number) => {
      if (index === i) {
        item.classList.add('item-selected');
      } else {
        item.classList.remove('item-selected');
      }
    });
    this.value = selectedItem.id || selectedItem.name;
    this.onChange(this.value);
  }

  writeValue(value: number): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  selectTrueFalse(option: string) {
    if (option === 'yes' || option === 'true') {
      this.trueFalseSelect1 = true;
      this.trueFalseSelect2 = false;
      this.selectedOption2.emit('true');
    } else if (option === 'no' || option === 'false') {
      this.trueFalseSelect1 = false;
      this.trueFalseSelect2 = true;
      this.selectedOption2.emit('false');
    }
  }

  onMigrationRouteChange() {
    this.selectedOption.emit(this._selectedOption);
  }

  onCheckboxChange(options: any) {
    this.selectedOption.emit(options);
  }

  onValueChange(value: any) {
    this.selectedOption2.emit(value);
  }
}
