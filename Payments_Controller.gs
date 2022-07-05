function payments_handler(editedData){
  
    // Get status of Col C - K in case it is needed
    var isColABlank = !editedData.sheet.getRange(editedData.range.getRow(), settings().PaymentLogDataAndColNum.LxID).isBlank(); // LxID
    var isColBBlank = !editedData.sheet.getRange(editedData.range.getRow(), settings().PaymentLogDataAndColNum.CxID).isBlank(); // CxID
    var iscolCBlank = !editedData.sheet.getRange(editedData.range.getRow(), 3).isBlank(); // Purchase ID
    
    var colA = editedData.sheet.getRange(editedData.range.getRow(), settings().PaymentLogDataAndColNum.LxID).getValue(); // LxID
    var colB = editedData.sheet.getRange(editedData.range.getRow(), settings().PaymentLogDataAndColNum.CxID).getValue(); // CxID
    
    var colC = editedData.sheet.getRange(editedData.range.getRow(), 3).getValue(); // Purchase ID
  
    var colL = editedData.sheet.getRange(editedData.range.getRow(), settings().PaymentLogDataAndColNum.ref_a).getValue(); // ref_a
    var colM = editedData.sheet.getRange(editedData.range.getRow(), settings().PaymentLogDataAndColNum.ref_b).getValue(); // ref_b
    var colN = editedData.sheet.getRange(editedData.range.getRow(), settings().PaymentLogDataAndColNum.ref_am).getValue(); // ref_am 
    var colO = editedData.sheet.getRange(editedData.range.getRow(), settings().PaymentLogDataAndColNum.ref_s).getValue(); // ref_l 
    var colP = editedData.sheet.getRange(editedData.range.getRow(), settings().PaymentLogDataAndColNum.ref_s).getValue(); // ref_s
  
    if(isColABlank & isColBBlank & iscolCBlank){
     insertPaymentFormulas(editedData.sheet, editedData.row);
      var affSheet = getSheetById(settings().AffiliatesSheetId),
          sheet_lastRow = affSheet.getLastRow(),
          sheet_lastCol = affSheet.getLastColumn(),
      
      allDataInAffSheetRefIdCol = affSheet.getSheetValues(1,1,sheet_lastRow,sheet_lastCol)
      
      // remove header
      allDataInAffSheetRefIdCol.shift()
  
      for(let x = 0 ; x < allDataInAffSheetRefIdCol.length; x++){
        var refId = allDataInAffSheetRefIdCol[x][ settings().AffiliatesDataAndColNum.ref_id - 1 ]
  
        if(refId == colL){
          
          editedData.sheet.getRange(editedData.range.getRow(), settings().PaymentLogDataAndColNum.ref_b).setValue(allDataInAffSheetRefIdCol[x][ settings().AffiliatesDataAndColNum.ref_b - 1 ]) // ref_b
          editedData.sheet.getRange(editedData.range.getRow(), settings().PaymentLogDataAndColNum.ref_am).setValue(allDataInAffSheetRefIdCol[x][ settings().AffiliatesDataAndColNum.ref_am - 1]) // ref_am
        }
      }    
  
      // Copy to location sheet's Payments if there is a match LxID in the Affiliates Sheet
      var affSheet = getSheetById(settings().AffiliatesSheetId)
      
      if(colA){
        for(var i = 2; i<= affSheet.getLastRow(); i++){
          if(affSheet.getRange(i,1).getValue() == colA){
            // Get location sheet from Affiliates sheet
            var destinationLocationSheetUrl = affSheet.getRange(i, 38).getValue(),
              foreignLocationSpreadsheet = SpreadsheetApp.openByUrl(destinationLocationSheetUrl),
              foreignLocationSpreadsheet = foreignLocationSpreadsheet.getSheets() ,
              locationPaymentSheetId = affSheet.getRange(i, 37).getValue(),
              dataToExport = editedData.sheet.getRange(range.getRow(), 1,1,editedData.sheet.getLastColumn()).getA1Notation()
              dataToExport = editedData.sheet.getSheetName() + '!' + dataToExport
  
            var exportCellsaffiliatesSpreadsheet = true
  
            
            foreignLocationSpreadsheet.forEach((sheet)=>{
              if(sheet.getSheetId() === parseInt(locationPaymentSheetId)){
                for(var i = 2; i<= sheet.getLastRow(); i++){
                  if(sheet.getRange(i,3).getValue() == colC){
                    exportCellsaffiliatesSpreadsheet = false
                    break 
                  }
                }
              }
            })
  
            if(exportCellsaffiliatesSpreadsheet){
             linkCells(SpreadsheetApp.getActiveSpreadsheet(), dataToExport, destinationLocationSheetUrl, locationPaymentSheetId) 
            }
  
  
          }
          
        }
      }
  
      if(colL || colM || colN || colO || colP){
        for(var i = 2; i<= affSheet.getLastRow(); i++){
          if(affSheet.getRange(i,3).getValue() == colL){
            // Get (Affiliates)Payments sub-sheet  from Affiliates sheet
            var destinationAffiliateSheetUrl = affSheet.getRange(i, 43).getValue(),
              foreignAffiliateSpreadsheet = SpreadsheetApp.openByUrl(destinationAffiliateSheetUrl),
              foreignAffiliateSpreadsheet = foreignAffiliateSpreadsheet.getSheets() ,
              affiliateLeadsSheetId = affSheet.getRange(i, 42).getValue(),
              dataToExport = editedData.sheet.getRange(range.getRow(), 1,1,editedData.sheet.getLastColumn()).getA1Notation()
              dataToExport = editedData.sheet.getSheetName() + '!' + dataToExport          
            
            var exportCellsaffiliatesSpreadsheet = true
  
            
            foreignAffiliateSpreadsheet.forEach((sheet)=>{
              if(sheet.getSheetId() === parseInt(affiliateLeadsSheetId)){
                for(var i = 2; i<= sheet.getLastRow(); i++){
                  if(
                    sheet.getRange(i,3).getValue() == colC &&
                    sheet.getRange(i,12).getValue() == colL &&
                    sheet.getRange(i,13).getValue() == colM &&
                    sheet.getRange(i,14).getValue() == colN &&
                    sheet.getRange(i,15).getValue() == colO &&
                    sheet.getRange(i,16).getValue() == colP
                  ){                        
                    exportCellsaffiliatesSpreadsheet = false
                    break 
                  }
                }
              }
            })
  
            if(exportCellsaffiliatesSpreadsheet){
             linkCells(SpreadsheetApp.getActiveSpreadsheet(), dataToExport, destinationAffiliateSheetUrl, affiliateLeadsSheetId) 
            }          
          }
  
        }
  
      }
    }
  
  }
  
  function insertPaymentFormulas(sheet = SpreadsheetApp.getActiveSheet(), currRow) {
  
    // setting formulas
    var formulaAI = '=SPLIT(C' + currRow + ',"_")';
    sheet.getRange(currRow, 35).setFormula(formulaAI);
  
  }