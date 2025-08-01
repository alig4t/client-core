import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import TagService from "@/Models/Tag/TagService";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { loadingStore } from "@/stores/loadingStore";
import RowContainer from "@/components/RowContainer";
import Column from "@/components/Column";
import TitleHeader from "@/components/TitleHeader";
import ServiceErrorDisplay from "@/components/ServiceErrorDisplay";

export default function TagDisplayPage() {
  const { id } = useParams();

  const { data, isError, error, refetch, isFetched } = useQuery({
    queryKey: ["tag", id],
    queryFn: () => {
      loadingStore.show();
      return TagService.getById(Number(id))
        .then((res) => res.data.data)
        .finally(() => loadingStore.hide());
    },
    enabled: !!id,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retryOnMount: false, // فقط برای mount اولیه

    // مهم: برای جلوگیری از toast تکراری
    onError: (error) => {
      if (!isFetched) {
        toast.error(error?.response?.data?.message || "خطا در دریافت برچسب", {
          description: "مشکلی در فرایند دریافت برچسب رخ داده است",
          position: "bottom-left",
        });
      }
    },
  });

  if (isError) {
    toast.error("خطا در دریافت برچسب");
    return <ServiceErrorDisplay refetch={() => refetch()} />;
  }

  if (data) {
    return (
      <div className="p-6 w-full">
        <TitleHeader title="مشاهده برچسب" />
        <Card>
          <CardContent className="p-0">
            <RowContainer>
              <Column title="نام برچسب" value={data?.name || "—"} />
            </RowContainer>
          </CardContent>
        </Card>
      </div>
    );
  }
}
