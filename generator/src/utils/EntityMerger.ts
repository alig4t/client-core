import type {
  Entity,
  EntityMeta,
  EnhancedEntity,
  Field,
  EnumValue,
  GeneratorConfig,
} from '../types/EntityTypes.js';
import { isCoreEntity, getCoreEntityInfo } from '../config.js';

export class EntityMerger {
  constructor(private config: GeneratorConfig) {}

  merge(entity: Entity, meta: EntityMeta | null): EnhancedEntity {
    const isCore = isCoreEntity(entity.name, this.config);
    const coreInfo = isCore ? getCoreEntityInfo(entity.name, this.config) : undefined;

    // If no meta file, create default meta
    const effectiveMeta = meta || this.createDefaultMeta(entity);

    // Merge enum labels from meta into entity fields
    const mergedFields = this.mergeFieldEnums(entity.fields, effectiveMeta);

    return {
      ...entity,
      fields: mergedFields,
      meta: effectiveMeta,
      isCore,
      coreImportPath: coreInfo?.importPath,
    };
  }

  private mergeFieldEnums(fields: Field[], meta: EntityMeta): Field[] {
    return fields.map(field => {
      if (field.enums && meta.fields[field.name]?.options) {
        const metaOptions = meta.fields[field.name].options!;
        const mergedEnums: EnumValue[] = field.enums.map(enumVal => {
          const metaOption = metaOptions.find(opt => opt.value === enumVal.name);
          return {
            ...enumVal,
            label: metaOption?.label || enumVal.value,
          };
        });
        return { ...field, enums: mergedEnums };
      }
      return field;
    });
  }

  private createDefaultMeta(entity: Entity): EntityMeta {
    const fields: Record<string, any> = {};
    const relationships: Record<string, any> = {};

    for (const field of entity.fields) {
      fields[field.name] = {
        label: this.camelToTitle(field.name),
        sortable: field.searchable || false,
        required: field.required || false,
        type: this.config.formTypeMapping[field.type],
      };
    }

    for (const rel of entity.relationships) {
      relationships[rel.name] = {
        label: this.camelToTitle(rel.name),
        sortable: false,
        required: rel.required || false,
        type: this.getRelationshipFormType(rel.relationshipType),
        displayField: 'id',
      };
    }

    return {
      displayName: entity.name,
      displayNamePlural: `${entity.name}s`,
      autocompleteField: entity.fields[0]?.name || 'id',
      fields,
      relationships,
    };
  }

  private getRelationshipFormType(relType: string): string {
    switch (relType) {
      case 'MANY_TO_MANY':
      case 'ONE_TO_MANY':
        return 'multiAutoComplete';
      default:
        return 'autocomplete';
    }
  }

  private camelToTitle(str: string): string {
    return str
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, s => s.toUpperCase())
      .trim();
  }
}
