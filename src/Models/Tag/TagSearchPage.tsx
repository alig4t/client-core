import React, { useState } from 'react';
import { Filter, FileText } from 'lucide-react';
import Accordion from '@/components/general/Accordion';
import TagsTable from './TagsTable';
import DynamicFilterForm, { type DynamicFilters } from '@/core/FilterForm/DynamicFilterForm';
import { tagFiltersConfig } from './TagFiltersConfig';

// ایمپورت کامپوننت‌های پایه

// کامپوننت آکاردئون فیلتر
// const FilterAccordion: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {

//   const [fromDate, setFromDate] = useState<Value>(null);
//   const [toDate, setToDate] = useState<Value>(null);

//   const insuranceTypes = [{ value: 'all', label: 'همه' }];

//   if (!isOpen) return null;

//   return (
//     <div dir="rtl" className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <div>
//           <label className="block mb-2 text-sm font-medium text-gray-700">نام بیمه گزار</label>
//           <Input placeholder="جستجو بر اساس نام بیمه گزار" />
//         </div>
//         <div>
//           <label className="block mb-2 text-sm font-medium text-gray-700">از تاریخ</label>
//           {/* 3. پاس دادن استیت‌ها به کامپوننت جدید */}
//           <CustomDatePicker value={fromDate} onChange={setFromDate} placeholder="۱۴۰۴/۰۷/۱۵" />
//         </div>
//         <div>
//           <label className="block mb-2 text-sm font-medium text-gray-700">تا تاریخ</label>
//           <CustomDatePicker value={toDate} onChange={setToDate} placeholder="۱۴۰۴/۰۷/۱۵" />
//         </div>
//         <div>
//           <label className="block mb-2 text-sm font-medium text-gray-700">نوع بیمه</label>
//           <Select options={insuranceTypes} value={""} onChange={() => { }} />
//         </div>
//       </div>
//       <div className="flex items-center gap-4 mt-6">
//         <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
//           اعمال فیلتر
//         </button>
//         <button className="bg-red-100 text-red-600 px-6 py-2 rounded-lg hover:bg-red-200 transition-colors">
//           حذف فیلتر
//         </button>
//       </div>
//     </div>
//   );
// };

// کامپوننت اصلی صفحه
const InstallmentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('ready');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(true);
  const [activeFilters, setActiveFilters] = useState<DynamicFilters>({});

  type Tab = {
    id: string;
    label: string;
  };

  const tabs: Tab[] = [
    { id: 'ready', label: 'اقساط آماده پرداخت' },
    { id: 'future', label: 'اقساط آتی' },
    { id: 'paid', label: 'اقساط پرداخت شده' },
  ];

  return (
    <div dir="rtl" className="p-8 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">قسط های من</h1>
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center gap-2 px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
        >
          <Filter size={18} />
          <span>فیلتر</span>
        </button>
      </div>

      <div className="flex items-center border-b border-gray-200 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 font-semibold transition-colors ${activeTab === tab.id
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-gray-500 hover:text-gray-800'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* <FilterAccordion isOpen={isFilterOpen} /> */}
      <Accordion title="فیلتر‌ها" startOpen={false}>
        {/* <FilterAccordion isOpen={true}/> */}
        <DynamicFilterForm
          fields={tagFiltersConfig}
          onApplyFilters={setActiveFilters}
        />
      </Accordion>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-semibold text-gray-800">قسطهای آماده پرداخت تا به امروز</h2>
          <div className="bg-purple-100 text-purple-800 font-bold px-4 py-2 rounded-lg text-sm">
            مجموع مبالغ آماده پرداخت: ۰ تومان
          </div>
        </div>

        <div className="text-center py-16">
          <div className="inline-block p-4 bg-gray-100 rounded-full">
            <FileText size={40} className="text-gray-400" />
          </div>
          <p className="mt-4 text-gray-500">اقساطی جهت نمایش وجود ندارد</p>
        </div>
      </div>
      <TagsTable filters={activeFilters} />
    </div>
  );
};

export default InstallmentsPage;








// import { useEffect, useState } from "react";
// import TagService from "@/Models/Tag/TagFakeService";
// import { Link } from "react-router-dom";
// import type { TagModel } from "./TagModel";
// import { PlusCircle, Search, Filter, Delete } from "lucide-react";

// // Import shadcn UI components
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHeader,
//   TableHead,
//   TableRow,
// } from "@/components/ui/table";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem
// } from "@/components/ui/accordion";
// import ProfileSectionWrapper from "@/components/Layout/ProfileSectionWrapper";

// // Import the new styled table wrapper

// // This declaration is necessary if the datepicker library adds itself to the window object
// declare global {
//   interface Window {
//     jalaliDatepicker: any;
//   }
// }

// export default function TagSearchPage() {
//   const [search, setSearch] = useState("");
//   const [tags, setTags] = useState<TagModel[]>([]);

//   const [openFilter, setOpenFilter] = useState<string>(""); // "" یعنی بسته، "filter-panel" یعنی باز

