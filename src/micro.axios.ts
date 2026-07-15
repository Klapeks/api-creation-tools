import { globalAxios, IAxios } from "./utils/i.axios.types";

export type MicroAxios<Ax extends IAxios = IAxios> = Ax & {
    setHeader(key: string, value: any): void;
    getData<T = any>(...params: Parameters<Ax['get']>): Promise<T>,
    postData<T = any>(...params: Parameters<Ax['post']>): Promise<T>,
    putData<T = any>(...params: Parameters<Ax['put']>): Promise<T>,
    patchData<T = any>(...params: Parameters<Ax['patch']>): Promise<T>,
    deleteData<T = any>(...params: Parameters<Ax['delete']>): Promise<T>,
    dummyInit(): void;
}

export function microAxiosOf<Ax extends IAxios>(axios: Ax, logger?: any): MicroAxios<Ax> {
    const api = axios as any as MicroAxios<Ax>;

    api.setHeader = async function(key: string, value: any) {
        (api as any).defaults.headers[key] = value;
        // api.defaults.headers.common[key] = val ue;
        logger?.debug?.("Setting api header of:", key);
    };
    api.getData = async function (...params: Parameters<Ax['get']>) {
        return (await api.get.apply(api, params)).data;
    };
    api.postData = async function (...params: Parameters<Ax['post']>) {
        return (await api.post.apply(api, params)).data;
    };
    api.deleteData = async function (...params: Parameters<Ax['delete']>) {
        return (await api.delete.apply(api, params)).data;
    };
    api.patchData = async function (...params: Parameters<Ax['patch']>) {
        return (await api.patch.apply(api, params)).data;
    };
    api.putData = async function (...params: Parameters<Ax['put']>) {
        return (await api.put.apply(api, params)).data;
    };
    api.dummyInit = () => {};
    
    return api;
}

export function createMicroAxios(uri: string, logger?: any, httpsAgent?: any) {
    if (!globalAxios) throw "No 'axios' module found";
    if (!('create' in globalAxios)) throw "Invalid 'axios' module";
    const api: IAxios = (globalAxios as any).create({
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