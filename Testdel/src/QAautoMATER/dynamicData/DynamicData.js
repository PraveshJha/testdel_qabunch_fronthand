import DataGeneratorUtility from "../funcLib/DataGeneratorUtility";
import DateTimeUtility from "../funcLib/DateTimeUtility";
export var DynamicData = [
    { id: 1, key: 'firstName', custom: '' },
    { id: 2, key: 'lastName', custom: '' },
    { id: 3, key: 'address', custom: '' },
    { id: 4, key: 'email', custom: '' },
    { id: 5, key: 'uuid', custom: '' },
    { id: 6, key: 'country', custom: '' },
    { id: 7, key: 'state', custom: '' },
    { id: 8, key: 'city', custom: '' },
    { id: 9, key: 'zipCode', custom: '' },
    { id: 10, key: 'phoneNumber', custom: '' },
    { id: 11, key: 'word(length=10)', custom: '' },
    { id: 12, key: 'string(length=10)', custom: '' },
    { id: 13, key: 'number(min=1,max=99999)', custom: '' },
    { id: 14, key: 'date(addorsubtractDaysfromPrsentDate=0,dateTemplate=DD-MM-yyyy)', custom: '' },
    { id: 15, key: 'extractNumberFromString(inputstring,willYouremoveDot)', custom: '' },
    { id: 16, key: 'splitAndSaveIndexValue(inputstring,splitKeyword,indexToSave)', custom: '' },
    { id: 17, key: 'addTwoNumber(number1,number2,numberToShowafterDecimal)', custom: '' },
    { id: 18, key: 'subtractTwoNumber(number1,number2,numberToShowafterDecimal)', custom: '' },
    { id: 19, key: 'multiplyTwoNumber(number1,number2,numberToShowafterDecimal)', custom: '' },
    { id: 20, key: 'devideTwoNumber(number1,number2,numberToShowafterDecimal)', custom: '' },
    { id: 21, key: 'reminderTwoNumber(number1,number2,numberToShowafterDecimal)', custom: '' },
    { id: 22, key: 'getPercentage(number1,number2,numberToShowafterDecimal)', custom: '' },
    { id: 23, key: 'addPercentageInNumber(number1,number2,numberToShowafterDecimal)', custom: '' },
    { id: 24, key: 'subtractPercentageInNumber(number1,number2,numberToShowafterDecimal)', custom: '' },
];
export class DynamicDataGetter {

