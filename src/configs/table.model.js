// WP -- WaterPlant--completed
// VEH-- Vehicle------partial
// IND -- Industry----completed
// CTR -- Contactor---completed
// SCTR- Sub Contractor---completed
// DR -- Driver-----------completed
// DB -- Delivery BOY------ partial
// TPA -- TransPort Agent----completed 
// PD -- Personal Details------completed

let enumValue = {
    screen_id: {
        'WP': "WaterPlant",
        'VEH': "Vehicle",
        'IND': "Industry",
        'CTR': "Contactor",
        'SCTR': "Sub Contractor",
        'DR': "Driver",
        'DB': "Delivery Boy",
        'TPA': "TransPort Agent",
        'PD': "Personal Details"
    }
}
let enumObject = {
    screen_id: ['WP', 'VEH', 'IND', 'CTR', 'SCTR', 'DR', 'DB', 'TPA', 'PD']
}

// waterplant series = 1,00,001 4,00,000
// contractor series = 5,00,000  8,00,000
// sub contractor series = 9,00,000 12,00,000
// vehicle series = 13,00,000 16,00,000
// industry series = 17,00,000 20,00,000
// driver series = 21,00,000 24,00,000
// delivery boy series = 25,00,000 28,00,000
// transport agent series = 29,00,000 32,00,000
// personal details series = 33,00,000 36,00,000
// group series = 37,00,000 40,00,000


let field = {
    required: "required",
    noRequired: "noRequired",
    varchar: "string",
    num: "number",
    date: "date",
    timestamp: "timestamp",
    object: "object",
    boolean: "boolean",
    json: "json",
    noValidate: "noValidate"
    //enum: (id) => enumObject[id]
};

// enum screen_id { Apple, Pear, Orange };


const tl_field_info = (method) => [
    { "id": [method === 'update' ? field.required : field.noRequired, field.num] },
    { 'form_name': [field.required, field.num] },
    { 'field_position': [field.noRequired, field.num] },
    { 'section_column_grid': [field.noRequired, field.varchar] },
    { 'section_position': [field.noRequired, field.num] },
    { 'section': [field.required, field.num] },
    { 'ctry_cd': [field.noRequired, field.num, 1, 3] },
    { 'lang_cd': [field.noRequired, field.num, 1, 2] },
    { 'field_label': [field.required, field.num, 1, 255] },
    { 'field_nm': [field.required, field.varchar, 1, 100] },
    { 'component_type': [field.required, field.num] },
    { 'field_default_value': [field.noRequired, field.varchar, 1, 255] },
    { 'field_desc_text_id': [field.noRequired, field.varchar, 1, 255] },
    { 'field_data_type': [field.noRequired, field.varchar, 1, 20] },
    { 'field_length': [field.noRequired, field.varchar, 1, 10] },
    { 'field_validations': [field.required, field.num] },
    { 'field_tooltip_text_id': [field.noRequired, field.varchar, 1, 255] },
    { 'is_readonly': [field.noRequired, field.boolean] },
    { 'display_order': [field.required, field.num] },
    { 'is_enabled': [field.noRequired, field.boolean] },
    { 'created_by': [field.noValidate, field.varchar, 1, 50] },
    { 'created_on': [field.noValidate, field.timestamp] },
    { 'modified_by': [field.noValidate, field.varchar, 1, 50] },
    { 'field_options': [field.noRequired, field.num] },
    { 'field_options_icon': [field.noRequired, field.num] },
    { 'field_icon': [field.noRequired, field.varchar] }
];

const tl_field_labels = [
    { "screen_id": [field.required, field.varchar, 1, 5] },
    { "ctry_cd": [field.required, field.varchar, 1, 3] },
    { "lang_cd": [field.required, field.varchar, 1, 2] },
    { "label_id": [field.required, field.varchar, 1, 30] },
    { "text_label": [field.required, field.varchar, 1, 250] },
    { "created_by": [field.noValidate, field.varchar, , 1, 50] },
    { "created_on": [field.noValidate, field.timestamp] },
    { "modified_by": [field.noValidate, field.timestamp] },
    { "modified_on": [field.noValidate, field.timestamp] }
]

const tl_profile = (method) => [
    { "id": [method === 'update' ? field.required : field.noRequired, field.num] },
    { "parent_id": [field.required, field.num, 1, 50] },
    { "user_type_id": [field.required, field.num, 1, 50] },
    { "description": [field.required, field.varchar, 1, 50] },
    { "action_flag": [field.noValidate, field.varchar, 1, 1] },
    { "created_by": [field.noValidate, field.varchar, 1, 50] },
    { "created_on": [field.noValidate, field.timestamp] },
    { "modified_by": [field.noValidate, field.varchar, 1, 50] },
    { "modified_on": [field.noValidate, field.timestamp] }
];

