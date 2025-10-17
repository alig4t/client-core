// src/pages/PermissionCreate.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import permissionService from "@/Models/Permission/PermissionService";
import Spinner from "@/components/general/Spinner";
// import { FormWrapper } from "@/components/shared/FormWrapper";
import { PermissionModelMeta } from "./PermissionModel.meta";
import { FormWrapper } from "@/components/form/FormWrapper";
import { FormInput } from "@/components/form/FormInput";

// --- Schema and Type for validation ---
const permissionSchema = z.object({
  showName: z.string().nonempty("نام نمایشی را وارد نمایید"),
  name: z.string().nonempty("نام سیستمی را وارد نمایید"),
});
type PermissionFormData = z.infer<typeof permissionSchema>;

// // --- Form Fields Component ---
// function PermissionFormFields() {
//   const {
//     register,
//     formState: { errors },
//   } = useFormContext<PermissionFormData>();

//   return (
//     <>
//       <div className="w-full">
//         <label
//           htmlFor="showName"
//           className="block text-sm font-medium text-gray-700 text-right mb-1"
//         >
//           {permissionModelMeta.fields.showName?.label}
//         </label>
//         <input
//           id="showName"
//           type="text"
//           placeholder="مثلا مدیریت کاربران"
//           {...register("showName")}
//           className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-right focus:outline-none focus:ring-2 focus:ring-purple-500"
//         />
//         {errors.showName && <ErrorFormText msg={errors.showName.message} />}
//       </div>

//       <div className="w-full">
//         <label
//           htmlFor="name"
//           className="block text-sm font-medium text-gray-700 text-right mb-1"
//         >
//           {permissionModelMeta.fields.name?.label}
//         </label>
//         <input
//           id="name"
//           type="text"
//           placeholder="مثلا manage-users"
//           {...register("name")}
//           className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-right focus:outline-none focus:ring-2 focus:ring-purple-500"
//         />
//         {errors.name && <ErrorFormText msg={errors.name.message} />}
//       </div>
//     </>
//   );
// }

// --- Main Component for Create Permission Page ---
const PermissionCreate: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newPermission: PermissionFormData) => {
      return permissionService.create(newPermission);
    },
    onSuccess: (data) => {
      toast.success("ایجاد دسترسی موفقیت‌آمیز بود", {
        description: "دسترسی جدید با موفقیت ایجاد شد.",
        position: "bottom-left",
      });
      queryClient.invalidateQueries({ queryKey: ["permission"] });
      // You can navigate to the permissions list page here
      // navigate('/permissions');
    },
    onError: (error: any) => {
      toast.error("خطا در ایجاد دسترسی", {
        description: error?.message || "مشکلی در اتصال به سرور رخ داده است.",
        position: "bottom-left",
      });
    },
  });

  const onSubmit = (data: PermissionFormData) => {
    console.log(data);
    // mutation.mutate(data);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div dir="rtl" className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">ایجاد دسترسی جدید</h1>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-md max-w-2xl mx-auto">
        <FormWrapper
          schema={permissionSchema}
          onSubmit={onSubmit}
          className="space-y-6"
        >
          <FormInput
            name="showName"
            label={PermissionModelMeta.fields.showName?.label || "نام نمایشی"}
            placeholder="مثلاً مدیریت کاربران"
          />
          <FormInput
            name="name"
            label={PermissionModelMeta.fields.name?.label || "نام سیستمی"}
            placeholder="مثلاً manage-users"
          />
          {/* <PermissionFormFields /> */}

          <div className="flex items-center justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              لغو
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className={`inline-flex items-center px-4 py-3 font-semibold text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:bg-purple-300 transition-colors duration-300`}
            >
              {mutation.isPending ? (
                <>
                  <Spinner className="w-4 h-4 ml-2" />
                  در حال ذخیره...
                </>
              ) : (
                "ذخیره"
              )}
            </button>
          </div>
        </FormWrapper>
      </div>
    </div>
  );
};

export default PermissionCreate;
