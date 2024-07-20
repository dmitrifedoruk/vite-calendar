import './style.css'


document.querySelector('#app').innerHTML = `
  <div>
    <div id="wrapper">
        <div id="monthHeading"><h1 id="month"></h1><h1 id="year"></h1></div>
        <div id="weekdayHeading"></div>
        <div id="dateGrid"></div>




    </div>

  </div>
`

//arrays of weekday names
const weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

//current date
const today = new Date();

const day = today.getDate();
const month =  today.getMonth();
const year = today.getFullYear();


function dateString(month, day, year) {
    return (month+1).toString()+"-"+day.toString()+"-"+year.toString()
}

//option to extract month name from date
const options = { month: "long" };
document.querySelector('#month').innerHTML =
    new Intl.DateTimeFormat("en-US", options).format(today);

//set year on display
document.querySelector('#year').innerHTML = year.toString();


//generates headings for each weekday "column" using array
weekdays.forEach((element) => {
    let weekday = document.createElement("div");
    weekday.classList.add("weekday");
    weekday.innerText = element;
    document.querySelector('#weekdayHeading').appendChild(weekday);}
);

//number of days in current month
const daysInMonth = (new Date(today.getFullYear(),today.getMonth() + 1,0).getDate());

//number of days in prior month (to determine what to display at beginning on calendar)
const daysInPriorMonth = (new Date(today.getFullYear(),today.getMonth(),0).getDate());

//finds the day of the week that is the first day of the month
const firstDayOfWeek = new Date(today.getFullYear(),today.getMonth(),8).getDay();

const priorMonthDaysStart = daysInPriorMonth - (firstDayOfWeek - 1) ;

console.log(daysInPriorMonth);
console.log(daysInMonth);
console.log(firstDayOfWeek);
console.log(priorMonthDaysStart);


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

    if(i < firstIndex){
        let number = document.createElement("div");
        number.innerText = priorCountUp.toString();
        number.classList.add("priorAndNextMonth");
        dateBlock.appendChild(number);
        dateBlock.setAttribute("data-date",dateString(month,count,year));
        priorCountUp++;
    }
    else if(i >= firstIndex && i <= lastIndex){
        dateBlock.innerText = count.toString();
        dateBlock.setAttribute("data-date",dateString(month,count,year));
        if(Date.parse(dateString(month,count,year)).valueOf() === Date.parse(dateString(month, day, year))){
            dateBlock.classList.add("todayBlock");
        }
        count++;
    }
    else if(i > lastIndex){
        let number = document.createElement("div");
        number.innerText = postCount.toString();
        number.classList.add("priorAndNextMonth");
        dateBlock.appendChild(number);
        dateBlock.setAttribute("data-date",dateString(month,count,year));
        postCount++;
    }
    document.querySelector('#dateGrid').appendChild(dateBlock);
}












