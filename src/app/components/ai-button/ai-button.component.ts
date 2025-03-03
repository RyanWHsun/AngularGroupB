import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { OpenAIService } from '../../services/ai.service';
import { IWeather } from 'src/app/interfaces/IWeather';

/**
 * AI推薦按鈕元件
 * 此元件用於獲取AI對特定景點的推薦建議
 * 包含一個可切換的按鈕，用於觸發AI推薦功能
 */
@Component({
  selector: 'app-ai-button',
  templateUrl: './ai-button.component.html',
  styleUrls: ['./ai-button.component.css'],
})
export class AiButtonComponent {
  // 從父元件接收的景點名稱
  @Input() cAttractionName = '';

  @Input() cWeather: IWeather | null = null;

  // 用於向父元件發送AI生成的新推薦計劃
  @Output() newPlanEvent = new EventEmitter<string>();

  // 用於向父元件發送按鈕的點擊狀態
  @Output() clickAiBtnEvent = new EventEmitter<boolean>();

  // 追蹤按鈕是否被點擊的狀態
  aiBtnIsClicked = false;

  // 儲存AI生成的推薦計劃
  plan = '';

  // 按鈕上顯示的文字，預設為「推薦景點」
  btnContent = '推薦景點';

  constructor(private aiService: OpenAIService) {}

  /**
   * 處理按鈕點擊事件的方法
   * @param attraction 要獲取推薦的景點名稱
   */
  async onClick(attraction: string) {
    // 重置推薦計劃
    this.plan = '';

    // 切換按鈕的點擊狀態
    this.aiBtnIsClicked = !this.aiBtnIsClicked;

    // 根據點擊狀態更新按鈕文字
    if (this.aiBtnIsClicked) {
      this.btnContent = '取消推薦';
    } else {
      this.btnContent = '推薦景點';
    }

    // 向父元件發送按鈕的最新狀態
    this.clickAiBtnEvent.emit(this.aiBtnIsClicked);

    // 如果按鈕被取消點擊，直接返回
    if (!this.aiBtnIsClicked) return;

    // 呼叫AI服務獲取推薦內容
    this.plan = await this.aiService.recommend(attraction, this.cWeather);

    // 如果成功獲取推薦內容，將其發送給父元件
    if (this.plan !== '') {
      this.newPlanEvent.emit(this.plan);
    }
  }
}
