function leads_handler(editedData){
    var refs = [],
        folderId
    
    // Get status of Col C - K in case it is needed
    var isColCBlank = !editedData.sheet.getRange(editedData.range.getRow(), 3).isBlank(); // CxID
    var isColDBlank = !editedData.sheet.getRange(editedData.range.getRow(), 4).isBlank(); // LxID
    
    var colC = editedData.sheet.getRange(editedData.range.getRow(), 3).getValue(); // CxID
    var colD = editedData.sheet.getRange(editedData.range.getRow(), 4).getValue(); // LxID
  
    var colF = editedData.sheet.getRange(editedData.range.getRow(), 6).getValue(); // ref_a
    (colF) ? refs.push(colF) : '';
  
    var colG = editedData.sheet.getRange(editedData.range.getRow(), 7).getValue(); // ref_b
    (colG) ? refs.push(colG) : '';
  
    var colH = editedData.sheet.getRange(editedData.range.getRow(), 8).getValue(); // ref_am
    (colH) ? refs.push(colH) : '';
   
    var colI = editedData.sheet.getRange(editedData.range.getRow(), 9).getValue(); // ref_l
    (colI) ? refs.push(colI) : '';
   
    var colJ = editedData.sheet.getRange(editedData.range.getRow(), 10).getValue(); // ref_s
    (colJ) ? refs.push(colJ) : '';
   
    if(isColCBlank && isColDBlank){
      insertLeadFormulas(editedData.sheet, editedData.row);
      var affSheet = getSheetById(settings().AffiliatesSheetId),
          sheet_lastRow = affSheet.getLastRow(),
          sheet_lastCol = affSheet.getLastColumn(),
      
      allDataInAffSheetRefIdCol = affSheet.getSheetValues(1,1,sheet_lastRow,sheet_lastCol)
      
      // remove header
      allDataInAffSheetRefIdCol.shift()
      for(let x = 0 ; x < allDataInAffSheetRefIdCol.length; x++){
        var refId = allDataInAffSheetRefIdCol[x][ settings().AffiliatesDataAndColNum.ref_id - 1 ]
        if(refId == colF){
          editedData.sheet.getRange(editedData.range.getRow(), 7).setValue(allDataInAffSheetRefIdCol[x][ settings().AffiliatesDataAndColNum.ref_b - 1 ]) // ref_b
          editedData.sheet.getRange(editedData.range.getRow(), 8).setValue(allDataInAffSheetRefIdCol[x][ settings().AffiliatesDataAndColNum.ref_am - 1]) // ref_am
        }
      }
  
      // Copy to location sheet's Leads if there is a match LxID in the Affiliates Sheet
      var affSheet = getSheetById(settings().AffiliatesSheetId)
  
      if(colD){
        for(var i = 2; i<= affSheet.getLastRow(); i++){
          if(affSheet.getRange(i,1).getValue() == colD){
            // Get location sheet from Affiliates sheet
            var destinationLocationSheetUrl = affSheet.getRange(i, 38).getValue(),
              foreignLocationSpreadsheet = SpreadsheetApp.openByUrl(destinationLocationSheetUrl),
              foreignLocationSpreadsheet = foreignLocationSpreadsheet.getSheets() ,
              locationLeadsSheetId = affSheet.getRange(i, 36).getValue(),
              dataToExport = editedData.sheet.getRange(range.getRow(), 1,1,editedData.sheet.getLastColumn()).getA1Notation()
              dataToExport = editedData.sheet.getSheetName() + '!' + dataToExport
  
            var exportCellsaffiliatesSpreadsheet = true
  
            
            foreignLocationSpreadsheet.forEach((sheet)=>{
              if(sheet.getSheetId() === parseInt(locationLeadsSheetId)){
                for(var i = 2; i<= sheet.getLastRow(); i++){
                  if(sheet.getRange(i,3).getValue() == colC){
                    exportCellsaffiliatesSpreadsheet = false
                    break 
                  }
                }
              }
            })
  
            if(exportCellsaffiliatesSpreadsheet){
             linkCells(SpreadsheetApp.getActiveSpreadsheet(), dataToExport, destinationLocationSheetUrl, locationLeadsSheetId) 
            }
  
  
          }
          
        }
      }
  
      if(colF || colG || colH || colI || colJ){
        for(var i = 2; i<= affSheet.getLastRow(); i++){
          if(affSheet.getRange(i,3).getValue() == colF){
            // Get Sub-Affiliates sheet  from Affiliates sheet
            var destinationAffiliateSheetUrl = affSheet.getRange(i, 43).getValue(),
              foreignAffiliateSpreadsheet = SpreadsheetApp.openByUrl(destinationAffiliateSheetUrl),
              foreignAffiliateSpreadsheet = foreignAffiliateSpreadsheet.getSheets() ,
              affiliateLeadsSheetId = affSheet.getRange(i, 41).getValue(),
              dataToExport = editedData.sheet.getRange(range.getRow(), 1,1,editedData.sheet.getLastColumn()).getA1Notation()
              dataToExport = editedData.sheet.getSheetName() + '!' + dataToExport          
            
            var exportCellsaffiliatesSpreadsheet = true
  
            
            foreignAffiliateSpreadsheet.forEach((sheet)=>{
              if(sheet.getSheetId() === parseInt(affiliateLeadsSheetId)){
                for(var i = 2; i<= sheet.getLastRow(); i++){
                  if(
                    sheet.getRange(i,3).getValue() == colC &&
                    sheet.getRange(i,6).getValue() == colF &&
                    sheet.getRange(i,7).getValue() == colG &&
                    sheet.getRange(i,8).getValue() == colH &&
                    sheet.getRange(i,9).getValue() == colI &&
                    sheet.getRange(i,10).getValue() == colJ
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
  
  function insertLeadFormulas(sheet = SpreadsheetApp.getActiveSheet(), currRow) {
  
    // setting formulas
    var formulaA = '=N' + currRow + '&" "&O' + currRow + '';
    sheet.getRange(currRow, 1).setFormula(formulaA);
  
  
  }