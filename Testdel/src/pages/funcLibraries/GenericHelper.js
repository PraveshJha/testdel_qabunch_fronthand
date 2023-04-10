export default
{
    common_deleteIteminJarrayBasedonIndex(Item,index,key) 
    {
        try{
            var testData = Item.filter(m => m.id !== index);
            for(let i=index;i<=testData.length;i++)
            {
                testData[i-1][key]=i;
            }
            return testData;
        }
        catch(error)
        {}
        return Item;
    },
    common_AddIteminJarrayBasedonIndex(Item,index,keyList,key) 
    {
        try{
            var allItem=[]
            for(let i=0;i<Number(index);i++)
            {
                allItem[i]= Item[i];
            }
            var NewItemContent ={};
            for(let i=0;i<keyList.length;i++)
            {
                NewItemContent[keyList[i]]='';
            }
            NewItemContent[key]=Number(index)+1;
            allItem.push(NewItemContent)
            for(let i=Number(index);i<Item.length;i++)
            {
                Item[i]['id']=Number(i)+2;
                allItem.push(Item[i]);
            }
            return allItem;
        }
        catch(error)
        {}
        return Item;
    },

    common_checkblankvalueinJarray(Item,key) 
    {
        try{
            for(let i=0;i<=Item.length;i++)
            {
                if(Item[i][key].trim()==='')
                {
                    return true
                }
            }
            return false;
        }
        catch(error)
        {}
        return false;
    },

    common_CheckValueFromJson( options,checkvalue) 
    {
     let allitem = []
     Object.keys(options).map((key) => (
      allitem.push(options[key])
    ));
    for (let i = 0; i < allitem.length; i++) 
    {
      if(allitem[i].trim().toLowerCase()===checkvalue.trim().toLowerCase())
      {
        return true;
      }
    }
    return false;
    },

    common_GetListvalueFromJsonResponce(options) 
    {
        let allitem = [];
        try{
            Object.keys(options).map((key) => (
            allitem.push(options[key])
            ));
            }
        catch(error)
        {}
        return allitem;
    },
    common_GetListKeyFromJsonResponce(options) 
    {
        let allitem = []
        Object.keys(options).map((key) => (
        allitem.push(key)
        ));
        return allitem;
    },

    common_ChangeJsoncontentforServer(ItemValue)
    {
    try{
        var valueaf =[];
    if(ItemValue.includes("+"))
    {
        valueaf = ItemValue.split('+')
        ItemValue= valueaf.join('auplussignau')
    }
    if(ItemValue.includes(":"))
    {
        valueaf = ItemValue.split(':')
        ItemValue= valueaf.join('aucolumnsignau')
    }
    if(ItemValue.includes("{"))
    {
        valueaf = ItemValue.split('{')
        ItemValue= valueaf.join('aucurlyopenbracketau')
    }
    if(ItemValue.includes("}"))
    {
        valueaf = ItemValue.split('}')
        ItemValue= valueaf.join('aucurlyclosebracketau')
    }
    if(ItemValue.includes("["))
    {
        valueaf = ItemValue.split('[')
        ItemValue= valueaf.join('aubigopenbracketau')
    }
    if(ItemValue.includes("]"))
    {
        valueaf = ItemValue.split(']')
        ItemValue= valueaf.join('aubigclosebracketau')
    }
    if(ItemValue.includes('"'))
    {
        valueaf = ItemValue.split('"')
        ItemValue= valueaf.join('audoublequotesau')
    }
    if(ItemValue.includes("="))
    {
        valueaf = ItemValue.split('=')
        ItemValue= valueaf.join('auequalsignau')
    }
    }
    catch(error)
    {}
    return ItemValue;
    },

    checkJsonFormat(sampleJSON)
    {
        if(sampleJSON.trim()==='')
        {
          return true;
        }
        try{
         JSON.parse(sampleJSON);
         return true;
        }
        catch(Exception)
        {}
        return false;
    },
    getListItem(Input,labelName)
    {
      let allitem = [];
      try{
      for(let i =0;i<Object.keys(Input).length;i++)
      {
          allitem.push(Input[i][labelName])
      }
      }
      catch(error)
      {}
      return allitem;
    },

     common_RemoveItesmfromListinJobject(ListItem,RemoveItem) 
    {
  let count = Object.keys(ListItem).length;
  let outputData={};
  for(let i=1;i<=count;i++)
  {
	var keyName =Object.keys(ListItem)[i-1];
	if(keyName.trim().toLowerCase()!==RemoveItem.trim().toLowerCase())
	{
		outputData[keyName]=ListItem[keyName];
	}
	
  }
  return outputData;
}

}

