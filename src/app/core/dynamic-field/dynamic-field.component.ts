import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DynamicField, FieldTypes } from 'src/app/modules/custom-fields/common';

@Component({
  selector: 'app-dynamic-field',
  templateUrl: './dynamic-field.component.html',
  styleUrls: ['./dynamic-field.component.css']
})
export class DynamicFieldComponent implements OnInit {
  @Input() fields: DynamicField[] = [];
  @Input() form: FormGroup = new FormGroup({});

  fieldTypes = FieldTypes;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
  }

  get isValid() {
    return this.form.valid;
  }
}
