import { Timebar } from "./timebar.js";
import { Schedule } from "./schedule/schedule.js";
import { createWeeklyEntry } from "./schedule/helpers.js";
import { addDays, justDay } from "./schedule/dateutil.js";
import { createRange } from "./schedule/range.js";
import { makeDays } from "./scene.js";
import { correctMonthFormat, switchViews } from "./scene.js";

let schedule = new Schedule();

let sample = createWeeklyEntry("cook", "#ffabcd", addDays(justDay(Date.now()), -1), [ true, true, true, true, true, true, true ], createRange(0, 1800000));
schedule.registerEntry(sample);
let sample3 = createWeeklyEntry("elizabeth", "#a032f7", addDays(justDay(Date.now()), -1), [ true, true, true, true, true, true, true ], createRange(9000000, 27000000));
schedule.registerEntry(sample3);
let sample4 = createWeeklyEntry("[", "#ff0000", addDays(justDay(Date.now()), -1), [ true, true, true, true, true, true, true ], createRange(11000000, 36000000));
schedule.registerEntry(sample4);

let timebar = new Timebar(document.querySelector("#time-bar"), document.querySelector("#time-bar-container"), schedule);
timebar.setDay(schedule.getDay(Date.now()));

makeDays();
correctMonthFormat();

document.querySelector("#arrow-icon").addEventListener("click", switchViews);

document.querySelector("#edit-button")
        .addEventListener("click", () => {
            let element = document.querySelector("#edit-menu");
            if(element.classList.contains("invisible")) {
                element.classList.remove("invisible");
            } else {
                element.classList.add("invisible");
            }
        });

// when writing to the calendar with genMonth(), display a max of 3 events
// during week display, write approximately 5 events