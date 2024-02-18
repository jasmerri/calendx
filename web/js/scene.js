export function switchViews() {
    let weekview = document.querySelector("#week-view");
    let monthview = document.querySelector("#month-view");

    if (weekview.style.display !== "none") {
        weekview.style.display = "none";
        monthview.style.display = "grid";
    } else {
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

export function correctMonthFormat() {
    let currentDay = new Date();
    currentDay.setDate(1); // change to first day of the month
    const dayNum = currentDay.getDay();
    // potential feature: don't remove previous month's days, but update their numbers as well
    // and gray them out instead of making invisible
    let i = 1;
    for(; i <= dayNum; i++) { // Remove previous month's days
        document.querySelector("#day" + i + "m").classList.add("invisible");
    }
    let daysInMonth = new Date(currentDay.getFullYear(), currentDay.getMonth() + 1, 0).getDate();
    for(i--; i <= daysInMonth + dayNum; i++) { // Change displayed dates of current month's days
        document.querySelector("#day" + i + "m").innerHTML = (i - dayNum);
    }
    for(; i <= 42; i++) { // Remove next month's days
        document.querySelector("#day" + i + "m").style.display = "none";
    }
    return dayNum; // return the id of the actual first day
}