const tl_function = (method) => [
    { "id": [method === 'update' ? field.required : field.noRequired, field.num] },
    { "function_name": [field.required, field.varchar, 1, 50] },
    // { "label": [field.required, field.varchar, 1, 100] },
    // { "function_description": [field.required, field.varchar, 1, 50] },
    { "action_flag": [field.noValidate, field.varchar, 1, 1] },
    { "created_by": [field.noValidate, field.varchar, 1, 50] },
    { "created_on": [field.noValidate, field.timestamp] },
    { "modified_by": [field.noValidate, field.varchar, 1, 50] },
    { "modified_on": [field.noValidate, field.timestamp] }
];

const tl_profile_function = (method) => [
    { "id": [method === 'update' ? field.required : field.noRequired, field.num] },
    { "profile_id": [field.required, field.num, 1, 50] },
    { "function_id": [field.required, field.num, 1, 50] },
    { "_create": [field.required, field.num] },
    { "_createAll": [field.required, field.num] },
    { "_read": [field.required, field.num] },
    { "_readAll": [field.required, field.num] },
    { "_update": [field.required, field.num] },
    { "_updateAll": [field.required, field.num] },
    { "_delete": [field.required, field.num] },
    { "_deleteAll": [field.required, field.num] },
    { "action_flag": [field.noValidate, field.varchar, 1, 1] },
    { "created_by": [field.noValidate, field.varchar, 1, 50] },
    { "created_on": [field.noValidate, field.timestamp] },
    { "modified_by": [field.noValidate, field.varchar, 1, 50] },
    { "modified_on": [field.noValidate, field.timestamp] }
];

const tl_user_type = (method) => [
    { "id": [method === 'update' ? field.required : field.noRequired, field.num] },
    { "user_type": [field.required, field.varchar, 1, 50] },
    { "action_flag": [field.noValidate, field.varchar, 1, 1] },
    { "created_by": [field.noValidate, field.varchar, 1, 50] },
    { "created_on": [field.noValidate, field.timestamp] },
    { "modified_by": [field.noValidate, field.varchar, 1, 50] },
    { "modified_on": [field.noValidate, field.timestamp] }
];

const tl_subscription = (method) => [
    { "id": [method === 'update' ? field.required : field.noRequired, field.num] },
    { "group_id": [field.required, field.num, 1, 50] },
    { "profile_id": [field.required, field.num, 1, 50] },
    { "subscription_name": [field.required, field.string, 1, 50] },
    { "services_available": [field.required, field.varchar, 1, 50] },
    { "services_subscribed": [field.required, field.varchar, 1, 50] },
    { "subscription_starts_on": [field.noValidate, field.timestamp] },
    { "subscription_ends_on": [field.noValidate, field.timestamp] },
    { "subsciption_type": [field.required, field.varchar, 1, 50] },
    { "subscription_period": [field.required, field.varchar, 1, 50] },
    { "subscription_fees": [field.required, field.num] },
    { "discount_given": [field.required, field.varchar, 1, 50] },
    { "discount_reason": [field.required, field.varchar, 1, 50] },
    { "discounted_price": [field.required, field.num] },
    { "invoice_no": [field.required, field.varchar, 1, 50] },
    { "payment_mode": [field.required, field.varchar, 1, 50] },
    { "payment_status": [field.required, field.varchar, 1, 50] },
    { "payment_received_on": [field.noRequired, field.timestamp] },
    { "payment_received_by": [field.required, field.varchar, 1, 50] },
    { "gst_value": [field.required, field.varchar, 1, 50] },
    { "sst_value": [field.required, field.varchar, 1, 50] },
    { "notify_expiry_daysbefore": [field.required, field.varchar, 1, 1] },
    { "notify_expiry_by_email": [field.required, field.varchar, 1, 1] },
    { "notify_expiry_by_phone": [field.required, field.varchar, 1, 1] },
    { "receive_newsletters_on_mail": [field.required, field.varchar, 1, 1] },
    { "action_flag": [field.noValidate, field.varchar, 1, 1] },
    { "created_by": [field.noValidate, field.varchar, 1, 50] },
    { "created_on": [field.noValidate, field.timestamp] },
    { "modified_by": [field.noValidate, field.varchar, 1, 50] },
    { "modified_on": [field.noValidate, field.timestamp] }
];

