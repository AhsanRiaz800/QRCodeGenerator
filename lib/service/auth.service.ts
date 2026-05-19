 
import { HttpService } from "@/lib/service/base.service";

// ===============================
// REQUEST TYPES
// ===============================
export interface ISignupPayload {
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface IVerifyOtpPayload {
  email: string;
  otp: string;
}

// ===============================
// UPDATE PROFILE TYPES
// ===============================
export interface IUpdateProfilePayload {
  username?: string;
  email?: string;
  phoneNumber?: string;
}

export interface IUpdateProfileResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      username: string;
      email: string;
      phoneNumber: string;
      isVerified: boolean;
    };
  };
}

// ===============================
// RESPONSE TYPES
// ===============================
export interface ISignupResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      username: string;
      email: string;
      phoneNumber: string;
      isVerified: boolean;
    };
  };
}

export interface IVerifyOtpResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      username: string;
      email: string;
      phoneNumber: string;
      isVerified: boolean;
    };
    token: string;
  };
}

// ===============================
// AUTH SERVICE
// ===============================
class AuthService extends HttpService {
  private readonly prefix = "api/auth";

  // SIGNUP
  signup = async (payload: ISignupPayload) => {
    return this.post<ISignupResponse>(`${this.prefix}/signup`, payload);
  };

  // VERIFY OTP
  verifyOtp = async (payload: IVerifyOtpPayload) => {
    return this.post<IVerifyOtpResponse>(`${this.prefix}/verify-otp`, payload);
  };

  login = (payload:any) => {
    return this.post("api/auth/login", payload);
  };

  forgotPassword = (payload: { email: string }) => {
    return this.post("api/auth/forgot-password", payload);
  };

  resetPassword = (payload: {
    email: string;
    otp: string;
    newPassword: string;
  }) => {
    return this.post("api/auth/reset-password", payload);
  };

  // UPDATE PROFILE
updateProfile = async (payload: IUpdateProfilePayload) => {
  return this.put<IUpdateProfileResponse>(
    `${this.prefix}/update-profile`,
    payload
  );
};
}

export const authService = new AuthService();