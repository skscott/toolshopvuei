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

// Define Invoice interface
export interface RawInvoice extends GormModel {
    id: number;
    invoice_number: string;
    date_issued: string;
    due_date: string;
    total_amount: string;
    tax_amount: string;
    status: string; // NEW, PAID, CANCELLED
    created_at: string;
    updated_at: string;
    customer_id: number; // Customer ID
}
 
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
    customer_id: number; // Customer ID
}   

// Define InvoiceItem interface
export interface RawInvoiceItem extends GormModel {
    id: number;
    quantity: number;
    unit_price: string;
    inventory_item_id: number;
    invoice_id: number;
}        
 
export interface InvoiceItem {
    id: number;
    quantity: number;
    unit_price: string;
    inventory_item_id: number;
    invoice_id: number;
}

export interface RawInventory  extends GormModel {
    id: number;     
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface Inventory {
    id: number;     
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface RawInventoryItem extends GormModel {
    id: number;
    name: string;
    description: string;
    sku: string;
    price: string;
    stock_quantity: number;
    inventory_id: number;
}

export interface InventoryItem {
    id: number;
    name: string;
    description: string;
    sku: string;
    price: string;
    stock_quantity: number;
    inventory_id: number;
}


