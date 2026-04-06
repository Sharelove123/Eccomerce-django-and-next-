export interface ImageList {
  img1: string;
  img2: string;
  img3: string;
  img4: string;
}

export interface Category {
  name: string;
}

export interface VendorMini {
  id: number;
  store_name: string;
  slug: string;
  store_logo: string | null;
}

export interface Vendor {
  id: number;
  store_name: string;
  slug: string;
  store_description: string;
  store_logo: string | null;
  store_banner: string | null;
  phone?: string;
  address?: string;
  is_approved: boolean;
  commission_rate: number;
  total_revenue?: number;
  total_sales_count?: number;
  product_count?: number;
  average_rating?: number;
  owner_name?: string;
  created_at: string;
}

export interface VendorDashboard {
  id: number;
  store_name: string;
  slug: string;
  is_approved: boolean;
  total_revenue: number;
  total_sales_count: number;
  commission_rate: number;
  product_count: number;
  average_rating: number;
  pending_orders_count: number;
  recent_orders: OrderItemList[];
  created_at: string;
}

export interface Product {
  id: number;
  title: string;
  category: Category;
  rateing: number;
  orginalPrice: number;
  discountedPrice: number;
  discription: string;
  imagelist: ImageList;
  created_at: string;
  get_discount_percentage: number | null;
  vendor: VendorMini | null;
  is_active?: boolean;
  stock?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Address {
  id: number;
  user: number;
  country: string;
  state: string;
  city: string;
  street_name: string;
  apartment_number: string;
  postal_code: string;
}

export interface User {
  id: string;
  name: string;
  avatar_url: string;
}

export interface Order {
  id: number;
  user: User;
  address: Address;
  delivered: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  Order_items: OrderItemList[];
  total_price: number;
}

export interface OrderItemList {
  id: number;
  product: Product;
  quantity: number;
  total_price: number;
  vendor_name?: string;
  vendor_id?: number | null;
  vendor_slug?: string | null;
}

export interface ProductReview {
  id: number;
  user: User;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface ReviewsResponse {
  reviews: ProductReview[];
  avg_rating: number;
  total_reviews: number;
}

export interface VendorStatus {
  is_vendor: boolean;
  is_approved: boolean;
  store_name?: string;
  slug?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ChatCounterpart {
  id: string;
  name: string;
  avatar_url: string;
  role: 'vendor' | 'customer';
  store_name?: string;
  slug?: string;
}

export interface ChatProductReference {
  id: number;
  title: string;
  image_url: string | null;
}

export interface ChatMessage {
  id: number;
  sender: User;
  content: string;
  is_read: boolean;
  is_own_message: boolean;
  created_at: string;
}

export interface ChatThreadSummary {
  id: number;
  vendor: VendorMini;
  customer: User;
  product: ChatProductReference | null;
  counterpart: ChatCounterpart;
  subject: string;
  last_message: ChatMessage | null;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

export interface ChatThreadDetail extends ChatThreadSummary {
  messages: ChatMessage[];
}
