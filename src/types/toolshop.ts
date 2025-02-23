export interface GormModel {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt?: string | null; // optional, if not present it'll be undefined or null
  }
  
export interface RawCustomer extends GormModel {
    id: number;
    name: string;
    vat_number: string;
    company_type: string;
    street_address: string;
    city: string;
    postal_code: string;
    country: string;
    contact_name: string;
    email: string;
    phone: string;
    industry: string;
    website: string | null;
    created_at: string;
    updated_at: string;
    is_active: boolean;
 }

 export interface UIComponent {
    id: number;
    name: string;
    is_visible: boolean;
 }

 export interface RawUIComponent extends GormModel {
    id: number;
    name: string;
    is_visible: boolean;
}
 
// Define Customer interface
export interface Customer {
    id: number;
    name: string;
    vat_number: string;
    company_type: string;
    street_address: string;
    city: string;
    postal_code: string;
    country: string;
    contact_name: string;
    email: string;
    phone: string;
    industry: string;
    website: string | null;
    created_at: string;
    updated_at: string;
    is_active: boolean;
}

// Define Invoice interface
export interface Invoice {
    id: number;
    invoice_number: string;
    date_issued: string;
    due_date: string;
    total_amount: string;
    tax_amount: string;
    status: string; // NEW, PAID, CANCELLED
    created_at: string;
    updated_at: string;
    customer: number; // Customer ID
}   