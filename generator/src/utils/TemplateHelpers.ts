// Handlebars template helpers

export function registerHelpers(handlebars: any) {
  // Convert snake_case or camelCase to PascalCase
  handlebars.registerHelper('pascalCase', (str: string) => {
    return str
      .replace(/[-_](.)/g, (_, char) => char.toUpperCase())
      .replace(/^(.)/, (char: string) => char.toUpperCase());
  });

  // Convert PascalCase to camelCase
  handlebars.registerHelper('camelCase', (str: string) => {
    return str.charAt(0).toLowerCase() + str.slice(1);
  });

  // Convert to kebab-case
  handlebars.registerHelper('kebabCase', (str: string) => {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/\s+/g, '-')
      .toLowerCase();
  });

  // Convert to SNAKE_CASE (for permissions)
  handlebars.registerHelper('snakeCase', (str: string) => {
    return str
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .toUpperCase();
  });

  // lowercase helper
  handlebars.registerHelper('lowercase', (str: string) => {
    return str.toLowerCase();
  });

  // Check if field type is relationship
  handlebars.registerHelper('isRelationship', (type: string) => {
    return ['ONE_TO_ONE', 'ONE_TO_MANY', 'MANY_TO_ONE', 'MANY_TO_MANY'].includes(type);
  });

  // Check if field is enum
  handlebars.registerHelper('isEnum', (field: any) => {
    return field.type === 'ENUM' && field.enums && field.enums.length > 0;
  });

  // Check if relationship is to-many
  handlebars.registerHelper('isToMany', (relType: string) => {
    return relType === 'ONE_TO_MANY' || relType === 'MANY_TO_MANY';
  });

  // Check if relationship is to-one
  handlebars.registerHelper('isToOne', (relType: string) => {
    return relType === 'ONE_TO_ONE' || relType === 'MANY_TO_ONE';
  });

  // Get TypeScript type for field
  handlebars.registerHelper('getTsType', (fieldType: string, isArray: boolean) => {
    const typeMap: Record<string, string> = {
      STRING: 'string',
      INTEGER: 'number',
      LONG: 'number',
      DOUBLE: 'number',
      BIG_DECIMAL: 'string',
      BOOLEAN: 'boolean',
      DATE: 'string',
      LOCAL_DATE: 'string',
      LOCAL_DATE_TIME: 'string',
      ENUM: 'string',
    };
    const baseType = typeMap[fieldType] || 'any';
    return isArray ? `${baseType}[]` : baseType;
  });

  // Check equality
  handlebars.registerHelper('eq', (a: any, b: any) => {
    return a === b;
  });

  // Check inequality
  handlebars.registerHelper('ne', (a: any, b: any) => {
    return a !== b;
  });

  // Logical AND
  handlebars.registerHelper('and', (...args: any[]) => {
    args.pop(); // Remove Handlebars options object
    return args.every(Boolean);
  });

  // Logical OR
  handlebars.registerHelper('or', (...args: any[]) => {
    args.pop(); // Remove Handlebars options object
    return args.some(Boolean);
  });

  // JSON stringify
  handlebars.registerHelper('json', (obj: any) => {
    return JSON.stringify(obj, null, 2);
  });
}
