function signal_successfull_processing(sheet, row, col){
  sheet.getRange(row, col).setValue('Processed');
}

function cloneGoogleSheet(str, folderId, location_id, fac_id) {
  var destFolder = DriveApp.getFolderById(folderId); 
  var file; 

  if(str === 'Location'){
    var filename = 'FAC | '+ location_id
    if(destFolder.getFilesByName(filename).hasNext()){
      file = destFolder.getFilesByName(filename).next()
    }else{
      file = DriveApp.getFileById(settings().templateId).makeCopy(filename, destFolder);
    }
  }else{
    var filename = 'FAC | '+ location_id +' | '+ fac_id +''
    if(destFolder.getFilesByName(filename).hasNext()){
      file = destFolder.getFilesByName(filename).next()
    }else{
      file = DriveApp.getFileById(settings().templateId).makeCopy(filename, destFolder); 
    }
  }  
  return file;
}


function getSheetById(id) {
  var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();

  return sheets.filter(function(sheet) {
    return sheet.getSheetId() === parseInt(id);
  })[0];
}

function parseURL (url){
  var array =  url.split("/");
  return array;
}

function linkCells(fromSpreadsheet, rangeToImport, toSheetUrl, sheetId){
  var url = fromSpreadsheet.getUrl();
  var importString = '=IMPORTRANGE("' + url + '","' + rangeToImport + '")';

  var gSheet = SpreadsheetApp.openByUrl(toSheetUrl); 

  var sheets = gSheet.getSheets()

  var donorSpreadsheetID = fromSpreadsheet.getId()
  var receiverSpreadsheetID = gSheet.getId()
  
  addImportrangePermission(donorSpreadsheetID, receiverSpreadsheetID)


  sheets.forEach((sheet)=>{
    if(sheet.getSheetId() === parseInt(sheetId)){
        var rowNum = sheet.getLastRow() + 1;
        sheet.getRange(rowNum,1).setValue(importString);
    }

  })
}

function addImportrangePermission(donorSpreadsheetID, receiverSpreadsheetID) {
  // id of the spreadsheet to add permission to import
  const ssId = receiverSpreadsheetID;

  // donor or source spreadsheet id, you should get it somewhere
  const donorId = donorSpreadsheetID;

  // adding permission by fetching this url
  const url = `https://docs.google.com/spreadsheets/d/${ssId}/externaldata/addimportrangepermissions?donorDocId=${donorId}`;

  const token = ScriptApp.getOAuthToken();

  const params = {
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + token,
    },
    muteHttpExceptions: true
  };
  
  try{
    UrlFetchApp.fetch(url, params);
    return true
  }catch(e){
    Logger.log(e)
  }
}