const tl_user = (method) => [
    { "id": [method === 'update' ? field.required : field.noRequired, field.num] },
    { "services_granted": [field.noRequired, field.varchar, 1, 50] },
    { "first_name": [field.required, field.varchar, 1, 50] },
    { "last_name": [field.required, field.varchar, 1, 50] },
    { "gender": [field.required, field.varchar, 1, 50] },
    { "dob": [field.noValidate, field.varchar] },
    { "contact_address": [field.required, field.varchar, 1, 50] },
    { "country_code": [field.noRequired, field.num, 1, 2] },
    { "pin": [field.required, field.varchar, 1, 50] },
    { "contact_number": [field.required, field.varchar] },
    { "contat_email": [field.required, field.varchar, 1, 50] },
    { "attached_photo": [field.noRequired, field.varchar, 1, 50] },
    { "id_proof_type": [field.required, field.varchar, 1, 50] },
    { "id_proof_no": [field.required, field.varchar, 1, 50] },
    { "attached_id_proof": [field.required, field.num] },
    { "user_name": [field.required, field.varchar, 1, 50] },
    { "password": [field.required, field.varchar, 1, 50] },
    { "secondary_check_enabled": [field.required, field.varchar, 1, 20] },
    { "otpenabled_phone": [field.noRequired, field.varchar, 1, 1] },
    { "otpenabled_email": [field.noRequired, field.varchar, 1, 1] },
    { "is_loggedin": [field.noValidate, field.varchar, 1, 1] },
    { "last_login_time": [field.noValidate, field.timestamp] },
    { "is_activeuser": [field.noRequired, field.varchar, 1, 1] },
    { "deactivate_after_inactive_days": [field.noRequired, field.num] },
    { "session_id": [field.noRequired, field.varchar, 1, 250] },
    { "ip_address": [field.noRequired, field.varchar, 1, 50] },
    { "action_flag": [field.noValidate, field.varchar, 1, 1] },
    { "created_by": [field.noValidate, field.varchar, 1, 50] },
    { "created_on": [field.noValidate, field.timestamp] },
    { "modified_by": [field.noValidate, field.varchar, 1, 50] },
    { "modified_on": [field.noValidate, field.timestamp] }
];



const tl_team = (method) => [
    { "id": [method === 'update' ? field.required : field.noRequired, field.num] },
    { "group_id": [field.required, field.num, 1, 50] },
    { "team_id": [field.required, field.num, 1, 50] },
    { "team_allocated_to": [field.required, field.varchar, 1, 50] },
    { "team_details": [field.required, field.varchar, 1, 50] },
    { "team_effective_from": [field.noValidate, field.timestamp] },
    { "team_effective_until": [field.noValidate, field.timestamp] },
    { "team_capacity_per_day": [field.required, field.num] },
    { "action_flag": [field.noValidate, field.varchar, 1, 1] },
    { "created_by": [field.noValidate, field.varchar, 1, 50] },
    { "created_on": [field.noValidate, field.timestamp] },
    { "modified_by": [field.noValidate, field.varchar, 1, 50] },
    { "modified_on": [field.noValidate, field.timestamp] }
];

const tl_audit_log = (method) => [
    { "id": [method === 'update' ? field.required : field.noRequired, field.num] },
    { "group_id": [field.required, field.num, 1, 50] },
    { "table_id": [field.required, field.num, 1, 50] },
    { "record_type": [field.required, field.varchar, 1, 50] },
    { "record_affected": [field.required, field.varchar, 1, 50] },
    { "field_affected": [field.required, field.varchar, 1, 50] },
    { "remarks": [field.required, field.varchar, 1, 50] },
    { "log_purges_on": [field.noRequired, field.timestamp] },
    { "changes_done_by": [field.required, field.varchar, 1, 50] },
    { "changes_done_on": [field.noRequired, field.timestamp] }
];

const tl_retention = (method) => [
    { "id": [method === 'update' ? field.required : field.noRequired, field.num] },
    { "group_id": [field.required, field.num, 1, 50] },
    { "table_id": [field.required, field.num, 1, 50] },
    { "retention_period": [field.required, field.num] },
    { "action_flag": [field.noValidate, field.varchar, 1, 1] },
    { "created_by": [field.noValidate, field.varchar, 1, 50] },
    { "created_on": [field.noValidate, field.timestamp] },
    { "modified_by": [field.noValidate, field.varchar, 1, 50] },
    { "modified_on": [field.noValidate, field.timestamp] }
];

const tl_sequence = [
    { "group_id": [field.required, field.varchar, 1, 50] },
    { "table_id": [field.required, field.varchar, 1, 50] },
    { "field_name": [field.required, field.varchar, 1, 50] },
    { "sequence_starts_from": [field.required, field.varchar, 1, 50] },
    { "sequence_ends_at": [field.required, field.varchar, 1, 50] },
    { "last_sequence_numer": [field.required, field.varchar, 1, 50] },
    { "string_to_append": [field.required, field.varchar, 1, 50] },
    { "action_flag": [field.noValidate, field.varchar, 1, 1] },
    { "created_by": [field.noValidate, field.varchar, 1, 50] },
    { "created_on": [field.noValidate, field.timestamp] },
    { "modified_by": [field.noValidate, field.varchar, 1, 50] },
    { "modified_on": [field.noValidate, field.timestamp] }
];

