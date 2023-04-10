export default
{
   getExecutionStatusListValue(allModuleName,alltestscripts,parameter) {
     var output =[];
     for(let i=0;i<allModuleName.length;i++)
     {
       const moduleName = allModuleName[i];
       var totalval=0;
       for(let j=0;j<alltestscripts.length;j++)
       {
        const runTimeModule = alltestscripts[j].moduleName;
        if(runTimeModule===moduleName)
        {
          const status= alltestscripts[j].status;
          if(status.toLowerCase().includes(parameter.toLowerCase()))
          {
            totalval=Number(totalval)+1;
          }
        }
       }
       output.push(totalval);
     }
     return output;

  },

  GetListOfListItemforCommonItem(JsonItems) 
{
  let count = Object.keys(JsonItems).length;
  let CommonDataItem=[];
  for(let i=1;i<=count;i++)
  {
	var keyName =Object.keys(JsonItems)[i-1];
	var keyVal =JsonItems[keyName];
	var  testdata={id:i,commonKeyName:keyName,commonKeyValue:keyVal};
	CommonDataItem.push(testdata);
  }
  return CommonDataItem;
},

GetListOfListforActionName(JsonItems) 
{
  let count = Object.keys(JsonItems).length;
  let CommonDataItem=[];
  for(let i=1;i<=count;i++)
  {
	var keyName =Object.keys(JsonItems)[i-1];
	var  testdata={value:keyName,label:keyName};
	CommonDataItem.push(testdata);
  }
  return CommonDataItem;
},
 GetModule(TestSuite,Index,executableTestscript)
{
  var Mo= TestSuite[executableTestscript[Index]-1].moduleName;
  return Mo;
},
GetTestID(TestSuite,Index,executableTestscript)
{
  var testID =TestSuite[executableTestscript[Index]-1].testid;
  return testID;
},
GetTestName(TestSuite,Index,executableTestscript)
{
  var testName= TestSuite[executableTestscript[Index]-1].testcasename;
  return testName;
},
TestInformationForTestSummaryReports(Mo,testID,testName,Status,reportPath,duration)
{
  var jstestStepData={};
  jstestStepData["Module"]=Mo;
  jstestStepData["testid"]=testID
  jstestStepData["testcasename"]=testName;
  jstestStepData["status"]=Status;
  reportPath= reportPath.split('\\').join('{')
  jstestStepData["reportpath"]=reportPath;
  jstestStepData["duration"]=duration;
  return jstestStepData;
}
}

