export class SceneManager {
    static instance;

    constructor(weekview) {
        this.weekview = weekview;
    }

    showWeek(date) {
        this.weekview.setDay(date);
        displayWeekEvents(date);

        let weekview = document.querySelector("#week-view");
        let monthview = document.querySelector("#month-view");
        weekview.style.display = "grid";
        monthview.style.display = "none";
    }

    showMonth() {
        // displayMonthEvents(date);

        let weekview = document.querySelector("#week-view");
        let monthview = document.querySelector("#month-view");
        weekview.style.display = "none";
        monthview.style.display = "grid";
    }
}

export function makeDays() {
    for(let i = 1; i <= 42; i++) { // loop for month days
        let dynamicId = "day" + i + "m";
        let day = document.createElement("div");
        let text = document.createTextNode(i);
        day.appendChild(text);
        day.classList.add("day");
        document.querySelector("#month-calendar").appendChild(day).id = dynamicId;
    }
    for(let i = 1; i <= 7; i++) { // loop for week days
        let dynamicId = "day" + i + "w";
        let day = document.createElement("div");
        let text = document.createTextNode(i);
        day.appendChild(text);
        day.classList.add("day");
        document.querySelector("#week-calendar").appendChild(day).id = dynamicId;
    }
}

// todo: check this param
function getDaysInMonth(date) { 
    let d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}


// date is the center of the week, so go 3 back and 3 forward
// figure out why it's going down by 2 each time
function displayWeekEvents(date) {
    let original = new Date(date);
    let dateCopy = new Date(date);
    let beginningDate = new Date(dateCopy.getTime() + (1 - 4) * 24 * 60 * 60 * 1000);
    let endingDate = new Date(dateCopy.getTime() + (7 - 4) * 24 * 60 * 60 * 1000);
    document.querySelector("#month-week-display").innerHTML = 
        beginningDate.toLocaleString('default', {month: 'long'}) + " " + 
        beginningDate.getDate() + " - " + endingDate.toLocaleString('default', {month: 'long'}) + " " + endingDate.getDate();

    for(let i = 3; i >= 1; i--) { // don't reassign date, because dateCopy gets reassigned repeatedly
        dateCopy = new Date(original.getTime() + (i - 4) * 24 * 60 * 60 * 1000); // set date to previous properly
        document.querySelector("#day" + i + "w").innerHTML = dateCopy.getDate(); // set new day value, just in case we go across months
    }
    for(let i = 4; i <= 7; i++) {
        dateCopy = new Date(original.getTime() + (i - 4) * 24 * 60 * 60 * 1000);
        document.querySelector("#day" + i + "w").innerHTML = dateCopy.getDate(); // set new day value
    }

    // render events
}

// date is a Date object starting SOMEWHERE in the month. doesn't actually matter where
// monthStartDay should be whatever the first displayed div id is (e.g. 3 if starting on a Tuesday)
export function displayMonthEvents(date, monthStartDay) {
    let days = getDaysInMonth(date);
    for(let i = monthStartDay; i <= monthStartDay + days; i++) {
        let dateCopy = new Date(date);
        dateCopy.setDate(i - monthStartDay);
        document.querySelector("#day" + i + "m").addEventListener("click", () => SceneManager.instance.showWeek(+dateCopy));
        // render events
    }
}


// currentDay must be within the month
// returns starting day
export function correctMonthFormat(currentDay) {
    //let currentDay = new Date();
    currentDay.setDate(1); // change to first day of the month
    document.querySelector("#month-year-display").innerHTML = currentDay.toLocaleString('default', {month: 'long'}) + " " + currentDay.getFullYear();
    const dayNum = currentDay.getDay();
    // potential feature: don't remove previous month's days, but update their numbers as well
    // and gray them out instead of making invisible
    let i = 1;
    for(; i <= dayNum; i++) { // Remove previous month's days
        document.querySelector("#day" + i + "m").classList.add("invisible");
    }
    let daysInMonth = getDaysInMonth(currentDay);
    for(i--; i <= daysInMonth + dayNum; i++) { // Change displayed dates of current month's days
        document.querySelector("#day" + i + "m").innerHTML = (i - dayNum);
    }
    for(; i <= 42; i++) { // Remove next month's days
        document.querySelector("#day" + i + "m").style.display = "none";
    }
    return dayNum;
}