const tl_tables = [
    { "group_id": [field.required, field.varchar, 1, 50] },
    { "table_id": [field.required, field.varchar, 1, 50] },
    { "table_name": [field.required, field.varchar, 1, 50] },
    { "action_flag": [field.noValidate, field.varchar, 1, 1] },
    { "created_by": [field.noValidate, field.varchar, 1, 50] },
    { "created_on": [field.noValidate, field.timestamp] },
    { "modified_by": [field.noValidate, field.varchar, 1, 50] },
    { "modified_on": [field.noValidate, field.timestamp] }
];

const tl_water_plant = (method) => [
    { "id": [method === 'update' ? field.required : field.noRequired, field.num] },
    { "user_id": [field.required, field.num] },
    { "plant_name": [field.required, field.varchar, 1, 50] },
    { "established_on": [field.noValidate, field.timestamp] },
    { "plant_type": [field.required, field.varchar, 1, 50] },
    { "plant_contact_no": [field.required, field.varchar, 1, 20] },
    { "plant_contact_email": [field.required, field.varchar, 1, 50] },
    { "plant_contact_address": [field.required, field.varchar, 1, 500] },
    { "plant_pincode": [field.required, field.varchar, 1, 6] },
    { "country_code": [field.required, field.varchar, 1, 3] },
    { "plant_licence_no": [field.required, field.varchar, 1, 50] },
    { "plant_isi_number": [field.required, field.varchar, 1, 50] },
    { "plant_fssai_number": [field.required, field.varchar, 1, 20] },
    { "is_owned_by_user": [field.required, field.varchar, 1, 1] },
    { "owned_by": [field.required, field.varchar, 1, 50] },
    { "delivery_capacity": [field.required, field.num] },
    { "having_own_transport": [field.required, field.varchar, 1, 1] },
    { "having_own_deliveryteam": [field.required, field.varchar, 1, 1] },
    { "is_delivery_supported": [field.required, field.varchar, 1, 1] },
    { "attached_wp_photo": [field.required, field.varchar, 1, 50] },
    { "attached_isi_reference": [field.required, field.varchar, 1, 50] },
    { "attached_fssai_reference": [field.required, field.varchar, 1, 50] },
    { "available_on_mon_fri": [field.required, field.varchar, 1, 50] },
    { "available_on_sat": [field.required, field.varchar, 1, 50] },
    { "available_on_sun": [field.required, field.varchar, 1, 50] },
    { "receivable_payment_mode": [field.required, field.varchar, 1, 10] },
    { "receivable_pymt_frequency": [field.required, field.varchar, 1, 10] },
    { "service_available_to_pin": [field.required, field.varchar, 1, 6] },
    { "action_flag": [field.noValidate, field.varchar, 1, 1] },
    { "created_by": [field.noValidate, field.varchar, 1, 50] },
    { "created_on": [field.noValidate, field.timestamp] },
    { "modified_by": [field.noValidate, field.varchar, 1, 50] },
    { "modified_on": [field.noValidate, field.timestamp] },
    { "plant_capacity": [field.required, field.num] }
];

const tl_industry = (method) => [
    { "id": [method === 'update' ? field.required : field.noRequired, field.num] },
    { "group_id": [field.noRequired, field.num, 1, 50] },
    { "user_id": [field.required, field.num, 1, 50] },
    { "industry_name": [field.required, field.varchar, 1, 50] },
    { "established_on": [field.noValidate, field.timestamp] },
    { "industry_contact_phone": [field.required, field.varchar, 1, 20] },
    { "industry_contact_email": [field.required, field.varchar, 1, 50] },
    { "industry_address": [field.required, field.varchar, 1, 50] },
    { "industry_pin": [field.required, field.varchar, 1, 6] },
    { "country_code": [field.required, field.varchar, 1, 3] },
    { "deliveryvolume_expected_mon_fri": [field.required, field.num] },
    { "deliveryvolume_expected_sat": [field.required, field.num] },
    { "deliveryvolume_expected_sun": [field.required, field.num] },
    { "delivery_slot1_mon_fri": [field.required, field.varchar, 1, 50] },
    { "delivery_slot2_mon_fri": [field.required, field.varchar, 1, 20] },
    { "delivery_slot1_sat": [field.required, field.varchar, 1, 50] },
    { "delivery_slot2_sat": [field.required, field.varchar, 1, 50] },
    { "delivery_slot1_sun": [field.required, field.varchar, 1, 50] },
    { "delivery_slot2_sun": [field.required, field.varchar, 1, 1] },
    { "km_coverage_agreed_per_day": [field.required, field.num] },
    { "payment_per_km_agreed": [field.required, field.num] },
    { "ind_photo_attachment": [field.noRequired, field.varchar, 1, 50] },
    { "payment_payable_mode": [field.required, field.varchar, 1, 10] },
    { "payable_pymt_frequency": [field.required, field.varchar, 1, 10] },
    { "action_flag": [field.noValidate, field.varchar, 1, 1] },
    { "created_by": [field.noValidate, field.varchar, 1, 50] },
    { "created_on": [field.noValidate, field.timestamp] },
    { "modified_by": [field.noValidate, field.varchar, 1, 50] },
    { "modified_on": [field.noValidate, field.timestamp] },
];

