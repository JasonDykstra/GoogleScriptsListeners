// Date
var dateFormat = "M/d/yyyy";
var date = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), dateFormat);

// Get mood tracker sheet
var ss = SpreadsheetApp.openById("hidden");
var sheet = ss.getSheetByName("Tracker");

// Dictionary to keep track of which column is what
var colDict = {
  "date": 1,
  "mood": 2,
  "comments": 3
};

// Function that executes when an apple shortcut request is sent
function doGet(e){
  var day = JSON.parse(e.parameters.day);
  var mood = JSON.parse(e.parameters.mood);
  var comments = JSON.parse(e.parameters.comments);
  
  // Check if day to modify is today or yesterday
  if (day == "yesterday"){
    date = getYesterday();
  }

  var row = findDate(date);

  // Set the mood rating and comments
  sheet.getRange(row, colDict["mood"]).setValue(mood);
  sheet.getRange(row, colDict["comments"]).setValue(comments);
}

// Finds the row of the given date
// Searches the date column
function findDate(date){
  var searchString = date;
  var column = colDict["date"]; //column Index   
  var columnValues = sheet.getRange(2, column, 162, column).getValues(); //1st is header row

  for(var i = 0; i < columnValues.length; i++){
    // Format the date so it's the same as the format of the date we are looking for
    // This part took me like an hour to figure out, dates in scripts vs apps are different, just don't touch it
    var formattedDate = Utilities.formatDate(new Date(columnValues[i][0]), ss.getSpreadsheetTimeZone(), dateFormat);
    if(formattedDate == searchString){
      return (i + 2);
    }
  }
}

// Subtract 24 hours to get the previous day
function getYesterday(){
  var result = new Date().getTime()-1*(24*3600*1000);
  var formattedResult = Utilities.formatDate(new Date(result), ss.getSpreadsheetTimeZone(), dateFormat);
  return formattedResult;
}