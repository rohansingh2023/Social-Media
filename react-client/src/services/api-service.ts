import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

interface AxiosConfig {
  baseUrl: string;
  headers?: Record<string, string>;
}

class ApiProxyService {
  private instance: AxiosInstance;

  constructor(config: AxiosConfig) {
    this.instance = axios.create({
      baseURL: config.baseUrl,
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
    });

    // Add request interceptor to attach the access token
    this.instance.interceptors.request.use(
      (config) => {
        const accessToken = localStorage.getItem("userToken"); // or use memory if preferred
        const matches = accessToken?.match(/"(.*?)"/);
        if (accessToken) {
          config.headers["Authorization"] = `${matches}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle token refresh if expired
    //   this.instance.interceptors.response.use(
    //     (response) => response, // Return response if successful
    //     async (error) => {
    //       const originalRequest = error.config;

    //       // Check if the error is due to expired token (401 error) and not already retried
    //       if (error.response?.status === 401 && !originalRequest._retry) {
    //         originalRequest._retry = true;

    //         // Try refreshing the token
    //         const refreshToken = localStorage.getItem('refresh_token');
    //         if (refreshToken) {
    //           try {
    //             // Request to refresh token
    //             const response = await axios.post('https://your-auth-service-url.com/refresh-token', { refresh_token: refreshToken });
    //             const { access_token } = response.data;

    //             // Store the new access token
    //             localStorage.setItem('access_token', access_token);

    //             // Retry the original request with the new access token
    //             originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
    //             return this.instance(originalRequest); // Retry the request
    //           } catch (err) {
    //             // If refresh token fails, redirect to login or show an error
    //             console.error('Refresh token failed:', err);
    //             window.location.href = '/login'; // Redirect to login
    //             return Promise.reject(err);
    //           }
    //         }
    //       }
    //       return Promise.reject(error);
    //     }
    //   );
  }

  public get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.get(url, config);
  }

  public post<T, R>(
    url: string,
    data: T,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<R>> {
    return this.instance.post(url, data, config);
  }

  public put<T, R>(
    url: string,
    data: T,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<R>> {
    return this.instance.put(url, data, config);
  }

  public delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.delete(url, config);
  }
}

export default ApiProxyService;
