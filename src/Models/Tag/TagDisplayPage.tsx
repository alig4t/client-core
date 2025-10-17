import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import TagService from "@/Models/Tag/TagService";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { loadingStore } from "@/stores/loadingStore";
import RowContainer from "@/components/RowContainer";
import Column from "@/components/Column";
import ServiceErrorDisplay from "@/components/ServiceErrorDisplay";
import TitleHeader from "@/components/TitleHeader";

export default function TagDisplayPage() {
  const { id } = useParams();

  const { data, isError, error, refetch } = useQuery({
    queryKey: ["tag", id],
    queryFn: () => {
      loadingStore.show();
      return TagService.getById(Number(id))
        .then((res) => res?.id)
        .finally(() => loadingStore.hide());
    },
    enabled: !!id,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retryOnMount: false, // فقط برای mount اولیه
  });

  // نمایش خطا با useEffect (نسخه v5: onError در useQuery وجود ندارد)
  const hasToastedRef = useRef(false);
  useEffect(() => {
    if (isError && !hasToastedRef.current) {
      const err: any = error;
      toast.error(err?.response?.data?.message || "خطا در دریافت برچسب", {
        description: "مشکلی در فرایند دریافت برچسب رخ داده است",
        position: "bottom-left",
      });
      hasToastedRef.current = true;
    }
  }, [isError, error]);

  if (isError) {
    return <ServiceErrorDisplay refetch={() => refetch()} />;
  }

  if (data) {
    return (
      <div className="p-6 w-full">
        <TitleHeader title="مشاهده برچسب" />
        <Card>
          <CardContent className="p-0">
            <RowContainer>
              <Column title="نام برچسب" value={data || "—"} />
            </RowContainer>
          </CardContent>
        </Card>
      </div>
    );
  }
}
