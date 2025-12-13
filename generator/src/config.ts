import { readFileSync } from 'fs';
import { resolve } from 'path';
import type { GeneratorConfig } from './types/EntityTypes.js';

let configCache: GeneratorConfig | null = null;

export function loadConfig(configPath?: string): GeneratorConfig {
  if (configCache) {
    return configCache;
  }

  const path = configPath || resolve(process.cwd(), 'config.json');
  const content = readFileSync(path, 'utf-8');
  configCache = JSON.parse(content) as GeneratorConfig;

  return configCache;
}

export function isCoreEntity(entityName: string, config: GeneratorConfig): boolean {
  return !!config.coreEntities[entityName];
}

export function getCoreEntityInfo(entityName: string, config: GeneratorConfig) {
  return config.coreEntities[entityName];
}

export function resolvePathFromGenerator(relativePath: string, config: GeneratorConfig): string {
  return resolve(process.cwd(), relativePath);
}
