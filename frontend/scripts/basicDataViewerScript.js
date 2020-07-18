// BASIC Data Viewer Script
// Name: Wong En Ting Kelyn
// Name: Teh Huan Xi Kester
// Class: DIT/FT/2B/01

// Forcing sequential execution:
// https://stackoverflow.com/questions/1859185/how-to-force-sequential-javascript-execution
// function myfunction() {
//     longfunctionfirst(shortfunctionsecond());
// }
// function longfunctionfirst(callback) {
//     // setTimeout(function() {
//         alert('first function finished');
//         if(typeof callback == 'function')
//             callback();
//     // }, 1);
// };

// function shortfunctionsecond() {
//     setTimeout('alert("second function finished");', 200);
// };
// myfunction();
var paginationIndex = 0; //0 being the first page
var startingNumber = 0; //For entries algo.
var endingNumber = 0; //For entries algo.

const baseUrl = "http://localhost:3000";
var filterCompanyId = "";
var filterAudienceReach = "";
// Pagination algorithm:
function paginationAlgorithm(table, filterCompanyId, filterAudienceReach, callback) { // callback calls the next function(fill table) to run after function complete.
    var openingTag = '<a class="paginateButton" id="generatedButton" tabindex="';
    var middleTag = '">';
    var closingTag = '</a>';
    var elipsis = '<a class="ellipsis">…</a>';
    var pageSize = table.page.info().length;
    const requestBody = {
        params: {
            companyId: filterCompanyId,
            audienceReach: filterAudienceReach
        }
    };

    axios.get(`${baseUrl}/basic/getRowCount`, requestBody)
        .then((response) => {
            console.log("Current Index:" + paginationIndex);
            var parse = response.data[0].count;
            var final = Math.ceil(parse / pageSize - 1); //This gets the max page (in index form)
            $(".pageNumbers").empty(); //Empties the class so it can append and work its magic
            $(".finalPageNumber").empty();

            if (final <= 4 && final != 0) { //If total pages is lesser than 5. (No need for ellipsis)
                for (let i = 0; i <= final; i++) {
                    $(".pageNumbers").append(openingTag + (i) + middleTag + (i + 1) + closingTag);
                }
            }
            else if (final == 0) { //If total pages is just 1.
                $(".pageNumbers").append(openingTag + (0) + middleTag + (1) + closingTag);
            }
            // Pagination responsiveness (Here comes the ellipsis!)
            else if (paginationIndex < 3) { // If page index is smaller than index 3(page4)
                for (let i = 0; i <= 4; i++) {
                    $(".pageNumbers").append(openingTag + (i) + middleTag + (i + 1) + closingTag);
                }
                $(".finalPageNumber").append(elipsis + openingTag + (final) + middleTag + (final + 1) + closingTag);
            }
            else if (paginationIndex < final - 2) { //If page index is smaller than the (last page - 2) - This results in the selected page to be inbetween 2 numbers.
                for (let i = paginationIndex - 2; i <= paginationIndex + 2; i++) {
                    $(".pageNumbers").append(openingTag + (i) + middleTag + (i + 1) + closingTag);
                }
                $(".finalPageNumber").append(elipsis + openingTag + (final) + middleTag + (final + 1) + closingTag);
            } else { // When the page index is nearing its final destination.
                for (let i = final - 5; i <= final - 1; i++) {
                    $(".pageNumbers").append(openingTag + (i) + middleTag + (i + 1) + closingTag);
                }
                $(".finalPageNumber").append(elipsis + openingTag + (final) + middleTag + (final + 1) + closingTag);
            }
            // Can't forget the visual representation!
            $(".paginateButton[tabindex='" + paginationIndex + "']").attr('class', 'paginateButton current');
            $(".paginateButton[tabindex='" + (paginationIndex + 1) + "']").attr('class', 'paginateButton');

            // Entries per page algo.
            $(".entriesArea").remove();
            startingNumber = 1 + paginationIndex * pageSize;
            if (paginationIndex == final) {
                endingNumber = parse;
            }
            else {
                for (let i = 0; i < pageSize - 1; i++) {
                    endingNumber += 1;
                }
                endingNumber += startingNumber;
            }
            $("#tableControls").prepend(`<div class="entriesArea" id="entriesArea" role="status" aria-live="polite">Showing ${startingNumber} to ${endingNumber} of ${parse} entries</div>`);
            endingNumber = 0;
            callback(table, filterCompanyId, filterAudienceReach); //Initiates fillTable()
        });
}

