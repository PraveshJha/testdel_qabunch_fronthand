export default
{
  GetTotalTestScripts(PassCount,FailCount)
  {
     var output =0;
     try
     {
      output=Number(PassCount)+Number(FailCount);
     }
     catch(error)
     {}
     return output;
  },
   GetTotalExecutedComponents(summaryReports)
  {
   var output =0;
   try
   {
    var totalResponseLength = Object.keys(summaryReports).length;
    output=Number(totalResponseLength)-Number(2);
   }
   catch(error)
   {}
   return output;
  },
  GetAllModule(testData){
    let allitem = []
    let finalItem =[]
       Object.keys(testData).map((key) => (
        allitem.push(key)
      ));
  
      for (let i = 0; i < allitem.length-2; i++) 
      {
        finalItem.push(allitem[i])
      }
    return (
      finalItem
    );
  },
   GetAllPass(testData){
    let allitem = []
    let finalItem =[]
       Object.keys(testData).map((key) => (
        allitem.push(testData[key].split('|')[0])
      ));
      for (let i = 0; i < allitem.length-2; i++) 
      {
        finalItem.push(allitem[i])
      }
    return (
      finalItem
    );
  },
   GetAllFail(testData){
    let allitem = []
    let finalItem =[]
       Object.keys(testData).map((key) => (
        allitem.push(testData[key].split('|')[1])
      ));
      for (let i = 0; i < allitem.length-2; i++) 
      {
        finalItem.push(allitem[i])
      }
    return (
      finalItem
    );
  },

}

