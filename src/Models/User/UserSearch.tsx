
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
import Validator from "@/core/forms/validation";
import { RowContainer } from "@/core/components/general/container/RowContainer";
import { PageWrapper } from "@/core/components/general/container/PageWrapper";
import { publicMessages, makeRangeLabel } from "@/core/forms/MessageUtils";
import { UserModelMeta } from "./UserModel.meta";
import { FormAutoComplete } from "@/core/components/form/FormAutoComplete";
import RoleService from "../Role/RoleService";

// --- Filter output interface ---

interface UserSearchProps {
  onApplyFilters: (filters: searchFilters) => void;
}

// --- Schema: All fields are optional ---
const searchSchema = z.object({
  // String
  [`name_${FilterOperator.LIKE}`]: Validator.optional(),
  [`username_${FilterOperator.LIKE}`]: Validator.optional(),

  [`createdAt_${FilterOperator.GE}`]: Validator.optional(),
  [`createdAt_${FilterOperator.LE}`]: Validator.optional(),

  [`updatedAt_${FilterOperator.GE}`]: Validator.optional(),
  [`updatedAt_${FilterOperator.LE}`]: Validator.optional(),

});

type SearchFormData = z.infer<typeof searchSchema>;

const UserSearch: React.FC<UserSearchProps> = ({
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
            name={`name_${FilterOperator.LIKE}`}
            label={UserModelMeta.fields.name?.label}
            placeholder="جستجو..."
          />

          <FormInput
            name={`username_${FilterOperator.LIKE}`}
            label={UserModelMeta.fields.username?.label}
            placeholder="جستجو..."
          />

          {/* <FormAutoComplete
            name={`roles_${FilterOperator.EQ}`}
            label={UserModelMeta.fields.roles?.label}
            service={RoleService}
            labelKey="name"
            valueKey="id"
          /> */}

          {/* Numeric: integerField */}


          <DateInput
            name={`createdAt_${FilterOperator.GE}`}
            label={makeRangeLabel(UserModelMeta.fields.createdAt.label, "from")}
          />
          <DateInput
            name={`createdAt_${FilterOperator.LE}`}
            label={makeRangeLabel(UserModelMeta.fields.createdAt.label, "to")}
          />


          <DateInput
            name={`updatedAt_${FilterOperator.GE}`}
            label={makeRangeLabel(UserModelMeta.fields.updatedAt.label, "from")}
          />
          <DateInput
            name={`updatedAt_${FilterOperator.LE}`}
            label={makeRangeLabel(UserModelMeta.fields.updatedAt.label, "to")}
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

export default UserSearch;
