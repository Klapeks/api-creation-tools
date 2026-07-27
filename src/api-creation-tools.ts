import { globalAxios, IAxios } from "./utils/i.axios.types";

export type ApiFunction<
    TURL extends string,
    TResponse extends object = {}, 
    TRequest extends object = {}, 
    TQuery extends object = {},
> = (
    [TQuery] extends [never] ? TRequest 
    : ([TRequest] extends [never] ? TQuery 
    : (TQuery & TRequest))
) extends infer Body ? {
    body: Body,
    return: (
        [Body] extends [never] ? (() => Promise<TResponse>)
        : ((body: Body) => Promise<TResponse>)
    ) & {
        __type: "ApiCreationToolsFunction",
        url: TURL,
        apiOptions: Parameters<typeof createApiEndpoint<TURL, TResponse, TRequest, TQuery>>[0]
        query: TQuery,
        body: TRequest,
        response: TResponse
    }
} : never;

export type ObjectType<T> = ObjectConstructor & { apiType: T }; 

export type _PreSendFuncReturn = { urlParams?: any, body?: any, query?: any };

export type _PreSendFunc<_TF extends ApiFunction<any, any, any>> = [_TF] extends [never]
    ? (() => _PreSendFuncReturn) : ((body: _TF['body']) => _PreSendFuncReturn);


function createApiEndpoint<
    TURL extends string,
    TResponse extends object = {}, 
    TRequest extends object = never, 
    TQuery extends object = never,
    _TF extends ApiFunction<TURL, TResponse, TRequest, TQuery> = ApiFunction<TURL, TResponse, TRequest, TQuery>
>(options: {
    name: string,
    // description?: string,
    url: TURL,
    request: {
        method: "POST" | "PATCH" | "PUT",
        body?: TRequest,
        preSend?: _PreSendFunc<_TF>
    } | {
        method: "GET" | "DELETE",
        query?: TQuery,
        preSend?: _PreSendFunc<_TF>
    },
    response: TResponse,
    axios?: any,
    getAxios?: () => any
}): _TF['return'] {
    const parseBody = (body: any): _PreSendFuncReturn => {
        if (options.request.preSend) return options.request.preSend(body);
        if (options.request.method == 'GET' || options.request.method == 'DELETE') {
            return { query: body };
        }
        return { body };
    }
    const call = (async (__args: any) => {
        const body = parseBody(__args);
        let url = options.url as any;
        if (url.includes(':') && body.urlParams) {
            if (typeof body.urlParams != 'object') {
                throw "urlParams is not an object";
            }
            let urls = url.split('/');
            for (let i = 0; i < urls.length; i++) {
                if (urls[i][0] == ':') {
                    urls[i] = urls[i].substring(1);
                    if (urls[i] in body.urlParams) {
                        urls[i] = body.urlParams[urls[i]];
                    } else {
                        throw `No \`${urls[i]}\` in url param string`;
                    }
                }
            }
            url = urls.join('/');
        }
        if (!url.startsWith('/')) url = '/' + url;

        const axios = options.getAxios?.() || options.axios || globalAxios;
        if (!axios) throw new Error("Axios not found");
        if (axios.defaults.baseURL?.endsWith('/api')) {
            if (url.startsWith('/api')) url = url.substring(4);
        }
        return (await axios.request({
            method: options.request.method,
            url: url,
            data: body.body,
            params: body.query,
        })).data;
    }) as _TF['return'];

    call.__type = 'ApiCreationToolsFunction';
    call.apiOptions = options as any;
    call.url = call.apiOptions.url as any;
    call.query = {} as TQuery;
    call.body = {} as TRequest;
    call.response = {} as TResponse;
    return call as any;
}



export class ApiContainer<TAxios extends IAxios = IAxios> {

    private _axios: TAxios | undefined;
    constructor(axios?: TAxios) {
        this._axios = axios;
        this.getAxios = this.getAxios.bind(this);
    }

    setAxios(axios: TAxios) {
        this._axios = axios;
    }
    getAxios(): TAxios {
        if (!this._axios) throw "No axios instance setted";
        return this._axios;
    }

    createApi: typeof createApiEndpoint = (options) => {
        options.getAxios = this.getAxios;
        return createApiEndpoint(options)
    }

}