import Handlebars from 'handlebars';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join, resolve, dirname } from 'path';
import prettier from 'prettier';
import chalk from 'chalk';
import type { EnhancedEntity, GeneratorConfig, Field, Relationship } from '../types/EntityTypes.js';
import { registerHelpers } from '../utils/TemplateHelpers.js';

export class FrontendGenerator {
  private handlebars: typeof Handlebars;
  private templates: Map<string, HandlebarsTemplateDelegate> = new Map();

  constructor(private config: GeneratorConfig) {
    this.handlebars = Handlebars.create();
    registerHelpers(this.handlebars);
    this.loadTemplates();
  }

  private loadTemplates() {
    for (const [name, path] of Object.entries(this.config.templates)) {
      const fullPath = resolve(process.cwd(), path);
      const templateContent = readFileSync(fullPath, 'utf-8');
      this.templates.set(name, this.handlebars.compile(templateContent));
    }
  }

  async generate(entity: EnhancedEntity): Promise<void> {
    console.log(chalk.blue(`\n📦 Generating ${entity.name}...`));

    const outputDir = this.getOutputDir(entity.name);
    this.ensureDir(outputDir);

    const context = this.prepareContext(entity);

    await this.generateFile('Model', `${entity.name}Model.ts`, outputDir, context);
    await this.generateFile('ModelMeta', `${entity.name}Model.meta.ts`, outputDir, context);
    await this.generateFile('Service', `${entity.name}Service.ts`, outputDir, context);
    await this.generateFile('Page', `${entity.name}Page.tsx`, outputDir, context);
    await this.generateFile('Table', `${entity.name}Table.tsx`, outputDir, context);
    await this.generateFile('TableColumns', `${entity.name}TableColumns.tsx`, outputDir, context);
    await this.generateFile('Create', `${entity.name}Create.tsx`, outputDir, context);
    await this.generateFile('Display', `${entity.name}Display.tsx`, outputDir, context);
    await this.generateFile('Search', `${entity.name}Search.tsx`, outputDir, context);

    // Generate routing files
    if (entity.meta.routing) {
      await this.generateFile('ModuleRoutes', `${entity.name}.routes.tsx`, outputDir, context);
      await this.generateFile('ModuleViewNames', `${entity.name}.viewnames.ts`, outputDir, context);
    }

    // Generate enum files if needed
    for (const field of entity.fields) {
      if (field.enums && field.enums.length > 0) {
        await this.generateEnumFile(entity.name, field, outputDir);
      }
    }

    console.log(chalk.green(`✅ Generated ${entity.name} successfully!`));
  }

  private prepareContext(entity: EnhancedEntity): any {
    const displayFields = this.getDisplayFields(entity);
    const searchableFields = entity.fields.filter(f => f.searchable);

    const hasDateFields = entity.fields.some(f =>
      ['DATE', 'LOCAL_DATE', 'LOCAL_DATE_TIME'].includes(f.type)
    );
    const hasEnumFields = entity.fields.some(f => f.enums && f.enums.length > 0);
    const hasSelectFields = hasEnumFields;
    const hasAutocompleteFields = entity.relationships.some(r =>
      ['ONE_TO_ONE', 'MANY_TO_ONE'].includes(r.relationshipType)
    );
    const hasBooleanFields = entity.fields.some(f => f.type === 'BOOLEAN');
    const hasFileFields = entity.relationships.some(r => r.document);
    const hasEnums = hasEnumFields;

    const imports = this.generateImports(entity);
    const relationshipServices = this.generateRelationshipServices(entity);
    const hasCoreUserRelationship = entity.relationships.some(r => r.coreUser);

    return {
      entityName: entity.name,
      tableName: entity.tableName,
      fields: entity.fields.map(f => ({
        ...f,
        meta: entity.meta.fields[f.name],
        validatorType: this.getValidatorType(f),
        isDate: ['DATE', 'LOCAL_DATE', 'LOCAL_DATE_TIME'].includes(f.type),
        isBoolean: f.type === 'BOOLEAN',
        isEnum: !!f.enums,
      })),
      relationships: entity.relationships.map(r => ({
        ...r,
        meta: entity.meta.relationships?.[r.name] || {},
        coreEntity: this.config.coreEntities[r.relatedEntityName],
      })),
      meta: entity.meta,
      displayFields: displayFields.map(df => ({
        ...df,
        isDate: df.field ? ['DATE', 'LOCAL_DATE', 'LOCAL_DATE_TIME'].includes(df.field.type) : false,
        isBoolean: df.field ? df.field.type === 'BOOLEAN' : false,
        isEnum: df.field ? !!df.field.enums : false,
        isRelationship: !!df.relationship,
        displayField: df.relationship ? entity.meta.relationships?.[df.relationship.name]?.displayField || 'id' : undefined,
      })),
      searchableFields,
      hasDateFields,
      hasEnumFields,
      hasSelectFields,
      hasAutocompleteFields,
      hasBooleanFields,
      hasFileFields,
      hasEnums,
      hasSearchableSelects: searchableFields.some(f => f.type === 'ENUM'),
      hasSearchableDates: searchableFields.some(f => ['DATE', 'LOCAL_DATE', 'LOCAL_DATE_TIME'].includes(f.type)),
      imports,
      relationshipServices,
      hasCoreUserRelationship,
    };
  }

