
import type { BaseModel } from "../../core/models/BaseModel";
import type { ChannelModel } from "../Channel/ChannelModel";
import type { UserModel } from "../User/UserModel";


// If you have enum, you can define it like this:
export type EnumFieldOption = {
    OPTION_A: "OPTION_A",
    OPTION_B: "OPTION_B",
    // Other options...
};

// export type EnumFieldOption = "OPTION_A" | "OPTION_B";

export interface ComprehensiveModel extends BaseModel {
    stringField: string;
    integerField: number;
    longField: number; // In TS all numbers are number, but you can specify with comment
    doubleField: number;
    bigDecimalField: number; // Or if you want more precision, you can use string (for exact Decimal)
    booleanField: boolean;
    dateField: string; // ISO 8601
    localDateField: string; // yyyy-MM-dd
    localDateTimeField: string; // ISO without offset
    enumField: EnumFieldOption;
    uniqueField: string;
    indexedField: string;
    oneToOneUser: UserModel;
    manyToOneChannel: ChannelModel;
}