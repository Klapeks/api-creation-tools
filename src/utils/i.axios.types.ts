
export const globalAxios: IAxios | null = (() => {
    try {
        const axios = require('axios');
        if (axios) return axios as any;
    } catch (err) {}
    console.warn("'axios' module not found");
    return null;
})();

export interface IAxios {
    request(config: any): Promise<any>;
    get(url: string, config?: any): Promise<any>;
    delete(url: string, config?: any): Promise<any>;
    head(url: string, config?: any): Promise<any>;
    options(url: string, config?: any): Promise<any>;
    post(url: string, data?: any, config?: any): Promise<any>;
    put(url: string, data?: any, config?: any): Promise<any>;
    patch(url: string, data?: any, config?: any): Promise<any>;
    postForm(url: string, data?: any, config?: any): Promise<any>;
    putForm(url: string, data?: any, config?: any): Promise<any>;
    patchForm(url: string, data?: any, config?: any): Promise<any>;
}