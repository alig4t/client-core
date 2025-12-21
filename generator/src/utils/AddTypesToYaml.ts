import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { XMLParser } from 'fast-xml-parser';
import * as yaml from 'js-yaml';

// Type mapping from XML field types to FormFieldType
const TYPE_MAPPING: Record<string, string> = {
  STRING: 'text',
  INTEGER: 'number',
  LONG: 'number',
  DOUBLE: 'number',
  BIG_DECIMAL: 'text', // Use text for precision
  BOOLEAN: 'boolean',
  DATE: 'date',
  LOCAL_DATE: 'date',
  LOCAL_DATE_TIME: 'datetime-local',
  ENUM: 'select',
};

interface Field {
  name: string;
  type: string;
  enums?: any[];
}

interface Relationship {
  name: string;
  relationshipType: string;
}

export function addTypesToYamlFiles(entityDefsPath: string) {
  const xmlFiles = readdirSync(entityDefsPath).filter(f => f.endsWith('.xml'));

  for (const xmlFile of xmlFiles) {
    const entityName = xmlFile.replace('.xml', '');
    const xmlPath = join(entityDefsPath, xmlFile);
    const yamlPath = join(entityDefsPath, `${entityName}.meta.yaml`);

    // Skip if YAML file doesn't exist
    if (!existsSync(yamlPath)) {
      console.log(`⏭️  Skipping ${entityName} - no YAML file found`);
      continue;
    }

    try {
      // Read and parse XML
      const xmlContent = readFileSync(xmlPath, 'utf-8');
      const parser = new XMLParser({
        ignoreAttributes: false,
        parseTagValue: true,
      });
      const xmlData = parser.parse(xmlContent);

      // Read and parse YAML
      const yamlContent = readFileSync(yamlPath, 'utf-8');
      const yamlData = yaml.load(yamlContent) as any;

      if (!yamlData.fields) {
        console.log(`⏭️  Skipping ${entityName} - no fields section in YAML`);
        continue;
      }

      // Get fields from XML
      const xmlEntity = xmlData.entity;
      const xmlFields = xmlEntity.fields?.field || [];
      const fieldsArray = Array.isArray(xmlFields) ? xmlFields : [xmlFields];

      let updated = false;

      // Update each field with type from XML
      for (const xmlField of fieldsArray) {
        if (!xmlField || !xmlField.name) continue;

        const fieldName = xmlField.name;
        const xmlType = xmlField.type;

        if (yamlData.fields[fieldName]) {
          const formType = TYPE_MAPPING[xmlType] || 'text';

          // Only add if not already present
          if (!yamlData.fields[fieldName].type) {
            yamlData.fields[fieldName].type = formType;
            updated = true;
            console.log(`  ✓ Added type "${formType}" to ${entityName}.${fieldName}`);
          }
        }
      }

      // Update relationship types
      if (yamlData.relationships) {
        const xmlRelationships = xmlEntity.relationships?.relationship || [];
        const relsArray = Array.isArray(xmlRelationships) ? xmlRelationships : [xmlRelationships];

        for (const xmlRel of relsArray) {
          if (!xmlRel || !xmlRel.name) continue;

          const relName = xmlRel.name;
          const relType = xmlRel.relationshipType;

          if (yamlData.relationships[relName]) {
            // Only add if not already present
            if (!yamlData.relationships[relName].type) {
              // const isToMany = relType === 'ONE_TO_MANY' || relType === 'MANY_TO_MANY';
              const formType = 'autocomplete';

              yamlData.relationships[relName].type = formType;
              updated = true;
              console.log(`  ✓ Added type "${formType}" to ${entityName}.${relName}`);
            }
          }
        }
      }

      // Write back to YAML if updated
      if (updated) {
        const newYamlContent = yaml.dump(yamlData, {
          lineWidth: -1,
          noRefs: true,
        });
        writeFileSync(yamlPath, newYamlContent, 'utf-8');
        console.log(`✅ Updated ${entityName}.meta.yaml`);
      } else {
        console.log(`⏭️  No updates needed for ${entityName}.meta.yaml`);
      }

    } catch (error) {
      console.error(`❌ Error processing ${entityName}:`, error);
    }
  }
}

// Run if called directly
const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'));
if (isMain || process.argv[1]?.includes('AddTypesToYaml')) {
  const entityDefsPath = process.argv[2] || join(process.cwd(), 'entity-definitions');
  console.log(`\n📝 Adding types to YAML files in: ${entityDefsPath}\n`);
  addTypesToYamlFiles(entityDefsPath);
  console.log('\n✅ Done!\n');
}
