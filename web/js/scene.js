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
        let text = document.createTextNode("Day " + i);
        day.appendChild(text);
        document.querySelector("#month-calendar").appendChild(day).id = dynamicId;
    }
    for(let i = 1; i <= 7; i++) { // loop for week days
        let dynamicId = "day" + i + "w";
        let day = document.createElement("div");
        let text = document.createTextNode("Day " + i);
        day.appendChild(text);
        document.querySelector("#week-calendar").appendChild(day).id = dynamicId;
    }
}