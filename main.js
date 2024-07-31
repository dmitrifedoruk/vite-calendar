import './style.css'


document.querySelector('#app').innerHTML = `
  <div>
    <div id="wrapper">
        <div id="navBar">
            <div id="leftButton" class="menuButton"></div>
            <div id="monthAndYearMenu" class="hideMenu" inert>
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

//generates string representing current date
function dateString(month, day, year) {
    return (month+1).toString()+"-"+day.toString()+"-"+year.toString()
}

function showMenu() {
    const menu = document.querySelector("#monthAndYearMenu");
    if (menu.classList[0] === "showMenu") {
        menu.classList.remove("showMenu");
        menu.classList.add("hideMenu");
        menu.inert = true;
    } else {
        menu.classList.remove("hideMenu");
        menu.classList.add("showMenu");
        menu.inert = false;
    }
}

document.querySelector("#rightButton").addEventListener("click",showMenu);

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
    for(let i = 1; i < 36; i++){
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

function updateCalendar() {

    //booleans to track changes and control transitions
    let yearChange = false;
    let monthChange = false;

    //case of same month different year
    if(document.querySelector("#month").innerHTML === document.querySelector("#monthSelect").value  &&
        document.querySelector("#year").innerHTML !== document.querySelector("#yearSelect").value) {
        yearChange = true;
        document.querySelector("#year").style.opacity = "0";
        document.querySelector("#weekdayHeading").style.opacity = "0";
        document.querySelector("#dateGrid").style.opacity = "0";
    }
    //case of same year different month
    else if(document.querySelector("#month").innerHTML !== document.querySelector("#monthSelect").value  &&
        document.querySelector("#year").innerHTML === document.querySelector("#yearSelect").value) {
        monthChange = true;
        document.querySelector("#month").style.opacity = "0";
        document.querySelector("#weekdayHeading").style.opacity = "0";
        document.querySelector("#dateGrid").style.opacity = "0";
    }
    //case of different year different month
    else if(document.querySelector("#month").innerHTML !== document.querySelector("#monthSelect").value  &&
        document.querySelector("#year").innerHTML !== document.querySelector("#yearSelect").value){
        document.querySelector("#monthHeading").style.opacity = "0";
        document.querySelector("#weekdayHeading").style.opacity = "0";
        document.querySelector("#dateGrid").style.opacity = "0";
    }
    //if no change no transition happens


    //timeout to delay reappearance while new data is displayed
    setTimeout(() => {
        const month = document.querySelector("#monthSelect").value;
        const year = document.querySelector("#yearSelect").value;

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

document.querySelector("#submit").addEventListener("click",updateCalendar);


//current date
const today = new Date();

const day = today.getDate();
const month =  today.getMonth();
const year = today.getFullYear();

console.log(month);


//array of month names
const months = ['January','February','March','April','May','June','July',
    'August','September','October','November','December'];

//array of weekday names
const weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

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











