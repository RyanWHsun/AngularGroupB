import { WalletService } from 'src/app/services/wallet.service';
import { userWallet } from './../../interfaces/wallet';
import { Component } from '@angular/core';
import { SweetAlert2Service } from 'src/app/services/sweet-alert2.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent {
  walletData: userWallet[] = [];
  availableBalance: number = 0;

  constructor(private wallet: WalletService, private swal: SweetAlert2Service) { }

  ngOnInit(): void {
    this.loadBalance();

    setTimeout(() => {
      const scrollY = window.innerHeight * 0.2; //視窗高度百分比
      window.scrollTo({ top: scrollY, behavior: 'smooth' });
    }, 200);

  }

  loadBalance(): void {
    this.wallet.getUserWallet().subscribe({
      next: (data) => {
        this.walletData = data
        this.sortTransactionsByDate();
        this.calculateBalance();
        console.log(this.walletData);
      }, error: (error) => {
        console.error(error.message);
        this.swal.showEasyError('尚無紀錄')
      }
    })
  }

  calculateBalance(): void {
    this.walletData.forEach(t => {
      this.availableBalance += t.fAmountChange
    })
  }

  // 根據交易時間將交易紀錄由新到舊排序
  sortTransactionsByDate(): void {
    this.walletData.sort((a, b) => {
      const dateA = new Date(a.fChangeTime).getTime();
      const dateB = new Date(b.fChangeTime).getTime();
      return dateB - dateA;  // 由新到舊排序
    });
  }
}
