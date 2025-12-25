
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";

type DateType = string | undefined;

export const GEORGIAN_TO_JALALI = (geoDate: DateType) => {
    if (!geoDate) return "";
    const serverDateISO = geoDate;

    const jsDate = new Date(serverDateISO);

    const shamsiDateObj = new DateObject(jsDate).convert(persian);

    const formattedShamsi = shamsiDateObj.format("YYYY/MM/DD");

    return formattedShamsi
}

export const GEORGIAN_TO_JALALI_WITH_TIME = (geoDate: DateType) => {
    if (!geoDate) return "";
    const jsDate = new Date(geoDate);
    const shamsiDateObj = new DateObject(jsDate).convert(persian);
    return shamsiDateObj.format("HH:mm:ss - YYYY/MM/DD");
}

export const JALALI_TO_GEORGIAN = (jalDate: DateType) => {

    if (!jalDate) return "";
    const dateObj = new DateObject(jalDate).convert(gregorian);

    const jsDate = dateObj.toDate();

    const isoString = jsDate.toISOString();

    const finalFormat = isoString.replace('Z', '+00:00');

    return finalFormat;
}

const DateUtil = {
    GEORGIAN_TO_JALALI,
    JALALI_TO_GEORGIAN,
    GEORGIAN_TO_JALALI_WITH_TIME
}

export default DateUtil;