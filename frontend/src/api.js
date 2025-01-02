// api.js

const BASE_URL = "http://localhost:5050";

// Base fetch function
const baseFetch = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const defaultHeaders = { "Content-Type": "application/json" };
  const headers = options.headers
    ? { ...defaultHeaders, ...options.headers }
    : defaultHeaders;

  try {
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    if (response.status !== 204) {
      // For non-204 responses, parse JSON
      return await response.json();
    }
    return null; // For DELETE or similar requests with no body
  } catch (error) {
    console.error(`API error on ${url}:`, error);
    throw error;
  }
};

// Auth APIs
export const loginUser = (loginInfo) =>
  baseFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(loginInfo),
  });

export const signupUser = (signupInfo) =>
  baseFetch("/auth/signup", {
    method: "POST",
    body: JSON.stringify(signupInfo),
  });

// Company APIs
export const fetchCompanies = () => baseFetch("/admin/companies");

export const addOrUpdateCompany = (company) =>
  baseFetch(`/admin/companies${company._id ? `/${company._id}` : ""}`, {
    method: company._id ? "PUT" : "POST",
    body: JSON.stringify(company),
  });

export const deleteCompany = (id) =>
  baseFetch(`/admin/companies/${id}`, { method: "DELETE" });

// Communication Method APIs
export const fetchMethods = () => baseFetch("/admin/communication-methods");

export const addOrUpdateMethod = (method) =>
  baseFetch(
    `/admin/communication-methods${method._id ? `/${method._id}` : ""}`,
    {
      method: method._id ? "PUT" : "POST",
      body: JSON.stringify(method),
    }
  );

export const deleteMethod = (id) =>
  baseFetch(`/admin/communication-methods/${id}`, { method: "DELETE" });

// Notifications APIs
export const fetchOverdueAndDue = () =>
  baseFetch("/admin/notifications");

export const fetchCalendarData = () =>
  baseFetch("/admin/communications/calendar");
