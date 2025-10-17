// scripts/generateZodSchema.ts

import { comprehensiveModelMeta } from "@/Models/Comprehensive/ComprehensiveModel.meta";


export function generateZodSchemaCode(meta: typeof comprehensiveModelMeta): string {
  const lines: string[] = [];

  for (const [key, fieldMeta] of Object.entries(meta.fields)) {
    if (!fieldMeta?.required) continue;

    const label = fieldMeta.label || key;

    // همه فیلدهای required غیر از boolean به صورت string + nonempty
    // (چون فرم‌ها string می‌فرستند)
    if (fieldMeta.type === "boolean") {
      // اگر boolean required باشد (کمتر رایج)
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