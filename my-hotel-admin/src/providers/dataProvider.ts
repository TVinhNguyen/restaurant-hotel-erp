import { DataProvider } from "@refinedev/core";
import { apiRequest, API_BASE_URL } from "../utils/api";

export const dataProvider = (apiUrl: string = API_BASE_URL): DataProvider => ({
  getList: async ({ resource, pagination, filters, sorters }) => {
    const url = new URL(`${apiUrl}/${resource}`);

    // Pagination
    if (pagination) {
      const { page = 1, pageSize = 10 } = pagination as any;
      url.searchParams.append("page", String(page));
      url.searchParams.append("limit", String(pageSize));
    }

    // Filters
    if (filters) {
      filters.forEach((filter) => {
        if (filter.operator === "eq" && filter.value) {
          url.searchParams.append(filter.field, String(filter.value));
        }
      });
    }

    // Sorters
    if (sorters && sorters.length > 0) {
      const { field, order } = sorters[0];
      url.searchParams.append("sortBy", field);
      url.searchParams.append("order", order === "asc" ? "ASC" : "DESC");
    }

    const response = await apiRequest<any>(url.pathname + url.search, {
      method: "GET",
    });

    // Handle different response formats
    const data = response.data || response.items || response;
    const total = response.total || response.meta?.total || data.length;

    return {
      data,
      total,
    };
  },

  getOne: async ({ resource, id }) => {
    const response = await apiRequest<any>(`/${resource}/${id}`, {
      method: "GET",
    });

    return {
      data: response.data || response,
    };
  },

  create: async ({ resource, variables }) => {
    const response = await apiRequest<any>(`/${resource}`, {
      method: "POST",
      body: JSON.stringify(variables),
    });

    return {
      data: response.data || response,
    };
  },

  update: async ({ resource, id, variables }) => {
    const response = await apiRequest<any>(`/${resource}/${id}`, {
      method: "PUT",
      body: JSON.stringify(variables),
    });

    return {
      data: response.data || response,
    };
  },

  deleteOne: async ({ resource, id }) => {
    const response = await apiRequest<any>(`/${resource}/${id}`, {
      method: "DELETE",
    });

    return {
      data: response.data || response,
    };
  },

  getApiUrl: () => apiUrl,

  custom: async ({ url, method, payload, query, headers }) => {
    let requestUrl = url.startsWith("http") ? url : `${apiUrl}${url}`;

    if (query) {
      const urlObj = new URL(requestUrl);
      Object.entries(query).forEach(([key, value]) => {
        urlObj.searchParams.append(key, String(value));
      });
      requestUrl = urlObj.toString();
    }

    const response = await apiRequest<any>(requestUrl.replace(apiUrl, ""), {
      method: method || "GET",
      body: payload ? JSON.stringify(payload) : undefined,
      headers: headers as Record<string, string>,
    });

    return {
      data: response,
    };
  },
});
