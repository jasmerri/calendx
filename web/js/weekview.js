export class WeekView {
    constructor(schedule, timebar) {
        this.schedule = schedule;
        this.timebar = timebar;
        this.day = undefined;
    }

    setDay(day) {
        this.day = day;
        this.timebar.setDay(day);
    }

    reload() {
        this.setDay(this.schedule.getDay(this.day.date));
    }
}