import axios, { AxiosInstance } from "axios";

type _AI = AxiosInstance;
export type MicroAxios = AxiosInstance & {
    setHeader(key: string, value: any): void;
    getData<T = any>(...params: Parameters<_AI['get']>): Promise<T>,
    postData<T = any>(...params: Parameters<_AI['post']>): Promise<T>,
    patchData<T = any>(...params: Parameters<_AI['patch']>): Promise<T>,
    deleteData<T = any>(...params: Parameters<_AI['delete']>): Promise<T>,
    dummyInit(): void;
}

export function microAxiosOf(axios: AxiosInstance, logger?: any): MicroAxios {
    const api = axios as MicroAxios;

    api.setHeader = async function(key: string, value: any) {
        api.defaults.headers[key] = value;
        logger?.debug?.("Setting api header of", key);
    };
    api.getData = async function (...params: Parameters<_AI['get']>) {
        return (await api.get(...params)).data;
    };
    api.postData = async function (...params: Parameters<_AI['post']>) {
        return (await api.post(...params)).data;
    };
    api.deleteData = async function (...params: Parameters<_AI['delete']>) {
        return (await api.delete(...params)).data;
    };
    api.patchData = async function (...params: Parameters<_AI['patch']>) {
        return (await api.patch(...params)).data;
    };
    api.dummyInit = () => {};
    
    return api;
}

export function createMicroAxios(uri: string, logger?: any, httpsAgent?: any) {
    const api = axios.create({
        baseURL: uri, 
        httpsAgent,
        withCredentials: false,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, PATCH, HEAD, OPTIONS',
            'Access-Control-Allow-Headers': '*',
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });
    return microAxiosOf(api, logger);
}