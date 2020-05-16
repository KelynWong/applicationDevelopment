// Data Viewer Script
// Name: Wong En Ting Kelyn
// Name: Teh Huan Xi Kester
// Class: DIT/FT/2B/01

//Basically the flow:
// 1. GET the number of rows from the table and set up pagination based off Page Size(Default 5)
// 2. Retrieve data from table based off Page Size(Default 5) and Page Number(Default 1). 
// - Since its the first page, no offset is needed, thus the algorithm makes the offset 0.
// 3. After that, it comes down to user interaction.
// 4. If the next, previous buttons are pressed:
// - 1) Increment/Decrease the paginationIndex based on what was clicked.
// - 2) Modify the class name of buttons so that the button represented by the paginationIndex("tabindex is checked!")
//      will be modified css wise.
// - 3) "Change the page" by deleting table data and POST to get data from table(This uses the same exact algorithm as step 2 in flow.)
//      - Utilises offset and limit to get the data needed for the respective page!
// 5. If the number buttons are pressed:
// - Vice versa as to 4, but paginationIndex is changed to the button's respective index.
// 6. If the filter button is clicked with parameters, the parameters are parsed into the pagination + fill table algorithms
//    work their magic with the parsed params. (If no params, it'll load all data as usual) 
// 7. When the clear button is clicked, all parameters saved in script will be reset and the default will be loaded.
// That should be all!
var paginationIndex = 0; //0 being the first page
var startingNumber = 0; //For entries algo.
var endingNumber = 0; //For entries algo.
const baseUrl = "http://localhost:3000";
var filterCompanyId = "";
var filterAudienceReach = "";
// Pagination algorithm:
function paginationAlgorithm(table, filterCompanyId, filterAudienceReach) {
    var openingTag = '<a class="paginateButton" id="generatedButton" tabindex="';
    var middleTag = '">';
    var closingTag = '</a>';
    var elipsis = '<a class="ellipsis">…</a>';
    var pageSize = table.page.info().length;
    const requestBody = {
        companyId: filterCompanyId,
        audienceReach: filterAudienceReach
    };
    axios.post(`${baseUrl}/extra/getRowCount`, requestBody)
        .then((response) => {
            var parse = response.data[0].count;
            var final = Math.ceil(parse / pageSize - 1); //This gets the max page (in index form)
            $(".pageNumbers").empty(); //Empties the class so it can append and work its magic
            $(".finalPageNumber").empty();
            console.log(parse);
            if (final <= 4 && final != 0) { //If total pages is lesser than 5. (No need for ellipsis)
                for (i = 0; i <= final; i++) {
                    $(".pageNumbers").append(openingTag + (i) + middleTag + (i + 1) + closingTag);
                }
            }
            else if (final == 0) { //If total pages is just 1.
                $(".pageNumbers").append(openingTag + (0) + middleTag + (1) + closingTag);
            }
            // Pagination responsiveness (Here comes the ellipsis!)
            else if (paginationIndex < 3) { // If page index is smaller than index 3(page4)
                for (i = 0; i <= 4; i++) {
                    $(".pageNumbers").append(openingTag + (i) + middleTag + (i + 1) + closingTag);
                }
                $(".finalPageNumber").append(elipsis + openingTag + (final) + middleTag + (final + 1) + closingTag);
            }
            else if (paginationIndex < final - 2) { //If page index is smaller than the (last page - 2) - This results in the selected page to be inbetween 2 numbers.
                for (i = paginationIndex - 2; i <= paginationIndex + 2; i++) {
                    $(".pageNumbers").append(openingTag + (i) + middleTag + (i + 1) + closingTag);
                }
                $(".finalPageNumber").append(elipsis + openingTag + (final) + middleTag + (final + 1) + closingTag);
            } else { // When the page index is nearing its final destination.
                for (i = final - 5; i <= final - 1; i++) {
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
                for (i = 0; i < pageSize - 1; i++) {
                    endingNumber += 1;
                }
                endingNumber += startingNumber;
            }
            $("#tableControls").prepend(`<div class="entriesArea" id="entriesArea" role="status" aria-live="polite">Showing ${startingNumber} to ${endingNumber} of ${parse} entries</div>`);
            endingNumber = 0;
        });
}

// Table filling algorithm:
function fillTable(table, filterCompanyId, filterAudienceReach) {
    var pageNo = paginationIndex;
    var pageSize = table.page.info().length;
    const requestBody = {
        pageNo: pageNo,
        pageSize: pageSize,
        //Specifically for filters
        companyId: filterCompanyId,
        audienceReach: filterAudienceReach
    };
    axios.post(`${baseUrl}/basic/Alldata`, requestBody)
        .then((response) => {
            console.log("response: " + response);
            var data = response.data;
            table.clear().draw();
            data.forEach((param) => {
                table.row.add(param).draw();
            });
        });
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
        "lengthMenu": [[5, 10, 20, 30, 40, 50, -1], [5, 10, 20, 30, 40, 50, "All"]]
    });

    // Pagination Algorithm that handles pagination and the entries shown.
    paginationAlgorithm(table, filterCompanyId, filterAudienceReach);
    // Retrieve ROW DATA from database based on limit(pageSize) and offset(pageNo * pageSize) values.
    fillTable(table, filterCompanyId, filterAudienceReach);

    // Click stuff:
    // Onclick PREVIOUS button
    $(document).on('click', '#theTablePrevious', function () {
        if (paginationIndex != 0) {
            paginationIndex -= 1;
            // Pagination algorithm:
            paginationAlgorithm(table, filterCompanyId, filterAudienceReach);
            // Get data from table
            fillTable(table, filterCompanyId, filterAudienceReach);
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
            paginationAlgorithm(table, filterCompanyId, filterAudienceReach);
            fillTable(table, filterCompanyId, filterAudienceReach);
        }
    });

    // Onclick pagination number.
    $(document).on('click', '#generatedButton', function () {
        var pageNumberClicked = ($(this).closest(".paginateButton"));
        paginationIndex = pageNumberClicked[0].tabIndex;
        paginationAlgorithm(table, filterCompanyId, filterAudienceReach);
        fillTable(table, filterCompanyId, filterAudienceReach);
    });

    // Onclick filter button.
    $(document).on('click', '.filterBtn', function () {
        filterCompanyId = document.getElementById("companyIdInput").value;
        filterAudienceReach = document.getElementById("audienceReachInput").value;
        if (!filterCompanyId && !filterAudienceReach) {
            alert("Please enter company Id or Audience reach or both!");
        } else {

            if (isNaN(filterCompanyId) == false && isNaN(filterAudienceReach) == false || isNaN(filterCompanyId) == false && filterAudienceReach == '') {

                if (filterCompanyId % 1 != 0) {
                    filterCompanyId = '';
                    alert("Company Id has to be a 10 digit number! Not a decimal!");
                }
                if (filterAudienceReach % 1 != 0) {
                    filterAudienceReach = '';
                    alert("Audience reach has to be a 10 digit number! Not a decimal!");
                }
                else if (filterCompanyId.length == 10 || filterCompanyId == '') {
                    filterCompanyId = Math.abs(filterCompanyId);
                    filterAudienceReach = Math.abs(filterAudienceReach);
                    paginationAlgorithm(table, filterCompanyId, filterAudienceReach);
                    fillTable(table, filterCompanyId, filterAudienceReach);
                }
                else {
                    filterCompanyId = '';
                    alert("Company Id has to be a 10 digit number!");
                }
            } else {
                if (isNaN(filterCompanyId)) {
                    filterCompanyId = '';
                    alert("Company Id has to be a number!");
                }
                else if (filterCompanyId.length != 10) {
                    filterCompanyId = '';
                    alert("Company Id has to be a 10 digit number!");
                }
                if (isNaN(filterAudienceReach)) {
                    filterAudienceReach = '';
                    alert("Audience reach has to be a number!");
                }
            }
        }
    });

    // Onclick clear button.
    $(document).on('click', '.clearBtn', function () {
        document.getElementById("companyIdInput").value = "";
        document.getElementById("audienceReachInput").value = "";
        filterCompanyId = "";
        filterAudienceReach = "";
        paginationAlgorithm(table, filterCompanyId, filterAudienceReach);
        fillTable(table, filterCompanyId, filterAudienceReach);
        $(".paginateButton[tabindex='" + 0 + "']").click();
        paginationIndex = 0;
    });

    // On change of pageSize - [The show (how many) entries part]
    $("[name='theTable_length'").change(function () {
        paginationAlgorithm(table, filterCompanyId, filterAudienceReach);
        fillTable(table, filterCompanyId, filterAudienceReach);
        paginationIndex = 0; //Sets back to page 1.(Highly important)
        $(".paginateButton[tabindex='" + 0 + "']").click();
    });
});