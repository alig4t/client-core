// scripts/generateZodSchema.ts

import { comprehensiveModelMeta } from "@/Models/Comprehensive/ComprehensiveModel.meta";


export function generateZodSchemaCode(meta: typeof comprehensiveModelMeta): string {
  const lines: string[] = [];

  for (const [key, fieldMeta] of Object.entries(meta.fields)) {
    if (!fieldMeta?.required) continue;

    const label = fieldMeta.label || key;

    // All required fields except boolean as string + nonempty
    // (Because forms send strings)
    if (fieldMeta.type === "boolean") {
      // If boolean is required (less common)
      lines.push(`  ${key}: z.boolean(), // ${label}`);
    } else {
      lines.push(`  ${key}: z.string().nonempty("${label} را وارد نمایید"),`);
    }
  }

  return `const comprehensiveSchema = z.object({
${lines.join("\n")}
});`;
}

console.log(generateZodSchemaCode(comprehensiveModelMeta));