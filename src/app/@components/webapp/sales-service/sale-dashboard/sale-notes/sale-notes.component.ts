import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteNoteModalComponent } from './delete-note-modal/delete-note-modal.component';
import { NotificationService } from 'src/app/@core/services/notification.service';
import { Notification } from 'src/app/@core/interfaces/notification.interface';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../../../@core/stores/app.reducer';
import * as NoteActions from '../../../../../@core/stores/notes/notes.actions';
import * as NoteSelectors from '../../../../../@core/stores/notes/notes.selectors';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-sale-notes',
  templateUrl: './sale-notes.component.html',
  styleUrls: ['./sale-notes.component.scss'],
})
export class SaleNotesComponent implements OnInit {
  content = '';
  selectedNoteId: number | null = null;
  quillModules: any = {
    toolbar: [
      [{ font: [] }],
      // [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      ['blockquote', 'code-block'],

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }], // outdent/indent

      // [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      // [{ align: [] }],
    ],
  };

  public isLoading$: Observable<boolean> = this.store.select(
    NoteSelectors.isNoteLoadingSelector
  );
  public notes$: Observable<any> = this.store
    .select(NoteSelectors.noteSuccessSelector)
    .pipe(
      map((notes: any) =>
        [...notes].sort(
          (a: any, b: any) =>
            new Date(b.createdDate).getTime() -
            new Date(a.createdDate).getTime()
        )
      )
    );
  public isCreating$: Observable<boolean> = this.store.select(
    NoteSelectors.isNoteCreatingSelector
  );

  constructor(
    public dialog: MatDialog,
    private notificationService: NotificationService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.store.dispatch(NoteActions.loadNotes());
    this.noteErrorLisener();
  }

  noteErrorLisener() {
    this.store.select(NoteSelectors.noteFailureSelector).subscribe({
      next: (error) => {
        if (error) {
          const notification: Notification = {
            state: 'error',
            message: error,
          };
          this.notificationService.openSnackBar(
            notification,
            'opt-notification-error'
          );
        }
      },
    });
  }

  addNote() {
    if (!this.content) {
      const notification: Notification = {
        state: 'error',
        message: 'Please enter a note before adding',
      };
      this.notificationService.openSnackBar(
        notification,
        'opt-notification-error'
      );
      return;
    }

    this.store.dispatch(NoteActions.createNoteLoading());

    if (this.selectedNoteId) this.updateNote();
    else
      this.store.dispatch(
        NoteActions.createNotes({ description: this.content })
      );
  }

  viewNote(note: any) {
    this.selectedNoteId = note.id;
    this.content = note.description;
  }

  duplicateNote(note: string) {
    this.store.dispatch(NoteActions.createNotes({ description: note }));
  }

  updateNote() {
    this.store.dispatch(
      NoteActions.updateNotes({
        description: this.content,
        noteId: this.selectedNoteId!,
      })
    );
  }

  deleteNote(note?: any) {
    this.selectedNoteId = note?.id ? note?.id : this.selectedNoteId;
    if (this.selectedNoteId === null) {
      const notification: Notification = {
        state: 'error',
        message: 'Please preview a note to delete',
      };
      this.notificationService.openSnackBar(
        notification,
        'opt-notification-error'
      );
      return;
    }

    this.openDeleteNoteModal();
  }

  openDeleteNoteModal() {
    const dialog = this.dialog.open(DeleteNoteModalComponent);
    dialog.afterClosed().subscribe({
      next: (result) => {
        if (!result) return;
        this.store.dispatch(
          NoteActions.deleteNotes({ id: this.selectedNoteId! })
        );
        this.selectedNoteId = null;
        this.content = '';
      },
    });
  }
}
