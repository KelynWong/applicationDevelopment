// ------------------ BASIC --------------------
function fractionalKnapsack(audience, cost, budget){
    var values = [];
    var paid = [];
    for (let i = 0; i < audience.length; i++) { //creating values array with cost and audience array
        var num = cost[i]/audience[i];
        values[i] = num;
    }
    do{
        var min = values[0];
        var option = 0
        for (let i = 1; i <= values.length; i++) { //finding the lowest value = best option
            if(values[i] <= min){
                min = values[i];
                option=i; //position of the option in the array
            }
        }
        if(option == values.length -1){
            values.splice(option, 1); //get rid of the option in the values array
        }else{
            values[option] = Number.POSITIVE_INFINITY;
        }
        var pay = cost[option]; //getting the cost needed to pay for that option
        budget = budget - pay; //paying for the option
        if(budget < 0){ //if not enough money to pay, pay partly
            var offset = Math.abs(budget);
            var amount = pay - offset; //amount is the amount you paid partly
            paid[option] = amount;
        }else{
            paid[option] = pay; //pay is full amount you paid for the particular option
        }
    }while(budget > 0)
    paid = Array.from(paid, item => item || 0);
    if(paid.length != cost.length){
        for (let i = paid.length; i < cost.length; i++) {
            paid.push(0)
        }
    }
    return paid;
}

console.log(fractionalKnapsack([1,2,3,4],[3,1,4,2], 4))

//------------------- ADVANCED -----------------------
function FullKnapsack(audience, cost, budget){
    let n = audience.length-1;
    let result = 0;
    console.log("n: " + n);
    console.log("audience: " + audience);
    console.log("cost: " + cost);
    console.log("budget: " + budget);
    console.log("result: " + result)
    if(n==0 || budget==0){
        result=0;
    }else if(cost[n] > budget){
        n-= 1
        result = FullKnapsack(audience, cost, budget);
    }else{
        var dontPut = FullKnapsack(audience, cost, budget);
        var put = audience[n] + FullKnapsack(audience, cost, budget - cost[n]);
        if(dontPut < put){
            result = put;
        }else{
            result = dontPut;
        }
        n-= 1;
    }
    return result;
}

console.log(FullKnapsack([1,1,1,1],[1,2,3,4], 4))