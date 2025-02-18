export interface IPostComment {
  fCommentId: number;
  fPostId: number;
  fUserId: number;
  fUserName: string;
  fUserImage: string;
  fUserNickName: string;
  fContent: string;
  fCreatedAt: string;
  fUpdatedAt: string;
  fParentCommentId: number;
}
