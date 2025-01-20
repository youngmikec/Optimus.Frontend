import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CommentInterface } from 'src/app/@core/interfaces/comments.interface';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as authSelections from 'src/app/@core/stores/auth/auth.selectors';
import * as DocumentCollectionActions from 'src/app/@core/stores/document-collection/document-collection.actions';
import * as DocumentCollectionSelector from 'src/app/@core/stores/document-collection/document-collection.selectors';

@Component({
  selector: 'app-document-comments',
  templateUrl: './document-comments.component.html',
  styleUrls: ['./document-comments.component.scss'],
})
export class DocumentCommentsComponent implements OnInit {
  @Input() documentId!: number;
  @Output() closeDocComments: EventEmitter<null> = new EventEmitter();
  user$ = this.store.select(authSelections.getUser);
  comments$: Observable<any> = this.store.select(
    DocumentCollectionSelector.documentCommentsSelector
  );

  addComment: boolean = false;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.getDocumentComments();
  }

  close() {
    this.closeDocComments.emit(null);
  }

  getDocumentComments() {
    this.store.dispatch(
      DocumentCollectionActions.getDocumentComments({
        documentId: this.documentId,
      })
    );
  }

  addDocComment(value: CommentInterface) {
    this.store.dispatch(
      DocumentCollectionActions.createDocumentComment({
        documentId: this.documentId,
        comment: value.comment,
      })
    );
  }
}