const tl_contractor = (method) => [
    { "id": [method === 'update' ? field.required : field.noRequired, field.num] },
    { "user_id": [field.required, field.num, 1, 50] },
    { "agency_name": [field.required, field.varchar, 1, 50] },
    { "agency_address": [field.required, field.varchar, 1, 250] },
    { "agency_phone": [field.required, field.varchar, 1, 20] },
    { "agency_email": [field.required, field.varchar, 1, 20] },
    { "agency_pin": [field.required, field.varchar, 1, 6] },
    { "country_code": [field.required, field.varchar, 1, 3] },
    { "having_own_transport": [field.required, field.varchar, 1, 1] },
    { "having_own_waterplant": [field.required, field.varchar, 1, 1] },
    { "having_own_team": [field.required, field.varchar, 1, 1] },
    { "empty_bottle_capacity": [field.required, field.num] },
    { "volume_needed_mon_fri": [field.required, field.num] },
    { "volume_needed_sat": [field.required, field.num] },
    { "volume_needed_sun": [field.required, field.num] },
    { "attached_photo": [field.required, field.varchar, 1, 50] },
    { "attached_agency_photo": [field.required, field.varchar, 1, 50] },
    { "service_available_to_pin": [field.required, field.varchar, 1, 6] },
    { "action_flag": [field.noValidate, field.varchar, 1, 1] },
    { "created_by": [field.noValidate, field.varchar, 1, 50] },
    { "created_on": [field.noValidate, field.timestamp] },
    { "modified_by": [field.noValidate, field.varchar, 1, 50] },
    { "modified_on": [field.noValidate, field.timestamp] },
];

const tl_sub_contractor = (method) => [
    { "id": [method === 'update' ? field.required : field.noRequired, field.num] },
    { "group_id": [field.noRequired, field.num, 1, 50] },
    { "user_id": [field.required, field.num, 1, 50] },
    { "contractor_id": [field.required, field.num, 1, 50] },
    { "agency_name": [field.required, field.varchar, 1, 50] },
    { "agency_address": [field.required, field.varchar, 1, 250] },
    { "agency_phone": [field.required, field.varchar, 1, 20] },
    { "agency_email": [field.required, field.varchar, 1, 20] },
    { "agency_pin": [field.required, field.varchar, 1, 6] },
    { "country_code": [field.required, field.varchar, 1, 3] },
    { "having_own_transport": [field.required, field.varchar, 1, 1] },
    { "having_own_waterplant": [field.required, field.varchar, 1, 1] },
    { "having_own_team": [field.required, field.varchar, 1, 1] },
    { "empty_bottle_capacity": [field.required, field.num] },
    { "volume_needed_mon_fri": [field.required, field.num] },
    { "volume_needed_sat": [field.required, field.num] },
    { "volume_needed_sun": [field.required, field.num] },
    { "attached_photo": [field.required, field.varchar, 1, 50] },
    { "attached_agency_photo": [field.required, field.varchar, 1, 50] },
    { "service_available_to_pin": [field.required, field.varchar, 1, 6] },
    { "action_flag": [field.noValidate, field.varchar, 1, 1] },
    { "created_by": [field.noValidate, field.varchar, 1, 50] },
    { "created_on": [field.noValidate, field.timestamp] },
    { "modified_by": [field.noValidate, field.varchar, 1, 50] },
    { "modified_on": [field.noValidate, field.timestamp] },
];

