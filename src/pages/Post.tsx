import NoContent from "@/components/noContent";
import { Plug } from "lucide-react";

const Post = () => {
  return (
    <NoContent
      icon={Plug}
      title="هیچ اکانتی متصل نشده است"
      description="برای دسترسی به همه امکانات و قابلیت‌های نوین، باید حداقل یک اکانت شبکه اجتماعی وصل کنید"
      buttonText="افزودن اکانت جدید"
      onButtonClick={() => {
        console.log("اکانت جدید اضافه شود یا لینک باز شود");
      }}
    />
  );
};

export default Post;
