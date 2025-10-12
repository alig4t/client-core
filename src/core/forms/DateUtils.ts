
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";


export const GEORGIAN_TO_JALALI = (geoDate : string) => {

    const serverDateISO = geoDate;

    const jsDate = new Date(serverDateISO); 

    const shamsiDateObj = new DateObject(jsDate).convert(persian);

    const formattedShamsi = shamsiDateObj.format("YYYY/MM/DD");

    return formattedShamsi
}

export const JALALI_TO_GEORGIAN = (jalDate : string) => {


const dateObj = new DateObject(jalDate).convert(gregorian);

const jsDate = dateObj.toDate(); 

const isoString = jsDate.toISOString(); 

const finalFormat = isoString.replace('Z', '+00:00');

return finalFormat;
}
