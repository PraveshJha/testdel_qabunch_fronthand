import axios, * as others from 'axios';
var FormData  = require('form-data')
export class RestApi {

    //#region [Rest Api method]

    async messageWhenServerUnreachable() {
        var output = {};
        output['status'] = "This site can’t be reached"
        output['headers'] = { error: 'server is unreachable,meanwhile you can see more QAAutoMATER features on https://qaautomater.vercel.app/' }
        output['data'] = { error: 'When nothing works out you need a short break, if still not working then its time to review from that start.' }
        return output;

    }

    async get(url, requestHeader) {
        requestHeader['Access-Control-Allow-Origin']= '*';
        var Response;
        try {
            let config = {
                headers: await requestHeader,
            }
            Response = await axios.get(await url, await config);
        }
        catch (error) {
            if (await error.response) {
                Response = await error.response;
            }
            else {
                Response = await this.messageWhenServerUnreachable();
            }
        }
        return await Response;
    }

    async post(url, requestHeader, requestBody) {
        requestHeader['Access-Control-Allow-Origin']= '*';
        var Response;
        try {
            let config = {
                headers: await requestHeader,
            }
            try {
                var isFormData = false;
                var contentType = await requestHeader['Content-Type'];
                if(await contentType === undefined)
                {
                    contentType = await requestHeader['content-type'];
                }
                if(await contentType !== undefined)
                {
                    if(await contentType.toSting().toLowerCase().inludes('multipart'))
                    {
                        isFormData = true;
                    }
                    if(await isFormData)
                    {
                        var bodyFormData = new FormData();
                        var alKeys = await Object.keys(await requestBody);
                        for(let i=0;i<await alKeys.length;i++)
                        {
                            var keyName = await alKeys[i];
                            await bodyFormData.append(await keyName,await requestBody[await keyName])
                        }
                        requestBody = await bodyFormData;
                    }
                }
            }
            catch (error) {
            }
            Response = await axios.post(await url, await requestBody, await config);
        }
        catch (error) {
            if (error.response) {
                Response = await error.response;
            }
            else {
                Response = await this.messageWhenServerUnreachable();
            }
        }
        return await Response;
    }

    async put(url, requestHeader, requestBody) {
        requestHeader['Access-Control-Allow-Origin']= '*';
        var Response;
        try {
            let config = {
                headers: await requestHeader,
            }
            Response = await axios.put(await url, await requestBody, await config);
        }
        catch (error) {
            if (error.response) {
                Response = await error.response;
            }
            else {
                Response = await this.messageWhenServerUnreachable();
            }
        }
        return await Response;
    }

    async patch(url, requestHeader, requestBody) {
        requestHeader['Access-Control-Allow-Origin']= '*';
        var Response;
        try {
            let config = {
                headers: await requestHeader,
            }
            Response = await axios.patch(await url, await requestBody, await config);
        }
        catch (error) {
            if (error.response) {
                Response = await error.response;
            }
            else {
                Response = await this.messageWhenServerUnreachable();
            }
        }
        return await Response;
    }

    async delete(url, requestHeader) {
        requestHeader['Access-Control-Allow-Origin']= '*';
        var Response;
        try {
            let config = {
                headers: await requestHeader,
            }
            Response = await axios.delete(await url, await config);
        }
        catch (error) {
            if (error.response) {
                Response = await error.response;
            }
            else {
                Response = await this.messageWhenServerUnreachable();
            }
        }
        return await Response;
    }

    async head(url, requestHeader) {
        requestHeader['Access-Control-Allow-Origin']= '*';
        var Response;
        try {
            let config = {
                headers: await requestHeader,
            }
            Response = await axios.head(await url, await config);
        }
        catch (error) {
            if (error.response) {
                Response = await error.response;
            }
            else {
                Response = await this.messageWhenServerUnreachable();
            }
        }
        return await Response;
    }

    async options(url, requestHeader) {
        requestHeader['Access-Control-Allow-Origin']= '*';
        var Response;
        try {
            let config = {
                headers: await requestHeader,
            }
            Response = await axios.options(await url, await config);
        }
        catch (error) {
            if (error.response) {
                Response = await error.response;
            }
            else {
                Response = await this.messageWhenServerUnreachable();
            }
        }
        return await Response;
    }

    //#endregion [Rest Api method]
}
export default new RestApi;

