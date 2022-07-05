function locations_handler(editedData){
    // To make sure column A is filled : 
    var colA = !editedData.sheet.getRange(editedData.range.getRow(), 1).isBlank();
  
    // Request from client : Proceed when only colA is filled
    if(colA){
      createNewFolderInGoogleDrive(editedData.sheet, editedData.row);
      insertLocationFormulas(editedData.sheet, editedData.row);    
  
      signal_successfull_processing(editedData.sheet, editedData.row, settings().LocationDataAndColNum.remarkCol)
  
    }
  }
  
  function createNewFolderInGoogleDrive(sheet, row,) {
    var folderName = "FAC ";
    folderName += sheet.getRange(row, 1).getValue();
  
    var parentFolder = DriveApp.getFolderById(settings().workingDriveId);
    
    // check if folder already exist 
    if(parentFolder.getFoldersByName(folderName) && !sheet.getRange(row, 15).isBlank()){
      return
    }
  
    // Folder does not exist, proceed
    var newFolder = parentFolder.createFolder(folderName); // create folder
    var folderId =  newFolder.getId().toString(); //To get newly created folder Id
  
    var url = newFolder.getUrl();
    var file = cloneGoogleSheet('Location', folderId, sheet.getRange(row, 1).getValue(), null)
    var locGS = file.getUrl(); // URL of newly created Location Sheet
  
    var loc = SpreadsheetApp.openByUrl(locGS); //load Google Sheet
  
    var val = parseURL(locGS);
    sheet.getRange(row, 15).setValue(folderId);
    sheet.getRange(row, 16).setValue(url);
    sheet.getRange(row, 17).setValue(val[5]);
    sheet.getRange(row, 21).setValue(file.getUrl()); 
    var subSheets = loc.getSheets();
    var k = 18 // for looping thorugh the columns
    for(var i = 0; i< subSheets.length; i++)
    {
      var sheetId = subSheets[i].getSheetId();
      sheet.getRange(row, k).setValue(sheetId);
      k++;
    }
  }
  
  function insertLocationFormulas(sheet = SpreadsheetApp.getActiveSheet(), currRow) {
  
    // setting formulas
    var formulaE = "=A" + currRow + "";
    sheet.getRange(currRow, 5).setFormula(formulaE);
  
  }