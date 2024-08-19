import axios from "axios";
import { clearAuthState } from "../Features/Auth/authSlice";
const BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

let store;

export const injectStore = (s) => {
  store = s;
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(error);
    if (error.response && error.response.status === 401) {
      console.log("Invalid token revoked");
      store.dispatch(clearAuthState());
    }
    return Promise.reject(error);
  }
);

// **********************************
// Create a new monitor
// **********************************
axiosInstance.createMonitor = async (authToken, monitor) => {
  return axiosInstance.post(`/monitors`, monitor, {
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
  });
};

// **********************************
// Get all uptime monitors for a user
// **********************************
axiosInstance.getMonitorsByUserId = async (
  authToken,
  userId,
  limit,
  types,
  status,
  sortOrder,
  normalize
) => {
  const params = new URLSearchParams();

  if (limit) params.append("limit", limit);
  if (types) {
    types.forEach((type) => {
      params.append("type", type);
    });
  }
  if (status) params.append("status", status);
  if (sortOrder) params.append("sortOrder", sortOrder);
  if (normalize) params.append("normalize", normalize);

  return axiosInstance.get(`/monitors/user/${userId}?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
  });
};

// **********************************
// Get stats for a monitor
// **********************************
axiosInstance.getStatsByMonitorId = async (
  authToken,
  monitorId,
  sortOrder,
  limit,
  dateRange,
  numToDisplay,
  normalize
) => {
  const params = new URLSearchParams();
  if (sortOrder) params.append("sortOrder", sortOrder);
  if (limit) params.append("limit", limit);
  if (dateRange) params.append("dateRange", dateRange);
  if (numToDisplay) params.append("numToDisplay", numToDisplay);
  if (normalize) params.append("normalize", normalize);

  return axiosInstance.get(
    `/monitors/stats/${monitorId}?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
};

// **********************************
// Updates a single monitor
// **********************************
axiosInstance.updateMonitor = async (authToken, monitorId, updatedFields) => {
  return axiosInstance.put(`/monitors/${monitorId}`, updatedFields, {
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
  });
};

// **********************************
// Deletes a single monitor
// **********************************
axiosInstance.deleteMonitorById = async (authToken, monitorId) => {
  return axiosInstance.delete(`/monitors/${monitorId}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
  });
};

// **********************************
// Get certificate
// **********************************
axiosInstance.getCertificateExpiry = async (authToken, monitorId) => {
  return axiosInstance.get(`/monitors/certificate/${monitorId}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

// **********************************
// Register a new user
// **********************************
axiosInstance.registerUser = async (form) => {
  return axiosInstance.post(`/auth/register`, form);
};

// **********************************
// Log in an exisiting user
// **********************************
axiosInstance.loginUser = async (form) => {
  return axiosInstance.post(`/auth/login`, form);
};

// **********************************
// Update in an exisiting user
// **********************************
axiosInstance.updateUser = async (authToken, userId, form) => {
  return axiosInstance.put(`/auth/user/${userId}`, form, {
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
  });
};

// **********************************
// Forgot password request
// **********************************
axiosInstance.forgotPassword = async (form) => {
  return axiosInstance.post(`/auth/recovery/request`, form);
};

axiosInstance.validateRecoveryToken = async (recoveryToken) => {
  return axiosInstance.post("/auth/recovery/validate", {
    recoveryToken,
  });
};

// **********************************
// Set new password request
// **********************************
axiosInstance.setNewPassword = async (recoveryToken, form) => {
  return axiosInstance.post("/auth/recovery/reset", {
    ...form,
    recoveryToken,
  });
};

// **********************************
// Check for admin user
// **********************************
axiosInstance.doesAdminExist = async () => {
  return axiosInstance.get("/auth/users/admin");
};

// **********************************
// Get all users
// **********************************
axiosInstance.getAllUsers = async (authToken) => {
  return axiosInstance.get("/auth/users", {
    headers: { Authorization: `Bearer ${authToken}` },
  });
};

// **********************************
// Request Invitation Token
// **********************************
axiosInstance.requestInvitationToken = async (authToken, email, role) => {
  return axiosInstance.post(
    `/auth/invite`,
    { email, role },
    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );
};

// **********************************
// Verify Invitation Token
// **********************************
axiosInstance.verifyInvitationToken = async (token) => {
  return axiosInstance.post(`/auth/invite/verify`, {
    token,
  });
};

// **********************************
// Get all checks for a given monitor
// **********************************

axiosInstance.getChecksByMonitor = async (
  authToken,
  monitorId,
  sortOrder,
  limit,
  dateRange,
  filter,
  page,
  rowsPerPage
) => {
  const params = new URLSearchParams();
  if (sortOrder) params.append("sortOrder", sortOrder);
  if (limit) params.append("limit", limit);
  if (dateRange) params.append("dateRange", dateRange);
  if (filter) params.append("filter", filter);
  if (page) params.append("page", page);
  if (rowsPerPage) params.append("rowsPerPage", rowsPerPage);

  return axiosInstance.get(`/checks/${monitorId}?${params.toString()}`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
};

// **********************************
// Get all checks for a given user
// **********************************
axiosInstance.getChecksByUser = async (
  authToken,
  userId,
  sortOrder,
  limit,
  dateRange,
  filter,
  page,
  rowsPerPage
) => {
  const params = new URLSearchParams();
  if (sortOrder) params.append("sortOrder", sortOrder);
  if (limit) params.append("limit", limit);
  if (dateRange) params.append("dateRange", dateRange);
  if (filter) params.append("filter", filter);
  if (page) params.append("page", page);
  if (rowsPerPage) params.append("rowsPerPage", rowsPerPage);
  return axiosInstance.get(`/checks/user/${userId}?${params.toString()}`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
};

export default axiosInstance;
