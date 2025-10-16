
import type { BaseModel } from "../../core/models/BaseModel";
import type { ChannelModel } from "../Channel/ChannelModel";
import type { UserModel } from "../User/UserModel";


// اگر enum داری، می‌تونی این‌طوری تعریفش کنی:
export type EnumFieldOption = {
    OPTION_A : "OPTION_A",
    OPTION_B : "OPTION_B",
    // سایر گزینه‌ها...
};

// export type EnumFieldOption = "OPTION_A" | "OPTION_B";

export interface ComprehensiveModel extends BaseModel {
    stringField: string;
    integerField: number;
    longField: number; // در TS همه عدد‌ها number هستند، ولی می‌تونی با کامنت مشخص کنی
    doubleField: number;
    bigDecimalField: number; // یا اگر دقیق‌تر می‌خوای، می‌تونی string بذاری (برای Decimal دقیق)
    booleanField: boolean;
    dateField: string; // ISO 8601
    localDateField: string; // yyyy-MM-dd
    localDateTimeField: string; // ISO بدون offset
    enumField: EnumFieldOption;
    uniqueField: string;
    indexedField: string;
    oneToOneUser: UserModel;
    manyToOneChannel: ChannelModel;
}