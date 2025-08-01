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
    <div className="p-6">
      <div className="flex justify-between items-center mb-4 rounded-lg p-3">
        <h4 className="text-lg font-bold">مدیریت تگ ها</h4>
        {/* <input
          className="input input-bordered"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجوی نام برچسب"
        /> */}
        <Link
          to="/portal/tags/create"
          className="btn btn-primary text-xs font-bold bg-[#c5226c] !text-white px-3 py-1.5 rounded-full"
        >
          افزودن جدید
        </Link>
      </div>

      <div className=" border-dashed border-2 p-4 border-gray-300 rounded-md my-4">
        <RowContainer>
          <Input
            // className="col-span-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی نام برچسب"
          />
          {/* <div className="date-picker-box"> */}
          <Input
            type="text"
            data-jdp
            placeholder="لطفا یک تاریخ وارد نمایید"
            data-jdp-only-date
          />
        </RowContainer>

        {/* </div> */}

        <ButtonPanel className="mt-4">
          <button
            type="button"
            className="btn btn-primary text-xs font-bold !bg-gray-200 text-gray-600 px-3 py-1.5 rounded-full"
          >
            اعمال فیلتر
          </button>
        </ButtonPanel>
      </div>

      <Table className="rounded-corners bg-white">
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">شناسه</TableHead>
            <TableHead>نام</TableHead>
            <TableHead>جزئیات</TableHead>
            {/* <TableHead className="text-right">Amount</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tags.map((tag) => (
            <TableRow key={tag.id}>
              <TableCell className="font-medium">{tag.id}</TableCell>
              <TableCell>{tag.name}</TableCell>
              <TableCell className="flex gap-2">
                <Link to={`/tags/${tag.id}/edit`} className="link">
                  ویرایش
                </Link>
                <span className="text-gray-400">|</span>
                <Link to={`/tags/${tag.id}`} className="link">
                  مشاهده
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
