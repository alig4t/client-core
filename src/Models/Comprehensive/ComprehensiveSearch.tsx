
import React from "react";
import type { SubmitHandler } from "react-hook-form";
import {
  FormWrapper,
  type searchFilters,
} from "@/core/components/form/FormWrapper";
import { DateInput } from "@/core/components/form/DateInput";
import ButtonPanel from "@/core/components/general/button/ButtonPanel";
import Button from "@/core/components/general/button/Button";
import FormInput from "@/core/components/form/FormInput";
import { z } from "zod";
import { FilterOperator } from "@/core/forms/FilterOperators";
import { comprehensiveModelMeta } from "./ComprehensiveModel.meta";
import Validator from "@/core/forms/validation";
import { Checkbox } from "@/core/components/form/Checkbox";
import { FormSelect } from "@/core/components/form/FormSelect";
import OptionUtils from "@/core/forms/OptionUtils";
import { RowContainer } from "@/core/components/general/container/RowContainer";
import { PageWrapper } from "@/core/components/general/container/PageWrapper";
import { publicMessages, makeRangeLabel } from "@/core/forms/MessageUtils";

// --- Filter output interface ---

interface ComprehensiveSearchProps {
  onApplyFilters: (filters: searchFilters) => void;
}

// --- Schema: All fields are optional ---
const searchSchema = z.object({
  // String
  [`stringField_${FilterOperator.LIKE}`]: Validator.optional(),

  // Numeric: each has two min/max fields
  [`integerField_${FilterOperator.GE}`]: Validator.optional(),
  [`integerField_${FilterOperator.LE}`]: Validator.optional(),
  [`longField_${FilterOperator.GE}`]: Validator.optional(),
  [`longField_${FilterOperator.LE}`]: Validator.optional(),
  [`doubleField_${FilterOperator.GE}`]: Validator.optional(),
  [`doubleField_${FilterOperator.LE}`]: Validator.optional(),

  [`bigDecimalField_${FilterOperator.GE}`]: Validator.optional(),
  [`bigDecimalField_${FilterOperator.LE}`]: Validator.optional(),

  [`booleanField_${FilterOperator.EQ}`]: Validator.optional(),

  // Dates (from/to)
  [`dateField_${FilterOperator.GE}`]: Validator.optional(),
  [`dateField_${FilterOperator.LE}`]: Validator.optional(),
  [`createdAt_${FilterOperator.GE}`]: Validator.optional(),
  [`createdAt_${FilterOperator.LE}`]: Validator.optional(),

   [`updatedAt_${FilterOperator.GE}`]: Validator.optional(),
  [`updatedAt_${FilterOperator.LE}`]: Validator.optional(),
  // enum (exact search)
  [`enumField_${FilterOperator.EQ}`]: Validator.optional(),
});

type SearchFormData = z.infer<typeof searchSchema>;

const ComprehensiveSearch: React.FC<ComprehensiveSearchProps> = ({
  onApplyFilters,
}) => {
  const [formMethods, setFormMethods] = React.useState<any>(null);

  const onSubmit: SubmitHandler<SearchFormData> = (data) => {
    console.log(data);
    onApplyFilters(data);
  };

  const handleClear = () => {
    if (formMethods) {
      formMethods.reset();
    }
    onApplyFilters({});
  };

  return (
    <PageWrapper>
      <FormWrapper onSubmit={onSubmit} schema={searchSchema} onFormReady={setFormMethods}>
        <RowContainer>
          {/* String */}
          <FormInput
            name={`stringField_${FilterOperator.LIKE}`}
            label={comprehensiveModelMeta.fields.stringField?.label || "رشته"}
            placeholder="جستجو..."
          />

          {/* Numeric: integerField */}
          <FormInput
            name={`integerField_${FilterOperator.GE}`}
            label={makeRangeLabel(
              comprehensiveModelMeta.fields.integerField?.label,
              "from"
            )}
            type="number"
            placeholder="مثلاً 10"
          />

          <FormInput
            name={`integerField_${FilterOperator.LE}`}
            label={makeRangeLabel(
              comprehensiveModelMeta.fields.integerField?.label,
              "to"
            )}
            type="number"
            placeholder="مثلاً 100"
          />

          {/* Numeric: longField */}
          <FormInput
            name={`longField_${FilterOperator.GE}`}
            label={makeRangeLabel(
              comprehensiveModelMeta.fields.longField?.label,
              "from"
            )}
            type="long"
            placeholder={publicMessages.form.range.from}
          />
          <FormInput
            name={`longField_${FilterOperator.LE}`}
            label={makeRangeLabel(
              comprehensiveModelMeta.fields.longField?.label,
              "to"
            )}
            type="long"
            placeholder={publicMessages.form.range.to}
          />

          {/* Numeric: doubleField */}
          <FormInput
            name={`doubleField_${FilterOperator.GE}`}
            label={makeRangeLabel(
              comprehensiveModelMeta.fields.doubleField?.label,
              "from"
            )}
            type="double"
            placeholder={publicMessages.form.range.from}
          />
          <FormInput
            name={`doubleField_${FilterOperator.LE}`}
            label={makeRangeLabel(
              comprehensiveModelMeta.fields.doubleField?.label,
              "to"
            )}
            type="double"
            placeholder={publicMessages.form.range.to}
          />

          {/* Numeric: bigDecimalField */}
          <FormInput
            name={`bigDecimalField_${FilterOperator.GE}`}
            label={makeRangeLabel(
              comprehensiveModelMeta.fields.bigDecimalField?.label,
              "from"
            )}
            type="bigDecimal"
            placeholder={publicMessages.form.range.from}
          />
          <FormInput
            name={`bigDecimalField_${FilterOperator.LE}`}
            label={makeRangeLabel(
              comprehensiveModelMeta.fields.bigDecimalField?.label,
              "to"
            )}
            type="bigDecimal"
            placeholder={publicMessages.form.range.to}
          />
          <FormSelect
            name={`booleanField_${FilterOperator.EQ}`}
            label={comprehensiveModelMeta.fields.booleanField?.label}
            placeholder="انتخاب کنید"
            options={OptionUtils.YES_OR_NO_OPTIONS}
          />

          {/* Dates */}
          <DateInput
            name={`dateField_${FilterOperator.GE}`}
            label={makeRangeLabel(comprehensiveModelMeta.fields.dateField?.label, "from")}
          />
          <DateInput
            name={`dateField_${FilterOperator.LE}`}
            label={makeRangeLabel(comprehensiveModelMeta.fields.dateField?.label, "to")}
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
            label={makeRangeLabel("تاریخ ایجاد", "from")}
          />
          <DateInput
            name={`createdAt_${FilterOperator.LE}`}
            label={makeRangeLabel("تاریخ ایجاد", "to")}
          />
        </RowContainer>

        <ButtonPanel align="start" className="mt-4">
          <Button variant="success" type="submit">
            {publicMessages.form.filters.apply}
          </Button>
          <Button variant="secondary" type="button" onClick={handleClear}>
            {publicMessages.form.filters.reset}
          </Button>
        </ButtonPanel>
      </FormWrapper>
    </PageWrapper>
  );
};

export default ComprehensiveSearch;
