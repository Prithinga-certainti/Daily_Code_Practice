const upload_constant = {
    AllowedFileTypes:['csv','xlsx','xls'],
    //file type
    Allowed_mime_type:[
        'text/csv',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
    ],
    //max file size
    MAX_FILE_SIZE:5,
    MAX_FILE_SIZE_IN_BYTES:5*1024*1024,
    //max row
    MAX_ROW:500,
    MIN_ROW:1,
    //status
    JOB_STATUS:{
        PENDING:'pending',
        PROCESSING:'processing',
        COMPLETED:'completed',
        FAILED:'failed'
    },
    //food types
    FOOD_TYPES:['veg','non-veg',],
    //spices
    SPICES:['Mild','Medium','Spicy','Extra Spicy'],
    //tax percentage
    TAX_PERCENTAGE:[0,5,10,15,20],
    //item status
    ITEM_STATUS:['Active','Inactive'],
    // csv teplate columns
    TEMPLATE_COLUMNS:[
    'item_name',
    'category',
    'sub_category',
    'description',
    'price',
    'discount_price',
    'tax_percentage',
    'image_url',
    'food_type',
    'spice_level',
    'calories',
    'allergens',
    'status',
    'available_from',
    'available_to',
    'packaging_charge',
    'display_order',
    'is_featured',
    'is_bestseller',
    'is_customizable',
  ],
  //required columns
    REQUIRED_COLUMNS:[
    'item_name',
    'category',
    'price',
    'food_type',
    'tax_percentage',
    'status',
  ],
}
module.exports = upload_constant;