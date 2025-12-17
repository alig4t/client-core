import React from "react";
import type { SubmitHandler } from "react-hook-form";
import { FormWrapper, type searchFilters } from "@/core/components/form/FormWrapper";
import { FormSelect } from "@/core/components/form/FormSelect";
import ButtonPanel from "@/core/components/general/button/ButtonPanel";
import Button from "@/core/components/general/button/Button";
import { z } from "zod";
import { FilterOperator } from "@/core/forms/FilterOperators";
import { channelModelMeta } from "./ChannelModel.meta";

import OptionUtils from "@/core/forms/OptionUtils";
import Validator from "@/core/forms/validation";
import { RowContainer } from "@/core/components/general/container/RowContainer";
import { PageWrapper } from "@/core/components/general/container/PageWrapper";
import { publicMessages } from "@/core/forms/MessageUtils";
import FormInput from "@/core/components/form/FormInput";
import { ChannelStatusOptionLabels } from "./ChannelEnumField";

interface ChannelSearchProps {
  onApplyFilters: (filters: searchFilters) => void;
}

const searchSchema = z.object({
  [`channelName_${FilterOperator.LIKE}`]: Validator.optional(),
  [`channelIdentifier_${FilterOperator.LIKE}`]: Validator.optional(),
  [`status_${FilterOperator.EQ}`]: Validator.optional(),
});

type SearchFormData = z.infer<typeof searchSchema>;

const ChannelSearch: React.FC<ChannelSearchProps> = ({ onApplyFilters }) => {
  const [formMethods, setFormMethods] = React.useState<any>(null);

  const onSubmit: SubmitHandler<SearchFormData> = (data) => onApplyFilters(data);
  const handleClear = () => {
    if (formMethods) formMethods.reset();
    onApplyFilters({});
  };

  return (
    <PageWrapper>
      <FormWrapper schema={searchSchema} onSubmit={onSubmit} onFormReady={setFormMethods}>
        <RowContainer>
          <FormInput
            name={`channelName_${FilterOperator.LIKE}`}
            label={channelModelMeta.fields.channelName.label}
            placeholder={channelModelMeta.fields.channelName.placeholder}
          />
          <FormInput
            name={`channelIdentifier_${FilterOperator.LIKE}`}
            label={channelModelMeta.fields.channelIdentifier.label}
            placeholder={channelModelMeta.fields.channelIdentifier.placeholder}
          />
          <FormSelect
            name={`status_${FilterOperator.EQ}`}
            label={channelModelMeta.fields.status.label}
            placeholder="انتخاب وضعیت"
            options={OptionUtils.getOptions(ChannelStatusOptionLabels, ChannelStatusOptionLabels)}
          />
        </RowContainer>
        <ButtonPanel align="start" className="mt-4">
          <Button variant="success" type="submit">{publicMessages.form.filters.apply}</Button>
          <Button variant="secondary" type="button" onClick={handleClear}>{publicMessages.form.filters.reset}</Button>
        </ButtonPanel>
      </FormWrapper>
    </PageWrapper>
  );
};

export default ChannelSearch;