import { Customer, RawCustomer, RawUIComponent, UIComponent } from "@/types";

export function transformCustomer(raw: RawCustomer): Customer {
    return {
        id: raw.ID,  // if you prefer to rename it
        name: raw.name,
        email: raw.email,
        vat_number: raw.vat_number,
        company_type: raw.company_type,
        street_address: raw.street_address,
        city: raw.city,
        country: raw.country,
        postal_code: raw.postal_code,
        phone: raw.phone,
        website: raw.website,
        created_at: raw.created_at,
        updated_at: raw.updated_at,
        contact_name: raw.contact_name,
        industry: raw.industry,
        is_active: raw.is_active,
    };
}

export function transformUIComponent(raw: RawUIComponent): UIComponent {
    return {
        id: raw.ID,
        name: raw.name,
        is_visible: raw.is_visible,
    };
}