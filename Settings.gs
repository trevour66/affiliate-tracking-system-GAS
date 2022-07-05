function settings(){
    const Prod_workingDriveId = '1vP3xmD3bHImBlsnd8OrS9qFIiUKTfO_u'
    const Prod_templateId =  '1w69B0PCZadGdhsQfss4CcJ3G_c44ezKQCHomYVyMYiA'
  
    const Dev_workingDriveId = '1vP3xmD3bHImBlsnd8OrS9qFIiUKTfO_u'
    const Dev_templateId =  '1w69B0PCZadGdhsQfss4CcJ3G_c44ezKQCHomYVyMYiA'
  
    return {
      LocationSheetId: 1143508112,
      LocationDataAndColNum:{
        'LxID': 1,
        'remarkCol': 23
      },
      AffiliatesSheetId: 1111110124,
      AffiliatesDataAndColNum:{
        'LxID': 1,
        'fac_id': 2,
        'ref_id': 3,
        'ref_b': 4,
        'ref_am': 5,
        'remarkCol': 44,
        'locationSubAffiliateSheetCol': 35,
        'affiliateSubAffiliateSheetCol': 40,
      },
       LeadLogSheetId: 154003472,
      LeadLogDataAndColNum:{
        'CxID': 3,
        'LxID': 4,
        'ref_a': 6,
        'ref_b': 7,
        'ref_am': 8,
        'ref_l': 9,
        'ref_s': 10,
        'remarkCol': 16
      },
      PaymentLogSheetId: 832477443,
      PaymentLogDataAndColNum:{
        'LxID': 1,
        'CxID': 2,
        'ref_a': 12,
        'ref_b': 13,
        'ref_am': 14,
        'ref_l': 15,
        'ref_s': 16,
        'remarkCol': 51
      },
      workingDriveId: Dev_workingDriveId,
      templateId: Dev_templateId
    }
  }