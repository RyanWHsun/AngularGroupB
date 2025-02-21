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

//修改Rank
export interface userRankMaterial {
  fUserRankId: number;
  fUserName: string;
  fUserNickName: string;
}

//修改密碼
export interface userPasswordMaterial {
  email: string;
  password: string;
}


// 所有的
export interface allUsersMaterial {
  fUserId: number;
  fUserRankId: number;
  fUserName: string;
  fUserNickName: string;
  fUserImage: string | null;
  fUserSex: string;
  fUserBirthday: string;
  fUserPhone: string;
  fUserEmail: string;
  fUserAddress: string;
  fUserComeDate: string;
  fUserPassword?: string;
}
