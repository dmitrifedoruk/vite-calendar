import './style.css'


document.querySelector('#app').innerHTML = `
  <div>
    <div id="wrapper">
        <div id="monthHeading"><h1 id="month"></h1></div>
        <div id="weekdayHeading"></div>
        <div id="dateGrid"></div>




    </div>

  </div>
`


//arrays of weekday names
const weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

//current date
const today = new Date();

//option to extract month name from date
const options = { month: "long" };
document.querySelector('#month').innerHTML =
    new Intl.DateTimeFormat("en-US", options).format(today);


//generates headings for each weekday "column" using array
weekdays.forEach((element) => {
    let weekday = document.createElement("div");
    weekday.classList.add("weekday");
    weekday.innerText = element;
    document.querySelector('#weekdayHeading').appendChild(weekday);}
);

//determines number of days in current month
const daysInMonth = (new Date(today.getFullYear(),today.getMonth() + 1,0).getDate());

//finds the day of the week that is the first day of the month
const firstDayOfWeek = new Date(today.getFullYear(),today.getMonth(),8).getDay();
console.log(daysInMonth);
console.log(firstDayOfWeek);


//establishes an index to determine what range to offset the listed dates based on what day is the first
//of the month
const firstIndex = firstDayOfWeek + 1;
const lastIndex = firstDayOfWeek + daysInMonth;
let count = 1;


//generates dates for grid inserting correct date numbers for each
for(let i = 1; i < 36; i++){
    let dateBlock = document.createElement("div");
    dateBlock.classList.add("dateBlock");
    if(i >= firstIndex && i <= lastIndex){
        dateBlock.innerText = count.toString();
        count++;
    }
    document.querySelector('#dateGrid').appendChild(dateBlock);

}




