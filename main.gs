function entryPoint_DataInputThroughAPI() {
    var allSheets = [
      {
        id: settings().LocationSheetId,
        remarkCol: settings().LocationDataAndColNum.remarkCol
      },
      {
        id: settings().AffiliatesSheetId,
        remarkCol: settings().AffiliatesDataAndColNum.remarkCol
      },
      {
        id: settings().PaymentLogSheetId,
        remarkCol: settings().PaymentLogDataAndColNum.remarkCol
      },
      {
        id: settings().LeadLogSheetId,
        remarkCol: settings().LeadLogDataAndColNum.remarkCol
      }
    ]
  
    // Loop through all sheets
    allSheets.forEach((elem)=>{
     
      var sheet = getSheetById(elem.id),
          sheet_lastRow = sheet.getLastRow(),
          sheet_lastCol = sheet.getLastColumn(),
          allDataInLeadLog = sheet.getSheetValues(1,1,sheet_lastRow,sheet_lastCol)
      
  
      // remove header
      allDataInLeadLog.shift()
  
  
      // for(let x = 0 ; x < allDataInLeadLog.length; x++){
      for (let x = allDataInLeadLog.length - 1; x >= 1; x--) {
        var isProcessed = allDataInLeadLog[x][ elem.remarkCol - 1 ]
  
        if( isProcessed !== "Processed" ){
          // Get range and pass it to traditional onedit func
          let row = x + 2,
              col = elem.remarkCol
              range = sheet.getRange(row, col)
  
          onEditEntryPoint(false, range)
         
        }
        if(isProcessed == "Processed"){
          break;
        }
      }
    })
  
  }
  
  function onEditEntryPoint(e, range) {
  
    if(e){
      var range = e.range
    }else if(!e && range){
      var range
    }
    
    const editedData = {
      sheetID: String(range.getSheet().getSheetId()),
      row: range.getRow(),
      data: range.getValues(),
      sheet: null,
      range: range 
    }
  
    editedData.sheet = getSheetById(editedData.sheetID)
  
    switch(editedData.sheetID) {
      case String(settings().LocationSheetId):
  
        locations_handler(editedData)
  
        break;
      
      case String(settings().AffiliatesSheetId):
  
        affiliates_handler(editedData)
  
        break;
  
      case String(settings().LeadLogSheetId):
  
        leads_handler(editedData)
  
        break;
  
      case String(settings().PaymentLogSheetId):
  
        payments_handler(editedData)
  
        break;
  
    }
  
  }