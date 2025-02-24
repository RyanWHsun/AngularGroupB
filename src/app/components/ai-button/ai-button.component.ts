import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OpenAIService } from '../../services/ai.service';

@Component({
  selector: 'app-ai-button',
  templateUrl: './ai-button.component.html',
  styleUrls: ['./ai-button.component.css']
})
export class AiButtonComponent {
  @Input() cAttractionName = ''; // child component 的 attraction
  @Output() newPlanEvent = new EventEmitter<string>();

  plan='';

  constructor(private aiService:OpenAIService){
  }

  async onClick(attraction:string){
    this.plan='';
    this.plan = await this.aiService.recommend(attraction);
    if(this.plan!==''){
      this.newPlanEvent.emit(this.plan);
    }
  }
}