const tl_transport_agent = (method) => [
    { "id": [method === 'update' ? field.required : field.noRequired, field.num] },
    { "group_id": [field.noRequired, field.num, 1, 50] },
    { "user_id": [field.required, field.num, 1, 50] },
    { "agency_name": [field.required, field.varchar, 1, 50] },
    { "agency_address": [field.required, field.varchar, 1, 250] },
    { "agency_phone": [field.required, field.varchar, 1, 50] },
    { "agency_email": [field.required, field.varchar, 1, 50] },
    { "agency_pin": [field.required, field.varchar, 1, 6] },
    { "country_code": [field.required, field.varchar, 1, 3] },
    { "drivers_capacity": [field.required, field.num] },
    { "delivery_boys_capacity": [field.required, field.num] },
    { "vehicle_capacity": [field.required, field.num] },
    { "available_on_mon_fri": [field.required, field.varchar, 1, 50] },
    { "available_on_sat": [field.required, field.varchar, 1, 50] },
    { "available_on_sun": [field.required, field.varchar, 1, 50] },
    { "receivable_payment_mode": [field.required, field.varchar, 1, 50] },
    { "receivable_pymt_frequency": [field.required, field.varchar, 1, 50] },
    { "attached_photo": [field.required, field.varchar, 1, 50] },
    { "attached_agency_photo": [field.required, field.varchar, 1, 50] },
    { "service_available_to_pin": [field.required, field.varchar, 1, 6] },
    { "action_flag": [field.noValidate, field.varchar, 1, 1] },
    { "created_by": [field.noValidate, field.varchar, 1, 50] },
    { "created_on": [field.noValidate, field.timestamp] },
    { "modified_by": [field.noValidate, field.varchar, 1, 50] },
    { "modified_on": [field.noValidate, field.timestamp] },
];

const tl_driver = (method) => [
    { "id": [method === 'update' ? field.required : field.noRequired, field.num] },
    { "group_id": [field.noRequired, field.num, 1, 50] },
    { "user_id": [field.required, field.num, 1, 50] },
    { "transport_agent_id": [field.required, field.num, 1, 50] },
    { "driver_name": [field.required, field.varchar, 1, 50] },
    { "years_of_exp": [field.required, field.num] },
    { "driving_skills": [field.required, field.varchar, 1, 50] },
    { "dl_no": [field.required, field.varchar, 1, 50] },
    { "dl_expires_on": [field.noValidate, field.timestamp] },
    { "employment_type": [field.required, field.varchar, 1, 50] },
    { "driver_address": [field.required, field.varchar, 1, 250] },
    { "driver_phone": [field.required, field.varchar, 1, 20] },
    { "driver_email": [field.required, field.varchar, 1, 20] },
    { "driver_pin": [field.required, field.varchar, 1, 6] },
    { "country_code": [field.required, field.varchar, 1, 3] },
    { "available_on_mon_fri": [field.required, field.varchar, 1, 50] },
    { "available_on_sat": [field.required, field.varchar, 1, 50] },
    { "available_on_sun": [field.required, field.varchar, 1, 50] },
    { "can_unload_bottles": [field.required, field.varchar, 1, 1] },
    { "having_own_vehicle": [field.required, field.varchar, 1, 1] },
    { "vehicle_reg_no": [field.required, field.varchar, 1, 50] },
    { "receivable_payment_mode": [field.required, field.varchar, 1, 10] },
    { "receivable_pymt_frequency": [field.required, field.varchar, 1, 10] },
    { "dl_attachment": [field.required, field.varchar, 1, 50] },
    { "photo_attachment": [field.required, field.varchar, 1, 50] },
    { "service_available_to_pin": [field.required, field.varchar, 1, 6] },
    { "action_flag": [field.noValidate, field.varchar, 1, 1] },
    { "created_by": [field.noValidate, field.varchar, 1, 50] },
    { "created_on": [field.noValidate, field.timestamp] },
    { "modified_by": [field.noValidate, field.varchar, 1, 50] },
    { "modified_on": [field.noValidate, field.timestamp] },
];

