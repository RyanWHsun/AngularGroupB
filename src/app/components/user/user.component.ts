import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { allUsersMaterial } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {


  Users: allUsersMaterial[] = []; // 存放 API 回傳
  filteredUsers: allUsersMaterial[] = []; // 存放篩選後的資料
  searchRank = 0;
  search = "";

  userPage: number = 1;//當前頁
  pageSize: number = 10;//一頁幾筆
  hasMorePages: boolean = true;//是否有下一頁
  totalUser: number = 0;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.logAll();
    window.scrollTo(0, 400);
  }

  //抓取所有檔案
  logAll() {
    this.userService.getUsers(this.userPage, this.pageSize, this.searchRank, this.search).subscribe({
      next: (data) => {
        // console.log(data);
        if (Array.isArray(data)) {
          // 確保 data 是一個陣列，並且符合 allUsersMaterial 結構
          this.Users = data.map(user => ({
            fUserId: user.fUserId,
            fUserRankId: user.fUserRankId,
            fUserName: user.fUserName,
            fUserNickName: user.fUserNickName,
            fUserImage: user.fUserImage,  // 確保圖片是符合資料類型
            fUserSex: user.fUserSex,
            fUserBirthday: user.fUserBirthday,
            fUserPhone: user.fUserPhone,
            fUserEmail: user.fUserEmail,
            fUserAddress: user.fUserAddress,
            fUserComeDate: user.fUserComeDate,
            fUserPassword: user.fUserPassword
          }));
        } else {
          console.log('返回資料不是陣列');
        }
        this.hasMorePages = this.pageSize === this.Users.length;
        this.filteredUsers = this.Users;

        // this.applyFilter();
      }, error: (err) => {
        console.log("讀取失敗", err);
      }
    })
  }

  log() {
    this.userPage = 1;
    this.logAll();
    window.scrollTo(0, 400);
  }








  // // 應用篩選
  // applyFilter() {
  //   let filtered = this.Users;

  //   // 篩選條件: 根據會員等級篩選
  //   if (this.searchRank > 0) {
  //     filtered = filtered.filter(user => user.fUserRankId == this.searchRank);
  //   } else if (this.searchRank == 0) {
  //     filtered = this.Users;
  //   }

  //   console.log("filtered", filtered);

  //   // 關鍵字篩選
  //   if (this.search) {
  //     filtered = filtered.filter(user =>
  //       user.fUserName.toLowerCase().includes(this.search.toLowerCase()) ||
  //       user.fUserNickName.toLowerCase().includes(this.search.toLowerCase()) ||
  //       user.fUserEmail.toLowerCase().includes(this.search.toLowerCase())
  //     );
  //   }

  //   // 更新篩選後的資料
  //   this.filteredUsers = filtered;
  // }



  //頁面
  //前一頁
  forwardPage() {

    this.userPage--;
    this.logAll();
    window.scrollTo(0, 400);

  }

  //後一頁
  nextPage() {
    if (this.hasMorePages) {
      this.userPage++;
      this.logAll();
      window.scrollTo(0, 400);
    }
  }


  // SMTP



  usersEdit(userId: number) {
    this.router.navigate([`/user/UserAdminEdit/${userId}`]);
  }


}
