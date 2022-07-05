function affiliates_handler(editedData){
    var file;
    //To make sure columns B & C are filled
    var colA = !editedData.sheet.getRange(editedData.range.getRow(), settings().AffiliatesDataAndColNum.LxID).isBlank();
    var colB = !editedData.sheet.getRange(editedData.range.getRow(), settings().AffiliatesDataAndColNum.fac_id).isBlank();
    var colC = !editedData.sheet.getRange(editedData.range.getRow(), settings().AffiliatesDataAndColNum.ref_id).isBlank();
    var colD = !editedData.sheet.getRange(editedData.range.getRow(), settings().AffiliatesDataAndColNum.ref_b).isBlank();
    var colE = !editedData.sheet.getRange(editedData.range.getRow(), settings().AffiliatesDataAndColNum.ref_am).isBlank();

    
    if(colA && colB && colC){

      var payoutDays = compareLocAndAff(editedData.row); // Also handles copying of location data to Affiliates sheet
      
      var file = cloneGoogleSheet('Affiliation', editedData.sheet.getRange(editedData.row, 32).getValue(), editedData.sheet.getRange(editedData.row, 1).getValue(), editedData.sheet.getRange(editedData.row, 2).getValue());
      insertAffiliateTemplateValues(file.getUrl(), editedData.row, editedData.sheet, payoutDays); // Populates Affiliates data 
      
      var locationSubAffiliateSheetId = editedData.sheet.getRange(editedData.range.getRow(), settings().AffiliatesDataAndColNum.locationSubAffiliateSheetCol).getValue()
      var affiliateSubAffiliateSheetId = editedData.sheet.getRange(editedData.range.getRow(), settings().AffiliatesDataAndColNum.affiliateSubAffiliateSheetCol).getValue()
      
      var locationSheetUrl = editedData.sheet.getRange(editedData.row, 38).getValue()
      var affiliatesSheetUrl = editedData.sheet.getRange(editedData.row, 43).getValue()
      
      var copyOfRowWithMatchingLxID = editedData.sheet.getRange(editedData.range.getRow(), 1,1,editedData.sheet.getLastColumn()).getA1Notation()
      
      var foreignLocationSpreadsheet = SpreadsheetApp.openByUrl(locationSheetUrl); 
      var foreignAffiliatesSpreadsheet = SpreadsheetApp.openByUrl(affiliatesSheetUrl); 
      
      var exportCellsLocatnSpreadsheet = true
      var exportCellsaffiliatesSpreadsheet = true
      insertAffiliateFormulas(editedData.sheet, editedData.row);    
      

      copyOfRowWithMatchingLxID = editedData.sheet.getSheetName() + '!' + copyOfRowWithMatchingLxID

      // before linking cell, check if there is already a link
      var location_affiliateSubSheets = foreignLocationSpreadsheet.getSheets()      
      location_affiliateSubSheets.forEach((sheet)=>{
        if(sheet.getSheetId() === parseInt(locationSubAffiliateSheetId)){
          for(var i = 1; i<= sheet.getLastRow(); i++){
            if(editedData.sheet.getRange(editedData.row, 2).getValue() == sheet.getRange(i,2).getValue()){
              exportCellsLocatnSpreadsheet = false
            }
          }
        }
      })
      if(exportCellsLocatnSpreadsheet){
        linkCells(SpreadsheetApp.getActiveSpreadsheet(), copyOfRowWithMatchingLxID, locationSheetUrl, locationSubAffiliateSheetId)
      }

      var affiliates_affiliateSubSheets = foreignAffiliatesSpreadsheet.getSheets()
      affiliates_affiliateSubSheets.forEach((sheet)=>{
        if(sheet.getSheetId() === parseInt(affiliateSubAffiliateSheetId)){
          for(var i = 1; i<= sheet.getLastRow(); i++){
            if(editedData.sheet.getRange(editedData.row, 2).getValue() == sheet.getRange(i,2).getValue()){
              exportCellsaffiliatesSpreadsheet = false
            }
          }
        }
      })

      if(exportCellsaffiliatesSpreadsheet){
        linkCells(SpreadsheetApp.getActiveSpreadsheet(), copyOfRowWithMatchingLxID, affiliatesSheetUrl, affiliateSubAffiliateSheetId)
      }

      if(colD){
        for(var i = 2; i<= editedData.sheet.getLastRow(); i++){
          if(editedData.sheet.getRange(i,3).getValue() === editedData.sheet.getRange(editedData.row, 4).getValue()){

            var destinationAffiliatesSheetUrl = editedData.sheet.getRange(i, 43).getValue()
            foreignAffiliatesSpreadsheet = SpreadsheetApp.openByUrl(destinationAffiliatesSheetUrl);
            destinationAffiliates_affiliateSubSheets = foreignAffiliatesSpreadsheet.getSheets() 
          
            destinationAffiliates_affiliateSubSheets.forEach((sheet)=>{
              if(sheet.getSheetId() === parseInt(affiliateSubAffiliateSheetId)){
                for(var i = 1; i<= sheet.getLastRow(); i++){
                  if(editedData.sheet.getRange(editedData.row, 2).getValue() == sheet.getRange(i,2).getValue()){
                    exportCellsaffiliatesSpreadsheet = false
                  }
                }
              }
            })

            if(exportCellsaffiliatesSpreadsheet){
              linkCells(SpreadsheetApp.getActiveSpreadsheet(), copyOfRowWithMatchingLxID, destinationAffiliatesSheetUrl, affiliateSubAffiliateSheetId)
            }

          }
        }
      }

      if(colE){
        for(var i = 2; i<= editedData.sheet.getLastRow(); i++){
          if(editedData.sheet.getRange(i,3).getValue() === editedData.sheet.getRange(editedData.row, 5).getValue()){

            var destinationAffiliatesSheetUrl = editedData.sheet.getRange(i, 43).getValue()
            foreignAffiliatesSpreadsheet = SpreadsheetApp.openByUrl(destinationAffiliatesSheetUrl);
            destinationAffiliates_affiliateSubSheets = foreignAffiliatesSpreadsheet.getSheets() 
          
            destinationAffiliates_affiliateSubSheets.forEach((sheet)=>{
              if(sheet.getSheetId() === parseInt(affiliateSubAffiliateSheetId)){
                for(var i = 1; i<= sheet.getLastRow(); i++){
                  if(editedData.sheet.getRange(editedData.row, 2).getValue() == sheet.getRange(i,2).getValue()){
                    exportCellsaffiliatesSpreadsheet = false
                  }
                }
              }
            })

            if(exportCellsaffiliatesSpreadsheet){
              linkCells(SpreadsheetApp.getActiveSpreadsheet(), copyOfRowWithMatchingLxID, destinationAffiliatesSheetUrl, affiliateSubAffiliateSheetId)
            }

          }
        }
      }

      signal_successfull_processing(editedData.sheet, editedData.row, settings().AffiliatesDataAndColNum.remarkCol)
        
    }

}

