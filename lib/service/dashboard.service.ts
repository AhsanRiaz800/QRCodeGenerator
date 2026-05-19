import { HttpService } from "@/lib/service/base.service";

// ===============================
// TYPES
// ===============================
export interface IQrItem {
  id: string;
  name: string;
  type: "whatsapp" | "website";
  scans: number;
  userId: string;
  createdAt: string;
  updatedAt: string;

  whatsappData?: {
    phone: string;
    message: string;
  };

  websiteData?: {
    url: string;
  };
}


export interface IUpdateQRPayload {
  name?: string;
  type?: "whatsapp" | "website";

  whatsappData?: {
    phone?: string;
    message?: string;
  };

  websiteData?: {
    url?: string;
  };
}


export interface IGetQRResponse {
  success: boolean;
  message: string;
  data: {
    qrs: IQrItem[];
    total: number;
  };
}

// ===============================
// SERVICE
// ===============================
class DashboardService extends HttpService {
  private readonly prefix = "api";

  // CREATE QR
  createQR = (payload: any) => {
    return this.post(`${this.prefix}/qr`, payload);
  };

  // GET ALL QRs
  getAllQRs = () => {
    return this.get<IGetQRResponse>(`${this.prefix}/qr`);
  };

  updateQR = (id: string, payload: IUpdateQRPayload) => {
    return this.put(`${this.prefix}/qr/${id}`, payload);
  };


   // 🗑 DELETE QR
   deleteQR = (id: string) => {
    return this.delete(`${this.prefix}/qr/${id}`);
  };

  
}

export const dashboardService = new DashboardService();