const tl_delivery_boy = (method) => [
    { "id": [method === 'update' ? field.required : field.noRequired, field.num] },
    { "group_id": [field.required, field.num, 1, 50] },
    { "user_id": [field.required, field.num, 1, 50] },
    { "transport_agent_id": [field.required, field.num, 1, 50] },
    { "deliveryboy_name": [field.required, field.varchar, 1, 50] },
    { "deliveryboy_address": [field.required, field.varchar, 1, 250] },
    { "deliveryboy_phone": [field.required, field.varchar, 1, 20] },
    { "deliveryboy_email": [field.required, field.varchar, 1, 20] },
    { "deliveryboy_pin": [field.required, field.varchar, 1, 6] },
    { "country_code": [field.required, field.varchar, 1, 3] },
    { "years_of_exp": [field.required, field.num] },
    { "knows_driving": [field.required, field.varchar, 1, 50] },
    { "dl_no": [field.required, field.varchar, 1, 50] },
    { "dl_expires_on": [field.required, field.varchar, 1, 50] },
    { "employment_type": [field.required, field.varchar, 1, 50] },
    { "available_on_mon_fri": [field.required, field.varchar, 1, 50] },
    { "available_on_sat": [field.required, field.varchar, 1, 50] },
    { "available_on_sun": [field.required, field.varchar, 1, 50] },
    { "receivable_payment_mode": [field.required, field.varchar, 1, 10] },
    { "receivable_pymt_frequency": [field.required, field.varchar, 1, 10] },
    { "photo_attachment": [field.required, field.varchar, 1, 50] },
    { "service_available_to_pin": [field.required, field.varchar, 1, 6] },
    { "action_flag": [field.noValidate, field.varchar, 1, 1] },
    { "created_by": [field.noValidate, field.varchar, 1, 50] },
    { "created_on": [field.noValidate, field.timestamp] },
    { "modified_by": [field.noValidate, field.varchar, 1, 50] },
    { "modified_on": [field.noValidate, field.timestamp] },
];

const tl_vehicle = (method) => [
    { "id": [method === 'update' ? field.required : field.noRequired, field.num] },
    { "group_id": [field.noRequired, field.num, 1, 50] },
    // { "user_id": [field.required, field.num, 1, 50] },
    { "transport_agent_id": [field.required, field.num, 1, 50] },
    { "driver_id": [field.required, field.num, 1, 50] },
    // { "vehicle_id": [field.required, field.num, 1, 50] },
    { "vehicle_reg_no": [field.required, field.varchar, 1, 50] },
    { "owner_name": [field.required, field.varchar, 1, 50] },
    { "owner_address": [field.required, field.varchar, 1, 250] },
    { "owner_phone": [field.required, field.num] },
    { "owner_email": [field.required, field.varchar, 1, 50] },
    { "owner_pin": [field.required, field.varchar, 1, 6] },
    { "country_code": [field.required, field.varchar, 1, 3] },
    { "insurance_expires_on": [field.noValidate, field.timestamp] },
    { "rc_book_number": [field.required, field.varchar, 1, 50] },
    { "insurance_attachment": [field.required, field.varchar, 1, 50] },
    { "rc_attachment": [field.required, field.varchar, 1, 50] },
    { "vehicle_make_year": [field.required, field.varchar, 1, 50] },
    { "next_service_due": [field.noValidate, field.timestamp] },
    { "vehicle_term": [field.required, field.varchar, 1, 50] },
    { "vehicle_permit": [field.required, field.varchar, 1, 10] },
    { "gps_enabled": [field.required, field.varchar, 1, 1] },
    { "fasttag_id": [field.required, field.varchar, 1, 50] },
    { "kms_per_litre": [field.required, field.num] },
    { "vehicle_capacity": [field.required, field.num] },
    { "vehicle_type": [field.required, field.varchar, 1, 50] },
    { "available_on_mon_fri": [field.required, field.varchar, 1, 50] },
    { "available_on_sat": [field.required, field.varchar, 1, 50] },
    { "available_on_sun": [field.required, field.varchar, 1, 50] },
    { "receivable_payment_mode": [field.required, field.varchar, 1, 50] },
    { "receivable_pymt_frequency": [field.required, field.varchar, 1, 10] },
    { "service_available_to_pin": [field.required, field.varchar, 1, 6] },
    { "action_flag": [field.noValidate, field.varchar, 1, 1] },
    { "created_by": [field.noValidate, field.varchar, 1, 50] },
    { "created_on": [field.noValidate, field.timestamp] },
    { "modified_by": [field.noValidate, field.varchar, 1, 50] },
    { "modified_on": [field.noValidate, field.timestamp] },
];

