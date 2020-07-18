// ------------------ BASIC --------------------
function fractionalKnapsack(audience, cost, budget) {
    var values = [];
    var paid = [];
    for (let i = 0; i < audience.length; i++) {
        var num = cost[i] / audience[i]; //Get the rate of change.
        values[i] = num;
    }

    for (let j = 0; j < values.length && budget > 0; j++) {
        //do validation if only 1 value parsed.
        var min = values[0];
        var option = 0;
        //Get the current best option (The smaller the rate of change, the better the option.)
        for (let i = 1; i <= values.length; i++) { //finding the lowest value = best option
            if (values[i] <= min) { //If the current index value smaller or = to min.
                min = values[i];
                option = i; //position of the best option in the array.
            }
        }

        // Isit Full or Partial?
        var pay = cost[option]; // Best option cost = pay.
        budget = budget - pay; // Paying for the option
        // When budget 
        if (budget < 0) { // If not enough money to pay, pay partly.
            var offset = Math.abs(budget);
            var amount = pay - offset;
            paid[option] = amount; // Paid partial amount.
        } else {
            paid[option] = pay; //Paid full amount
        }
        values[option] = Number.POSITIVE_INFINITY; // This sets the value in the current best option to infinity as such that it won't get picked again.
    }
    // This responds to indexes with null values. If null, give 0! If value exists, give value.
    paid = Array.from(paid, item => item || 0);
    if (paid.length != cost.length) {
        for (let i = paid.length; i < cost.length; i++) {
            paid.push(0);
        }
    }
    return paid; //paid is an array which returns how much money is put into each option (options are in order of what user keyed in)
}
//e.g paid[0] would be the amount of money paid to the first option that user keyed in
// console.log(fractionalKnapsack([4000,5000],[1000,800], 1000))

// ------------------- ADVANCED ----------------------
// fullKnapsack(Audience Reach, Cost, Budget); //aud cost
// Advanced Algo explaination will be out soon :)
function fullKnapsack(audience, cost, budget) {
    let n = audience.length-1; // no. of items
    let m = budget; //Max weight
    let P = audience;
    let wt = cost;
    let table = [];
    let paid = new Array(n);
    for(let p = 0;p < n-1; p++) {
        paid[p] = 0;
    }

    for (let index = 0; index < n + 1; index++) {
        table.push(new Array());
    }

    for (let i = 0; i <= n; i++) {
        for (let w = 0; w <= m; w++) {
            if (i == 0 || w == 0) {
                table[i][w] = 0;
            } else if (wt[i] <= w) {
                table[i][w] = Math.max(P[i] + table[i - 1][w - wt[i]], table[i - 1][w]);
            } else {
                table[i][w] = table[i - 1][w];
            }
        }
    }
    // console.table(table);
    let i = n;
    let j = m;

    // Identify the choices to be selected.
    do {
        if (table[i][j] == table[i - 1][j]) {
            console.log("choice:" + i + " NO");
            paid[i-1] = 0;
            i--;
        } else {
            console.log("choice:" + i + " YES");
            paid[i-1] = 1;
            
            j = j - wt[i];
            i--;
        }
    } while (i > 0 && j > 0);
    console.table(paid);
    return paid;
}

module.exports = {
    fractionalKnapsack,
    fullKnapsack
};