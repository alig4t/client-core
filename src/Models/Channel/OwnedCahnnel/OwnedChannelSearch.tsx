import { DateInput } from "@/core/components/form/DateInput";
import FormInput from "@/core/components/form/FormInput";
import { FormSelect } from "@/core/components/form/FormSelect";
import { FormWrapper,type searchFilters } from "@/core/components/form/FormWrapper";
import Button from "@/core/components/general/button/Button";
import ButtonPanel from "@/core/components/general/button/ButtonPanel";
import { PageWrapper } from "@/core/components/general/container/PageWrapper";
import { RowContainer } from "@/core/components/general/container/RowContainer";
import { FilterOperator } from "@/core/forms/FilterOperators";
import { makeRangeLabel,publicMessages } from "@/core/forms/MessageUtils";
import Validator from "@/core/forms/validation";
import z from "@/core/forms/zod.config";
import React from "react";
import type { SubmitHandler } from "react-hook-form";
import { OwnedChannelModelMeta } from "./OwnedChannelModel.meta";

const searchSchema = z.object({
  [`displayName_${FilterOperator.LIKE}`]: Validator.optional(),
  [`channelTitle_${FilterOperator.LIKE}`]: Validator.optional(),
  [`platformName_${FilterOperator.LIKE}`]: Validator.optional(),
  [`ownerName_${FilterOperator.LIKE}`]: Validator.optional(),
  [`status_${FilterOperator.EQ}`]: Validator.optional(),
  // BaseModel fields
  [`createdAt_${FilterOperator.GE}`]: Validator.optional(),
  [`createdAt_${FilterOperator.LE}`]: Validator.optional(),
  [`updatedAt_${FilterOperator.GE}`]: Validator.optional(),
  [`updatedAt_${FilterOperator.LE}`]: Validator.optional(),
});

type SearchFormData = z.infer<typeof searchSchema>;

interface OwnedChannelSearchProps {
  onApplyFilters: (filters: searchFilters) => void;
}

const OwnedChannelSearch: React.FC<OwnedChannelSearchProps> = ({ onApplyFilters }) => {
  const [formMethods, setFormMethods] = React.useState<{ reset: () => void } | null>(null);

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
          <FormInput
            name={`displayName_${FilterOperator.LIKE}`}
            label={OwnedChannelModelMeta.fields.displayName?.label}
            placeholder="جستجو..."
          />

          <FormInput
            name={`channelTitle_${FilterOperator.LIKE}`}
            label={OwnedChannelModelMeta.fields.channelTitle?.label}
            placeholder="جستجو..."
          />

          <FormInput
            name={`platformName_${FilterOperator.LIKE}`}
            label={OwnedChannelModelMeta.fields.platformName?.label}
            placeholder="جستجو..."
          />

          <FormInput
            name={`ownerName_${FilterOperator.LIKE}`}
            label={OwnedChannelModelMeta.fields.ownerName?.label}
            placeholder="جستجو..."
          />

          <FormSelect
            name={`status_${FilterOperator.EQ}`}
            label={OwnedChannelModelMeta.fields.status?.label}
            options={OwnedChannelModelMeta.fields.status?.options || []}
            placeholder="انتخاب کنید"
          />

          {/* BaseModel fields: createdAt and updatedAt */}
          <DateInput
            name={`createdAt_${FilterOperator.GE}`}
            label={makeRangeLabel(OwnedChannelModelMeta.fields.createdAt.label, "from")}
          />
          <DateInput
            name={`createdAt_${FilterOperator.LE}`}
            label={makeRangeLabel(OwnedChannelModelMeta.fields.createdAt.label, "to")}
          />
          <DateInput
            name={`updatedAt_${FilterOperator.GE}`}
            label={makeRangeLabel(OwnedChannelModelMeta.fields.updatedAt.label, "from")}
          />
          <DateInput
            name={`updatedAt_${FilterOperator.LE}`}
            label={makeRangeLabel(OwnedChannelModelMeta.fields.updatedAt.label, "to")}
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

export default OwnedChannelSearch;
