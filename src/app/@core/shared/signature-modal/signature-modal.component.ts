import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subscription, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as UsersSelectors from 'src/app/@core/stores/users/users.selectors';
import * as UsersActions from 'src/app/@core/stores/users/users.actions';
import { Notification } from 'src/app/@core/interfaces/notification.interface';
import { NotificationService } from 'src/app/@core/services/notification.service';

import * as SignatureActions from 'src/app/@core/stores/signature/signature.actions';
import * as SignatureSelectors from 'src/app/@core/stores/signature/signature.selectors';
import { SignatureInterface } from 'src/app/@core/stores/signature/signature.actions';

enum Method {
  Draw = 'Draw',
  Upload = 'Upload',
  SignatureList = 'SignatureList',
}
@Component({
  selector: 'app-signature-modal',
  templateUrl: './signature-modal.component.html',
  styleUrls: ['./signature-modal.component.scss'],
})
export class SignatureModalComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  selectedMethod: Method = Method.Draw;
  methodList: Method[] = [Method.Draw, Method.Upload];

  @ViewChild('signpad', { static: false })
  public signpad!: ElementRef<HTMLCanvasElement>;
  condition: boolean = false;

  canSubmit: boolean = false;
  isLoading!: Observable<boolean>;
  isSignatureLoading: Observable<boolean> = of(false);
  userSignatureList!: SignatureInterface[] | null;
  selectedUserSignature!: SignatureInterface | null;

  selectedImage!: any;

  private signatureImg?: string;
  private sigPadElement: any;
  private context: any;
  private isDrawing!: boolean;

  canvasRendered: boolean = false;

  getSignatureSub!: Subscription;

  saveMode: 'create' | 'update' = 'create';
  selectedSignatureId!: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SignatureModalComponent>,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private store: Store<fromApp.AppState>,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    if (this.data.type === 'profile') {
      this.isLoading = this.store.pipe(
        select(UsersSelectors.getUsersIsLoading)
      );
    } else if (this.data.type === 'invoice') {
      this.isLoading = of(false);
      this.isSignatureLoading = this.store.pipe(
        select(SignatureSelectors.getSignatureIsLoading)
      );
      this.getUsersSignature();
    } else {
      this.isLoading = of(false);
    }
  }

  ngAfterViewInit(): void {
    this.condition = true;
    this.changeDetectorRef.detectChanges();

    if (this.selectedMethod !== Method.Draw) return;

    this.dialogRef.afterOpened().subscribe(() => {
      this.sigPadElement = this.signpad?.nativeElement;
      this.context = this.sigPadElement?.getContext('2d');
      if (this.context) {
        this.context.strokeStyle = '#000';
      }
      this.sigPadElement.addEventListener('mousedown', (event: any) =>
        this.onMouseDown(event)
      );
      this.sigPadElement.addEventListener('mousemove', (event: any) =>
        this.onMouseMove(event)
      );
      this.sigPadElement.addEventListener('mouseup', (event: any) =>
        this.onMouseUp(event)
      );
      setTimeout(() => {
        this.sigPadElement = this.signpad?.nativeElement;
        this.context = this.sigPadElement?.getContext('2d');
        if (this.context) {
          this.context.strokeStyle = '#000';
        }
        this.sigPadElement.addEventListener('mousedown', (event: any) =>
          this.onMouseDown(event)
        );
        this.sigPadElement.addEventListener('mousemove', (event: any) =>
          this.onMouseMove(event)
        );
        this.sigPadElement.addEventListener('mouseup', (event: any) =>
          this.onMouseUp(event)
        );
      }, 0);
    });
  }

  getUsersSignature() {
    this.store.dispatch(SignatureActions.GetSignatureByUserId());

    this.getSignatureSub = this.store
      .pipe(select(SignatureSelectors.getSignatureByUserId))
      .subscribe((resData: any) => {
        if (!resData) {
          this.selectedMethod = Method.Draw;
        }
        if (resData) {
          this.userSignatureList = resData;
          this.selectedMethod = Method.SignatureList;
        }
      });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onSelectedMethodChange() {
    this.canSubmit = false;
  }

  onUpload(e: any) {
    if (e.target.files[0]?.size < 1000000) {
      this.selectedImage = e.target.files[0];
      this.canSubmit = true;
    } else {
      const notification: Notification = {
        state: 'warning',
        message: 'The maximum image size is 1MB',
      };

      this.notificationService.openSnackBar(
        notification,
        'opt-notification-warning'
      );
    }
  }

  clearUpload() {
    this.selectedImage = null;
  }

  openFileInput() {
    document?.getElementById(`upload`)?.click();
  }

  onMouseDown(e: any): void {
    this.isDrawing = true;
    const coords = this.relativeCoords(e);
    this.context?.moveTo(coords.x, coords.y);
    this.canSubmit = true;
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(e: any): void {
    this.isDrawing = false;
  }

  onMouseMove(e: any): void {
    if (this.isDrawing) {
      const coords = this.relativeCoords(e);
      this.context?.lineTo(coords.x, coords.y);
      this.context?.stroke();
    }
  }

  clearSignature(): void {
    this.signatureImg = undefined;
    this.context.clearRect(
      0,
      0,
      this.sigPadElement.width,
      this.sigPadElement.height
    );
    this.context.beginPath();
    this.canSubmit = false;
  }

  private relativeCoords(event: any): { x: number; y: number } {
    const bounds = event.target.getBoundingClientRect();
    const cords = {
      clientX: event.clientX || event.changedTouches[0].clientX,
      clientY: event.clientY || event.changedTouches[0].clientY,
    };
    const x = cords.clientX - bounds.left;
    const y = cords.clientY - bounds.top;
    return { x, y };
  }

  viewSavedSignature() {
    this.selectedMethod = Method.SignatureList;
  }

  viewDrawSignature() {
    this.selectedMethod = Method.Draw;
  }

  onSaveSignature(): void {
    // if type is draw
    if (this.selectedMethod === 'Draw' && this.canSubmit) {
      this.signatureImg = this.sigPadElement.toDataURL('image/png');
      const base64String = this.signatureImg!.toString().split(',');

      if (this.saveMode === 'create') {
        this.onSubmit(base64String[1]);
      } else if (this.saveMode === 'update') {
        this.onSubmit(base64String[1], this.selectedSignatureId);
      }
    }
    // if type is upload
    else if (this.selectedMethod === 'Upload' && this.canSubmit) {
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedImage);
      reader.onload = () => {
        const base64String = reader.result!.toString().split(',');

        if (this.saveMode === 'create') {
          this.onSubmit(base64String[1]);
        } else if (this.saveMode === 'update') {
          this.onSubmit(base64String[1], this.selectedSignatureId);
        }
      };
    }
  }

  onEditSignature(signatureId: number) {
    this.saveMode = 'update';
    this.selectedSignatureId = signatureId;

    this.selectedMethod = Method.Draw;

    this.changeDetectorRef.detectChanges();

    this.sigPadElement = this.signpad?.nativeElement;
    this.context = this.sigPadElement?.getContext('2d');
    if (this.context) {
      this.context.strokeStyle = '#000';
    }
    this.sigPadElement.addEventListener('mousedown', (event: any) =>
      this.onMouseDown(event)
    );
    this.sigPadElement.addEventListener('mousemove', (event: any) =>
      this.onMouseMove(event)
    );
    this.sigPadElement.addEventListener('mouseup', (event: any) =>
      this.onMouseUp(event)
    );
  }

  onSubmit(file: string, signatureId?: number) {
    if (this.data.type === 'profile') {
      this.store.dispatch(UsersActions.IsLoading({ payload: true }));

      this.store.dispatch(
        UsersActions.UpdateUserSignature({
          payload: {
            signature: file,
          },
        })
      );
    } else if (this.data.type === 'invoice') {
      if (this.saveMode === 'create') {
        this.store.dispatch(
          SignatureActions.CreateSignature({
            payload: {
              signature: file,
            },
          })
        );
        this.getSignatureSub = this.store
          .pipe(select(SignatureSelectors.getCreatedSignature))
          .subscribe((resData: any) => {
            if (resData) {
              this.data.action(resData);
              this.dialogRef.close();
            }
          });
      } else if (this.saveMode === 'update') {
        if (!signatureId) return;
        this.store.dispatch(
          SignatureActions.UpdateSignature({
            payload: {
              id: signatureId,
              signature: file,
            },
          })
        );
        this.getSignatureSub = this.store
          .pipe(select(SignatureSelectors.getUpdatedSignature))
          .subscribe((resData: any) => {
            if (resData) {
              this.data.action(resData);
              this.dialogRef.close();
            }
          });
      }
    } else {
      this.data.action(file);
      this.dialogRef.close();
    }
  }

  createNewSignature() {
    this.saveMode = 'create';

    this.selectedMethod = Method.Draw;

    this.changeDetectorRef.detectChanges();

    this.sigPadElement = this.signpad?.nativeElement;
    this.context = this.sigPadElement?.getContext('2d');
    if (this.context) {
      this.context.strokeStyle = '#000';
    }
    this.sigPadElement.addEventListener('mousedown', (event: any) =>
      this.onMouseDown(event)
    );
    this.sigPadElement.addEventListener('mousemove', (event: any) =>
      this.onMouseMove(event)
    );
    this.sigPadElement.addEventListener('mouseup', (event: any) =>
      this.onMouseUp(event)
    );
  }

  onSaveSelectedSignature() {
    if (!this.selectedUserSignature) return;
    this.data.action(this.selectedUserSignature);
    this.dialogRef.close();
  }

  selectUserSignature(signature: SignatureInterface) {
    this.selectedUserSignature = signature;
  }

  formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = [
      'Bytes',
      'KiB',
      'MiB',
      'GiB',
      'TiB',
      'PiB',
      'EiB',
      'ZiB',
      'YiB',
    ];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }

  ngOnDestroy(): void {
    if (this.getSignatureSub) {
      this.getSignatureSub.unsubscribe();
    }
  }
}
