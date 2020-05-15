# Code Style

This documents helps to guide the look and feel of the code so that even when there are multiple developer, the style remains consistent. You may read more about it [here](https://javascript.info/coding-style).

## Style Guide

| Rules             | Choices                         |
| ----------------- | ------------------------------- |
| Case Styles       | camelCase/snake_case/PascalCase |
| Acronym Case      | IBM/Ibm/ibm                     |
| Indentation Style | Allman/1TBS                     |
| Indentation       | Tabs/Space                      |
| Indentation Space | 2/4 spaces                      |
| Semicolon         | Optional/Mandatory              |

### Chosen rules:
Case Styles - camelCase
Acronym Case - ibm
Indentation Style - 1TBS
Indentation - Tabs
Indentation Space - 2 spaces
Semicolon - Optional

## Examples

Based on your chosen rules, give an example of a code that follows the code style and an example of a code that does not follow the code style. The examples you give should cover all the above defined rule.

### Good Examples
### Indentation - tabs
<table id="theTable" class="responsive nowrap display table-bordered table-striped " style="width:100%">
    <thead>
        <tr>
            <th class="th-sm">Option ID</th>
            <th class="th-sm">Company ID</th>
            <th class="th-sm">Cost</th>
            <th class="th-sm">Audience reach</th>
            <th class="th-sm">AdType</th>
        </tr>
    </thead>
    <tbody class='myTable'></tbody>
</table>

### CaseStyle - camelCase
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
    axios.post(`${baseUrl}/basic/allData`, requestBody)
        .then((response) => {
            console.log("response: " + response)
            var data = response.data;
            table.clear();
            data.forEach((param) => {
                table.row.add(param).draw()
            });
        });
}

### Bad Examples
### Indentation - tabs
<table id="theTable" class="responsive nowrap display table-bordered table-striped " style="width:100%">
 <thead>
  <tr>
   <th class="th-sm">Option ID</th>
   <th class="th-sm">Company ID</th>
   <th class="th-sm">Cost</th>
   <th class="th-sm">Audience reach</th>
   <th class="th-sm">AdType</th>
  </tr>
 </thead>
 <tbody class='myTable'></tbody>
</table>

### CaseStyle - camelCase
function fillTable(table, filter_CompanyId, filter_Audience_Reach) {
    var pageNo = pagination_Index;
    var pageSize = table.page.info().length;
    const requestBody = {
        pageNo: page_No,
        pageSize: page_Size,
        //Specifically for filters
        companyId: filter_CompanyId,
        audienceReach: filter_Audience_Reach
    };
    axios.post(`${baseUrl}/basic/allData`, requestBody)
        .then((response) => {
            console.log("response: " + response)
            var data = response.data;
            table.clear();
            data.forEach((param) => {
                table.row.add(param).draw()
            });
        });
}