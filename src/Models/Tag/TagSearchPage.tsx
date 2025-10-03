import { useEffect, useState } from "react";
import TagService from "@/Models/Tag/TagFakeService";
import { Link } from "react-router-dom";
import type { TagModel } from "./TagModel";
import { PlusCircle, Search } from "lucide-react";

// Import shadcn UI components
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ProfileSectionWrapper from "@/components/Layout/ProfileSectionWrapper";
import StyledTableWrapper from "@/components/Layout/StyledTableWrapper";

// Import the new styled table wrapper

// This declaration is necessary if the datepicker library adds itself to the window object
declare global {
  interface Window {
    jalaliDatepicker: any;
  }
}

export default function TagSearchPage() {
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState<TagModel[]>([]);

  // Initialize datepicker
  useEffect(() => {
    if (window.jalaliDatepicker) {
      window.jalaliDatepicker.startWatch({
        minDate: "attr",
        maxDate: "attr",
        time: true,
      });
    }
  }, []);

  // Fetch and filter tags
  const fetchTags = async () => {
    const res = await TagService.getAll();
    const filtered = res.data.data.filter((t: TagModel) =>
      t.name.toLowerCase().includes(search.toLowerCase())
    );
    setTags(filtered);
  };

  useEffect(() => {
    fetchTags();
  }, [search]);

  return (
    <>
      <ProfileSectionWrapper
        title="مدیریت تگ ها"
        newLink={
          <Link to="/portal/tags/create">
            <Button>
              <PlusCircle className="ml-2 h-4 w-4" />
              افزودن تگ جدید
            </Button>
          </Link>
        }
      >
        <div className="space-y-6 text-[var(--foreground)]">
          {/* Accordion Filter */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="focus-visible:ring-gray-800 bg-gray-100 dark:bg-gray-800 px-4 rounded-md">
                <span className="text-base font-medium">فیلترها</span>
              </AccordionTrigger>
              <AccordionContent className="bg-gray-50 dark:bg-gray-900 mt-1 rounded-md p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="جستجوی نام برچسب..."
                  />
                  <Input
                    type="text"
                    data-jdp // For Jalali DatePicker
                    placeholder="انتخاب تاریخ"
                  />
                </div>
                <div className="flex justify-end mt-4">
                  <Button variant="secondary">
                    <Search className="ml-2 h-4 w-4" />
                    اعمال فیلتر
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Use the new StyledTableWrapper */}
        </div>
      </ProfileSectionWrapper>
      <StyledTableWrapper title="لیست تگ‌ها">
        <Table>
          <TableHeader>
            <TableRow className="border-b-4 border-[var(--border)] hover:bg-transparent">
              <TableHead className="w-[100px] border-b-2 font-bold border-[var(--border)] text-center">
                #
              </TableHead>
              <TableHead className="border-b-2 font-bold border-[var(--border)] text-center">
                نام
              </TableHead>
              <TableHead className="border-b-2 font-bold border-[var(--border)] text-center">
                عملیات
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tags.length > 0 ? (
              tags.map((tag, index) => (
                <TableRow key={tag.id} className="border-b last:border-b-0">
                  <TableCell className="font-medium text-center">
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-center">{tag.name}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex gap-2 justify-center">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="border-[var(--border)]"
                      >
                        <Link to={`/portal/tags/${tag.id}/edit`}>ویرایش</Link>
                      </Button>
                      <Button asChild variant="ghost" size="sm">
                        <Link to={`/portal/tags/${tag.id}`}>مشاهده</Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  هیچ نتیجه‌ای یافت نشد.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </StyledTableWrapper>
    </>
  );
}
