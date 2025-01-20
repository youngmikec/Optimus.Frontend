import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as authSelections from 'src/app/@core/stores/auth/auth.selectors';
import * as usersSelections from 'src/app/@core/stores/users/users.selectors';
import * as usersActions from 'src/app/@core/stores/users/users.actions';
import * as commentActions from 'src/app/@core/stores/comments/comments.actions';
import * as commentSelectors from 'src/app/@core/stores/comments/comments.selectors';
import * as AuthSelector from 'src/app/@core/stores/auth/auth.selectors';
import { CommentInterface } from 'src/app/@core/interfaces/comments.interface';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit {
  @Output() closeComments: EventEmitter<'comments'> = new EventEmitter();

  user$ = this.store.select(authSelections.getUser);
  users$ = this.store.select(usersSelections.getActiveUsers);
  comments$: Observable<any> = this.store.select(
    commentSelectors.commentsSuccessSelector
  );
  replies$: Observable<any> = this.store.select(
    commentSelectors.repliesSuccessSelector
  );
  isCreating$ = this.store.select(commentSelectors.isCommentsCreatingSelector);

  addComment: boolean = false;
  showReplies: boolean = false;

  activeComment: any;

  private applicationId: number = parseInt(
    this.route.snapshot.paramMap.get('applicationId')!
  );

  constructor(
    private store: Store<fromApp.AppState>,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.store.dispatch(
      usersActions.GetActiveUsers({ payload: { take: 0, skip: 0 } })
    );
    this.store.dispatch(
      commentActions.loadComments({ applicationId: this.applicationId })
    );
  }

  closeTray() {
    this.closeComments.emit('comments');
  }

  sendComment(value: CommentInterface) {
    const commentReferences = value.references.map((ref) => ({
      recipientName: ref.userName, //  Pass recepient name or update backend to accept userId
      toEmail: ref.userEmail,
    }));
    this.store.dispatch(commentActions.loadingCreateComments());

    this.store.select(AuthSelector.getUser).subscribe({
      next: (user: any) => {
        this.store.dispatch(
          commentActions.createComment({
            text: value.comment,
            applicationId: this.applicationId,
            commentReferences,
            fromemail: user?.Email,
          })
        );
      },
    });
  }

  markCommentAsRead() {}

  deleteCommentThread() {}

  getCommentReplies(comment: any) {
    this.showReplies = !this.showReplies;
    this.activeComment = comment;
    this.store.dispatch(commentActions.loadReplies({ commentId: comment.id }));
  }

  backToComment() {
    this.showReplies = !this.showReplies;
    this.activeComment = null;
  }

  sendReply(value: { comment: string; references: any[] }) {
    this.addComment = false;

    const replyMailRecipients = value.references.map((ref) => ({
      recipientName: ref.userName, //  Pass recepient name or update backend to accept userId
      toEmail: ref.userEmail,
    }));
    this.store.dispatch(commentActions.loadingCreateComments());

    this.store.select(AuthSelector.getUser).subscribe({
      next: (user: any) => {
        this.store.dispatch(
          commentActions.replyComment({
            text: value.comment,
            replyMailRecipients,
            fromemail: user?.Email,
            commentId: this.activeComment.id,
          })
        );
      },
    });
  }

  markReplyAsRead() {}

  deleteNoteThread() {}
}
