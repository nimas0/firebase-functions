exports.initialSetUpData = (addressPartsArray) => {
   const addressBreakDown = [
      'streetNumber',
      'streetName',
      'city',
      'county',
      'state',
      'country',
      'zip',
      'zipExtra',
   ];
   let addressObject = {};
   addressPartsArray.map(
      (part, index) => (addressObject[addressBreakDown[index]] = part.long_name)
   );

   console.log(addressObject);

   const data = {
      activity: 'Just Listed!',
      generalAvailability: {
         days: {
            friday: true,
            monday: true,
            saturday: true,
            sunday: true,
            thursday: true,
            tuesday: true,
            wednesday: true,
         },
         halfHourly: [8, 8.5, 9, 10, 12, 12.5, 13, 13.5, 14, 14.5, 17, 17.5],
         hourly: [8, 9, 11, 13, 14, 17],
         isHourly: true,
      },
      generalSettings: [
         {
            data: [
               'Active',
               'Pending',
               'Off the Market',
               'Pending, but still accepting backup offers',
            ],
            label: 'Status',
            name: 'status',
            type: 'select',
            value: 'Active',
         },
      ],
      homeDetails: [
         {
            data: ['Residential', 'Townhome', 'Condominium'],
            label: 'Property Type',
            name: 'propertyType',
            type: 'select',
            value: 'Residential',
         },
         {
            label: 'Street Number',
            name: 'streetNumber',
            type: 'input',
            value: addressObject.streetNumber,
         },
         {
            label: 'Street Name',
            name: 'streetName',
            type: 'input',
            value: addressObject.streetName,
         },
         {
            label: 'City',
            name: 'city',
            type: 'input',
            value: addressObject.city,
         },
         {
            label: 'State',
            name: 'state',
            type: 'input',
            value: addressObject.state,
         },
         {
            label: 'Zip Code',
            name: 'zipCode',
            type: 'input',
            value: addressObject.zip,
         },
         {
            label: 'Area / Subdivision',
            name: 'area',
            type: 'input',
            value: '',
         },
         {
            label: 'County',
            name: 'county',
            type: 'input',
            value: addressObject.county,
         },
         {
            label: 'Lot Size',
            name: 'lotSize',
            type: 'input',
            value: '',
         },
         {
            label: 'Total Finished SqFt',
            name: 'totalFinishedSqFt',
            type: 'input',
            value: 0,
         },
         {
            label: 'Year Built',
            name: 'yearBuilt',
            type: 'input',
            value: 0,
         },
         {
            label: 'Bedrooms',
            name: 'bedrooms',
            type: 'input',
            value: 0,
         },
         {
            label: 'Full Baths',
            name: 'fullBaths',
            type: 'input',
            value: 0,
         },
         {
            label: 'Half Baths',
            name: 'halfBaths',
            type: 'input',
            value: 0,
         },
         {
            data: ['Yes', 'No', 'N/A'],
            label: 'First Floor Master',
            name: 'firstFloorMaster',
            type: 'select',
            value: 'Yes',
         },
         {
            data: ['Yes', 'No'],
            label: 'In-Law Suite',
            name: 'inLawSuite',
            type: 'select',
            value: 'Yes',
         },
         {
            data: ['Yes', 'No', 'N/A'],
            label: 'HOA',
            name: 'hoa',
            type: 'select',
            value: 'N/A',
         },
         {
            label: 'HOA Amount',
            name: 'hoaAmount',
            type: 'input',
            value: 0,
         },
         {
            data: [
               'Bi-Monthly',
               'Bi-Weekly',
               'Annually',
               'Daily',
               'Monthly',
               'One-Time',
               'Quarterly',
               'Seasonal',
               'Semi-Annual',
               'Semi-Monthly',
               'Weekly',
            ],
            label: 'HOA Frequency',
            name: 'hoaFrequency',
            type: 'select',
            value: 'Please Select',
         },
         {
            data: ['Yes', 'No'],
            label: 'New Construction',
            name: 'newConstruction',
            type: 'select',
            value: 'Please Select',
         },
         {
            label: 'Current Price',
            name: 'currentPrice',
            type: 'input',
            value: 0,
         },
         {
            label: 'Original Price',
            name: 'originalPrice',
            type: 'input',
            value: 0,
         },
      ],
      homeFeatures: {
         acreageRange: [
            {
               label: 'Less than 1 acre',
               name: 'lessThan1Acre',
               value: false,
            },
            {
               label: '.5 to 10 acre',
               name: 'halfToOneAcre',
               value: false,
            },
            {
               label: '1-3 acres',
               name: '1TO3Acres',
               value: false,
            },
            {
               label: '3-5 acres',
               name: '3To5Acres',
               value: false,
            },
            {
               label: '5-10 acres',
               name: '5To10Acres',
               value: false,
            },
            {
               label: '10-25 acres',
               name: '10To25Acres',
               value: false,
            },
            {
               label: '25-50 acres',
               name: '25To50Acres',
               value: false,
            },
            {
               label: '50+ acres',
               name: '50PlusAcres',
               value: false,
            },
            {
               label: 'Other-See Remarks',
               name: 'otherSeeRemarks',
               value: false,
            },
         ],
         airConditioning: [
            {
               label: 'Central Electric',
               name: 'centralElectric',
               value: false,
            },
            {
               label: 'Central Gas',
               name: 'centralGas',
               value: false,
            },
            {
               label: 'Geo Thermal',
               name: 'geoThermal',
               value: false,
            },
            {
               label: 'Heat Pump',
               name: 'heatPump',
               value: false,
            },
            {
               label: 'Zone',
               name: 'zone',
               value: false,
            },
            {
               label: 'Window unit(s)',
               name: 'windowUnits',
               value: false,
            },
            {
               label: 'Attic Fan(s)',
               name: 'atticFans',
               value: false,
            },
            {
               label: 'Window Fans',
               name: 'windowFans',
               value: false,
            },
            {
               label: 'None',
               name: 'none',
               value: false,
            },
            {
               label: 'Other- See Remarks',
               name: 'otherSeeRemarks',
               value: false,
            },
         ],
         appliances: [
            {
               label: 'Range',
               name: 'range',
               value: false,
            },
            {
               label: 'Refrigerator',
               name: 'refrigerator',
               value: false,
            },
            {
               label: 'Dishwasher',
               name: 'dishwasher',
               value: false,
            },
            {
               label: 'Washer',
               name: 'washer',
               value: false,
            },
            {
               label: 'Dryer',
               name: 'dryer',
               value: false,
            },
            {
               label: 'Indoor Grill',
               name: 'indoorGrill',
               value: false,
            },
            {
               label: 'Microwave',
               name: 'microwave',
               value: false,
            },
            {
               label: 'Compactor',
               name: 'compactor',
               value: false,
            },
            {
               label: 'Disposal',
               name: 'disposal',
               value: false,
            },
            {
               label: 'Double Oven',
               name: 'doubleOven',
               value: false,
            },
            {
               label: 'Exhaust Fan',
               name: 'exhaustFan',
               value: false,
            },
            {
               label: 'Wall Oven',
               name: 'wallOven',
               value: false,
            },
            {
               label: 'Humidifier',
               name: 'humidifier',
               value: false,
            },
            {
               label: 'Cooktop',
               name: 'cooktop',
               value: false,
            },
            {
               label: 'Wine Cooler',
               name: 'wineCooler',
               value: false,
            },
            {
               label: 'Warming Drawer',
               name: 'warmingDrawer',
               value: false,
            },
            {
               label: 'None',
               name: 'none',
               value: false,
            },
            {
               label: 'Other-See Remarks',
               name: 'otherSeeRemarks',
               value: false,
            },
         ],
         attic: [
            {
               label: 'Access Only',
               name: 'accessOnly',
               value: false,
            },
            {
               label: 'Storage Only',
               name: 'storageOnly',
               value: false,
            },
            {
               label: 'Expandable',
               name: 'expandable',
               value: false,
            },
            {
               label: 'Fully Finished',
               name: 'fullyFinished',
               value: false,
            },
            {
               label: 'Partially Finished',
               name: 'partiallyFinished',
               value: false,
            },
            {
               label: 'Permanent Stairs',
               name: 'permanentStairs',
               value: false,
            },
            {
               label: 'Pull Down Stairs',
               name: 'pullDownStairs',
               value: false,
            },
            {
               label: 'Dormer',
               name: 'dormer',
               value: false,
            },
            {
               label: 'Heated',
               name: 'heated',
               value: false,
            },
            {
               label: 'None',
               name: 'none',
               value: false,
            },
            {
               label: 'Other-See Remarks',
               name: 'otherSeeRemarks',
               value: false,
            },
         ],
         basement: [
            {
               label: 'Full-Finished',
               name: 'fullFinished',
               value: false,
            },
            {
               label: 'Full-Unfinished',
               name: 'fullUnfinished',
               value: false,
            },
            {
               label: 'Full-Partially Finished',
               name: 'fullPartiallyFinished',
               value: false,
            },
            {
               label: 'Partial-Finished',
               name: 'partialFinished',
               value: false,
            },
            {
               label: 'Partial-Unfinished',
               name: 'partialUnfinished',
               value: false,
            },
            {
               label: 'Partial-Partly Finished',
               name: 'partialPartlyFinished',
               value: false,
            },
            {
               label: 'Outside Entrance',
               name: 'outsideEntrance',
               value: false,
            },
            {
               label: 'Walkout',
               name: 'walkout',
               value: false,
            },
            {
               label: 'Cellar',
               name: 'cellar',
               value: false,
            },
            {
               label: 'Sump Pump',
               name: 'sumpPump',
               value: false,
            },
            {
               label: 'Drain',
               name: 'drain',
               value: false,
            },
            {
               label: 'Utility',
               name: 'utility',
               value: false,
            },
            {
               label: 'Block',
               name: 'block',
               value: false,
            },
            {
               label: 'Poured',
               name: 'poured',
               value: false,
            },
            {
               label: 'None',
               name: 'none',
               value: false,
            },
            {
               label: 'Other-See Remarks',
               name: 'otherSeeRemarks',
               value: false,
            },
         ],
         construction: [
            {
               label: 'Brick',
               name: 'brick',
               value: false,
            },
            {
               label: 'Log',
               name: 'log',
               value: false,
            },
            {
               label: 'Aluminum Siding',
               name: 'aluminumSiding',
               value: false,
            },
            {
               label: 'Asbestos',
               name: 'asbestos',
               value: false,
            },
            {
               label: 'Masonite',
               name: 'masonite',
               value: false,
            },
            {
               label: 'Vinyl Siding',
               name: 'vinylSiding',
               value: false,
            },
            {
               label: 'Wood Siding',
               name: 'woodSiding',
               value: false,
            },
            {
               label: 'Stone',
               name: 'stone',
               value: false,
            },
            {
               label: 'Cedar',
               name: 'cedar',
               value: false,
            },
            {
               label: 'Stucco',
               name: 'stucco',
               value: false,
            },
            {
               label: 'Solid Masonry',
               name: 'solidMasonry',
               value: false,
            },
            {
               label: 'Frame',
               name: 'frame',
               value: false,
            },
            {
               label: 'Steel Frame',
               name: 'steelFrame',
               value: false,
            },
            {
               label: 'HardiPlank Type',
               name: 'hardiPlankType',
               value: false,
            },
            {
               label: 'Other',
               name: 'other',
               value: false,
            },
         ],
         exteriorFeatures: [
            {
               label: 'Cable Available',
               name: 'cableAvailable',
               value: false,
            },
            {
               label: 'Fence',
               name: 'fence',
               value: false,
            },
            {
               label: 'Circular Drive',
               name: 'circularDrive',
               value: false,
            },
            {
               label: 'Gas Grill',
               name: 'gasGrill',
               value: false,
            },
            {
               label: 'Play House',
               name: 'playHouse',
               value: false,
            },
            {
               label: 'Landscaped',
               name: 'landscaped',
               value: false,
            },
            {
               label: 'Patio',
               name: 'patio',
               value: false,
            },
            {
               label: 'Deck',
               name: 'deck',
               value: false,
            },
            {
               label: 'In-ground Pool',
               name: 'inGroundPool',
               value: false,
            },
            {
               label: 'Above Ground Pool',
               name: 'aboveGroundPool',
               value: false,
            },
            {
               label: 'Privacy Fence',
               name: 'privacyFence',
               value: false,
            },
            {
               label: 'Storage Building',
               name: 'storageBuilding',
               value: false,
            },
            {
               label: 'Storm Windows',
               name: 'stormWindows',
               value: false,
            },
            {
               label: 'Storm Doors',
               name: 'stormDoors',
               value: false,
            },
            {
               label: 'Trees/Wooded',
               name: 'treesWooded',
               value: false,
            },
            {
               label: 'Satellite Dish',
               name: 'satelliteDish',
               value: false,
            },
            {
               label: 'Hot Tub',
               name: 'hotTub',
               value: false,
            },
            {
               label: 'Greenhouse',
               name: 'greenhouse',
               value: false,
            },
            {
               label: 'Gazebo',
               name: 'gazebo',
               value: false,
            },
            {
               label: 'Water Garden',
               name: 'waterGarden',
               value: false,
            },
            {
               label: 'Scenic',
               name: 'scenic',
               value: false,
            },
            {
               label: 'Secluded',
               name: 'secluded',
               value: false,
            },
            {
               label: 'Asphalt Drive',
               name: 'asphaltDrive',
               value: false,
            },
            {
               label: 'Concrete Drive',
               name: 'concreteDrive',
               value: false,
            },
            {
               label: 'Gravel Drive',
               name: 'gravelDrive',
               value: false,
            },
            {
               label: 'Replacement Windows',
               name: 'replacementWindows',
               value: false,
            },
            {
               label: 'Porch Front',
               name: 'porchFront',
               value: false,
            },
            {
               label: 'Porch Back',
               name: 'porchBack',
               value: false,
            },
            {
               label: 'Barn/Stable',
               name: 'barnStable',
               value: false,
            },
            {
               label: 'Shop',
               name: 'shop',
               value: false,
            },
            {
               label: 'Sunroom',
               name: 'sunroom',
               value: false,
            },
            {
               label: 'Screened Porch',
               name: 'screenedPorch',
               value: false,
            },
            {
               label: 'None',
               name: 'none',
               value: false,
            },
            {
               label: 'Sprinkler System',
               name: 'sprinklerSystem',
               value: false,
            },
            {
               label: 'Other-See Remarks',
               name: 'otherSeeRemarks',
               value: false,
            },
         ],
         fireplace: [
            {
               label: 'Fireplace Blowers',
               name: 'fireplaceBlowers',
               value: false,
            },
            {
               label: 'Gas Logs',
               name: 'gasLogs',
               value: false,
            },
            {
               label: 'Gas Starters',
               name: 'gasStarters',
               value: false,
            },
            {
               label: 'Stove Insert',
               name: 'stoveInsert',
               value: false,
            },
            {
               label: 'Heat-O-Later',
               name: 'heatOLater',
               value: false,
            },
            {
               label: 'Glass Doors',
               name: 'glassDoors',
               value: false,
            },
            {
               label: 'Free-Standing',
               name: 'freeStanding',
               value: false,
            },
            {
               label: 'Angle-nook',
               name: 'angleNook',
               value: false,
            },
            {
               label: 'Non-functional',
               name: 'nonFunctional',
               value: false,
            },
            {
               label: 'Basement',
               name: 'basement',
               value: false,
            },
            {
               label: 'Fireplace',
               name: 'fireplace',
               value: false,
            },
            {
               label: 'None',
               name: 'none',
               value: false,
            },
            {
               label: 'Other-See Remarks',
               name: 'otherSeeRemarks',
               value: false,
            },
         ],
         floors: [
            {
               label: 'Wall to Wall Carpet',
               name: 'wallToWallCarpet',
               value: false,
            },
            {
               label: 'Carpet',
               name: 'carpet',
               value: false,
            },
            {
               label: 'Hardwood',
               name: 'hardwood',
               value: false,
            },
            {
               label: 'Slate',
               name: 'slate',
               value: false,
            },
            {
               label: 'Tile',
               name: 'tile',
               value: false,
            },
            {
               label: 'Vinyl',
               name: 'vinyl',
               value: false,
            },
            {
               label: 'Wood',
               name: 'wood',
               value: false,
            },
            {
               label: 'Brick',
               name: 'brick',
               value: false,
            },
            {
               label: 'Carpet over Hardwood',
               name: 'carpetoverHardwood',
               value: false,
            },
            {
               label: 'Parquet',
               name: 'parquet',
               value: false,
            },
            {
               label: 'Terrazzo',
               name: 'Terrazzo',
               value: false,
            },
            {
               label: 'Linoleum',
               name: 'linoleum',
               value: false,
            },
            {
               label: 'Marble',
               name: 'marble',
               value: false,
            },
            {
               label: 'Ceramic',
               name: 'ceramic',
               value: false,
            },
            {
               label: 'Wood Laminate',
               name: 'woodLaminate',
               value: false,
            },
            {
               label: 'Granite',
               name: 'granite',
               value: false,
            },
         ],
         foundation: [
            {
               label: 'Basement',
               name: 'basement',
               value: false,
            },
            {
               label: 'Slab',
               name: 'slab',
               value: false,
            },
            {
               label: 'Crawl Space',
               name: 'crawlSpace',
               value: false,
            },
            {
               label: 'Concrete Perimeter',
               name: 'concretePerimeter',
               value: false,
            },
            {
               label: 'Block',
               name: 'block',
               value: false,
            },
            {
               label: 'Underpining',
               name: 'underpining',
               value: false,
            },
            {
               label: 'Pillar/Post/Pier',
               name: 'pillarPostPier',
               value: false,
            },
            {
               label: 'Pilings/Wood',
               name: 'pilingsWood',
               value: false,
            },
            {
               label: 'Pilings/Concrete/Steel',
               name: 'pilingsConcreteSteel',
               value: false,
            },
            {
               label: 'Other',
               name: 'other',
               value: false,
            },
         ],
         garageCarport: [
            {
               label: 'Garage-Single Attached',
               name: 'garageSingleAttached',
               value: false,
            },
            {
               label: 'Garage-Double Attached',
               name: 'garageDoubleAttached',
               value: false,
            },
            {
               label: 'Garage-Triple Attached',
               name: 'garageTripleAttached',
               value: false,
            },
            {
               label: 'Garage-Basement Single',
               name: 'garageBasementSingle',
               value: false,
            },
            {
               label: 'Garage-Basement Double',
               name: 'garageBasmentDouble',
               value: false,
            },
            {
               label: 'Garage-Single-Detached',
               name: 'garageSingleDetached',
               value: false,
            },
            {
               label: 'Garage-Double Detached',
               name: 'garageDoubleDetached',
               value: false,
            },
            {
               label: 'Garage-Triple Detached',
               name: 'garageTripleDetached',
               value: false,
            },
            {
               label: 'No Garage',
               name: 'noGarage',
               value: false,
            },
            {
               label: 'Carport-Single',
               name: 'carportSingle',
               value: false,
            },
            {
               label: 'Carport-Double',
               name: 'carportDouble',
               value: false,
            },
            {
               label: 'Carport-Triple',
               name: 'carportTriple',
               value: false,
            },
            {
               label: 'No Carport',
               name: 'noCarport',
               value: false,
            },
            {
               label: 'Parking Pad',
               name: 'parkingPad',
               value: false,
            },
            {
               label: 'Garage Door Opener',
               name: 'garageDoorOpener',
               value: false,
            },
            {
               label: 'Garage',
               name: 'garage',
               value: false,
            },
            {
               label: 'Carport',
               name: 'carport',
               value: false,
            },
            {
               label: 'Other-See Remarks',
               name: 'otherSeeRemarks',
               value: false,
            },
         ],
         heatingSource: [
            {
               label: 'Gas',
               name: 'gas',
               value: false,
            },
            {
               label: 'Electric',
               name: 'electric',
               value: false,
            },
            {
               label: 'Propane',
               name: 'propane',
               value: false,
            },
            {
               label: 'Geo Thermal',
               name: 'geoThermal',
               value: false,
            },
            {
               label: 'Wood',
               name: 'wood',
               value: false,
            },
            {
               label: 'Coal',
               name: 'coal',
               value: false,
            },
            {
               label: 'Solar',
               name: 'solar',
               value: false,
            },
            {
               label: 'Steam',
               name: 'steam',
               value: false,
            },
            {
               label: 'Hot Water',
               name: 'hotWater',
               value: false,
            },
            {
               label: 'Oil',
               name: 'oil',
               value: false,
            },
            {
               label: 'Kerosene',
               name: 'kerosene',
               value: false,
            },
            {
               label: 'Other-See Remarks',
               name: 'otherSeeRemarks',
               value: false,
            },
         ],
         heatingSystem: [
            {
               label: 'Cable Electric-ceiling',
               name: 'cableElectricCeiling',
               value: false,
            },
            {
               label: 'Baseboard',
               name: 'baseboard',
               value: false,
            },
            {
               label: 'Boiler',
               name: 'boiler',
               value: false,
            },
            {
               label: 'Ceiling Radiant',
               name: 'ceilingRadiant',
               value: false,
            },
            {
               label: 'Floor Radiant',
               name: 'floorRadiant',
               value: false,
            },
            {
               label: 'Floor Furnace',
               name: 'floorFurnace',
               value: false,
            },
            {
               label: 'Forced Air',
               name: 'forcedAir',
               value: false,
            },
            {
               label: 'Heat Pump',
               name: 'heatPump',
               value: false,
            },
            {
               label: 'Space Heater',
               name: 'spaceHeater',
               value: false,
            },
            {
               label: 'Gravity',
               name: 'gravity',
               value: false,
            },
            {
               label: 'Fireplace',
               name: 'fireplace',
               value: false,
            },
            {
               label: 'Stove',
               name: 'stove',
               value: false,
            },
            {
               label: 'Hybrid Dual System',
               name: 'hybridDualSystem',
               value: false,
            },
            {
               label: 'Other-See Remarks',
               name: 'otherSeeRemarks',
               value: false,
            },
         ],
         interiorFeatures: [
            {
               label: 'Cathedral Ceiling',
               name: 'cathedralCeiling',
               value: false,
            },
            {
               label: 'Ceiling Fan(s)',
               name: 'ceilingFans',
               value: false,
            },
            {
               label: 'Window Treatments',
               name: 'windowTreatments',
               value: false,
            },
            {
               label: 'Whirlpool',
               name: 'whirlpool',
               value: false,
            },
            {
               label: 'Intercom',
               name: 'intercom',
               value: false,
            },
            {
               label: 'Security System',
               name: 'securitySystem',
               value: false,
            },
            {
               label: 'Sauna',
               name: 'sauna',
               value: false,
            },
            {
               label: 'Vacuum System',
               name: 'vacuumSystem',
               value: false,
            },
            {
               label: 'Walk-in Closet',
               name: 'walkInCloset',
               value: false,
            },
            {
               label: 'Warranty Program',
               name: 'warrantyProgram',
               value: false,
            },
            {
               label: 'Sunken Room',
               name: 'sunkenRoom',
               value: false,
            },
            {
               label: 'Skylight',
               name: 'skylight',
               value: false,
            },
            {
               label: 'Wet Bar',
               name: 'wetBar',
               value: false,
            },
            {
               label: 'W/D Hookup',
               name: 'wDHookup',
               value: false,
            },
            {
               label: 'Vaulted Ceiling',
               name: 'vaultedCeiling',
               value: false,
            },
            {
               label: 'Kitchen Fireplace',
               name: 'kitchenFireplace',
               value: false,
            },
            {
               label: 'Living Room Fireplace',
               name: 'livingRoomFireplace',
               value: false,
            },
            {
               label: 'Great Room Fireplace',
               name: 'greatRoomFireplace',
               value: false,
            },
            {
               label: 'Bedroom Fireplace',
               name: 'bedroomFireplace',
               value: false,
            },
            {
               label: 'Family Room Fireplace',
               name: 'familyRoomFireplace',
               value: false,
            },
            {
               label: 'Den Fireplace',
               name: 'denFireplace',
               value: false,
            },
            {
               label: 'Rec Room Fireplace',
               name: 'recRoomFireplace',
               value: false,
            },
            {
               label: 'Wood Stove',
               name: 'woodStove',
               value: false,
            },
            {
               label: 'Water Purifier',
               name: 'waterPurifier',
               value: false,
            },
            {
               label: 'Air Purifier',
               name: 'airPurifier',
               value: false,
            },
            {
               label: 'Fireplace',
               name: 'fireplace',
               value: false,
            },
            {
               label: 'Granite',
               name: 'granite',
               value: false,
            },
            {
               label: 'Universal Design',
               name: 'universalDesign',
               value: false,
            },
            {
               label: 'Split Bedroom',
               name: 'splitBedroom',
               value: false,
            },
            {
               label: 'Walk-in Shower',
               name: 'walkInShower',
               value: false,
            },
            {
               label: 'None',
               value: false,
            },
            {
               label: 'Other-See Remarks',
               name: 'otherSeeRemarks',
               value: false,
            },
         ],
         kitchenDining: [
            {
               label: 'Dining Area',
               name: 'diningArea',
               value: false,
            },
            {
               label: 'Breakfast Area',
               name: 'breakfastArea',
               value: false,
            },
            {
               label: 'Breakfast Room',
               name: 'breakfastRoom',
               value: false,
            },
            {
               label: 'Island',
               name: 'island',
               value: false,
            },
            {
               label: 'Country Kitchen',
               name: 'countryKitchen',
               value: false,
            },
            {
               label: 'Formal-Seperate',
               name: 'formalSeperate',
               value: false,
            },
            {
               label: 'Kitchen Bar',
               name: 'kitchenBar',
               value: false,
            },
            {
               label: 'Kitchen/Dining',
               name: 'kitchenDining',
               value: false,
            },
            {
               label: 'Living Room/Dining',
               name: 'livingRoomDining',
               value: false,
            },
            {
               label: 'Eat-In Kitchen',
               name: 'eatInKitchen',
               value: false,
            },
            {
               label: 'Outdoor Kitchen',
               name: 'outdoorKitchen',
               value: false,
            },
            {
               label: 'Granite',
               name: 'granite',
               value: false,
            },
            {
               label: 'Wine Cooler',
               name: 'wineCooler',
               value: false,
            },
            {
               label: 'Other-See Remarks',
               name: 'otherSeeRemarks',
               value: false,
            },
         ],
         lotDescription: [
            {
               label: 'Zero Lot Line',
               name: 'zeroLotLine',
               value: false,
            },
            {
               label: 'Level',
               name: 'level',
               value: false,
            },
            {
               label: 'Rolling',
               name: 'rolling',
               value: false,
            },
            {
               label: 'Stream',
               name: 'stream',
               value: false,
            },
            {
               label: 'Lake',
               name: 'lake',
               value: false,
            },
            {
               label: 'Dead End',
               name: 'deadEnd',
               value: false,
            },
            {
               label: 'Cul-de-Sac',
               name: 'culDeSac',
               value: false,
            },
            {
               label: 'Corner Lot',
               name: 'cornerLot',
               value: false,
            },
            {
               label: 'Paved Frontage',
               name: 'pavedFrontage',
               value: false,
            },
            {
               label: 'Pasture/Gardens',
               name: 'pastureGardens',
               value: false,
            },
            {
               label: 'Paddock',
               name: 'paddock',
               value: false,
            },
            {
               label: 'Gardens',
               name: 'gardens',
               value: false,
            },
            {
               label: 'None',
               name: 'none',
               value: false,
            },
            {
               label: 'Other-See Remarks',
               name: 'otherSeeRemarks',
               value: false,
            },
         ],
         possession: [
            {
               label: 'At Closing',
               name: 'atClosing',
               value: true,
            },
            {
               label: 'Close Plus 30 Days',
               name: 'closePlus30Days',
               value: false,
            },
            {
               label: 'Close Plus 60 Days',
               name: 'closePlus60Days',
               value: false,
            },
            {
               label: 'Close Plus 90+ days',
               name: 'closePlus90Days',
               value: false,
            },
            {
               label: 'With Deed',
               'name ': 'withDeed',
               value: false,
            },
            {
               label: 'Negotiable',
               name: 'negotiable',
               value: true,
            },
            {
               label: 'Subject to Lease',
               name: 'subjectToLease',
               value: false,
            },
            {
               label: 'Prefer Lease Back',
               name: 'preferLeaseBack',
               value: false,
            },
            {
               label: 'Lease/Option to Buy',
               name: 'leaseOptionToBuy',
               value: false,
            },
            {
               label: 'Immediate',
               name: 'immediate',
               value: false,
            },
            {
               label: 'Delayed',
               name: 'delayed',
               value: false,
            },
            {
               label: 'Subject To Tenant Rights',
               name: 'subjectToTenantRights',
               value: false,
            },
            {
               label: 'To Be Arranged',
               name: 'toBeArranged',
               value: false,
            },
            {
               label: 'Subject to Harvest of Crops',
               name: 'subjectToHarvestOfCrops',
               value: false,
            },
            {
               label: 'Long Term Lease',
               name: 'longTermLease',
               value: false,
            },
            {
               label: 'See Remarks',
               name: 'seeRemarks',
               value: false,
            },
         ],
         roof: [
            {
               label: 'Tar/Gravel',
               name: 'tarGravel',
               value: false,
            },
            {
               label: 'Metal',
               name: 'metal',
               value: false,
            },
            {
               label: 'Composition',
               name: 'composition',
               value: false,
            },
            {
               label: 'Wood',
               name: 'wood',
               value: false,
            },
            {
               label: 'Slate',
               name: 'slate',
               value: false,
            },
            {
               label: 'Tile',
               name: 'tile',
               value: false,
            },
            {
               label: 'Tin',
               name: 'tin',
               value: false,
            },
            {
               label: 'Copper',
               name: 'copper',
               value: false,
            },
            {
               label: 'Dimensional',
               name: 'dimensional',
               value: false,
            },
            {
               label: 'Rubber',
               name: 'rubber',
               value: false,
            },
            {
               label: '3-Tab',
               name: '3Tab',
               value: false,
            },
            {
               label: 'Other',
               name: 'other',
               value: false,
            },
         ],
         sewer: [
            {
               label: 'Septic Tank',
               name: 'septicTank',
               value: false,
            },
            {
               label: 'Private Sewer',
               name: 'privateSewer',
               value: false,
            },
            {
               label: 'Public Sewer',
               name: 'publicSewer',
               value: false,
            },
            {
               label: 'Available',
               name: 'available',
               value: false,
            },
            {
               label: 'None',
               name: 'none',
               value: false,
            },
            {
               label: 'Other',
               name: 'other',
               value: false,
            },
         ],
         stories: [
            {
               label: 'One',
               name: 'one',
               value: false,
            },
            {
               label: 'One and One Half',
               name: 'oneAndOneHalf',
               value: false,
            },
            {
               label: 'Two',
               name: 'two',
               value: false,
            },
            {
               label: 'Three or More',
               name: 'threeOrMore',
               value: false,
            },
            {
               label: 'Other',
               name: 'other',
               value: false,
            },
         ],
         style: [
            {
               label: 'Ranch/Single',
               name: 'ranchSingle',
               value: false,
            },
            {
               label: 'Traditional',
               name: 'traditional',
               value: false,
            },
            {
               label: 'Tri-Level',
               name: 'triLevel',
               value: false,
            },
            {
               label: 'Split Foyer',
               name: 'splitFoyer',
               value: false,
            },
            {
               label: 'A-Frame',
               name: 'aFrame',
               value: false,
            },
            {
               label: 'Colonial',
               name: 'colonial',
               value: false,
            },
            {
               label: 'Contemporary',
               name: 'contemporary',
               value: false,
            },
            {
               label: 'Cape Cod',
               name: 'capeCod',
               value: false,
            },
            {
               label: 'Cabin',
               name: 'cabin',
               value: false,
            },
            {
               label: 'Patio Home',
               name: 'patio',
               value: false,
            },
            {
               label: 'Modular',
               name: 'modular',
               value: false,
            },
            {
               label: 'In-Ground/Berm',
               name: 'inGroundBerm',
               value: false,
            },
            {
               label: 'Condo/Townhome',
               name: 'condoTownhome',
               value: false,
            },
            {
               label: 'Manufactured',
               name: 'manufactured',
               value: false,
            },
            {
               label: 'Dutch Colonial',
               name: 'dutchColonial',
               value: false,
            },
            {
               label: 'Ranch w/ Loft',
               name: 'ranchWLoft',
               value: false,
            },
            {
               label: 'Ranch w/ Bonus',
               name: 'ranchWBonus',
               value: false,
            },
            {
               label: 'Craftsman Style',
               name: 'craftsmanStyle',
               value: false,
            },
            {
               label: 'Other',
               name: 'other',
               value: false,
            },
         ],
         water: [
            {
               label: 'Public',
               name: 'public',
               value: false,
            },
            {
               label: 'Private',
               name: 'private',
               value: false,
            },
            {
               label: 'Well',
               name: 'well',
               value: false,
            },
            {
               label: 'Shared Well',
               name: 'sharedWell',
               value: false,
            },
            {
               label: 'County',
               name: 'county',
               value: false,
            },
            {
               label: 'Cistern',
               name: 'cistern',
               value: false,
            },
            {
               label: 'Available',
               name: 'available',
               value: false,
            },
            {
               label: 'Community',
               name: 'community',
               value: false,
            },
            {
               label: 'None',
               name: 'none',
               value: false,
            },
            {
               label: 'Other',
               name: 'other',
               value: false,
            },
         ],
         waterHeater: [
            {
               label: 'Electric',
               name: 'electric',
               value: false,
            },
            {
               label: 'Gas',
               name: 'gas',
               value: false,
            },
            {
               label: 'Propane',
            name: 'propane',
               value: false,
            },
            {
               label: 'Geo Thermal',
               name: 'geoThermal',
               value: false,
            },
            {
               label: 'Solar/Combination',
               name: 'solarCombination',
               value: false,
            },
            {
               label: 'Tankless',
               name: 'tankless',
               value: false,
            },
            {
               label: 'None',
               name: 'none',
               value: false,
            },
            {
               label: 'Other-See Remarks',
               name: 'otherSeeRemarks',
               value: false,
            },
         ],
      },
      initialized: {
         documents: false,
         information: false,
         photos: false,
         leads: false,
         tour: false,
         questions: false,
         showingSettings: false,
         yardSign: false, 
         photography: false

      },
      interest_count: 0,
      propertyType: {
         data: ['Residential', 'Townhome', 'Condominium'],
         label: 'Property Type',
         name: 'propertyType',
         type: 'select',
         value: 'Please Select',
      },
      photos: [{ id: 0, orientation: 'landscape', src: 'https://firebasestorage.googleapis.com/v0/b/finding-spaces-73b23.appspot.com/o/websiteimages%2FDefaultPhotoListing1.png?alt=media&token=0b4266a9-cef8-4d01-88fc-a046a1c79281' }],
      showingCount: '0',
      uniqueViews: '0',
   };

   return data;
};
