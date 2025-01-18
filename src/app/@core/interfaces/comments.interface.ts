export interface ReferenceUserInterface {
  userName: string;
  userEmail: string;
}

export interface CommentInterface {
  comment: string;
  references: ReferenceUserInterface[];
}
