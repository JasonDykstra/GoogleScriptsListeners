// Date variables
var year = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy");
var month = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "MMMM").toUpperCase();
var day = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd");

// Get sheet associated with current year
var sheet = SpreadsheetApp.openById("hidden").getSheetByName(year);

// Define background colors associated with each type of day
var colorDict = {
    "none": "#d6dce4",
    "gym": "yellow",
    "comp": "cyan",
    "outdoors": "magenta",
    "sick": "red",
    "sick but climbed": "orange",
    "obligation": "dark grey 3"
};

// Function that executes when an apple shortcut request is sent
function doGet(e) {

    // Grab the category from the apple shortcut
    var category = JSON.parse(e.parameters.category)

    // Get cell locations of current month and day
    var monthLocation = findMonth(month);
    var dayLocation = findDay(day, monthLocation);

    // Change the current day's background color to its proper color defined by the dictionary
    sheet.getRange(dayLocation[0], dayLocation[1]).setBackground(colorDict[category]);
}

// Searches sheet for row and col of specified month name
function findMonth(month) {
    var findData = month
    var searchData = sheet.getDataRange().getValues();

    for(var j=0, jLen=searchData.length; j<jLen; j++) {
        for(var k=0, kLen=searchData[0].length; k<kLen; k++) {
            if(findData == searchData[j][k]) {
                return([(j+1), (k+1)]);
            }
        }
    }
}

// Searches hard-coded area around month cell to find row and col of specified day
// To search around month: monthCol/x +- 3, monthRow/y + 2-7
function findDay(day, monthLocation){
    var findData = day;

    var monthRow = monthLocation[0];
    var monthCol = monthLocation[1];

    // Offset from 0,0 in the search Values array, if upper left corner of month box was 0,0
    var monthRowOffset = 2;
    var monthColOffset = -3;

    var searchRange = sheet.getRange(monthRow + 2, monthCol - 3, monthRow + 7, monthCol + 3);
    // Values of cells in search range, in this case the day numbers
    var searchValues = searchRange.getValues();

    // Find the absolute row and col of the cell that matches the specified day
    for(var row = 0; row < searchRange.getWidth(); row++){
        for(var col = 0; col < searchRange.getHeight(); col++){
            if(searchValues[row][col] == findData){
                return([row + monthRow + monthRowOffset, col + monthCol + monthColOffset]);
            }
        }
    }

}