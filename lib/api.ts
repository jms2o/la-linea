import type {
  CategoryDTO,
  OrderDTO,
  ProductDTO,
  StoreSettingDTO
} from "@/types";
import type {
  CreateOrderInput,
  LoginInput,
  RegisterCustomerInputPayload
} from "@/lib/validations";

export type AuthResult = {
  kind: "admin" | "customer";
  name: string;
  redirectTo: string;
};

type ProductParams = {
  search?: string;
  category?: string;
  sort?: "recent" | "price-asc" | "price-desc";
};

function withQuery(path: string, params: Record<string, string | undefined>): string {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      query.set(key, value);
    }
  });

  const queryString = query.toString();
  return queryString ? `${path}?${queryString}` : path;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers
    }
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getProducts(params: ProductParams = {}) {
  return request<ProductDTO[]>(
    withQuery("/api/products", {
      search: params.search,
      category: params.category,
      sort: params.sort
    })
  );
}

export function getProductBySlug(slug: string) {
  return request<ProductDTO>(`/api/products/${slug}`);
}

export function getCategories() {
  return request<CategoryDTO[]>("/api/categories");
}

export function createOrder(data: CreateOrderInput) {
  return request<OrderDTO>("/api/orders", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function getSettings() {
  return request<StoreSettingDTO>("/api/settings");
}

async function authRequest(path: string, body: unknown): Promise<AuthResult> {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? "No se pudo completar la solicitud.");
  }

  return data as AuthResult;
}

export function login(data: LoginInput) {
  return authRequest("/api/auth/login", data);
}

export function registerCustomer(data: RegisterCustomerInputPayload) {
  return authRequest("/api/auth/register", data);
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}

export function getAdminProducts() {
  return getProducts();
}

export function createProduct(data: unknown) {
  return request<ProductDTO>("/api/admin/products", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function updateProduct(id: string, data: unknown) {
  return request<ProductDTO>(`/api/admin/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data)
  });
}

export function getOrders() {
  return request<OrderDTO[]>("/api/orders");
}

export function getOrderById(id: string) {
  return request<OrderDTO>(`/api/orders/${id}`);
}

export function updateOrderStatus(id: string, status: OrderDTO["status"]) {
  return request<OrderDTO>(`/api/orders/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status })
  });
}
