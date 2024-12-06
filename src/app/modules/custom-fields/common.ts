// Define constants for entity types
export class EntityTypes {
    public static readonly Contact: string = 'contact';
    public static readonly Job: string = 'job';
    public static readonly WorkOrder: string = 'workorder';
    public static readonly Attachment: string = 'attachment';
    public static readonly Note: string = 'note';
    public static readonly Task: string = 'task';
    public static readonly Source: string = 'source';
  }
  
  // Define constants for field types
  export class FieldTypes {
    public static readonly Dropdown: string = 'dropdown';
    public static readonly Date: string = 'date';
    public static readonly Number: string = 'number';
    public static readonly Currency: string = 'currency';
    public static readonly Text: string = 'text';
    public static readonly Boolean: string = 'boolean';
  }


  // dynamic-field.interface.ts

export interface Option {
  id: number;
  value: string;
}

export interface DynamicField {
  id: number;
  entityType: string;
  fieldName: string;
  fieldType: string;
  isRequired: boolean;
  multiSelect: boolean;
  options?: Option[];
}

  