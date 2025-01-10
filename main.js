import './style.css'


document.querySelector('#app').innerHTML = `
  <div>
    <div id="wrapper">
        <div id="navBar">
            <div id="leftButton" class="menuButton" title="tap to toggle additional functions menu"></div>
            <div id="otherFunctionsMenu" class="">
                <button id="nextMonth" class="functionButton">Next Month</button>
                <button id="lastMonth" class="functionButton">Previous Month</button>
                <button id="thisMonth" class="functionButton">Current Month</button>
                <button id="clear" class="functionButton">Clear Highlights</button>
            </div>
            <div id="monthAndYearMenu" class="">
                <div id="monthMenu">
                    <label class="menuLabel">Month: </label>
                    <select id="monthSelect"></select>
                </div>
                <div id="yearMenu">
                    <label class="menuLabel">Year: </label>
                    <select id="yearSelect"></select>
                </div>
                <button id="submit">Go</button>
            </div>
            <div id="rightButton" class="menuButton" title="tap to toggle month/year menu"></div>
        </div>
        <div id="monthHeading" class="calendarContent"><h1 id="month"></h1><h1 id="year"></h1></div>
        <div id="weekdayHeading" class="calendarContent"></div>
        <div id="dateGrid" class="calendarContent"></div>
    </div>

  </div>
`

//current date
const today = new Date();

const day = today.getDate();
const month =  today.getMonth();
const year = today.getFullYear();

//array of month names
const months = ['January','February','March','April','May','June','July',
    'August','September','October','November','December'];

//array of weekday names
const weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];


//fades element in and out while also removing from or returning to layout using display property
function removeFadeOut( el, speed ) {
    let seconds = speed/1000;
    el.style.transition = "opacity "+seconds+"s ease-in-out";

    if(window.getComputedStyle(el).getPropertyValue("display") === "grid") {
        el.style.opacity = "0";
        setTimeout(function () {
            el.style.display = "none";
        }, speed);
    }
    else{
        el.style.display = "grid";
        setTimeout(function () {
            el.style.opacity = "1";
        }, speed);
    }
}

const menuDelay = 170;
const switchoverDelay = menuDelay + 1;

//menus will disappear alternately to avoid cluttering layout; only one can be open at once
document.querySelector("#leftButton").addEventListener("click", () =>
{
    if(window.getComputedStyle(document.getElementById('monthAndYearMenu')).getPropertyValue("display") === "grid"){
        removeFadeOut(document.getElementById('monthAndYearMenu'), menuDelay);
        setTimeout(function () {
            removeFadeOut(document.getElementById('otherFunctionsMenu'), menuDelay);
        }, switchoverDelay);
    }
    else{removeFadeOut(document.getElementById('otherFunctionsMenu'), menuDelay)}
});

document.querySelector("#rightButton").addEventListener("click", () =>
{
    if(window.getComputedStyle(document.getElementById('otherFunctionsMenu')).getPropertyValue("display") === "grid"){
        removeFadeOut(document.getElementById('otherFunctionsMenu'), menuDelay);
        setTimeout(function () {
            removeFadeOut(document.getElementById('monthAndYearMenu'), menuDelay);
        }, switchoverDelay);
    }
    else{removeFadeOut(document.getElementById('monthAndYearMenu'), menuDelay)}
});


//generates string representing current date
function dateString(month, day, year) {
    return (month+1).toString()+"-"+day.toString()+"-"+year.toString()
}

function createCalendar(date) {

    //current date to compare for highlighting
    const now = new Date();
    const currentDay = now.getDate();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    //data to generate calendar dates
    const month =  date.getMonth();
    const year = date.getFullYear();

    //option to extract month name from date
    const options = { month: "long" };
    const monthName = new Intl.DateTimeFormat("en-US", options).format(date);
    document.querySelector('#month').innerHTML = monthName;

    //set year on display
    document.querySelector('#year').innerHTML = year.toString();

    document.querySelector("title").innerHTML = monthName + " " + year.toString();


    //number of days in current month
    const daysInMonth = (new Date(year,month + 1,0).getDate());

    //number of days in prior month (to determine what to display at beginning on calendar)
    const daysInPriorMonth = (new Date(year,month,0).getDate());

    //finds the day of the week that is the first day of the month
    const firstDayOfWeek = new Date(year,month,8).getDay();

    const priorMonthDaysStart = daysInPriorMonth - (firstDayOfWeek - 1) ;

    //establishes an index to determine what range to offset the listed dates based on what day is the first
    //of the month
    const firstIndex = firstDayOfWeek + 1;
    const lastIndex = firstDayOfWeek + daysInMonth;

    let priorCountUp = priorMonthDaysStart;
    let count = 1;
    let postCount = 1;


    //generates dates for grid inserting correct date numbers for each
    let gridLimit = 36;

    //checks for cases where 6 rows of dates are needed
    if(daysInMonth === 31 && firstDayOfWeek > 4){
        gridLimit = 43;
    }
    if(daysInMonth === 30 && firstDayOfWeek > 5){
        gridLimit = 43;
    }

    for(let i = 1; i < gridLimit; i++){
        let dateBlock = document.createElement("div");
        dateBlock.classList.add("dateBlock");
        //fills in dates from previous month in empty spaces at beginning of current month
        if(i < firstIndex){
            let number = document.createElement("div");
            number.inert = true;
            number.innerText = priorCountUp.toString();
            number.classList.add("priorAndNextMonth");
            dateBlock.appendChild(number);
            dateBlock.setAttribute("data-date",dateString(month,count,year));
            priorCountUp++;
        }
        //fills in dates of current month
        else if(i >= firstIndex && i <= lastIndex){
            let number = document.createElement("div");
            number.inert = true;
            number.innerText = count.toString();
            dateBlock.appendChild(number);
            dateBlock.setAttribute("data-date",dateString(month,count,year));
            if(Date.parse(dateString(month,count,year)) === Date.parse(dateString(currentMonth,currentDay,currentYear))){
                dateBlock.classList.add("todayBlock");
            }
            count++;
        }
        //fills in dates from following month in empty spaces at end of current month
        else if(i > lastIndex){
            let number = document.createElement("div");
            number.inert = true;
            number.innerText = postCount.toString();
            number.classList.add("priorAndNextMonth");
            dateBlock.appendChild(number);
            dateBlock.setAttribute("data-date",dateString(month,count,year));
            postCount++;
        }

        dateBlock.addEventListener("click",function (e){
            this.classList.toggle("highlighted")
        });

        document.querySelector('#dateGrid').appendChild(dateBlock);
    }

}

