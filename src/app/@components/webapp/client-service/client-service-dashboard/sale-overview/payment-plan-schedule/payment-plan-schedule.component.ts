import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { fadeInDown } from 'src/app/@core/animations/animation';

@Component({
  selector: 'app-payment-plan-schedule',
  templateUrl: './payment-plan-schedule.component.html',
  styleUrls: ['./payment-plan-schedule.component.scss'],
  animations: [fadeInDown],
})
export class PaymentPlanScheduleComponent implements OnInit {
  @Input() outstandingLoan: number = 0;
  public paymentScheduleForm!: FormGroup;
  public createPaymentSchedule: boolean = false;
  public shouldUploadReceipt: boolean = false;
  public minDate: Date = new Date();

  public replacedFile: File | null = null;
  public isFileUploaded: boolean = false;
  public fileSize: string = '';

  @Output() private closePage: EventEmitter<null> = new EventEmitter();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.paymentScheduleForm = this.fb.group({
      totalAmount: new FormControl('', Validators.required),
      paymentDuration: new FormControl('', Validators.required),
      frequency: new FormControl('', Validators.required),
      startDate: new FormControl('', Validators.required),
    });
  }

  dismiss() {
    this.closePage.emit(null);
  }

  uploadReceipt(ev: any) {
    const file = ev.target.files[0];
    this.replacedFile = file;
    this.isFileUploaded = !this.isFileUploaded;

    const fileSizeInBytes = file.size;
    const fileSizeInKB = fileSizeInBytes / 1024;
    this.fileSize = (fileSizeInKB / 1024).toFixed(2);
  }
}
