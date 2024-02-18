import { createRepeatData } from "./repeat.js";
import { createEntry } from "./entry.js";

export function createWeeklyEntry(name, color, start, weekdays) {
    let repeatData = createRepeatData({
        updatedTo: start,
        repeatType: "weekly",
        weekdays: weekdays
    });
    return createEntry(name, color, repeatData);
}