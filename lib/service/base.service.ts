 



import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosRequestConfig } from "axios";
import { router } from "expo-router";

// ===============================
// ENV CONFIG
// ===============================
const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;

if (!BASE_URL) {
  console.warn("❌ BASE_URL is not defined in env");
}

export const baseUrl = BASE_URL;
export const serverUrl = BASE_URL;

// ===============================
// HTTP SERVICE
// ===============================
export class HttpService {

  CancelToken: any;
  source: any;

  constructor() {
     this.CancelToken = axios.CancelToken;
    this.source = this.CancelToken.source();

    /**
     * ===============================
     * REQUEST INTERCEPTOR
     * Automatically attach Bearer token
     * ===============================
     */
    axios.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem("token");
console.log('Token',token)
        if (token) {
          config.headers = config.headers ?? {};
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    /**
     * ===============================
     * RESPONSE INTERCEPTOR
     * Handle 401 globally
     * ===============================
     */
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error?.response?.status === 401) {
          console.log("🔐 Unauthorized – clearing storage");
          await AsyncStorage.clear();
          // You can navigate to login here if needed
          
          router.push('/auth/login')
        }
        return Promise.reject(error);
      }
    );
  }

  // Common Axios config
  private getConfig = (options: AxiosRequestConfig = {}) => ({
    ...options,
    cancelToken: this.source.token,
    withCredentials: true,
  });

  /**
   * ===============================
   * GET
   * ===============================
   */
  protected get = async <T = any>(url: string, params?: any): Promise<T> => {
    const res = await axios.get<T>(`${BASE_URL}/${url}`, this.getConfig({ params }));
    return res.data;
  };

  /**
   * ===============================
   * POST
   * ===============================
   */
  protected post = async <T = any>(
    url: string,
    body?: any,
    options: AxiosRequestConfig = {}
  ): Promise<T> => {
    const res = await axios.post<T>(`${BASE_URL}/${url}`, body, this.getConfig(options));
    return res.data;
  };

  /**
   * ===============================
   * PUT
   * ===============================
   */
  protected put = async <T = any>(url: string, body?: any, params?: any): Promise<T> => {
    const res = await axios.put<T>(`${BASE_URL}/${url}`, body, this.getConfig({ params }));
    return res.data;
  };

  /**
   * ===============================
   * PATCH
   * ===============================
   */
  protected patch = async <T = any>(url: string, body?: any, params?: any): Promise<T> => {
    const res = await axios.patch<T>(`${BASE_URL}/${url}`, body, this.getConfig({ params }));
    return res.data;
  };

  /**
   * ===============================
   * DELETE
   * ===============================
   */
  protected delete = async <T = any>(url: string, params?: any, data?: any): Promise<T> => {
    const res = await axios.delete<T>(`${BASE_URL}/${url}`, this.getConfig({ params, data }));
    return res.data;
  };

  /**
   * ===============================
   * CANCEL REQUESTS
   * ===============================
   */
  cancel = () => {
    this.source.cancel("HTTP request cancelled");
    this.source = this.CancelToken.source();
  };
}