    async getValueFromDynamicData(dataKey, param) {
        switch (dataKey) {
            case "firstName":
                return await DataGeneratorUtility.getFirstName();
            case "lastName":
                return await DataGeneratorUtility.getLastName();
            case "address":
                return await DataGeneratorUtility.getAddress();
            case "email":
                return await DataGeneratorUtility.getEmail();
            case "uuid":
                return await DataGeneratorUtility.getUuid();
            case "country":
                return await DataGeneratorUtility.getCountry();
            case "state":
                return await DataGeneratorUtility.getState();
            case "city":
                return await DataGeneratorUtility.getCity();
            case "zipCode":
                return await DataGeneratorUtility.getZipCode();
            case "phoneNumber":
                return await DataGeneratorUtility.getPhoneNumber();
            case "word(length=10)":
                if (await Number(param) > 0) {
                    return await DataGeneratorUtility.getWords(Number(param));
                }
                else
                    return await DataGeneratorUtility.getWords(10);
            case "string(length=10)":
                if (await Number(param) > 0) {
                    return await DataGeneratorUtility.getString(Number(param));
                }
                else
                    return await DataGeneratorUtility.getString(10)
            case "number(min=1,max=99999)":
                if (await param.includes(',')) {
                    var minRange = param.split(',')[0];
                    var maxRange = param.split(',')[1];
                    try {
                        return await DataGeneratorUtility.getNumberFromRange(Number(minRange), Number(maxRange));
                    }
                    catch (error) {
                        return await DataGeneratorUtility.getNumberFromRange(1, 99999);
                    }

                }
                else
                    return await DataGeneratorUtility.getNumberFromRange(1, 99999);
            case "date(addorsubtractDaysfromPrsentDate=0,dateTemplate=DD-MM-yyyy)":
                if (await param.trim() !== '') {
                    var daytoadd = param.split(',')[0];
                    var template = param.split(',')[1];
                    try {
                        return await DateTimeUtility.addOrSubtractDaysToCurrentDate(Number(daytoadd), template)
                    }
                    catch (error) {
                        return await DateTimeUtility.addOrSubtractDaysToCurrentDate(0, "DD-MM-yyyy")
                    }
                }
                else
                    return await DateTimeUtility.addOrSubtractDaysToCurrentDate(0, "DD-MM-yyyy");
            case "extractNumberFromString(inputstring,willYouremoveDot)":
                if (await param.trim() !== '') {
                    try {
                        var inputString = param.split(',')[0];
                        var removeDot = param.split(',')[1];
                        var optionalParam = true;
                        if (await removeDot.toLowerCase() !== 'true') {
                            optionalParam = false;
                        }
                        return await DataGeneratorUtility.extractNumberFromString(await inputString, await optionalParam)
                    }
                    catch (error) {
                        return 'Error-Please provide correct input'
                    }
                }
                else
                    return 'Error-Please provide correct input'
            case "splitAndSaveIndexValue(inputstring,splitKeyword,indexToSave)":
                if (await param.trim() !== '') {
                    try {
                        var inputString = await param.split(',')[0];
                        var splitKey = await param.split(',')[1];
                        var indexToSave = await Number(await param.split(',')[2]);
                        return await DataGeneratorUtility.splitAndSaveIndexValue(await inputString, await splitKey, await indexToSave)
                    }
                    catch (error) {
                        return 'Error-Please provide correct input'
                    }
                }
                else
                    return 'Error-Please provide correct input'
            case "addTwoNumber(number1,number2,numberToShowafterDecimal)":
                if (await param.trim() !== '') {
                    try {
                        var indexToSave = 0;
                        var number1 = await Number(await param.split(',')[0]);
                        var number2 = await Number(param.split(',')[1]);
                        try {
                            indexToSave = await Number(await param.split(',')[2]);
                        }
                        catch (error) {
                            indexToSave = 0;
                        }
                        return await DataGeneratorUtility.addTwoNumber(await number1, await number2, await indexToSave)
                    }
                    catch (error) {
                        return 'Error-Please provide correct input'
                    }
                }
                else
                    return 'Error-Please provide correct input'
            case "subtractTwoNumber(number1,number2,numberToShowafterDecimal)":
                if (await param.trim() !== '') {
                    try {
                        var indexToSave = 0;
                        var number1 = await Number(await param.split(',')[0]);
                        var number2 = await Number(param.split(',')[1]);
                        try {
                            indexToSave = await Number(await param.split(',')[2]);
                        }
                        catch (error) {
                            indexToSave = 0;
                        }
                        return await DataGeneratorUtility.subtractTwoNumber(await number1, await number2, await indexToSave)
                    }
                    catch (error) {
                        return 'Error-Please provide correct input'
                    }
                }
                else
                    return 'Error-Please provide correct input'
            case "multiplyTwoNumber(number1,number2,numberToShowafterDecimal)":
                if (await param.trim() !== '') {
                    try {
                        var indexToSave = 0;
                        var number1 = await Number(await param.split(',')[0]);
                        var number2 = await Number(param.split(',')[1]);
                        try {
                            indexToSave = await Number(await param.split(',')[2]);
                        }
                        catch (error) {
                            indexToSave = 0;
                        }
                        return await DataGeneratorUtility.multiplyTwoNumber(await number1, await number2, await indexToSave)
                    }
                    catch (error) {
                        return 'Error-Please provide correct input'
                    }
                }
                else
                    return 'Error-Please provide correct input'
            case "devideTwoNumber(number1,number2,numberToShowafterDecimal)":
                if (await param.trim() !== '') {
                    try {
                        var indexToSave = 0;
                        var number1 = await Number(await param.split(',')[0]);
                        var number2 = await Number(param.split(',')[1]);
                        try {
                            indexToSave = await Number(await param.split(',')[2]);
                        }
                        catch (error) {
                            indexToSave = 0;
                        }
                        return await DataGeneratorUtility.devideTwoNumber(await number1, await number2, await indexToSave)
                    }
                    catch (error) {
                        return 'Error-Please provide correct input'
                    }
                }
                else
                    return 'Error-Please provide correct input'
            case "reminderTwoNumber(number1,number2,numberToShowafterDecimal)":
                if (await param.trim() !== '') {
                    try {
                        var indexToSave = 0;
                        var number1 = await Number(await param.split(',')[0]);
                        var number2 = await Number(param.split(',')[1]);
                        try {
                            indexToSave = await Number(await param.split(',')[2]);
                        }
                        catch (error) {
                            indexToSave = 0;
                        }
                        return await DataGeneratorUtility.reminderTwoNumber(await number1, await number2, await indexToSave)
                    }
                    catch (error) {
                        return 'Error-Please provide correct input'
                    }
                }
                else
                    return 'Error-Please provide correct input'
            case "getPercentage(number1,number2,numberToShowafterDecimal)":
                if (await param.trim() !== '') {
                    try {
                        var indexToSave = 0;
                        var number1 = await Number(await param.split(',')[0]);
                        var number2 = await Number(param.split(',')[1]);
                        try {
                            indexToSave = await Number(await param.split(',')[2]);
                        }
                        catch (error) {
                            indexToSave = 0;
                        }
                        return await DataGeneratorUtility.getPercentage(await number1, await number2, await indexToSave)
                    }
                    catch (error) {
                        return 'Error-Please provide correct input'
                    }
                }
                else
                    return 'Error-Please provide correct input'
            case "addPercentageInNumber(number1,number2,numberToShowafterDecimal)":
                if (await param.trim() !== '') {
                    try {
                        var indexToSave = 0;
                        var number1 = await Number(await param.split(',')[0]);
                        var number2 = await Number(param.split(',')[1]);
                        try {
                            indexToSave = await Number(await param.split(',')[2]);
                        }
                        catch (error) {
                            indexToSave = 0;
                        }
                        return await DataGeneratorUtility.addPercentageInNumber(await number1, await number2, await indexToSave)
                    }
                    catch (error) {
                        return 'Error-Please provide correct input'
                    }
                }
                else
                    return 'Error-Please provide correct input'
            case "subtractPercentageInNumber(number1,number2,numberToShowafterDecimal)":
                if (await param.trim() !== '') {
                    try {
                        var indexToSave = 0;
                        var number1 = await Number(await param.split(',')[0]);
                        var number2 = await Number(param.split(',')[1]);
                        try {
                            indexToSave = await Number(await param.split(',')[2]);
                        }
                        catch (error) {
                            indexToSave = 0;
                        }
                        return await DataGeneratorUtility.subtractPercentageInNumber(await number1, await number2, await indexToSave)
                    }
                    catch (error) {
                        return 'Error-Please provide correct input'
                    }
                }
                else
                    return 'Error-Please provide correct input'
            default:
                return undefined;

        }
    }

}
export default new DynamicDataGetter;