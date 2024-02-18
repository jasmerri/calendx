  // when writing to the calendar with genMonth(), display a max of 3 events
  // during week display, write approximately 5 events

  function switchViews() {
    weekview = document.getElementById("week-view");
    monthview = document.getElementById("month-view");

    if(weekview.style.display != "none") {
      weekview.style.display = "none";
      monthview.style.display = "grid";
    } else {
      weekview.style.display = "grid";
      monthview.style.display = "none";
    } 
  }

  function generateWeek(month, day) {
    
  }