// Table filling algorithm:
function fillTable(table, filterCompanyId, filterAudienceReach) {
    var pageNo = paginationIndex;
    var pageSize = table.page.info().length;
    console.log("filtercompanyid:" + filterCompanyId);
    const requestBody =
    {
        params:
        {
            pageNo: pageNo,
            pageSize: pageSize,
            //Specifically for filters
            companyId: filterCompanyId,
            audienceReach: filterAudienceReach
        }
    };
    //Clear and redraw first in the case of error 404.(If sql returns no result.)
    table.clear().draw();
    axios.get(`${baseUrl}/basic/allData`, requestBody)
        .then((response) => {
            var data = response.data;
            table.clear().draw();
            data.forEach((param) => {
                table.row.add(param).draw();
            });
        });
}

function checkCompanyId() {
    console.log("Running check 1");
    if (filterCompanyId) {
        if (isNaN(filterCompanyId) == true) {
            filterCompanyId = '';
            document.getElementById('companyIdInput').style.backgroundColor = "#FF4A31"; // Set background to red if invalid
            alert("Company Id has to be a 10 digit number!");
        } else if (filterCompanyId % 1 != 0) {
            filterCompanyId = '';
            document.getElementById('companyIdInput').style.backgroundColor = "#FF4A31"; // Set background to red if invalid
            alert("Company Id has to be a 10 digit number! Not a decimal!");
        } else if (filterCompanyId.length != 10) {
            filterCompanyId = '';
            document.getElementById('companyIdInput').style.backgroundColor = "#FF4A31"; // Set background to red if invalid
            alert("Company Id has to be a 10 digit number!");
        }
        else {
            filterCompanyId = Math.abs(filterCompanyId);
        }
    }
}

function checkAudienceReach() {
    console.log("Running check 2");
    if (filterAudienceReach) {
        // If filterAudienceReach exists
        if (isNaN(filterAudienceReach) == true) {
            filterAudienceReach = '';
            document.getElementById('audienceReachInput').style.backgroundColor = "#FF4A31"; // Set background to red if invalid
            alert("Audience reach has to be a numeric number!");
        } else if (filterAudienceReach % 1 != 0) {
            filterAudienceReach = '';
            document.getElementById('audienceReachInput').style.backgroundColor = "#FF4A31"; // Set background to red if invalid
            alert("Audience reach has to be a numeric number! Not a decimal!");
        } else {
            filterAudienceReach = Math.abs(filterAudienceReach);
            // paginationAlgorithm(table, filterCompanyId, filterAudienceReach, filterCost, fillTable);
        }
    }
}

