import GetData from "./getData";

export class Matcher {

    //#region [Data getter]

    async isValuePresentInArray(itemArray, itemtoSearch) {
        const newitemArray = itemArray.map(element => {
            return element.toLowerCase();
        });
        if (await newitemArray.includes(itemtoSearch.toLowerCase())) {
            return true;
        }
        else {
            return false;
        }
    }

    async matchExpectedvsActual(functionName, expectedValue, actualValue) {
        switch (await functionName) {
            case "ShouldBe":
                actualValue = await this.getTypeofVariable(await actualValue);
                expectedValue = await this.getTypeofVariable(await expectedValue);
                return await actualValue === await expectedValue;
            case "ShouldContains":
                return await actualValue.toLocaleLowerCase().includes(await expectedValue.toLocaleLowerCase());
            case "LengthShouldBe":
                return Number(await actualValue) === Number(await expectedValue);
            case "LengthGreaterThanEqualTo":
                return Number(await actualValue) >= Number(await expectedValue);
            case "LengthLessThanEqualTo":
                return Number(await actualValue) <= Number(await expectedValue);
            case "KeyShouldExist":
                return await actualValue !== undefined;
            case "KeyShouldNotExist":
                return await actualValue === undefined;
            case "ShouldBeNull":
                return await actualValue === null;
            case "ShouldNotBeNull":
                return await actualValue !== null;
            case "ValueBetween":
                var lowerRange = await expectedValue.toString().trim().split('-')[0];
                lowerRange = await GetData.getNumberFromString(await lowerRange);
                var upperRange = await expectedValue.toString().trim().split('-')[1];
                upperRange = await GetData.getNumberFromString(await upperRange);
                return await actualValue >= await lowerRange && await actualValue <= await upperRange;
            case "ShouldBeInTheList":
                return await expectedValue.includes(await actualValue);
            case "ShouldNotBeInTheList":
                return !await expectedValue.includes(await actualValue);
            default:
                return false;

        }
    }

    async getTypeofVariable(actualValue) {
        var getTypeOf = typeof (actualValue);
        switch (getTypeOf.toString().toLocaleLowerCase()) {
            case "string":
                actualValue = await actualValue.toString();
                if (!isNaN(actualValue)) {
                    actualValue = Number(actualValue);
                }
                break;
            case "number":
                actualValue = Number(await actualValue);
                break;
            case "object":
                actualValue = JSON.stringify(await actualValue);
                break;
            case "boolean":
                actualValue = Boolean(await actualValue);
                break;
            default:
                actualValue = await actualValue.toString();
        }
        return actualValue;
    }

    //#endregion [Data Getter]
}
export default new Matcher;

