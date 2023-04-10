export default
{
    PreResponseVariableSave(JsonItems) 
    {
        let count = Object.keys(JsonItems).length;
        let APIData=[];
        for(let i=1;i<=count;i++)
        {
          var keyName =Object.keys(JsonItems)[i-1];
          var keyVal =JsonItems[keyName];
          var  testdata={id:i,varname:keyName,resvalue:keyVal};
          APIData.push(testdata);
        }
        return APIData;
    },
    SetHttpHeaderData(JsonItems)
    {
        let count = Object.keys(JsonItems).length;
        let APIData=[];
        for(let i=1;i<=count;i++)
        {
          var keyName =Object.keys(JsonItems)[i-1];
          var keyVal =JsonItems[keyName];
          var  testdata={id:i,headername:keyName,headervalue:keyVal};
          APIData.push(testdata);
        }
        return APIData;
    },
    createAuthCredData(JsonItems)
    {
        let count = Object.keys(JsonItems).length;
        var allJsonItem={};
        for(let i=0;i<count;i++)
        {
          allJsonItem[JsonItems[i]['key']]=JsonItems[i]['key'];
        }
        return allJsonItem;
    },

    setAPIBody(apiBodyContent)
    {
        try{
              return JSON.parse(apiBodyContent);
        }
        catch(error)
        {}
    },
}

