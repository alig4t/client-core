import { XMLParser } from 'fast-xml-parser';
import { readFileSync } from 'fs';
import type { Entity, Field, Relationship, EnumValue } from '../types/EntityTypes.js';

export class XmlEntityParser {
  private parser: XMLParser;

  constructor() {
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      textNodeName: '#text',
      parseAttributeValue: true,
      trimValues: true,
    });
  }

  parseFile(filePath: string): Entity {
    const xmlContent = readFileSync(filePath, 'utf-8');
    return this.parse(xmlContent);
  }

  parse(xmlContent: string): Entity {
    const result = this.parser.parse(xmlContent);
    const entityData = result.entity;

    if (!entityData) {
      throw new Error('Invalid XML: no <entity> root found');
    }

    return {
      name: entityData.name,
      tableName: entityData.tableName,
      generate: entityData.generate === true || entityData.generate === 'true',
      fields: this.parseFields(entityData.fields?.field),
      relationships: this.parseRelationships(entityData.relationships?.relationship),
    };
  }

  private parseFields(fieldsData: any): Field[] {
    if (!fieldsData) return [];

    const fields = Array.isArray(fieldsData) ? fieldsData : [fieldsData];

    return fields.map(field => ({
      name: field.name,
      type: field.type,
      required: field.required === true || field.required === 'true',
      unique: field.unique === true || field.unique === 'true',
      searchable: field.searchable === true || field.searchable === 'true',
      indexed: field.indexed === true || field.indexed === 'true',
      maxLength: field.maxLength ? parseInt(field.maxLength) : undefined,
      minLength: field.minLength ? parseInt(field.minLength) : undefined,
      min: field.min !== undefined ? parseFloat(field.min) : undefined,
      max: field.max !== undefined ? parseFloat(field.max) : undefined,
      pattern: field.pattern,
      enums: this.parseEnums(field.enums?.enum),
    }));
  }

  private parseEnums(enumsData: any): EnumValue[] | undefined {
    if (!enumsData) return undefined;

    const enums = Array.isArray(enumsData) ? enumsData : [enumsData];

    return enums.map(e => ({
      name: e.name,
      value: e.value,
      label: undefined, // Will be filled from meta file
    }));
  }

  private parseRelationships(relationshipsData: any): Relationship[] {
    if (!relationshipsData) return [];

    const relationships = Array.isArray(relationshipsData)
      ? relationshipsData
      : [relationshipsData];

    return relationships.map(rel => ({
      name: rel.name || rel.relationshipName,
      relationshipType: rel.relationshipType,
      relatedEntityName: rel.relatedEntityName,
      joinColumnName: rel.joinColumnName,
      joinTableName: rel.joinTableName,
      required: rel.required === true || rel.required === 'true',
      unique: rel.unique === true || rel.unique === 'true',
      fetch: rel.fetch,
      mappedBy: rel.mappedBy,
      coreUser: rel.coreUser === true || rel.coreUser === 'true',
      document: rel.document === true || rel.document === 'true',
    }));
  }
}
