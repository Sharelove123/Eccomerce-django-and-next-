export interface ImageList {
  img1: string;
  img2: string;
  img3: string;
  img4: string;
}

export interface Category {
  name: string;
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
}

export interface CartItem {
  product:Product,
  quantity:Number
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
    id: number;
    name:string;
    avatar_url:string;
}


export interface Order{
  id: number;
  user:User;
  address:Address;
  delivered:boolean;
  created_at:string;
  updated_at:string;
  Order_items:CartItem;
  total_price: number;
}

export interface OrderItemList{
  id: number;
  product:Product;
  quantity:Number;
  total_price:Number;
}

