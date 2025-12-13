import yaml from 'js-yaml';
import { readFileSync, existsSync } from 'fs';
import type { EntityMeta, FieldMeta } from '../types/EntityTypes.js';

export class MetaParser {
  parseFile(filePath: string): EntityMeta | null {
    if (!existsSync(filePath)) {
      console.warn(`Meta file not found: ${filePath}`);
      return null;
    }

    const content = readFileSync(filePath, 'utf-8');
    return this.parse(content);
  }

  parse(yamlContent: string): EntityMeta {
    const data = yaml.load(yamlContent) as any;

    if (!data) {
      throw new Error('Invalid YAML: empty content');
    }

    return {
      displayName: data.displayName,
      displayNamePlural: data.displayNamePlural,
      autocompleteField: data.autocompleteField,
      routing: data.routing ? {
        basePath: data.routing.basePath,
        menuLabel: data.routing.menuLabel,
        menuIcon: data.routing.menuIcon,
        menuParent: data.routing.menuParent,
        showInMenu: data.routing.showInMenu,
        menuOrder: data.routing.menuOrder,
      } : undefined,
      fields: this.parseFieldsMeta(data.fields || {}),
      relationships: this.parseFieldsMeta(data.relationships || {}),
    };
  }

  private parseFieldsMeta(fieldsData: any): Record<string, FieldMeta> {
    const fields: Record<string, FieldMeta> = {};

    for (const [fieldName, fieldData] of Object.entries(fieldsData)) {
      const data = fieldData as any;
      fields[fieldName] = {
        label: data.label,
        placeholder: data.placeholder,
        sortable: data.sortable,
        type: data.type,
        displayField: data.displayField,
        options: data.options || (data.enums ? this.convertEnumsToOptions(data.enums) : undefined),
      };
    }

    return fields;
  }

  private convertEnumsToOptions(enums: Record<string, string>): Array<{ value: string; label: string }> {
    return Object.entries(enums).map(([value, label]) => ({
      value,
      label,
    }));
  }
}
