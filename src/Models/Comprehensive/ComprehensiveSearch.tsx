// src/pages/permission/ComprehensiveSearch.tsx
import React from "react";
import type { SubmitHandler } from "react-hook-form";
import {
  FormWrapper,
  type searchFilters,
} from "@/core/components/form/FormWrapper";
import { DateInput } from "@/core/components/form/DateInput";
import ButtonPanel from "@/components/Button/ButtonPanel";
import Button from "@/components/Button/Button";
import FormInput from "@/core/components/form/FormInput";
import { z } from "zod";
import { FilterOperator } from "@/core/forms/FilterOperators";
import { comprehensiveModelMeta } from "./ComprehensiveModel.meta";
import Validator from "@/core/forms/validation";
import { Checkbox } from "@/core/components/form/Checkbox";
import { FormSelect } from "@/core/components/form/FormSelect";
import OptionUtils from "@/core/forms/OptionUtils";
import RowContainer from "@/components/RowContainer";

// --- Filter output interface ---

interface ComprehensiveSearchProps {
  onApplyFilters: (filters: searchFilters) => void;
}

// --- Schema: همه فیلدها اختیاری هستند ---
const searchSchema = z.object({
  // رشته‌ای
  [`stringField_${FilterOperator.LIKE}`]: Validator.optional(),

  // عددی: هر کدام دو فیلد min/max دارند
  [`integerField_${FilterOperator.GE}`]: Validator.optional(),
  [`integerField_${FilterOperator.LE}`]: Validator.optional(),
  [`longField_${FilterOperator.GE}`]: Validator.optional(),
  [`longField_${FilterOperator.LE}`]: Validator.optional(),
  [`doubleField_${FilterOperator.GE}`]: Validator.optional(),
  [`doubleField_${FilterOperator.LE}`]: Validator.optional(),

  [`bigDecimalField_${FilterOperator.GE}`]: Validator.optional(),
  [`bigDecimalField_${FilterOperator.LE}`]: Validator.optional(),

  [`booleanField_${FilterOperator.EQ}`]: Validator.optional(),

  // تاریخ‌ها (از/تا)
  [`dateField_${FilterOperator.GE}`]: Validator.optional(),
  [`dateField_${FilterOperator.LE}`]: Validator.optional(),
  [`createdAt_${FilterOperator.GE}`]: Validator.optional(),
  [`createdAt_${FilterOperator.LE}`]: Validator.optional(),

  // enum (جستجوی دقیق)
  [`enumField_${FilterOperator.EQ}`]: Validator.optional(),
});

type SearchFormData = z.infer<typeof searchSchema>;

const ComprehensiveSearch: React.FC<ComprehensiveSearchProps> = ({
  onApplyFilters,
}) => {
  const onSubmit: SubmitHandler<SearchFormData> = (data) => {
    console.log(data);
    // const filters: ComprehensiveFilters = {};
    onApplyFilters(data);
  };

  const handleClear = () => {
    onApplyFilters({});
  };

  // کمکی برای ساخت label برای min/max
  const makeRangeLabel = (baseLabel: string, suffix: "min" | "max") => {
    return suffix === "min" ? `${baseLabel} از` : `${baseLabel} تا`;
  };

  return (
    <FormWrapper onSubmit={onSubmit} schema={searchSchema}>
      <RowContainer>
        {/* رشته */}
        <FormInput
          name={`stringField_${FilterOperator.LIKE}`}
          label={comprehensiveModelMeta.fields.stringField?.label || "رشته"}
          placeholder="جستجو..."
        />

        {/* عددی: integerField */}
        <FormInput
          name={`integerField_${FilterOperator.GE}`}
          label={makeRangeLabel(
            comprehensiveModelMeta.fields.integerField?.label,
            "min"
          )}
          type="text"
          placeholder="مثلاً 10"
        />

        <FormInput
          name={`integerField_${FilterOperator.LE}`}
          label={makeRangeLabel(
            comprehensiveModelMeta.fields.integerField?.label,
            "max"
          )}
          type="text"
          placeholder="مثلاً 100"
        />

        {/* عددی: longField */}
        <FormInput
          name={`longField_${FilterOperator.GE}`}
          label={makeRangeLabel(
            comprehensiveModelMeta.fields.longField?.label,
            "min"
          )}
          type="text"
          placeholder="از"
        />
        <FormInput
          name={`longField_${FilterOperator.LE}`}
          label={makeRangeLabel(
            comprehensiveModelMeta.fields.longField?.label,
            "max"
          )}
          type="text"
          placeholder="تا"
        />

        {/* عددی: doubleField */}
        <FormInput
          name={`doubleField_${FilterOperator.GE}`}
          label={makeRangeLabel(
            comprehensiveModelMeta.fields.doubleField?.label,
            "min"
          )}
          type="text"
          placeholder="از"
        />
        <FormInput
          name={`doubleField_${FilterOperator.LE}`}
          label={makeRangeLabel(
            comprehensiveModelMeta.fields.doubleField?.label,
            "max"
          )}
          type="text"
          placeholder="تا"
        />

        {/* عددی: bigDecimalField */}
        <FormInput
          name={`bigDecimalField_${FilterOperator.GE}`}
          label={makeRangeLabel(
            comprehensiveModelMeta.fields.bigDecimalField?.label,
            "min"
          )}
          type="text"
          placeholder="از"
        />
        <FormInput
          name={`bigDecimalField_${FilterOperator.LE}`}
          label={makeRangeLabel(
            comprehensiveModelMeta.fields.bigDecimalField?.label,
            "max"
          )}
          type="text"
          placeholder="تا"
        />

        <Checkbox
          name={`booleanField_${FilterOperator.EQ}`}
          label={comprehensiveModelMeta.fields.booleanField?.label}
        />

        {/* تاریخ‌ها */}
        <DateInput
          name={`dateField_${FilterOperator.GE}`}
          label={`${comprehensiveModelMeta.fields.dateField?.label} از`}
        />
        <DateInput
          name={`dateField_${FilterOperator.LE}`}
          label={`${comprehensiveModelMeta.fields.dateField?.label} تا`}
        />

        {/* enum */}
        <FormSelect
          name={`enumField_${FilterOperator.EQ}`}
          label={comprehensiveModelMeta.fields.enumField?.label}
          placeholder="انتخاب کنید"
          options={OptionUtils.YES_OR_NO_OPTIONS}
        />

        <DateInput
          name={`createdAt_${FilterOperator.GE}`}
          label={`تاریخ ایجاد از`}
        />
        <DateInput
          name={`createdAt_${FilterOperator.LE}`}
          label={`تاریخ ایجاد تا`}
        />
      </RowContainer>

      <ButtonPanel align="start" className="mt-4">
        <Button variant="success" type="submit">
          اعمال فیلتر
        </Button>
        <Button variant="secondary" type="button" onClick={handleClear}>
          حذف فیلتر
        </Button>
      </ButtonPanel>
    </FormWrapper>
  );
};

export default ComprehensiveSearch;
