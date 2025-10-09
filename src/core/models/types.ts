export interface FieldMetadata {
    label: string;
    sortable?: boolean;
    // hidden?: boolean;
    // type?: 'text' | 'date' | 'number' | 'boolean';
}

export interface ModelMetadata<T> {
    fields: { [K in keyof T]?: FieldMetadata };
    displayField: keyof T;
}