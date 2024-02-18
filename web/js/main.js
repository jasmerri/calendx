import { Timebar } from "./timebar.js";
import { Schedule } from "./schedule/schedule.js";
import { createWeeklyEntry } from "./schedule/helpers.js";
import { addDays, justDay } from "./schedule/dateutil.js";
import { createRange } from "./schedule/range.js";

let schedule = new Schedule();

let sample = createWeeklyEntry("cook", "#ffabcd", addDays(justDay(Date.now()), -1), [ true, true, true, true, true, true, true ], createRange(0, 1800000));
schedule.registerEntry(sample);

let timebar = new Timebar(document.querySelector("#time-bar"), document.querySelector("#time-bar-container"), schedule);
timebar.setDay(schedule.getDay(Date.now()));

// when writing to the calendar with genMonth(), display a max of 3 events
// during week display, write approximately 5 events

function switchViews() {
    weekview = document.getElementById("week-view");
    monthview = document.getElementById("month-view");

    if (weekview.style.display != "none") {
        weekview.style.display = "none";
        monthview.style.display = "grid";
    } else {
        weekview.style.display = "grid";
        monthview.style.display = "none";
    }
}

function generateWeek(month, day) {

}
