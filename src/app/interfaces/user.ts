// 顯示
export interface userMaterial {
  fUserRankId: number;
  fUserName: string;
  fUserImage?: string | null;//照片
  fUserNickName: string;
  fUserSex: string;
  fUserBirthday: string;
  fUserComeDate: string;
  fUserPhone: string;
  fUserAddress: string;

}

//修改
export interface userEditMaterial {
  fUserRankId: number;
  fUserName: string;
  fUserImage?: string | null;//照片
  fUserNickName: string;
  fUserSex: string;
  fUserPhone: string;
  fUserBirthday: string;
  fUserAddress: string;
}