//   // Initialize datepicker
//   useEffect(() => {
//     if (window.jalaliDatepicker) {
//       window.jalaliDatepicker.startWatch({
//         minDate: "attr",
//         maxDate: "attr",
//         time: true,
//       });
//     }
//   }, []);

//   // Fetch and filter tags
//   const fetchTags = async () => {
//     const res = await TagService.getAll();
//     const filtered = res.data.data.filter((t: TagModel) =>
//       t.name.toLowerCase().includes(search.toLowerCase())
//     );
//     setTags(filtered);
//   };

//   useEffect(() => {
//     fetchTags();
//   }, [search]);

//   // 2. تابع برای باز و بسته کردن پنل فیلتر
//   const toggleFilterPanel = () => {
//     setOpenFilter(openFilter === "" ? "filter-panel" : "");
//   };

//   // useEffect(() => {
//   //   // فقط زمانی اسکریپت را اجرا کن که پنل فیلتر باز باشد
//   //   if (openFilter === "filter-panel" && window.jalaliDatepicker) {
//   //     window.jalaliDatepicker.startWatch({
//   //       minDate: "attr",
//   //       maxDate: "attr",
//   //       time: true,
//   //     });
//   //   }
//   // }, [openFilter]);

//   return (
//     <>
//       <ProfileSectionWrapper
//         title="لیست تگ‌ها"
//         className="!rounded-[25px] "
//         newLink={
//           <div className="flex gap-2">
//             <Button
//               variant="outline"
//               className="border-purple-700 hover:!border-purple-800 text-purple-700 hover:text-purple-800"
//               onClick={toggleFilterPanel}
//             >
//               <Filter className="ml-2 h-4 w-4" />
//               فیلتر
//             </Button>
//             <Link to="/portal/tags/create">
//               <Button className="!text-[13px]">
//                 <PlusCircle className="ml-2 h-4 w-4" />
//                 افزودن تگ جدید
//               </Button>
//             </Link>
//           </div>
//         }
//       >
//         <Accordion
//           type="single"
//           collapsible
//           className="w-full"
//           value={openFilter}
//           onValueChange={setOpenFilter}
//         >
//           <AccordionItem value="filter-panel" className="border-none">
//             <AccordionContent className="bg-gray-100 border-1 border-gray-50  mt-1 rounded-md p-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 <div className="flex flex-col gap-2">
//                   <p className="text-[var(--foreground)]">عنوان برچسب</p>
//                   <Input
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     placeholder="جستجوی نام برچسب..."
//                   />
//                 </div>
//                 <div className="flex flex-col gap-2">
//                   <p className="text-[var(--foreground)]">تاریخ</p>
//                   <Input type="text" data-jdp placeholder="انتخاب تاریخ" />
//                 </div>
//               </div>
//               <div className="flex justify-end gap-2 mt-4">
//                 <Button
//                   size={"sm"}
//                   variant={"outline"}
//                   className="border !text-[12px] border-red-500 hover:!border-red-600 text-red-500 hover:!text-red-600"
//                 >
//                   <Delete className="ml-2 h-4 w-4" />
//                   حذف فیلتر
//                 </Button>
//                 <Button
//                   size={"sm"}
//                   className="bg-green-600  !text-[12px] hover:bg-green-700"
//                 >
//                   <Search className="ml-2 h-4 w-4" />
//                   اعمال فیلتر
//                 </Button>
//               </div>
//             </AccordionContent>
//           </AccordionItem>
//         </Accordion>
//         <Table className=" shadow-md text-[var(--foreground-2)] mt-7">
//           <TableHeader>
//             <TableRow className="border-b-4 border-[var(--border)] hover:bg-transparent">
//               <TableHead className="w-[100px] border-b-2 font-bold border-[var(--border)] text-center">
//                 #
//               </TableHead>
//               <TableHead className="border-b-2 font-bold border-[var(--border)] text-center">
//                 نام
//               </TableHead>
//               <TableHead className="border-b-2 font-bold border-[var(--border)] text-center">
//                 عملیات
//               </TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {tags.length > 0 ? (
//               tags.map((tag, index) => (
//                 <TableRow key={tag.id} className="border-b last:border-b-0">
//                   <TableCell className="font-medium text-center">
//                     {index + 1}
//                   </TableCell>
//                   <TableCell className="text-center">{tag.name}</TableCell>
//                   <TableCell className="text-center">
//                     <div className="flex gap-2 justify-center">
//                       <Button
//                         asChild
//                         variant="outline"
//                         size="sm"
//                         className="border-[var(--border)]"
//                       >
//                         <Link to={`/portal/tags/${tag.id}/edit`}>ویرایش</Link>
//                       </Button>
//                       <Button asChild variant="ghost" size="sm">
//                         <Link to={`/portal/tags/${tag.id}`}>مشاهده</Link>
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={3} className="h-24 text-center">
//                   هیچ نتیجه‌ای یافت نشد.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </ProfileSectionWrapper>
//     </>
//   );
// }