  private getDisplayFields(entity: EnhancedEntity): any[] {
    const fields: any[] = [];

    // Add sortable fields first
    for (const field of entity.fields) {
      const meta = entity.meta.fields[field.name];
      if (meta?.sortable) {
        fields.push({ name: field.name, field });
      }
    }

    // Add relationships that are sortable
    for (const rel of entity.relationships) {
      const meta = entity.meta.relationships?.[rel.name];
      if (meta?.sortable && ['ONE_TO_ONE', 'MANY_TO_ONE'].includes(rel.relationshipType)) {
        fields.push({ name: rel.name, relationship: rel });
      }
    }

    return fields;
  }

  private getValidatorType(field: Field): string {
    const typeMap: Record<string, string> = {
      STRING: 'text',
      INTEGER: 'integer',
      LONG: 'long',
      DOUBLE: 'double',
      BIG_DECIMAL: 'bigDecimal',
      BOOLEAN: 'boolean',
      DATE: 'date',
      LOCAL_DATE: 'date',
      LOCAL_DATE_TIME: 'dateTime',
      ENUM: 'select',
    };
    return typeMap[field.type] || 'text';
  }

  private generateImports(entity: EnhancedEntity): any[] {
    const imports: any[] = [];
    const seen = new Set<string>();

    for (const rel of entity.relationships) {
      if (seen.has(rel.relatedEntityName)) continue;
      seen.add(rel.relatedEntityName);

      const coreInfo = this.config.coreEntities[rel.relatedEntityName];
      if (coreInfo) {
        imports.push({
          typeName: rel.relatedEntityName,
          importPath: coreInfo.importPath,
          isCore: true,
        });
      } else {
        imports.push({
          typeName: `${rel.relatedEntityName}Model`,
          entityName: rel.relatedEntityName,
          isCore: false,
        });
      }
    }

    return imports;
  }

  private generateRelationshipServices(entity: EnhancedEntity): any[] {
    const services: any[] = [];
    const seen = new Set<string>();

    for (const rel of entity.relationships) {
      if (seen.has(rel.relatedEntityName)) continue;
      seen.add(rel.relatedEntityName);

      const coreInfo = this.config.coreEntities[rel.relatedEntityName];
      // Skip if marked as skipImport
      if (coreInfo?.skipImport) continue;

      services.push({
        serviceName: `${rel.relatedEntityName}Service`,
        entityName: rel.relatedEntityName,
        isCore: !!coreInfo,
      });
    }

    return services;
  }

  private async generateFile(
    templateName: string,
    fileName: string,
    outputDir: string,
    context: any
  ): Promise<void> {
    const template = this.templates.get(templateName);
    if (!template) {
      console.warn(chalk.yellow(`⚠️  Template ${templateName} not found`));
      return;
    }

    const filePath = join(outputDir, fileName);

    // Check if file exists and overwrite is disabled
    if (existsSync(filePath) && !this.config.generation.overwriteExisting) {
      console.log(chalk.yellow(`⏭️  Skipping ${fileName} (already exists)`));
      return;
    }

    let content = template(context);

    // Format with Prettier if enabled
    if (this.config.generation.formatWithPrettier) {
      try {
        content = await prettier.format(content, {
          parser: fileName.endsWith('.tsx') || fileName.endsWith('.jsx') ? 'typescript' : 'typescript',
          semi: true,
          singleQuote: false,
          trailingComma: 'es5',
          printWidth: 90,
        });
      } catch (error) {
        console.warn(chalk.yellow(`⚠️  Prettier formatting failed for ${fileName}`));
      }
    }

    writeFileSync(filePath, content, 'utf-8');
    console.log(chalk.gray(`  ✓ ${fileName}`));
  }

  private async generateEnumFile(
    entityName: string,
    field: Field,
    outputDir: string
  ): Promise<void> {
    const enumName = `${entityName}${field.name.charAt(0).toUpperCase() + field.name.slice(1)}Enum`;
    const fileName = `${enumName}.ts`;
    const filePath = join(outputDir, fileName);

    const enumValues = field.enums!.map(e => `  ${e.name} = "${e.name}",`).join('\n');
    const labelEntries = field.enums!.map(e => `  { value: ${enumName}.${e.name}, label: "${e.label || e.value}" },`).join('\n');

    const content = `export enum ${enumName} {
${enumValues}
}

export const ${enumName}Labels = [
${labelEntries}
];
`;

    let formatted = content;
    if (this.config.generation.formatWithPrettier) {
      try {
        formatted = await prettier.format(content, { parser: 'typescript' });
      } catch {}
    }

    writeFileSync(filePath, formatted, 'utf-8');
    console.log(chalk.gray(`  ✓ ${fileName}`));
  }

  private getOutputDir(entityName: string): string {
    return resolve(process.cwd(), this.config.paths.outputBase, entityName);
  }

  private ensureDir(dir: string): void {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }
}
