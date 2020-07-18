// ADVANCED Results Viewer Script
// Name: Wong En Ting Kelyn
// Name: Teh Huan Xi Kester
// Class: DIT/FT/2B/01

const baseUrl = "http://localhost:3000";
$(document).ready(function () {
    $(document).on('click', '.computeBtn', function () { // On click compute button
        var optionIdsInput = document.getElementById("optionIdsInput").value; //Get option id input
        var budgetInput = document.getElementById("budgetInput").value; //Get budget input

        // Field Validation -> Needs Extra Checking
        if (optionIdsInput == '' && budgetInput == '') {
            document.getElementById('optionIdsInput').style.backgroundColor = "#FF4A31"; // Set background to red if invalid
            document.getElementById('budgetInput').style.backgroundColor = "#FF4A31"; // Set background to red if invalid
            alert("Please enter at least 2 optionIds and budget!");
        }
        else if (budgetInput == '') {
            document.getElementById('budgetInput').style.backgroundColor = "#FF4A31"; // Set background to red if invalid
            alert("Please enter a Budget!");
        }
        else if (optionIdsInput == '') {
            document.getElementById('optionIdsInput').style.backgroundColor = "#FF4A31"; // Set background to red if invalid
            alert("Please enter at least 2 optionsIds!");
        }
        else if (isNaN(budgetInput)) {
            document.getElementById('budgetInput').style.backgroundColor = "#FF4A31"; // Set background to red if invalid
            alert("Please enter a numeric value for Budget!");
        }
        else if (budgetInput <= 0) {
            document.getElementById('budgetInput').style.backgroundColor = "#FF4A31"; // Set background to red if invalid
            alert("Please enter a numeric value bigger than $0.00");
        }
        else if (optionIdsInput.search(",") == -1) {
            document.getElementById('optionIdsInput').style.backgroundColor = "#FF4A31"; // Set background to red if invalid
            alert("Please enter at least 2 optionIds, seperated by a comma!");
        }
        else {
            var optionList;
            optionList = optionIdsInput.toString().split(','); //optionList array
            if (optionList.length < 2) {
                document.getElementById('optionIdsInput').style.backgroundColor = "#FF4A31"; // Set background to red if invalid
                document.getElementById('budgetInput').style.backgroundColor = "#FF4A31"; // Set background to red if invalid
                alert("Please enter at least 2 optionIds and budget!");
            }
            else {
                var lengthCheck = [];
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
                }
                if (!lengthCheck.every(v => v == true)) {
                    alert("Please make sure your optionIds are exactly 10 digits each, and digits only!");
                }
                else {

                    console.log("optionIdsInput: " + optionIdsInput);
                    console.log("budgetInput: " + budgetInput);
                    const requestBody = {
                        params: {
                            optionIds: optionIdsInput,
                            budget: parseInt(budgetInput),
                        }
                    };
                    axios.get(`${baseUrl}/advance/allChartData`, requestBody) // Links to app.js
                        .then((response) => {
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

                                $("#tabulation").empty();

                                allData.forEach((tabulation) => {
                                    const postHtml1 = `
                                        <div id="${tabulation.optionid}" style="width: auto;" class="card" style="margin-top: 2rem" >
                                            <div style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2)" class="card-body">
                                                <h5>No payment for option ${tabulation.optionid} from company ${tabulation.companyid}</h5>
                                                <p>0 -> 0 pax</p>
                                            </div>
                                        </div>
                                    `;
                                    $("#tabulation").append(postHtml1);
                                    //id="${tabulation.optionid}" 
                                });
                            }

                            axios.get(`${baseUrl}/advance/result?optionIds=${requestBody.params.optionIds}&budget=${requestBody.params.budget}`) // Links to app.js
                                .then((response) => {
                                    console.log("response.data: " + response);
                                    var people = 0;
                                    var maxAmount = 0;
                                    console.log(response.data.result);
                                    const tabulations = response.data.result;

                                    tabulations.forEach((tabulation) => {
                                        var postHtml1 = `
                                    <div style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);" class="card-body">
                                        <h5>Full payment for option ${tabulation.optionId} from company ${tabulation.companyId}</h5>
                                        <p>$${tabulation.amount} -> ${tabulation.audienceReached}pax</p>
                                    </div>
                                    `;
                                        $(`#${tabulation.optionId}`).empty();
                                        $(`#${tabulation.optionId}`).append(postHtml1);

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

                                });
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