function compareLocAndAff(currRow){  
  var sheetAff = getSheetById(settings().AffiliatesSheetId)
  var sheetLoc = getSheetById(settings().LocationSheetId)
  var payoutDays;

  for(var i = 1; i<= sheetLoc.getLastRow(); i++)
  {
    
    // check if LxID in Affiliates and Location sheet matches
    var check = sheetAff.getRange(currRow,settings().AffiliatesDataAndColNum.LxID).getValue() == sheetLoc.getRange(i,settings().LocationDataAndColNum.LxID).getValue(); 

    if(check){
      
      sheetAff.getRange(currRow,32 ,1, 7).setValues(sheetLoc.getRange(i,15, 1, 7).getValues());
      payoutDays = sheetLoc.getRange(i,4).getValue();

      break;
    }
  }
  return payoutDays;
}

function insertAffiliateTemplateValues(affGS, currRow, sheet, payoutDay){
    var aff = SpreadsheetApp.openByUrl(affGS);
    var sheetID = parseURL(affGS);
    var subSheets = aff.getSheets();
    sheet.getRange(currRow, 39).setValue(sheetID[5]);
    sheet.getRange(currRow, 40).setValue(subSheets[0].getSheetId());
    sheet.getRange(currRow, 41).setValue(subSheets[1].getSheetId());
    sheet.getRange(currRow, 42).setValue(subSheets[2].getSheetId());
    sheet.getRange(currRow, 43).setValue(affGS); // URL of newly created sheet
    sheet.getRange(currRow, 8).setValue(payoutDay);
}

function linkCells(fromSheet, rangeToImport, toSheetUrl, sheetId){
  var url = fromSheet.getUrl();
  var importString = '=IMPORTRANGE("' + url + '","' + rangeToImport + '")';

  var gSheet = SpreadsheetApp.openByUrl(toSheetUrl); 

  var sheets = gSheet.getSheets()

  sheets.forEach((sheet)=>{
    if(sheet.getSheetId() === parseInt(sheetId)){
      var rowNum = sheet.getLastRow() + 1;
      sheet.getRange(rowNum,1).setValue(importString);
    }

  })
}

function insertAffiliateFormulas(sheet = SpreadsheetApp.getActiveSheet(), currRow) {

  // setting formulas
  var formulaI = "=$C" + currRow + "";
  sheet.getRange(currRow, 9).setFormula(formulaI);


}