function updateCalendar(month, year) {

    //booleans to track changes and control transitions
    let yearChange = false;
    let monthChange = false;

    //case of same month different year
    if(document.querySelector("#month").innerHTML === month  &&
        document.querySelector("#year").innerHTML !== year) {
        yearChange = true;
        document.querySelector("#year").style.opacity = "0";
        document.querySelector("#weekdayHeading").style.opacity = "0";
        document.querySelector("#dateGrid").style.opacity = "0";
    }
    //case of same year different month
    else if(document.querySelector("#month").innerHTML !== month  &&
        document.querySelector("#year").innerHTML === year) {
        monthChange = true;
        document.querySelector("#month").style.opacity = "0";
        document.querySelector("#weekdayHeading").style.opacity = "0";
        document.querySelector("#dateGrid").style.opacity = "0";
    }
    //case of different year different month
    else if(document.querySelector("#month").innerHTML !== month  &&
        document.querySelector("#year").innerHTML !== year){
        document.querySelector("#monthHeading").style.opacity = "0";
        document.querySelector("#weekdayHeading").style.opacity = "0";
        document.querySelector("#dateGrid").style.opacity = "0";
    }
    //if no change no transition happens


    //timeout to delay reappearance while new data is displayed
    setTimeout(() => {

        const newDate = new Date(month+"-1-"+year.toString());

        document.querySelector("#dateGrid").replaceChildren();

        createCalendar(newDate);

        if(yearChange === true){document.querySelector("#year").style.opacity = "1";}
        else if(monthChange === true){document.querySelector("#month").style.opacity = "1";}
        else{document.querySelector("#monthHeading").style.opacity = "1";}
        document.querySelector("#weekdayHeading").style.opacity = "1";
        document.querySelector("#dateGrid").style.opacity = "1";
    }, 600);
}

//changes calendar to selected month/year
document.querySelector("#submit").addEventListener("click", () =>
{
    const month = document.querySelector("#monthSelect").value;
    const year = document.querySelector("#yearSelect").value;
    updateCalendar(month,year);
});

//advances displayed month by one
document.querySelector("#nextMonth").addEventListener("click", () =>
{
    const month = document.querySelector("#month").innerHTML;
    const year = document.querySelector("#year").innerHTML;
    if(month === "December"){
        updateCalendar('January',(parseInt(year)+1).toString());
    }
    else{
        const monthIndex = months.indexOf(month);
        updateCalendar(months[monthIndex + 1],year);
    }
});

//changes displayed month to prior month
document.querySelector("#lastMonth").addEventListener("click", () =>
{
    const month = document.querySelector("#month").innerHTML;
    const year = document.querySelector("#year").innerHTML;
    if(month === "January"){
        updateCalendar('December',(parseInt(year)-1).toString());
    }
    else{
        const monthIndex = months.indexOf(month);
        updateCalendar(months[monthIndex - 1],year);
    }
});

//changes displayed month to current month
document.querySelector("#thisMonth").addEventListener("click", () =>
{
    const month = today.getMonth();
    const year = today.getFullYear();
    updateCalendar(months[month],year.toString());
});

//removes click-highlighting from dates
document.querySelector("#clear").addEventListener("click", () =>
{
    const highlightedDates = document.querySelectorAll(".highlighted");

    highlightedDates.forEach((elem) =>{
        elem.classList.remove("highlighted");
    });
});


//generates headings for each weekday "column" using array
weekdays.forEach((element) => {
    let weekday = document.createElement("div");
    weekday.classList.add("weekday");
    weekday.innerText = element;
    document.querySelector('#weekdayHeading').appendChild(weekday);}
);


//populates month select options from array
months.forEach((element) => {
    let monthOption = document.createElement("option");
    monthOption.innerText = element;
    if(months[month] === element){monthOption.selected = true};
    document.querySelector('#monthSelect').appendChild(monthOption);}
);

//populates year select options
for(let i = 2050; i >= 1900; i--) {
    let yearOption = document.createElement("option");
    yearOption.innerText = i.toString();
    if(i == year){yearOption.selected = true};
    if(i%10 == 0 && i != 2050){
        const space = document.createElement("option");
        space.disabled = true;
        document.querySelector('#yearSelect').appendChild(space);
    }
    document.querySelector('#yearSelect').appendChild(yearOption);
}

createCalendar(today);









