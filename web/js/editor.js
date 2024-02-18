import { createRange } from "./schedule/range.js";
import { justDay } from "./schedule/dateutil.js";

export class Editor {
    constructor(schedule, weekview) {
        this.entry = undefined;
        this.schedule = schedule;
        this.weekview = weekview;
        this.initialize();
    }

    anyChecked() {
        let checked = false;
        for(let day of this.daysOfTheWeek) {
            if(day.checked) {
                checked = true;
                break;
            }
        }

        return checked;
    }

    parseTime(timestring) {
        let parts = timestring.split(":");
        if(parts.length < 2) {
            return -1;
        }
        let hours = parseInt(parts[0]);
        let minutes = parseInt(parts[1]);
        if(isNaN(hours) || isNaN(minutes)) {
            return -1;
        }

        let date = new Date(0);

        date.setUTCHours(hours);
        date.setUTCMinutes(minutes);

        return +date;
    }

    createEntry(entry) {
        this.schedule.registerEntry(entry);
        this.weekview.reload();
    }

    trySubmit() {
        if(this.entry == undefined || this.name.value == "" || (!this.anyChecked() && this.date.value == "") || this.begins.value == "" || this.ends.value == "") {
            return;
        }

        let begin = this.parseTime(this.begins.value);
        let end = this.parseTime(this.ends.value);

        if(begin == -1 || end == -1) {
            return;
        }

        this.entry.name = this.name.value;
        this.entry.color = this.color.value;

        this.entry.repeat = {};

        this.entry.repeat.relativeRange = createRange(begin, end);
        this.entry.repeat.updatedTo = justDay(Date.now());

        if(this.anyChecked()) {
            let weekdays = [];
            for(let day of this.daysOfTheWeek) {
                weekdays.push(day.checked);
            }

            this.entry.repeat.weekdays = weekdays;
            this.entry.repeat.repeatType = "weekly";

            this.createEntry(this.entry);
        } else {
            let day = justDay(+new Date(this.date.value));

            this.entry.repeat.day = day;
            this.entry.repeat.repeatType = "none";

            this.createEntry(this.entry);
        }

        this.closeEditor();
    }

    clearEditor() {
        this.color.value = "";
        this.name.value = "";
        this.date.value = "";
        this.date.disabled = false;
        this.begins.value = "";
        this.ends.value = "";
        
        for(let day of this.daysOfTheWeek) {
            day.checked = false;
        }
    }

    openEditor(entry) {
        this.entry = entry;
        this.clearEditor();
        this.me.classList.remove("invisible");
    }

    closeEditor() {
        this.entry = undefined;
        this.me.classList.add("invisible");
    }

    initialize() {
        let $ = document.querySelector.bind(document);

        this.me = $("#edit-menu");
        this.daysOfTheWeek = [
            $("#edit-sunday"),
            $("#edit-monday"),
            $("#edit-tuesday"),
            $("#edit-wednesday"),
            $("#edit-thursday"),
            $("#edit-friday"),
            $("#edit-saturday"),
        ];

        this.color = $("#edit-color");
        this.name = $("#edit-name");
        this.date = $("#edit-date");
        this.begins = $("#edit-begins");
        this.ends = $("#edit-ends");
        this.save = $("#edit-save");

        for(let day of this.daysOfTheWeek) {
            day.addEventListener("input", () => {
                this.date.disabled = this.anyChecked();
            })
        }

        this.save.addEventListener("click", () => this.trySubmit());
    }
}