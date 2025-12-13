#!/usr/bin/env node

import { Command } from 'commander';
import { resolve, join, basename } from 'path';
import { readdirSync, existsSync } from 'fs';
import chalk from 'chalk';
import { glob } from 'glob';
import { loadConfig } from './config.js';
import { XmlEntityParser } from './parsers/XmlParser.js';
import { MetaParser } from './parsers/MetaParser.js';
import { EntityMerger } from './utils/EntityMerger.js';
import { FrontendGenerator } from './generators/FrontendGenerator.js';

const program = new Command();

program
  .name('frontend-generator')
  .description('Generate frontend CRUD components from XML entity definitions')
  .version('1.0.0');

program
  .command('generate')
  .description('Generate frontend code for a specific entity')
  .argument('<entity>', 'Entity name (e.g., Channel)')
  .option('-c, --config <path>', 'Path to config.json', './config.json')
  .action(async (entityName: string, options) => {
    try {
      console.log(chalk.blue.bold('\n🚀 RNT Frontend Generator\n'));

      const config = loadConfig(options.config);
      const xmlPath = findXmlFile(entityName, config.paths.entityDefinitions);

      if (!xmlPath) {
        console.error(chalk.red(`❌ XML file not found for entity: ${entityName}`));
        process.exit(1);
      }

      await generateEntity(xmlPath, config);

      console.log(chalk.green.bold('\n✨ Generation complete!\n'));
    } catch (error) {
      console.error(chalk.red('\n❌ Error:'), error);
      process.exit(1);
    }
  });

program
  .command('generate:all')
  .description('Generate frontend code for all entities')
  .option('-c, --config <path>', 'Path to config.json', './config.json')
  .action(async (options) => {
    try {
      console.log(chalk.blue.bold('\n🚀 RNT Frontend Generator - Batch Mode\n'));

      const config = loadConfig(options.config);
      const xmlFiles = await glob('*.xml', {
        cwd: resolve(process.cwd(), config.paths.entityDefinitions),
        absolute: true,
      });

      if (xmlFiles.length === 0) {
        console.error(chalk.red('❌ No XML files found'));
        process.exit(1);
      }

      console.log(chalk.blue(`Found ${xmlFiles.length} entities to generate\n`));

      let successCount = 0;
      let failedCount = 0;

      for (const xmlPath of xmlFiles) {
        try {
          await generateEntity(xmlPath, config);
          successCount++;
        } catch (error) {
          failedCount++;
          console.error(chalk.red(`❌ Failed to generate ${basename(xmlPath)}:`), error);
        }
      }

      console.log(chalk.green.bold(`\n✨ Batch generation complete!`));
      console.log(chalk.green(`   ✓ ${successCount} successful`));
      if (failedCount > 0) {
        console.log(chalk.red(`   ✗ ${failedCount} failed`));
      }
      console.log();
    } catch (error) {
      console.error(chalk.red('\n❌ Error:'), error);
      process.exit(1);
    }
  });

async function generateEntity(xmlPath: string, config: any): Promise<void> {
  const xmlParser = new XmlEntityParser();
  const metaParser = new MetaParser();
  const merger = new EntityMerger(config);
  const generator = new FrontendGenerator(config);

  // Parse XML
  const entity = xmlParser.parseFile(xmlPath);

  if (!entity.generate) {
    console.log(chalk.gray(`⏭️  Skipping ${entity.name} (generate=false)`));
    return;
  }

  // Parse Meta (optional)
  const metaPath = xmlPath.replace('.xml', '.meta.yaml');
  const meta = metaParser.parseFile(metaPath);

  if (!meta) {
    console.warn(chalk.yellow(`⚠️  No meta file found for ${entity.name}, using defaults`));
  }

  // Merge
  const enhancedEntity = merger.merge(entity, meta);

  // Generate
  await generator.generate(enhancedEntity);
}

function findXmlFile(entityName: string, definitionsPath: string): string | null {
  const baseDir = resolve(process.cwd(), definitionsPath);

  // Try exact match
  const exactPath = join(baseDir, `${entityName}.xml`);
  if (existsSync(exactPath)) {
    return exactPath;
  }

  // Try case-insensitive search
  const files = readdirSync(baseDir);
  const match = files.find(
    f => f.toLowerCase() === `${entityName.toLowerCase()}.xml`
  );

  return match ? join(baseDir, match) : null;
}

program.parse();
