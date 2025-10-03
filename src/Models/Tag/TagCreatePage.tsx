// pages/tags/CreateTagPage.tsx
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FormWrapper } from "@/components/shared/FormWrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "@/components/SubmitButton";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import TagService from "@/Models/Tag/TagService";
import { loadingStore } from "@/stores/loadingStore";
import RowContainer from "@/components/RowContainer";
import ButtonPanel from "@/components/ButtonPanel";
import StyledTableWrapper from "@/components/Layout/StyledTableWrapper";

const createTagSchema = z.object({
  name: z.string().min(2, "نام الزامی است"),
});

type CreateTagFormData = z.infer<typeof createTagSchema>;

function TagFormFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateTagFormData>();

  return (
    <div>
      <Label htmlFor="name" className="text-xs m-1">
        نام برچسب
      </Label>
      <Input
        id="name"
        {...register("name")}
        placeholder="نام برچسب را وارد نمایید"
      />
      {errors.name && (
        <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
      )}
    </div>
  );
}

export default function CreateTagPage() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data: CreateTagFormData) => {
      loadingStore.show();
      return TagService.create(data);
    },
    onSuccess: () => {
      toast.success("برچسب با موفقیت ایجاد شد");
      loadingStore.hide();
      navigate("/tags");
    },
    onError: (error: any) => {
      loadingStore.hide();
      console.log(error);
      toast(error?.response?.data?.message || "خطا در ایجاد برچسب", {
        description: "مشکلی در فرایند ایجاد برچسب رخ داده است",
        position: "bottom-left",
      });
    },
  });

  const handleSubmit = (data: CreateTagFormData) => {
    mutation.mutate(data);
  };

  // useEffect(() => {
  //   loadingStore.show();
  // }, []);

  return (
    <StyledTableWrapper title="ایجاد برچسب جدید">
      {/* <TitleHeader title="ایجاد برچسب جدید" /> */}

      <div className="bg-layout-content w-full rounded-md p-4 mt-4">
        <FormWrapper schema={createTagSchema} onSubmit={handleSubmit}>
          <RowContainer>
            <TagFormFields />
          </RowContainer>
          <ButtonPanel>
            <SubmitButton
              type="submit"
              disabled={mutation.isPending}
              className="mt-4 w-auto"
            >
              {mutation.isPending ? "در حال ذخیره..." : "ایجاد"}
            </SubmitButton>
          </ButtonPanel>
        </FormWrapper>
      </div>
    </StyledTableWrapper>
  );
}