const tl_shop_keeper = (method) => [
    { "id": [method === 'update' ? field.required : field.noRequired, field.num] },
    { "group_id": [field.noRequired, field.num, 1, 50] },
    { "user_id": [field.required, field.num, 1, 50] },
    { "shop_id": [field.required, field.num, 1, 50] },
    { "shop_name": [field.required, field.varchar, 1, 50] },
    { "established_on": [field.noValidate, field.timestamp] },
    { "shop_contact_no": [field.required, field.varchar, 1, 50] },
    { "shop_contact_email": [field.required, field.varchar, 1, 50] },
    { "shop_contact_address": [field.required, field.varchar, 1, 250] },
    { "shop_pincode": [field.required, field.varchar, 1, 6] },
    { "country_code": [field.required, field.varchar, 1, 3] },
    { "delivery_capacity": [field.required, field.num] },
    { "having_own_transport": [field.required, field.varchar, 1, 1] },
    { "having_own_deliveryteam": [field.required, field.varchar, 1, 1] },
    { "is_delivery_supported": [field.required, field.varchar, 1, 1] },
    { "attached_shop_photo": [field.required, field.varchar, 1, 50] },
    { "available_on_mon_fri": [field.required, field.varchar, 1, 50] },
    { "available_on_sat": [field.required, field.varchar, 1, 50] },
    { "available_on_sun": [field.required, field.varchar, 1, 50] },
    { "receivable_payment_mode": [field.required, field.varchar, 1, 50] },
    { "receivable_pymt_frequency": [field.required, field.varchar, 1, 10] },
    { "service_available_to_pin": [field.required, field.varchar, 1, 6] },
    { "action_flag": [field.noValidate, field.varchar, 1, 1] },
    { "created_by": [field.noValidate, field.varchar, 1, 50] },
    { "created_on": [field.noValidate, field.timestamp] },
    { "modified_by": [field.noValidate, field.varchar, 1, 50] },
    { "modified_on": [field.noValidate, field.timestamp] },
];

const tl_customers = (method) => [
    { "id": [method === 'update' ? field.required : field.noRequired, field.num] },
    { "group_id": [field.noRequired, field.num, 1, 50] },
    { "user_id": [field.required, field.num, 1, 50] },
    { "customer_name": [field.required, field.varchar, 1, 50] },
    { "customer_contact_phone": [field.required, field.varchar, 1, 20] },
    { "customer_contact_email": [field.required, field.varchar, 1, 50] },
    { "customer_address": [field.required, field.varchar, 1, 250] },
    { "customer_pin": [field.required, field.varchar, 1, 6] },
    { "country_code": [field.required, field.varchar, 1, 3] },
    { "volume_frequency": [field.required, field.varchar, 1, 50] },
    { "volume_expected": [field.required, field.num] },
    { "delivery_slot1": [field.required, field.varchar, 1, 1] },
    { "delivery_slot2": [field.required, field.varchar, 1, 1] },
    { "action_flag": [field.noValidate, field.varchar, 1, 1] },
    { "created_by": [field.noValidate, field.varchar, 1, 50] },
    { "created_on": [field.noValidate, field.timestamp] },
    { "modified_by": [field.noValidate, field.varchar, 1, 50] },
    { "modified_on": [field.noValidate, field.timestamp] },
];

const tl_util = (method) => [
    { "id": [method === 'update' ? field.required : field.noRequired, field.num] },
    { "parent_id": [field.required, field.num] },
    { "key": [field.required, field.varchar, 1, 50] },
    { "options": [field.noRequired, field.varchar, 1, 255] },
    { "action_flag": [field.noValidate, field.varchar, 1, 1] },
    { "created_by": [field.noValidate, field.varchar, 1, 50] },
    { "created_on": [field.noValidate, field.timestamp] },
    { "modified_by": [field.noValidate, field.varchar, 1, 50] },
    { "modified_on": [field.noValidate, field.timestamp] },
    { "value": [field.required, field.varchar, 1, 50] }
];

const tl_group = (method) => [
    { "id": [method === 'update' ? field.required : field.noRequired, field.num] },
    { "group_name": [field.required, field.varchar, 1, 20] },
    { "description": [field.required, field.varchar, 1, 100] },
    { "action_flag": [field.noValidate, field.varchar, 1, 1] },
    { "created_by": [field.noValidate, field.varchar, 1, 50] },
    { "created_on": [field.noValidate, field.timestamp] },
    { "modified_by": [field.noValidate, field.varchar, 1, 50] },
    { "modified_on": [field.noValidate, field.timestamp] }
];



const tl_login = () => [
    { "user_number": [field.required, field.varchar, 1, 50] },
    { "password": [field.required, field.varchar, 1, 50] }
];

const tl_cache = () => [
    { "user_id": [field.required, field.num] },
    // { "document": [field.noRequired, field.json] }
];

const tl_fileupload = (method) => [
    { "base64": [field.required, field.varchar] }
];



module.exports = {
    tl_field_info,
    tl_field_labels,
    tl_profile,
    tl_function,
    tl_profile_function,
    tl_user_type,
    tl_subscription,
    tl_user,
    tl_team,
    tl_audit_log,
    tl_retention,
    tl_sequence,
    tl_tables,
    tl_water_plant,
    tl_industry,
    tl_contractor,
    tl_sub_contractor,
    tl_transport_agent,
    tl_driver,
    tl_delivery_boy,
    tl_vehicle,
    tl_shop_keeper,
    tl_customers,
    tl_util,
    tl_group,
    tl_login,
    tl_cache,
    tl_fileupload
}