//Every single script will only run once the DOM is ready!
$(document).ready(function () {
    var table = $('#theTable').DataTable({ //Renamed the table to literally, theTable.
        "columns": [
            { data: 'optionid' },
            { data: 'companyid' },
            { data: 'cost' },
            { data: 'audiencereach' },
            { data: 'adtype' },
        ],
        "scrollX": true,
        "scrollY": "50vh",
        "scrollCollapse": true,
        responsive: true,
        // The DOM model for the table are only modeled at t,l.
        // Legend~
        // l - length
        // t - table 
        // <> - div elements   
        // <"#id" > -div with an id 
        // <"class" > div with a class
        // <"#id.class" div with an id and class
        dom: '<"#tableContainer"<"#tableArea"t><"#tableControls"l>>',
        // Only tableArea will have flex, tableControls won't. Thus the written DOM.
        "lengthMenu": [[5, 10, 20, 30, 40, 50], [5, 10, 20, 30, 40, 50]]
    });

    // Pagination Algorithm that handles pagination and the entries shown.
    // Then, Retrieve ROW DATA from database based on limit(pageSize) and offset(pageNo * pageSize) values.
    paginationAlgorithm(table, filterCompanyId, filterAudienceReach, fillTable);


    // Click stuff:
    // Onclick PREVIOUS button
    $(document).on('click', '#theTablePrevious', function () {
        if (paginationIndex != 0) {
            paginationIndex -= 1;
            // Do the Pagination algorithm first, then do the Fill Table algorithm.
            paginationAlgorithm(table, filterCompanyId, filterAudienceReach, fillTable);
        }
    });

    // Onclick NEXT button
    $(document).on('click', '#theTableNext', function () {
        var array = []; //the TabIndex of paginateButtons generated are taken in to get the highest index
        var lastPage;
        $(".paginateButton").each(function () {
            array.push(parseInt($(this).attr('tabIndex')));
        });
        lastPage = Math.max(...array);
        if (paginationIndex < lastPage) {
            paginationIndex += 1;
            paginationAlgorithm(table, filterCompanyId, filterAudienceReach, fillTable);
            // fillTable(table, filterCompanyId, filterAudienceReach, false);
        }
    });

    // Onclick pagination number.
    $(document).on('click', '#generatedButton', function () {
        var pageNumberClicked = ($(this).closest(".paginateButton"));
        paginationIndex = pageNumberClicked[0].tabIndex;
        paginationAlgorithm(table, filterCompanyId, filterAudienceReach, fillTable);
        // fillTable(table, filterCompanyId, filterAudienceReach, false);
    });

    // Onclick filter button.
    $(document).on('click', '.filterBtn', function () {
        paginationIndex = 0; //Sets back to page 1.(Highly important)
        document.getElementById('companyIdInput').style.backgroundColor = null; // Set background back to normal
        document.getElementById('audienceReachInput').style.backgroundColor = null; // Set background back to normal
        filterCompanyId = document.getElementById("companyIdInput").value;
        filterAudienceReach = document.getElementById("audienceReachInput").value;

        // Validation:
        // First check if the params are actually empty, then do respective validation.
        // If the param checks out(Basically not empty), parse in the filter param.
        if (!filterCompanyId && !filterAudienceReach) {
            document.getElementById('companyIdInput').style.backgroundColor = "#FF4A31"; // Set background to red if invalid
            document.getElementById('audienceReachInput').style.backgroundColor = "#FF4A31"; // Set background to red if invalid

            alert("Fill in at least one of the parameters!(CompanyId, Audience reach)");
        } else {
            checkCompanyId();
            checkAudienceReach();

            paginationAlgorithm(table, filterCompanyId, filterAudienceReach, fillTable);
            if (filterCompanyId != '') {
                document.getElementById('companyIdInput').style.backgroundColor = "#55FF3D"; // Set background to green if valid
            }
            if (filterAudienceReach != '') {
                document.getElementById('audienceReachInput').style.backgroundColor = "#55FF3D"; // Set background to green if valid
            }
        }
    });

    // Onclick clear button.
    $(document).on('click', '.clearBtn', function () {
        document.getElementById("companyIdInput").value = "";
        document.getElementById("audienceReachInput").value = "";
        filterCompanyId = "";
        filterAudienceReach = "";
        paginationIndex = 0;
        paginationAlgorithm(table, filterCompanyId, filterAudienceReach, fillTable);
        document.getElementById('companyIdInput').style.backgroundColor = null; // Set background back to normal
        document.getElementById('audienceReachInput').style.backgroundColor = null; // Set background back to normal
        $(".paginateButton[tabindex='" + 0 + "']").click();
    });

    // On change of pageSize - [The show (how many) entries part]
    $("[name='theTable_length'").change(function () {
        paginationIndex = 0; //Sets back to page 1.(Highly important)
        paginationAlgorithm(table, filterCompanyId, filterAudienceReach, fillTable);
        $(".paginateButton[tabindex='" + 0 + "']").click();
    });

    // On input change, return backgroundColor back to normal.
    $('#companyIdInput').on('input', function (e) {
        document.getElementById('companyIdInput').style.backgroundColor = null; // Set background back to normal
    });
    $('#audienceReachInput').on('input', function (e) {
        document.getElementById('audienceReachInput').style.backgroundColor = null; // Set background back to normal
    });
});