// pages/tags/TagSearchPage.tsx
import { useEffect, useState } from "react";
import TagService from "@/Models/Tag/TagFakeService";
import { Link } from "react-router-dom";
import type { TagModel } from "./TagModel";
import {
  Table,
  TableBody,
  TableCell,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { DatePicker } from "zaman";

import "@majidh1/jalalidatepicker/dist/jalalidatepicker.min.css";
import "@majidh1/jalalidatepicker";
import RowContainer from "@/components/RowContainer";
import ButtonPanel from "@/components/ButtonPanel";
import { PlusCircle, Search } from "lucide-react"; // آیکون‌های زیبا

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import ProfileSectionWrapper from "@/components/Layout/ProfileSectionWrapper";

declare global {
  interface Window {
    jalaliDatepicker: any;
  }
}

export default function TagSearchPage() {
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState<TagModel[]>([]);

  useEffect(() => {
    window.jalaliDatepicker.startWatch({
      minDate: "attr",
      maxDate: "attr",
      time: true,
    });
  }, []);

  const fetchTags = async () => {
    const res = await TagService.getAll();
    const filtered = res.data.data.filter((t) =>
      t.name.toLowerCase().includes(search.toLowerCase())
    );
    setTags(filtered);
  };

  useEffect(() => {
    fetchTags();
  }, [search]);

  return (
    <ProfileSectionWrapper title="مدیریت تگ ها" newLink={<Button>
      <PlusCircle className="ml-2 h-4 w-4" />
      افزودن تگ جدید
    </Button>}>
      <div className="space-y-6">
        {/* بخش ۱: هدر صفحه */}
        <div className="flex items-center justify-between">
          {/* <h1 className="text-2xl font-bold">مدیریت تگ‌ها</h1> */}
          <Link to="/portal/tags/create">
            
          </Link>
        </div>

        {/* بخش ۲: پنل فیلتر در یک Card زیبا */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="focus-visible:ring-gray-800 bg-green-100">
              <span className="text-base font-medium">فیلترها</span>
            </AccordionTrigger>
            <AccordionContent className=" mt-1 rounded-2xl p-3">
              {/* محتوای فیلترها در اینجا قرار می‌گیرد */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="جستجوی نام برچسب..."
                />
                <Input
                  type="text"
                  data-jdp // برای DatePicker شما
                  placeholder="انتخاب تاریخ"
                />
              </div>
              <div className="flex justify-end mt-4">
                <Button variant="secondary" className="bg-green-100">
                  <Search className="ml-2 h-4 w-4" />
                  اعمال فیلتر
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* بخش ۳: جدول داده در یک Card دیگر */}
        <Card>
          <CardContent className="p-0">
            {" "}
            {/* حذف padding برای چسبیدن جدول به لبه‌ها */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">شناسه</TableHead>
                  <TableHead>نام</TableHead>
                  <TableHead className="text-right">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tags.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell className="font-medium">{tag.id}</TableCell>
                    <TableCell>{tag.name}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2">
                        {/* استفاده از دکمه‌های کوچک و زیبا برای عملیات */}
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/portal/tags/${tag.id}/edit`}>ویرایش</Link>
                        </Button>
                        <Button asChild variant="ghost" size="sm">
                          <Link to={`/portal/tags/${tag.id}`}>مشاهده</Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ProfileSectionWrapper>
  );
}
