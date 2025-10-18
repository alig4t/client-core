"use strict";
import z, { ZodParsedType, util } from "zod";

const errorMap: z.ZodErrorMap = (issue, _ctx) => {
  let message: string;
  switch (issue.code) {
    case z.ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "اجباری است";
      } else {
        message = `مقدار ${issue.expected == "number" ? "عدد" : issue.expected == "string" ? "حرف" : "نادرست"} مورد انتظار بود، اما ${issue.received == "number" ? "عدد" : issue.received == "string" ? "حرف" : "نادرست"} دریافت شد`;
      }
      break;
    case z.ZodIssueCode.invalid_literal:
      message = `مقدار ثابت نامعتبر، مقدار ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)} انتظار می‌رود`;
      break;
    case z.ZodIssueCode.unrecognized_keys:
      message = `کلید(های) نامعتبر در شیء: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case z.ZodIssueCode.invalid_union:
      message = `ورودی نامعتبر`;
      break;
    case z.ZodIssueCode.invalid_union_discriminator:
      message = `مقدار تمییزکننده نامعتبر. مقادیر مورد انتظار: ${util.joinValues(issue.options)}`;
      break;
    case z.ZodIssueCode.invalid_enum_value:
      message = `مقدار شناسه‌ی نامعتبر. مقادیر مورد انتظار: ${util.joinValues(issue.options)}، مقدار دریافتی: '${issue.received}'`;
      break;
    case z.ZodIssueCode.invalid_arguments:
      message = `پارامترهای تابع نامعتبر است`;
      break;
    case z.ZodIssueCode.invalid_return_type:
      message = `نوع بازگشتی تابع نامعتبر است`;
      break;
    case z.ZodIssueCode.invalid_date:
      message = `تاریخ نامعتبر است`;
      break;
    case z.ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `ورودی نامعتبر: باید "${issue.validation.includes}" را شامل شود`;
          if (typeof issue.validation.position === "number") {
            message = `${message} در یک یا چند موقعیت بیشتر یا مساوی با ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `ورودی نامعتبر: باید با "${issue.validation.startsWith}" شروع شود`;
        } else if ("endsWith" in issue.validation) {
          message = `ورودی نامعتبر: باید با "${issue.validation.endsWith}" پایان یابد`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `ورودی نامعتبر: ${issue.validation}`;
      } else {
        message = "ورودی نامعتبر است";
      }
      break;
    case z.ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `آرایه باید شامل ${issue.exact ? "دقیقاً" : issue.inclusive ? `حداقل` : `بیشتر از`} ${issue.minimum} عنصر باشد`;
      else if (issue.type === "string")
        message = `رشته باید شامل ${issue.exact ? "دقیقاً" : issue.inclusive ? `حداقل` : `بیشتر از`} ${issue.minimum} کاراکتر باشد`;
      else if (issue.type === "number")
        message = `عدد باید ${
          issue.exact
            ? `دقیقاً برابر با `
            : issue.inclusive
              ? `بیشتر یا مساوی با `
              : `بیشتر از `
        }${issue.minimum} باشد`;
      else if (issue.type === "date")
        message = `تاریخ باید ${
          issue.exact
            ? `دقیقاً برابر با `
            : issue.inclusive
              ? `بیشتر یا مساوی با `
              : `بیشتر از `
        }${new Date(Number(issue.minimum))} باشد`;
      else message = "ورودی نامعتبر است";
      break;
    case z.ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `آرایه باید شامل ${issue.exact ? `دقیقاً` : issue.inclusive ? `حداکثر` : `کمتر از`} ${issue.maximum} عنصر باشد`;
      else if (issue.type === "string")
        message = `رشته باید شامل ${issue.exact ? `دقیقاً` : issue.inclusive ? `حداکثر` : `کمتر از`} ${issue.maximum} کاراکتر باشد`;
      else if (issue.type === "number")
        message = `عدد باید ${
          issue.exact
            ? `دقیقاً`
            : issue.inclusive
              ? `کمتر یا مساوی با`
              : `کمتر از`
        } ${issue.maximum} باشد`;
      else if (issue.type === "bigint")
        message = `BigInt باید ${
          issue.exact
            ? `دقیقاً`
            : issue.inclusive
              ? `کمتر یا مساوی با`
              : `کمتر از`
        } ${issue.maximum} باشد`;
      else if (issue.type === "date")
        message = `تاریخ باید ${
          issue.exact
            ? `دقیقاً`
            : issue.inclusive
              ? `کوچکتر یا مساوی با`
              : `کوچکتر از`
        } ${new Date(Number(issue.maximum))} باشد`;
      else message = "ورودی نامعتبر است";
      break;
    case z.ZodIssueCode.custom:
      message = `ورودی نامعتبر است`;
      break;
    case z.ZodIssueCode.invalid_intersection_types:
      message = `نتایج اشتراک نمی‌توانند ادغام شوند`;
      break;
    case z.ZodIssueCode.not_multiple_of:
      message = `عدد باید ضریبی از ${issue.multipleOf} باشد`;
      break;
    case z.ZodIssueCode.not_finite:
      message = "عدد باید متناهی باشد";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};

// export default errorMap;

z.setErrorMap(errorMap);

export default z;
