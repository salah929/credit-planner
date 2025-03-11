/**
 * Calculate the whole plan and show it in the table.
 */
function calculatePlan(event) {
    // event.preventDefault is used to prevent refreshing the page after clicking calculate button
    event.preventDefault();
    // first we remove the old data from the table body
    let tableBody = document.getElementById("tbody");
    tableBody.innerHTML = "";

    // we remove the old plan info (the 3 paragraphs)
    let tableContainer = document.getElementById("table-container");
    tableContainer.querySelectorAll("p").forEach(p => p.remove());
    
    // Check if the given data is valid for the calculation
    if (!formIsValid()) return;
    
    // here, all data are valid, we start the calculation

    // first, we have to show the table
    let table = document.getElementById("table");
    table.style.visibility = "visible";

    let creditAmount = Number(document.getElementById("amount").value);
    let interestPerYear = Number(document.getElementById("interest").value / 100);
    let month = Number(document.getElementById("month").value);
    let year = Number(document.getElementById("year").value);
    let monthlyPayment = Number(document.getElementById("payment").value);

    let interestPerMonth = Number(interestPerYear / 12);
    let interestSum = 0; // keeps the total amount of the interest
    let i = 0;
    let date = new Date("1850-01-01");
    let balance = creditAmount;

    while(balance > 0) {
        // create a row in the table
        let row = document.createElement("tr");
        let tdMonth = document.createElement("td");
        let tdMonthYear = document.createElement("td");
        let tdInterest = document.createElement("td");
        let tdPricipal = document.createElement("td");
        let tdBalance = document.createElement("td");

        let monthCount = ++i;
        tdMonth.textContent = monthCount;

        // the default value of date is 1850-01-01
        // if it is still so, this means we are in the first loop
        // so we take the date from the form fields.
        if (date.getFullYear() < 1900) date = new Date(`${year}-${month}-01`);
        // if the date is not the default date, this meand we are not in the first loop
        // simply we add one month to the date to make it ready for the next loop
        else date.setMonth(date.getMonth() + 1);
        tdMonthYear.textContent = date.toLocaleString('en-US', { month: 'short', year: 'numeric' })

        // calculate the interest amount
        var interestAmount = Number((balance * interestPerMonth).toFixed(2));
        tdInterest.textContent = interestAmount;
        // add the interest amount to the interest sum
        interestSum += interestAmount;
        // principal is the amount that will be deducted every month from the credit
        var principal = 0;
        if (monthlyPayment >= balance) principal = balance; // this will happen only in the last payment
        // principal is the monthly payment minus the monthly interest
        else principal = Number((monthlyPayment - interestAmount).toFixed(2));
        tdPricipal.textContent = principal;
        // the new balance is the old balance minus the principal
        balance = Number((balance - principal).toFixed(2));
        tdBalance.textContent = balance;

        // add all of these information to the row
        row.appendChild(tdMonth);
        row.appendChild(tdMonthYear);
        row.appendChild(tdInterest);
        row.appendChild(tdPricipal);
        row.appendChild(tdBalance);

        // add the rwo to table
        tableBody.appendChild(row);
    }
    
    // the last payment will be different
    let lastPayment = principal + interestAmount;

    // add the summary before the table
    addCreditSummary(i, interestSum, creditAmount, lastPayment);
}

/**
 * Add plan summary before the table
 * @param {*} i , at the end, i represents the number of the last payment
 * @param {*} interestSum , contains the total amount of the interest
 * @param {*} creditAmount , the amount of the credit
 * * @param {*} lastPayment , the last payment, which is different from all previous payments
 */
function addCreditSummary(i, interestSum, creditAmount, lastPayment) {

    let tableContainer = document.getElementById("table-container"); // the table container that will contain the summary
    let table = document.getElementById("table"); // at the end, i represents the number of the last payment

    let p1 = document.createElement("p");
    p1.textContent = `Total credit time is: ${Math.floor(i / 12)} year(s) and ${i % 12} month(s).`;
    tableContainer.insertBefore(p1, table);
    let p2 = document.createElement("p");
    p2.textContent = `The total amount of the interest is: ${interestSum.toFixed(2)}.`;
    tableContainer.insertBefore(p2, table);
    let p3 = document.createElement("p");
    p3.textContent = `The ratio of total interest amount to credit amount is ${(interestSum / creditAmount * 100).toFixed(2)} %.`;
    tableContainer.insertBefore(p3, table);
    let p4 = document.createElement("p");
    p4.textContent = "The details of the payments are shown in the below table.";
    tableContainer.insertBefore(p4, table);
    let p5 = document.createElement("p");
    p5.textContent = `The last payment is: ${lastPayment}`;
    tableContainer.appendChild(p5);
}

/**
 * Check if the given information is valid.
 * * @returns ture if yes, otherwise returns false
 */
function formIsValid() {
    let creditForm = document.getElementById("credit-form");
    if (creditForm.checkValidity() == false || checkManualValidation() == false) {
        // If form is not valid, hide the table, show built-in validation messages and stop the execution
        document.getElementById("table").style.visibility = "hidden";
        creditForm.reportValidity();
        return false;
    }
    else return true;
}

/**
 * Check if the given data negative of zero.
 * Check if the monthly payment covers the first interest amount
 * @returns 
 */
function checkManualValidation() {
    let loanAmount = Number(document.getElementById("amount").value);
    if (loanAmount <= 0) {
        alert ("Credit amount can't be less than or equal to zero!")
        return false;
    } 
    let interestPerYear = Number(document.getElementById("interest").value / 100);
    if (interestPerYear < 0) {
        alert ("Interest can't be less than zero!")
        return false;
    } 
    let year = Number(document.getElementById("year").value);
    if (year < 1900 || year > 2100) {
        alert("Year should be between 1900 and 2100!")
        return false;
    }
    let monthlyPayment = Number(document.getElementById("payment").value);
    if (monthlyPayment <= 0) {
        alert("Monthly payment can't be less than or equal to zero!")
        return false;
    }
    let creditAmount = Number(document.getElementById("amount").value);
    let interestPerMonth = Number(interestPerYear / 12);
    let firstInterestAmount = creditAmount * interestPerMonth;
    if (firstInterestAmount > monthlyPayment) {
        alert("The monthly payment does not cover the intereset of the first month!");
        return false;
    }
    return true;
}

document.getElementById("btn").addEventListener("click", calculatePlan);



