import { faker } from '@faker-js/faker';
const moment = require('moment');
export class DataGeneratorUtility {

    //#region [Data Generator Method]

    async getEmail() {
        return faker.internet.email();
    }

    async getFirstName() {
        return faker.name.firstName();
    }

    
    async getLastName() {
        return faker.name.lastName();
    }

    async getAddress() {
        return faker.address.streetAddress();
    }

    async getUuid()
    {
        return faker.datatype.uuid()
    }

    async getCountry() {
        return faker.address.country();
    }

    async getPhoneNumber() {
        return faker.phone.number('99########');
    }

    async getState() {
        return faker.address.state();
    }

    async getCity() {
        return faker.address.city();
    }

    async getZipCode() {
        return faker.address.zipCode();
    }

    async getWords(wordLength) {
        return faker.random.words(wordLength);
    }

    async getNumberFromRange(min = 0, max = 100) {
        return faker.datatype.number({ min: min, max: max });
    }

    async getStringArray(arrayLenth = 1) {
        var allstringArray = [];
        for (let i = 0; i < arrayLenth; i++) {
            allstringArray.push(faker.word.adverb());
        }
        return allstringArray
    }
    async getNumberArray(arrayLenth = 1, min = 50, max = 5000) {
        var allNumberArray = [];
        for (let i = 0; i < arrayLenth; i++) {
            allNumberArray.push(await this.getNumberFromRange(min, max));
        }
        return allNumberArray
    }

    async gerHexaColorCodeForArray(arrayLength = 1) {
        var allColorCode = [];
        for (let i = 0; i < arrayLength; i++) {
            allColorCode.push(faker.color.rgb({ format: 'hex' }));
        }
        return allColorCode;
    }

    async gerHexaColorCode() {
        return faker.color.rgb({ format: 'hex' });
    }

    async getRandomDate(addFromCurrentDate = 0) {
        var randomDate = faker.date.recent(addFromCurrentDate);
        return randomDate.getDay() + '/' + randomDate.getMonth() + '/' + randomDate.getFullYear();
    }

    async getListOfDateDate(arrayLenth) {
        var allDates = [];
        for (let i = 0; i < arrayLenth; i++) {
            allDates.push(await this.getRandomDate(i));
        }
        return allDates;
    }

    async getPastDateListFromCurrentDate(totalDays)
    {
        var allDays =[];
        for(let i=0;i<totalDays;i++)
        {
            var daysToSubtract = (Number(totalDays)-Number(i))-1;
            var dateasString = await this.addOrSubtractDaysToCurrentDate(-daysToSubtract);
            allDays.push(dateasString);
        }
        return allDays;
        
    }

    async getPastDateListinDesendingOrder(totalDays)
    {
        var allDays =[];
        for(let i=0;i<totalDays;i++)
        {
            var dateasString = await this.addOrSubtractDaysToCurrentDate(-i);
            allDays.push(dateasString);
        }
        return allDays;
        
    }
    async addOrSubtractDaysToCurrentDate(addorSubtractDays=0, dateFormat="DD MMM yyyy") {
        const presentDate = new Date();
        var returnDate= moment(presentDate).add(Number(addorSubtractDays), 'days');
        return moment(returnDate).format(dateFormat);
    }

    async getString(stringLength) {
        return faker.random.alpha(stringLength);
    }

    async  extractNumberFromString(inputString,removeDot=true) {
        if(await removeDot)
        {
            return await inputString.replace(/[^0-9]/g,"");
        }
        else{
            return await inputString.replace(/[^0-9.]/g,"");
        }
    }
    
    async  splitAndSaveIndexValue(inputString,splitKeyword,indexToSave) {
        return await inputString.split(await splitKeyword)[await indexToSave];
    }
    
    async  addTwoNumber(number1,number2,numberToShowafterDecimal=0) {
        return await Math.round(Number(await number1)+Number(await number2)).toFixed(await numberToShowafterDecimal)
    }
    
    async  subtractTwoNumber(number1,number2,numberToShowafterDecimal=0) {
        return await Math.round(Number(await number1)-Number(await number2)).toFixed(await numberToShowafterDecimal)
    }
    
    async  multiplyTwoNumber(number1,number2,numberToShowafterDecimal=0) {
        return await Math.round(Number(await number1)*Number(await number2)).toFixed(await numberToShowafterDecimal)
    }
    
    async  devideTwoNumber(number1,number2,numberToShowafterDecimal=0) {
        return await Math.round(Number(await number1)/Number(await number2)).toFixed(await numberToShowafterDecimal)
    }
    
    async  reminderTwoNumber(number1,number2,numberToShowafterDecimal=0) {
        return await Math.round(Number(await number1)%Number(await number2)).toFixed(await numberToShowafterDecimal)
    }
    
    async  getPercentage(number1,number2,numberToShowafterDecimal=0) {
        return await Math.round(await Number(await number2)*100/await Number(await number1)).toFixed(await numberToShowafterDecimal)
    }
    
    async  addPercentageInNumber(number1,number2,numberToShowafterDecimal=0) {
        var number2 = await Math.round((await Number(await number1)*await Number(await number2)/100)).toFixed(await numberToShowafterDecimal)
        return await Math.round(Number(await number1)+Number(await number2)).toFixed(await numberToShowafterDecimal)
    }
    
    async  subtractPercentageInNumber(number1,number2,numberToShowafterDecimal=0) {
        var number2 = await Math.round((await Number(await number1)*await Number(await number2)/100)).toFixed(await numberToShowafterDecimal)
        return await Math.round(Number(await number1)-Number(await number2)).toFixed(await numberToShowafterDecimal)
    }

    //#endregion [Generic Method]
}
export default new DataGeneratorUtility;

