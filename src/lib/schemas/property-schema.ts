const propertySchema: Record<
    string,
    {
        types?: { value: string; slug: string; database?: string, label?: string }[];
        class: string;
        label: string;
        fields?: { label: string; name: string; type: string; options?: { value: string; label: string }[]; placeholder?: string }[];
    }
> = {
    residential: {
        class: 'RE_1',
        label: 'Residential',
        types: [
            { value: 'CND', slug: 'condominium', database: 'Condominium', label: 'Condominium' },
            { value: 'SF', slug: 'single-family', database: 'SINGLE FAMILY', label: 'Single Family' },
            { value: 'MOL', slug: 'manufactured-on-land', database: 'MANUFACT. ON LAND', label: 'Manufactured on Land' },
            { value: 'SFG', slug: 'single-family-w-guest', database: 'SGLE FAM W/GUEST', label: 'Single Family w/ Guest' },
            { value: 'MO', slug: 'mobile-only', database: 'MOBILE-ONLY', label: 'Mobile Only' }
        ],
        fields: [
            { label: 'Price Range (Min)', name: 'PriceMin', type: 'number', placeholder: 'Min Price' },
            { label: 'Price Range (Max)', name: 'PriceMax', type: 'number', placeholder: 'Max Price' },
            {
                label: 'View', name: 'View', type: 'select', options: [
                    { value: 'AR', label: 'Area' },
                    { value: 'Trees', label: 'Trees' },
                    { value: 'Mount', label: 'Mountain View' },
                    { value: 'OF', label: 'Ocean Front' },
                    { value: 'OV', label: 'Ocean View' },
                    { value: 'RF', label: 'River Front' },
                    { value: 'RV', label: 'River View' },
                    { value: 'PN', label: 'Panoramic' },
                    { value: 'LF', label: 'Lake Front' },
                    { value: 'LV', label: 'Lake View' }
                ]
            },
            {
                label: 'Levels', name: 'Levels', type: 'select', options: [
                    { value: '1', label: '1 Story' },
                    { value: '2', label: '2 Story' },
                    { value: 'Split', label: 'Split' },
                    { value: 'SGQ', label: 'Separate Guest Quarters' },
                    { value: 'OT', label: 'Other' }
                ]
            },
            {
                label: 'Garage Type', name: 'GarageType', type: 'select', options: [
                    { value: 'AG', label: 'Attached Garage' },
                    { value: 'DG', label: 'Detached Garage' },
                    { value: 'AC', label: 'Attached Carport' },
                    { value: 'DC', label: 'Detached Carport' },
                    { value: 'None', label: 'None' }
                ]
            },
            {
                label: 'SQFT', name: 'SQFT', type: 'select', options: [
                    { value: '0-1000', label: '0 - 1000' },
                    { value: '1001-1500', label: '1001 - 1500' },
                    { value: '1501-2000', label: '1501 - 2000' },
                    { value: '2001-3000', label: '2001 - 3000' },
                    { value: '3000-3999', label: '3000 - 3999' },
                    { value: '4000+', label: '4000+' }
                ]
            }
        ]
    },
    commercial: {
        class: 'CI_3',
        label: 'Commercial & Industrial',
        types: [
            { value: 'BLWB', slug: 'building-and-land-w-business', database: 'BUILDING AND LAND W/BUSNS', label: 'Building and Land w/ Business' },
            { value: 'BL', slug: 'building-and-land', database: 'BUILDING AND LAND', label: 'Building and Land' },
            { value: 'BO', slug: 'business-only', database: 'BUILDING ONLY', label: 'Building Only' },
            { value: 'LO', slug: 'land-only', database: 'LAND ONLY', label: 'Land Only' }
        ],
        fields: [
            { label: 'Price Per Square Foot', name: 'PricePerSqFt', type: 'number', placeholder: 'Price per SqFt' }
        ]
    },
    land: {
        class: 'LD_2',
        label: 'Land',
        types: [
            { value: 'AG', slug: 'agricultural', database: 'AGRICULTURAL', label: 'Agricultural' },
            { value: 'CI', slug: 'commercial-industrial', database: 'COMMERCIAL/INDUST', label: 'Commercial/Industrial' },
            { value: 'OT', slug: 'other', database: 'OTHER', label: 'Other' },
            { value: 'RE', slug: 'residential', database: 'RESIDENTIAL', label: 'Residential' }
        ]
    },
    'multi-family': {
        class: 'MF_4',
        label: 'Multi-family',
        types: [
            { value: '2+', slug: '2-plus', database: '2+ RESIDENCES', label: '2+ Residences' },
            { value: '4P', slug: 'four-plex', database: 'FOUR-PLEX', label: 'Four-Plex' },
            { value: '5P', slug: 'five-plex', database: 'FIVE-PLEX', label: 'Five-Plex' },
            { value: 'AP', slug: 'apartment', database: 'APARTMENT', label: 'Apartment' },
            { value: 'DUP', slug: 'duplex', database: 'DUPLEX', label: 'Duplex' },
            { value: 'TR', slug: 'triplex', database: 'TRIPLEX', label: 'Triplex' }
        ]
    }
};

export { propertySchema };