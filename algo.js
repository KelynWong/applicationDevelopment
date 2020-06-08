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
    paid = Array.from(paid, item => item || 0); //0 for the particular option
    if(paid.length != cost.length){
        for (let i = paid.length; i < cost.length; i++) {
            paid.push(0)
        }
    }
    return paid; //paid is an array which returns how much money is put into each option (options are in order of what user keyed in)
}
//e.g paid[0] would be the amount of money paid to the first option that user keyed in
// console.log(fractionalKnapsack([4000,5000],[1000,800], 1000))

//------------------- ADVANCED -----------------------
// function FullKnapsack(audience, cost, budget, n){
//     var result= [];
//     console.log("========================");
//     console.log("n: " + n);
//     console.log("audience: " + audience);
//     console.log("cost: " + cost);
//     console.log("budget: " + budget);
//     console.log("result: " + result);
//     console.log("cost[n]: " + cost[n]);
//     if(n==0 || budget==0){
//         result[n]=0;
//     }else if(cost[n] > budget){
//         result = FullKnapsack(audience, cost, budget, n-1);
//     }else{
//         var dontPut = FullKnapsack(audience, cost, budget, n-1);
//         var put = audience[n] + FullKnapsack(audience, cost, budget - cost[n], n-1);
//         console.log("put: " + put)
//         console.log("dontPut: " + dontPut)
//         if(dontPut < put){
//             result[n] = "put";
//         }else{
//             result[n] = "dontPut";
//         }
//     }
//     return result;
// }

// console.log(FullKnapsack([1,1,1,1],[1,2,3,4], 4, 3))

// function FullKnapsack(audience, cost, budget){
//     let cache = [];
//      for (g = 0; g < audience.length+1; g++){
//           cache[g] = [];
//           for (h = 0; h < budget+1; h++) {
//                cache[g][h] = 0;
//           }
//      }
//      for (let i = 0; i < audience.length+1; i++) {
//           for (let j = 0; j < budget+1; j++) {
//                if (i === 0 || j === 0)
//                     cache[i][j] = 0;
//                else if (cost[i-1] <= j) {
//                     let included = audience[i-1] + cache[i-1][j-cost[i-1]];
//                     let excluded = cache[i-1][j];
//                     cache[i][j] = Math.max(included, excluded);
//                }
//                else
//                     cache[i][j] = cache[i-1][j]
//           }
//      }
//      return cache[audience.length][budget];
// }

// console.log(FullKnapsack([4,3,2,1],[1,2,3,4], 4))

module.exports = {
    fractionalKnapsack,
    // FullKnapsack
  }