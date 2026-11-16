// src/pages/permission/PermissionSearch.tsx

import { FormWrapper,type searchFilters } from "@/core/components/form/FormWrapper";
import React from "react";
import type { SubmitHandler } from "react-hook-form";
import { PermissionModelMeta } from "./PermissionModel.meta";

// import { FormSelect } from "@/components/form/FormSelect";
import { z } from "zod/v3";

import FormInput from "@/core/components/form/FormInput";
import { FilterOperator } from "@/core/forms/FilterOperators";
import Validator from "@/core/forms/validation";

import { DateInput } from "@/core/components/form/DateInput";
import Button from "@/core/components/general/button/Button";
import ButtonPanel from "@/core/components/general/button/ButtonPanel";
import { PageWrapper } from "@/core/components/general/container/PageWrapper";
import { RowContainer } from "@/core/components/general/container/RowContainer";


interface PermissionSearchProps {
  onApplyFilters: (filters: searchFilters) => void;
}

const searchSchema = z.object({
  [`showName_${FilterOperator.LIKE}`]: Validator.optional(),
  [`name_${FilterOperator.LIKE}`]: Validator.optional(),
  [`createdAt_${FilterOperator.GE}`]: Validator.optional(),
  [`createdAt_${FilterOperator.LE}`]: Validator.optional(),
  [`updatedAt_${FilterOperator.GE}`]: Validator.optional(),
  [`updatedAt_${FilterOperator.LE}`]: Validator.optional(),
});

type SearchFormData = z.infer<typeof searchSchema>;


const PermissionSearch: React.FC<PermissionSearchProps> = ({
  onApplyFilters,
}) => {
  const onSubmit: SubmitHandler<SearchFormData> = (data) => {
    console.log(data);
    onApplyFilters(data);
  };

  const handleClear = () => {
    onApplyFilters({});
  };

  return (
    <PageWrapper>
      <FormWrapper onSubmit={onSubmit} schema={searchSchema}>
        <RowContainer>
          <FormInput
            name={`showName_${FilterOperator.LIKE}`}
            label={PermissionModelMeta.fields.showName.label}
            placeholder="جستجو..."
            type="text"
          />
          <FormInput
            name={`name_${FilterOperator.LIKE}`}
            label={PermissionModelMeta.fields.name.label}
            placeholder="جستجو..."
            type="text"
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
    </PageWrapper>
  );
};

export default PermissionSearch;
