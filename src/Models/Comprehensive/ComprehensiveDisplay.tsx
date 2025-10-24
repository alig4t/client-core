// src/pages/ComprehensiveDisplay.tsx (Example)
import React from "react";
import { RecordDisplayLayout } from "@/components/general/RecordDisplayLayout";
import { RowContainer } from "@/components/general/RowContainer";
import { DisplayField } from "@/components/general/DisplayField";

// Mock data (replace with actual fetch logic)
const comprehensiveRecord = {
  id: "comp-123",
  stringField: "مثال از یک رشته",
  integerField: 42,
  doubleField: 12.345,
  booleanField: true,
  dateField: "1402/09/20",
  enumField: "YES",
  oneToOneUserId: 5,
  oneToOneUserName: "احمدی",
};

const ComprehensiveDisplayPage: React.FC = () => {
  // Assume you fetch the record and it's not loading (isFetching: false)

  return (
    <RecordDisplayLayout
      title={`جزئیات رکورد: ${comprehensiveRecord.id}`}
      actions={
        // Example action button
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          ویرایش
        </button>
      }
    >
      <RowContainer numberOfColumns={3}>
        <DisplayField
          label="فیلد رشته‌ای"
          value={comprehensiveRecord.stringField}
        />
        <DisplayField
          label="فیلد عددی"
          value={comprehensiveRecord.integerField}
        />
        <DisplayField
          label="فیلد ممیز شناور"
          value={comprehensiveRecord.doubleField?.toFixed(2)}
        />

        <DisplayField
          label="فیلد تاریخ"
          value={comprehensiveRecord.dateField}
        />
        <DisplayField
          label="فیلد دودویی"
          value={comprehensiveRecord.booleanField ? "بله" : "خیر"}
        />
        <DisplayField label="فیلد انوم" value={comprehensiveRecord.enumField} />

        {/* Example of linking to a related model record */}
        {/* <DisplayField
          label="کاربر مرتبط"
          value={comprehensiveRecord.oneToOneUserName}
          link={{
            view: "user-display",
            id: comprehensiveRecord.oneToOneUserId,
          }}
        /> */}

        {/* Example of a field spanning all columns */}
        <DisplayField
          label="توضیحات طولانی"
          value="این یک متن طولانی است که می‌تواند فضای بیشتری را اشغال کند و به همین دلیل از colSpan='full' برای آن استفاده شده است."
          colSpan="full"
        />
      </RowContainer>
    </RecordDisplayLayout>
  );
};

export default ComprehensiveDisplayPage;
