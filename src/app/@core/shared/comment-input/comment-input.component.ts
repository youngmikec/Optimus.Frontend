import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import 'quill-mention';
import {
  CommentInterface,
  ReferenceUserInterface,
} from '../../interfaces/comments.interface';
import { QuillViewComponent } from 'ngx-quill';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-comment-input',
  templateUrl: './comment-input.component.html',
  styleUrls: ['./comment-input.component.scss'],
})
export class CommentInputComponent {
  @Input() activeBtnLabel: string = 'Send';
  @Input() placeholder: string = 'Add a comment';
  @Input() showCancelBtn: boolean = true;
  @Input() usersRef: any[] = [];
  @Input() isCreating$: Observable<boolean> = of(false);

  @Output() send: EventEmitter<CommentInterface> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();

  @ViewChild('quillEditor') quill!: QuillViewComponent;

  comment: string = '';
  isFocused: boolean = false;
  quillModules: any = {
    toolbar: [['bold', 'italic', 'underline']],
    mention: {
      allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
      mentionDenotationChars: ['@'],
      source: (searchTerm: any, renderList: any, mentionChar: any) => {
        let values: { id: string; value: string }[] = [];

        if (mentionChar === '@')
          values = this.usersRef?.map((user: any) => ({
            id: user?.userId,
            value: user?.name,
          }));
        if (searchTerm.length === 0) renderList(values, searchTerm);
        else {
          const matches = [];
          for (let i = 0; i < values.length; i++)
            if (
              ~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())
            )
              matches.push(values[i]);

          renderList(matches, searchTerm);
        }
      },
      onSelect: (item: any, insertItem: Function) => {
        insertItem(item);
        this.referencedUsers.push(item.id);
      },
    },
  };
  private referencedUsers: string[] = [];

  constructor() {}

  sendComment() {
    this.sanitizeComment();
    const references = this.getReferences;
    this.send.emit({ comment: this.comment, references });
  }

  cancelComment() {
    this.cancel.emit(null);
  }

  referenceUser(user: any) {
    const range = this.quill.quillEditor.getSelection(true);
    this.quill.quillEditor.insertText(range.index, `@${user?.name}`);
    this.referencedUsers.push(user?.userId);
  }

  // Removes references in the text that were cleared out
  sanitizeComment() {
    this.referencedUsers.forEach((userId: string, index: number) => {
      if (!this.comment.includes(userId)) this.referencedUsers.splice(index, 1);
    });
  }

  get getReferences() {
    const reference: ReferenceUserInterface[] = [];
    this.referencedUsers.forEach((userId) => {
      const ref = this.usersRef.find((userRef) => userRef.userId === userId);
      reference.push({ userName: ref.name, userEmail: ref.email });
    });

    return reference;
  }
}
