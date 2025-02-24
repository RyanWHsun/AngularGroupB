import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { OpenAIService } from '../../services/ai.service';

@Component({
  selector: 'app-ai-button',
  templateUrl: './ai-button.component.html',
  styleUrls: ['./ai-button.component.css'],
})
export class AiButtonComponent {
  @Input() cAttractionName = ''; // child component 的 attraction
  @Output() newPlanEvent = new EventEmitter<string>();
  @Output() clickAiBtnEvent = new EventEmitter<boolean>();

  aiBtnIsClicked = false;

  plan = '';
  btnContent = '推薦景點';

  constructor(private aiService: OpenAIService) {}

  async onClick(attraction: string) {
    this.plan = '';

    this.aiBtnIsClicked = !this.aiBtnIsClicked;
    if (this.aiBtnIsClicked) {
      this.btnContent = '取消推薦';
    } else {
      this.btnContent = '推薦景點';
    }

    this.clickAiBtnEvent.emit(this.aiBtnIsClicked);

    if(!this.aiBtnIsClicked)return;
    this.plan = await this.aiService.recommend(attraction);
    if (this.plan !== '') {
      this.newPlanEvent.emit(this.plan);
    }
  }
}
