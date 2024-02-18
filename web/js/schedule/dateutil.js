import { createRange } from "./range.js";

// clear the hours, minutes, seconds, and milliseconds of a timestamp
export function justDay(time) {
    let date = new Date(time);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return +date;
}

// add a number of days to a date
export function addDays(date, n) {
    let start = new Date(date);
    let end = new Date(date);
    end.setDate(start.getDate() + n);
    return +end;
}

// create a range containing n entire days, starting at 0:00 on day
export function rangeOfNDays(date, n) {
    let day = justDay(date);
    return createRange(day, addDays(day, n));
}

// convert to the time of day
export function timeStr(time) {
    let date = new Date(time);
    let hour = date.getHours().toString();
    let minute = date.getMinutes().toString();
    if(minute.length == 1) {
        minute = "0" + minute;
    }
    return hour + ":" + minute;
}