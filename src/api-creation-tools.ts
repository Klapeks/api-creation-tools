import { AxiosInstance } from "axios";

let _axios: AxiosInstance | undefined;
function useAxios(axios: AxiosInstance) {
    _axios = axios;
}
function getAxios(): AxiosInstance {
    if (!_axios) throw "No axios instance found. Please use apiCreationTools.useAxios(axiosInstance)";
    return _axios;
}

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
        apiOptions: Parameters<typeof createApi<TURL, TResponse, TRequest, TQuery>>[0]
        query: TQuery,
        body: TRequest,
        response: TResponse
    }
} : never;

export type ObjectType<T> = ObjectConstructor & { apiType: T }; 

export type _PreSendFuncReturn = { urlParams?: any, body?: any, query?: any };

export type _PreSendFunc<_TF extends ApiFunction<any, any, any>> = [_TF] extends [never]
    ? (() => _PreSendFuncReturn) : ((body: _TF['body']) => _PreSendFuncReturn);

export function createApi<
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
        method: "POST" | "GET" | "DELETE" | "PATCH",// | "PUT",
        body?: TRequest,
        query?: TQuery,
        preSend?: _PreSendFunc<_TF>
    },
    response: TResponse
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
        if (getAxios().defaults.baseURL?.endsWith('/api')) {
            if (url.startsWith('/api')) url = url.substring(4);
        }
        return (await getAxios().request({
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

export const apiCreationTools = {
    createApi, getAxios, useAxios
}