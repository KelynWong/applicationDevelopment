// BASIC Results Viewer Script
// Name: Wong En Ting Kelyn
// Name: Teh Huan Xi Kester
// Class: DIT/FT/2B/01

const baseUrl = "http://localhost:3000";
$(document).ready(function () {
    $(document).on('click', '.computeBtn', function () { // On click compute button
        var optionIdsInput = document.getElementById("optionIdsInput").value; //Get option id input
        var budgetInput = document.getElementById("budgetInput").value; //Get budget input

        // Field Validation -> Needs Extra Checking
        if (optionIdsInput == '' && budgetInput == '') { //check if both fields are empty
            document.getElementById('optionIdsInput').style.backgroundColor = "#FF4A31"; // Set background to red if invalid
            document.getElementById('budgetInput').style.backgroundColor = "#FF4A31"; // Set background to red if invalid
            alert("Please enter at least 2 optionIds and budget!");
        }
        else if (optionIdsInput == '') { //check if optionIds field is empty
            document.getElementById('optionIdsInput').style.backgroundColor = "#FF4A31"; // Set background to red if invalid
            alert("Please enter at least 2 optionsIds!");
        }
        else if (optionIdsInput.search(",") == -1) { //check if there is a comma in the optionIds field
            document.getElementById('optionIdsInput').style.backgroundColor = "#FF4A31"; // Set background to red if invalid
            alert("Please enter at least 2 optionIds, seperated by a comma!");
        }
        else {
            var optionList;
            optionList = optionIdsInput.toString().split(','); //optionList array
            if (optionList.length < 2) { //check if there is more than one optionIds
                document.getElementById('optionIdsInput').style.backgroundColor = "#FF4A31"; // Set background to red if invalid
                alert("Please enter at least 2 optionIds!");
            }
            else {
                var lengthCheck = [];
                // var isIntCheck = [];
                for (let i = 0; i < optionList.length; i++) {
                    optionList[i] = parseInt(optionList[i]);
                    optionList[i] = optionList[i].toString();

                    if (optionList[i].length == 10) {
                        lengthCheck[i] = true;
                        console.log("Pass2" + optionList[i]);
                    } else {
                        lengthCheck[i] = false;
                        console.log("Failed2" + optionList[i]);
                    }
                    // optionList[i] = optionList[i].toString();
                }
                var same = false
                for (let j = 0; j < optionList.length; j++) {
                    for (let k = 0; k < optionList.length; k++) {
                        if (optionList[j] == optionList[k] && j != k) {
                            same = true
                        }
                    }
                }
                if (!lengthCheck.every(v => v == true)) { //check ebery optionId in the list if they are 10 digits each
                    document.getElementById('optionIdsInput').style.backgroundColor = "#FF4A31"; // Set background to red if invalid
                    alert("Please make sure your optionIds are exactly 10 digits each, and digits only!");
                }
                else if(same == true){ //check within the optionIds if have any repeated optionId
                    document.getElementById('optionIdsInput').style.backgroundColor = "#FF4A31"; // Set background to red if invalid
                    alert("Please make sure you don't enter the same optionId!");
                }
                else if (budgetInput == '') { //check if budget field is empty
                    document.getElementById('budgetInput').style.backgroundColor = "#FF4A31"; // Set background to red if invalid
                    document.getElementById('optionIdsInput').style.backgroundColor = "#55FF3D"; // Set background to green if valid
                    alert("Please enter a Budget!");
                }
                else if (isNaN(budgetInput)) { //check if there is any alphabets in the budget field
                    document.getElementById('budgetInput').style.backgroundColor = "#FF4A31"; // Set background to red if invalid
                    document.getElementById('optionIdsInput').style.backgroundColor = "#55FF3D"; // Set background to green if valid
                    alert("Please enter a numeric value for Budget!");
                }
                else if (budgetInput <= 0) { //check if budget has a negative value
                    document.getElementById('budgetInput').style.backgroundColor = "#FF4A31"; // Set background to red if invalid
                    document.getElementById('optionIdsInput').style.backgroundColor = "#55FF3D"; // Set background to green if valid
                    alert("Please enter a numeric value bigger than $0.00");
                }
                else{
                    console.log("optionIdsInput: " + optionIdsInput);
                    console.log("budgetInput: " + budgetInput);
                    const requestBody = {
                        params: {
                            optionIds: optionIdsInput,
                            budget: parseInt(budgetInput),
                        }
                    };
                    axios.get(`${baseUrl}/basic/allChartData`, requestBody) // Links to app.js
                        .then((response) => {
                            if(response.data.length != optionList.length){
                                document.getElementById('budgetInput').style.backgroundColor = "#55FF3D"; // Set background to green if valid
                                document.getElementById('optionIdsInput').style.backgroundColor = "#FF4A31"; // Set background to red if invalid
                                alert("One or more of the optionId you have entered is invalid!")
                            }else if(response.data.length == optionList.length){
                                console.log("response.data.error: " + response.data.error);
                                google.charts.load('current', { 'packages': ['bar'] });
                                google.charts.setOnLoadCallback(drawStuff);

                                var allData = response.data;
                                console.log("allData: " + allData);
                                var optionid = [];
                                var audiencereach = [];
                                var cost = [];
                                console.log("allData.length" + allData.length);
                                for (var i = 0; i < allData.length; i++) {
                                    optionid.push(response.data[i].optionid);
                                    audiencereach.push(response.data[i].audiencereach);
                                    cost.push(response.data[i].cost);
                                }
                                console.log("optionid: " + optionid);
                                console.log("audiencereach: " + audiencereach);
                                console.log("cost: " + cost);
                                var dataArray = [['OptionId', 'Audience Reach', 'Cost']];
                                for (var n = 0; n < allData.length; n++) {
                                    dataArray.push([optionid[n], audiencereach[n], cost[n]]);
                                }
                                console.log("dataArray: " + dataArray);
                                function drawStuff() {
                                    var data = new google.visualization.arrayToDataTable(dataArray);

                                    var options = {
                                        // width: 800,
                                        //height:800,
                                        bars: 'horizontal', // Required for Material Bar Charts.
                                        series: {
                                            0: { axis: 'audiencereach' }, // Bind series 0 to an axis named 'audiencereach'.
                                            1: { axis: 'cost' } // Bind series 1 to an axis named 'cost'.
                                        },
                                        axes: {
                                            x: {
                                                cost: { label: 'Cost' }, // Bottom x-axis.
                                                audiencereach: { side: 'top', label: 'Audience Reach' } // Top x-axis.
                                            }
                                        },
                                    };
                                    var chart = new google.charts.Bar(document.getElementById('dual_x_div'));
                                    chart.draw(data, options);
                                }
                            }
                        });


                        axios.get(`${baseUrl}/basic/result?optionIds=${requestBody.params.optionIds}&budget=${requestBody.params.budget}`) // Links to app.js
                            .then((response) => {
                                if(response.data.result.length == 0){
                                    document.getElementById('optionIdsInput').style.backgroundColor = "#FF4A31"; // Set background to red if invalid
                                    document.getElementById('budgetInput').style.backgroundColor = "#55FF3D"; // Set background to green if valid
                                    alert("Please enter optionIds that are valid!")
                                }else if(response.data.result.length == optionList.length){
                                    console.log("response.data: " + response);
                                    var people = 0;
                                    var maxAmount = 0;
                                    console.log(response.data.result);
                                    const tabulations = response.data.result;
                                    $("#tabulation").empty();
                                    tabulations.forEach((tabulation) => {
                                        const postHtml1 = `
                                    <div style="width: auto;" class="card" style="margin-top: 2rem;">
                                        <div style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);" class="card-body">
                                            <h5>${tabulation.payment} payment for option ${tabulation.optionId} from company ${tabulation.companyId}</h5>
                                            <p>$${tabulation.amount} -> ${tabulation.audienceReached.toFixed(3)}pax</p>
                                        </div>
                                    </div>
                                    `;
                                        $("#tabulation").append(postHtml1);
                                        people += parseFloat(tabulation.audienceReached.toFixed(3));
                                        // people = people.toFixed(3);
                                        maxAmount += parseFloat(tabulation.amount);
                                    });

                                    // console.log(Object.keys(response.data).length)
                                    $("#resultsArea").empty();
                                    const postHtml2 = `<h3>Result -> $ ${maxAmount} -> ${people} People</h3>`;
                                    $("#resultsArea").append(postHtml2);
                                    document.getElementById('optionIdsInput').style.backgroundColor = "#55FF3D"; // Set background to green if valid
                                    document.getElementById('budgetInput').style.backgroundColor = "#55FF3D"; // Set background to green if valid
                                }
                            });
                }
            }
        }
    });
    // On input change, return backgroundColor back to normal.
    $('#optionIdsInput').on('input', function (e) {
        document.getElementById('optionIdsInput').style.backgroundColor = null; // Set background back to normal
    });
    $('#budgetInput').on('input', function (e) {
        document.getElementById('budgetInput').style.backgroundColor = null; // Set background back to normal
    });
});