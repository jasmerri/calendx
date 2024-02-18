// todo: check this param
export function switchViews(date) {
    console.log("switchViews() called on day " + date);
    let weekview = document.querySelector("#week-view");
    let monthview = document.querySelector("#month-view");

    if (weekview.style.display !== "none") {
        weekview.style.display = "none";
        monthview.style.display = "grid";
    } else {
        displayWeekEvents(date);
        weekview.style.display = "grid";
        monthview.style.display = "none";
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
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}


// date is the center of the week, so go 3 back and 3 forward
// figure out why it's going down by 2 each time
function displayWeekEvents(date) {
    let dateCopy = new Date(date);
    for(let i = 3; i >= 1; i--) { // don't reassign date, because dateCopy gets reassigned repeatedly
        console.log("date: ", dateCopy);
        console.log("date + (i-4): " + (dateCopy.getTime() - (i - 4) * 24 * 60 * 60 * 1000));
        dateCopy = new Date(date.getTime() + (i - 4) * 24 * 60 * 60 * 1000); // set date to previous properly
        document.querySelector("#day" + i + "w").innerHTML = dateCopy.getDate(); // set new day value, just in case we go across months
    }
    for(let i = 4; i <= 7; i++) {
        console.log("date: ", dateCopy);
        console.log("date + (i-4): " + (date.getTime() - (i - 4) * 24 * 60 * 60 * 1000));
        dateCopy = new Date(date.getTime() + (i - 4) * 24 * 60 * 60 * 1000);
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
        (function(dateCopy) {
            document.querySelector("#day" + i + "m").addEventListener("click", () => switchViews(dateCopy));
        })(dateCopy);
        // render events
    }
}



// currentDay must be within the month
// returns starting day
export function correctMonthFormat(currentDay) {
    //let currentDay = new Date();
    currentDay.setDate(1); // change to first day of the month
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