import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Note } from '../createWorkOrderDto';

@Component({
  selector: 'app-notes-modal',
  templateUrl: './notes-modal.component.html',
  styleUrls: ['./notes-modal.component.css'],
})
export class NotesModalComponent implements OnInit {
  noteForm: FormGroup;
  noteTypes: string[] = ['Email', 'SMS', 'Type3'];

  constructor(
    public dialogRef: MatDialogRef<NotesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.noteForm = this.fb.group({
      id: [this.data?.id || 0],
      type: [this.data?.type || '', Validators.required],
      content: [this.data?.content || '', Validators.required],
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.noteForm.valid) {
      const noteData:Note = {
        id: this.noteForm.value.id,
        type: this.noteForm.value.type,
        content: this.noteForm.value.content,
        attachments : []
      };

      this.dialogRef.close(noteData);
    }
  }
}
