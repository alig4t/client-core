import React from "react";
import type { SubmitHandler } from "react-hook-form";
import { FormWrapper, type searchFilters } from "@/core/components/form/FormWrapper";
import { PersonModelMeta } from "./PersonModel.meta";
import FormInput from "@/core/components/form/FormInput";
import { DateInput } from "@/core/components/form/DateInput";
import Button from "@/core/components/general/button/Button";
import ButtonPanel from "@/core/components/general/button/ButtonPanel";
import { FilterOperator } from "@/core/forms/FilterOperators";
import { RowContainer } from "@/core/components/general/container/RowContainer";
import { PageWrapper } from "@/core/components/general/container/PageWrapper";
import { publicMessages, makeRangeLabel } from "@/core/forms/MessageUtils";
import z from "@/core/forms/zod.config";
import Validator from "@/core/forms/validation";
import OptionUtils from "@/core/forms/OptionUtils";

const searchSchema = z.object({
  // BaseModel fields
  [`createdAt_${FilterOperator.GE}`]: Validator.optional(),
  [`createdAt_${FilterOperator.LE}`]: Validator.optional(),
  [`updatedAt_${FilterOperator.GE}`]: Validator.optional(),
  [`updatedAt_${FilterOperator.LE}`]: Validator.optional(),
});

type SearchFormData = z.infer<typeof searchSchema>;

interface PersonSearchProps {
  onApplyFilters: (filters: searchFilters) => void;
}

const PersonSearch: React.FC<PersonSearchProps> = ({ onApplyFilters }) => {
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
          {/* BaseModel fields: createdAt and updatedAt */}
          <DateInput
            name={`createdAt_${FilterOperator.GE}`}
            label={makeRangeLabel(PersonModelMeta.fields.createdAt.label, "from")}
          />
          <DateInput
            name={`createdAt_${FilterOperator.LE}`}
            label={makeRangeLabel(PersonModelMeta.fields.createdAt.label, "to")}
          />
          <DateInput
            name={`updatedAt_${FilterOperator.GE}`}
            label={makeRangeLabel(PersonModelMeta.fields.updatedAt.label, "from")}
          />
          <DateInput
            name={`updatedAt_${FilterOperator.LE}`}
            label={makeRangeLabel(PersonModelMeta.fields.updatedAt.label, "to")}
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

export default PersonSearch;
