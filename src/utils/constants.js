export const LicenseTypeList = [
  'Alternating Proprietor Premises',
  'Arts License (city)',
  'Arts License (county)',
  'Bed & Breakfast Permit',
  'Beer & Wine (city)',
  'Beer & Wine (county)',
  'Brew Pub (city)',
  'Brew Pub (county)',
  'Campus Liquor Complex (City)',
  'Campus Liquor Complex (County)',
  'Campus Liquor Complex (State)',
  'Club License (city)',
  'Club License (county)',
  'Distillery Pub (City)',
  'Distillery Pub (County)',
  'Entertainment District',
  'Fermented Malt Beverage and Wine (city)',
  'Fermented Malt Beverage and Wine (State)',
  'Fermented Malt Beverage and Wine(county)',
  'Fermented Malt Beverage Importer',
  'Fermented Malt Beverage Manufacturer',
  'Fermented Malt Beverage Nonresident',
  'Fermented Malt Beverage On (city)',
  'Fermented Malt Beverage On (county)',
  'Fermented Malt Beverage On/Off (city)',
  'Fermented Malt Beverage On/Off (county)',
  'Fermented Malt Beverage Wholesale',
  'Festival Permit',
  'Hotel & Restaurant (city)',
  'Hotel & Restaurant (county)',
  'Hotel & Restaurant / Optional (city)',
  'Hotel & Restaurant / Optional (county)',
  'Importer (malt liquor)',
  'Importer (vinous & spirituous)',
  'Limited Winery',
  'Liquor Licensed Drug Store (city)',
  'Liquor Licensed Drug Store (county)',
  'Lodging & Entertainment (City)',
  'Lodging & Entertainment (County)',
  'Manufacturer (brewery)',
  'Manufacturer (distillery & rectifier)',
  'Manufacturer (winery)',
  'Master File (Business)',
  'Master File (Person)',
  'Noncontiguous Location Permit',
  'Nonresident Manufacturer (malt liquor)',
  'Optional Premises (city)',
  'Optional Premises (county)',
  'Public Transportation',
  'Racetrack License (city)',
  'Racetrack License (county)',
  'Related Facility Permit (City)',
  'Related Facility Permit (County)',
  'Related Facility Permit (State)',
  'Resort Complex (city)',
  'Resort Complex (county)',
  'Retail Establishment Permit',
  'Retail Gaming Tavern (city)',
  'Retail Gaming Tavern (county)',
  'Retail Liquor Store (city)',
  'Retail Liquor Store (county)',
  'Sales Room Malt',
  'Sales Room Spirits',
  'Sales Room Wine',
  'Sales Room Wine Seasonal',
  'Sidewalk Service Area',
  'Special Events Permit (3.2% beer)',
  'Special Events Permit (alcohol)',
  'Tavern (city)',
  'Tavern (county)',
  'Tobacco Cigar-Tobacco Bar',
  'Tobacco Large Operator',
  'Tobacco Retailer Indoor Age Restricted ',
  'Tobacco Retailer Off-Premises',
  "Vintner's Restaurant (city)",
  "Vintner's Restaurant (county)",
  'Wholesale (vinous & spirituous)',
  'Wholesale Beer (malt liquor)',
  'Wine Packaging Permit',
  "Winery Direct Shipper's Permit",
];

export const LicenseTypesInit = {
  'Manufacturer (brewery)': 'Brewery',
  'Manufacturer (winery)': 'Winery',
  'Manufacturer (Distillery)': 'Distillery',
  'Tavern (city)': 'Tavern',
  'Tavern (county)': 'Tavern',
  'Limited Winery': 'Winery',
  'Brew Pub (city)': 'Pub',
  'Brew Pub (county)': 'Pub',
  "Vintner's Restaurant (city)": "Vintner's Restaurant",
  "Vintner's Restaurant (county)": "Vintner's Restaurant",
  'Distillery Pub (City)': 'Distillery',
  'Distillery Pub (County)': 'Distillery',
  'Hotel & Restaurant (city)': 'Hotel & Restaurant',
  'Hotel & Restaurant (county)': 'Hotel & Restaurant',
  'Hotel & Restaurant / Optional (city)': 'Hotel & Restaurant',
  'Hotel & Restaurant / Optional (county)': 'Hotel & Restaurant',
  'Beer & Wine (city)': 'Beer & Wine',
  'Beer & Wine (county)': 'Beer & Wine',
  'Festival Permit': 'Event',
  'Lodging & Entertainment (City)': 'Specialty Type',
  'Lodging & Entertainment (County)': 'Specialty Type',
  'Alternating Proprietor Premises': 'Alternating Proprietor Premises',
};

export const MapLicenseTypes = [
  { text: 'Brewery', value: 'Brewery' },
  { text: 'Winery', value: 'Winery' },
  { text: 'Distillery', value: 'Distillery' },
  { text: 'Tavern', value: 'Tavern' },
  { text: 'Winery', value: 'Winery' },
  { text: 'Pub', value: 'Pub' },
  { text: "Vintner's Restaurant", value: "Vintner's Restaurant" },
  { text: 'Distillery', value: 'Distillery' },
  { text: 'Hotel & Restaurant', value: 'Hotel & Restaurant' },
  { text: 'Beer & Wine', value: 'Beer & Wine' },
  { text: 'Event', value: 'Event' },
  { text: 'Specialty Type', value: 'Specialty Type' },
  {
    text: 'Alternating Proprietor Premises',
    value: 'Alternating Proprietor Premises',
  },
];

export const UserRole = {
  USER: 1,
  ADMIN: 2,
  OWNER: 3,
};

export const EventTypes = [
  { text: 'Once', value: 'Once' },
  { text: 'Period', value: 'Period' },
  { text: 'Permanent', value: 'Permanent' },
];

export const EventRepeatTypes = [
  { text: 'Daily', value: 'Daily' },
  { text: 'Weekly', value: 'Weekly' },
  { text: 'Monthly', value: 'Monthly' },
  { text: 'Yearly', value: 'Yearly' },
];