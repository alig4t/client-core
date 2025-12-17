import React from "react";
import type { SubmitHandler } from "react-hook-form";
import { FormWrapper, type searchFilters } from "@/core/components/form/FormWrapper";
import ButtonPanel from "@/core/components/general/button/ButtonPanel";
import Button from "@/core/components/general/button/Button";
import { z } from "zod";
import { FilterOperator } from "@/core/forms/FilterOperators";
import Validator from "@/core/forms/validation";
import { RowContainer } from "@/core/components/general/container/RowContainer";
import { PageWrapper } from "@/core/components/general/container/PageWrapper";
import { makeRangeLabel, publicMessages } from "@/core/forms/MessageUtils";
import FormInput from "@/core/components/form/FormInput";
import { DateInput } from "@/core/components/form/DateInput";
import { platformModelMeta } from "./PlatformModel.meta";

interface PlatformSearchProps {
    onApplyFilters: (filters: searchFilters) => void;
}

const searchSchema = z.object({
    [`platformName_${FilterOperator.LIKE}`]: Validator.optional(),
    [`platformKey_${FilterOperator.LIKE}`]: Validator.optional(),
    [`apiEndpoint_${FilterOperator.LIKE}`]: Validator.optional(),
    [`authMethod_${FilterOperator.LIKE}`]: Validator.optional(),
    [`createdAt_${FilterOperator.GE}`]: Validator.optional(),
    [`createdAt_${FilterOperator.LE}`]: Validator.optional(),

    [`updatedAt_${FilterOperator.GE}`]: Validator.optional(),
    [`updatedAt_${FilterOperator.LE}`]: Validator.optional(),
});

type SearchFormData = z.infer<typeof searchSchema>;

const PlatformSearch: React.FC<PlatformSearchProps> = ({ onApplyFilters }) => {
    const [formMethods, setFormMethods] = React.useState<any>(null);

    const onSubmit: SubmitHandler<SearchFormData> = (data) => {
        onApplyFilters(data);
    };

    const handleClear = () => {
        if (formMethods) formMethods.reset();
        onApplyFilters({});
    };

    return (
        <PageWrapper>
            <FormWrapper schema={searchSchema} onSubmit={onSubmit} onFormReady={setFormMethods}>
                <RowContainer>
                    <FormInput
                        name={`platformName_${FilterOperator.LIKE}`}
                        label={platformModelMeta.fields.platformName?.label} placeholder="جستجو..."
                    />
                    <FormInput
                        name={`platformKey_${FilterOperator.LIKE}`}
                        label={platformModelMeta.fields.platformKey?.label}
                        placeholder="جستجو..."
                    />
                    <FormInput
                        name={`apiEndpoint_${FilterOperator.LIKE}`}
                        label={platformModelMeta.fields.apiEndpoint?.label}
                        placeholder="جستجو..."
                    />
                    <FormInput name={`authMethod_${FilterOperator.LIKE}`}
                        label={platformModelMeta.fields.authMethod?.label}
                        placeholder="جستجو..."
                    />


                    <DateInput
                        name={`createdAt_${FilterOperator.GE}`}
                        label={makeRangeLabel(platformModelMeta.fields.createdAt.label, "from")}
                    />
                    <DateInput
                        name={`createdAt_${FilterOperator.LE}`}
                        label={makeRangeLabel(platformModelMeta.fields.createdAt.label, "to")}
                    />


                    <DateInput
                        name={`updatedAt_${FilterOperator.GE}`}
                        label={makeRangeLabel(platformModelMeta.fields.updatedAt.label, "from")}
                    />
                    <DateInput
                        name={`updatedAt_${FilterOperator.LE}`}
                        label={makeRangeLabel(platformModelMeta.fields.updatedAt.label, "to")}
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

export default PlatformSearch;