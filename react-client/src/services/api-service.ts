import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

interface AxiosConfig{
    baseUrl: string,
    headers?: Record<string, string>
}

class ApiProxyService{
    private instance: AxiosInstance;

    constructor(config: AxiosConfig){
        this.instance = axios.create({
            baseURL: config.baseUrl,
            headers: {
                'Content-Type': 'application/json',
                ...config.headers,
            },
        })
    }

    public get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.get(url, config);
    }

    public post<T, R>(url: string, data: T, config?: AxiosRequestConfig): Promise<AxiosResponse<R>> {
    return this.instance.post(url, data, config);
    }

    public put<T, R>(url: string, data: T, config?: AxiosRequestConfig): Promise<AxiosResponse<R>> {
    return this.instance.put(url, data, config);
    }

    public delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.delete(url, config);
    }
}

export default ApiProxyService