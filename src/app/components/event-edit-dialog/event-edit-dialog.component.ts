import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventService, Event } from '../../services/event.service';

@Component({
  selector: 'app-event-edit-dialog',
  templateUrl: './event-edit-dialog.component.html',
  styleUrls: ['./event-edit-dialog.component.css']
})
export class EventEditDialogComponent {
  event: Event;
  selectedImage: File | null = null;
  isEditMode = false;

  constructor(
    public dialogRef: MatDialogRef<EventEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Event | null
  ) {
    if (data) {
      this.event = { ...data };
      this.isEditMode = true;
    } else {
      this.event = { fEventId: 0, fEventName: '', fEventDescription: '', fEventStartDate: '', fEventEndDate: '' };
      this.isEditMode = false;
    }
  }

  /** ✅ 選擇圖片 */
  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedImage = event.target.files[0];
    }
  }

  /** ✅ 提交表單 */
  submitEvent() {
    if (!this.event.fEventName || !this.event.fEventStartDate || !this.event.fEventEndDate) {
      alert('請填寫完整的活動資訊！');
      return;
    }

    this.dialogRef.close(this.event);
  }

  /** ❌ 取消 */
  cancelEdit() {
    this.dialogRef.close();
  }
}



