export interface EVBay {
  id: string;
  connector: string;
  type: 'DC Fast' | 'Supercharger' | 'AC Type 2';
  powerKw: number;
  status: 'available' | 'charging' | 'reserved';
  timeRemaining?: string;
  tariffKwh: number;
}

export interface Carpark {
  id: string;
  name: string;
  shortName: string;
  address: string;
  area: string;
  pinPosition: { x: number; y: number }; // Percentage position on vector map
  availableLots: number;
  totalLots: number;
  ratePerFirstHour: number;
  rateSubsequent: number;
  subsequentIntervalMin: number;
  eveningFlatRate: number;
  eveningStartTime: string;
  gracePeriodMinutes: number;
  maxClearance: number;
  clearanceNote: string;
  erpGantry: {
    name: string;
    rate: number;
    activeTill: string;
    status: 'active' | 'free' | 'low';
  };
  distanceKm: number;
  etaMin: number;
  status: 'optimal' | 'moderate' | 'almost-full';
  ltaVerified: boolean;
  evSummary: {
    operator: string;
    locationDetail: string;
    freeCount: number;
    totalCount: number;
    powerDesc: string;
    speedBadge: string;
    tariffKwh: number;
    hasFastCharging: boolean;
  };
  evBays: EVBay[];
  shelteredWalk: string;
  seasonPassAccepted: boolean;
  description: string;
  operatingHours: string;
  historicalOccupancyToday: { time: string; pct: number }[];
}

export const CARPARKS: Carpark[] = [
  {
    id: 'suntec-city',
    name: 'Suntec City Multi-Storey',
    shortName: 'Suntec City',
    address: '3 Temasek Boulevard, S038983 · Sector Green West',
    area: 'Marina Centre / Esplanade',
    pinPosition: { x: 30, y: 24 },
    availableLots: 342,
    totalLots: 980,
    ratePerFirstHour: 2.4,
    rateSubsequent: 1.2,
    subsequentIntervalMin: 30,
    eveningFlatRate: 3.5,
    eveningStartTime: '17:00',
    gracePeriodMinutes: 15,
    maxClearance: 2.0,
    clearanceNote: 'Fits Standard SUV',
    erpGantry: {
      name: 'Sheares Ave Gantry',
      rate: 2.0,
      activeTill: '18:30',
      status: 'active',
    },
    distanceKm: 1.2,
    etaMin: 4,
    status: 'optimal',
    ltaVerified: true,
    evSummary: {
      operator: 'SP Mobility & Tesla Supercharger',
      locationDetail: 'Level B1, Lobby C (Lots 140–154)',
      freeCount: 10,
      totalCount: 14,
      powerDesc: '(4x 120kW, 6x 50kW)',
      speedBadge: '120kW DC Fast',
      tariffKwh: 0.58,
      hasFastCharging: true,
    },
    evBays: [
      { id: 'BAY-140', connector: 'CCS2 DC', type: 'DC Fast', powerKw: 120, status: 'available', tariffKwh: 0.58 },
      { id: 'BAY-141', connector: 'CCS2 DC', type: 'DC Fast', powerKw: 120, status: 'available', tariffKwh: 0.58 },
      { id: 'BAY-142', connector: 'Tesla V3', type: 'Supercharger', powerKw: 250, status: 'charging', timeRemaining: '12m left', tariffKwh: 0.54 },
      { id: 'BAY-143', connector: 'CCS2 DC', type: 'DC Fast', powerKw: 50, status: 'available', tariffKwh: 0.52 },
      { id: 'BAY-144', connector: 'Type 2 AC', type: 'AC Type 2', powerKw: 22, status: 'available', tariffKwh: 0.48 },
      { id: 'BAY-145', connector: 'CCS2 DC', type: 'DC Fast', powerKw: 120, status: 'available', tariffKwh: 0.58 },
    ],
    shelteredWalk: 'Underground walkway directly connects to Promenade & Esplanade MRT',
    seasonPassAccepted: true,
    description: 'Premier integrated hub carpark with ultra-wide bays, dynamic LED lot occupancy indicators, and direct lift lobby access.',
    operatingHours: '24 Hours Daily',
    historicalOccupancyToday: [
      { time: '08:00', pct: 28 },
      { time: '10:00', pct: 54 },
      { time: '12:00', pct: 72 },
      { time: '14:00', pct: 65 },
      { time: '16:00', pct: 59 },
      { time: '18:00', pct: 62 },
      { time: '20:00', pct: 45 },
    ],
  },
  {
    id: 'mbfc',
    name: 'Marina Bay Financial Centre Tower 1 & 2',
    shortName: 'MBFC Tower 1/2',
    address: '8 Marina Boulevard, S018981 · Subterranean Carpark',
    area: 'Downtown Marina Bay',
    pinPosition: { x: 74, y: 40 },
    availableLots: 48,
    totalLots: 620,
    ratePerFirstHour: 4.8,
    rateSubsequent: 2.4,
    subsequentIntervalMin: 30,
    eveningFlatRate: 4.2,
    eveningStartTime: '18:00',
    gracePeriodMinutes: 10,
    maxClearance: 2.15,
    clearanceNote: 'High Ceiling Luxury Bays',
    erpGantry: {
      name: 'Marina Coastal Gantry',
      rate: 3.0,
      activeTill: '19:00',
      status: 'active',
    },
    distanceKm: 2.1,
    etaMin: 7,
    status: 'moderate',
    ltaVerified: true,
    evSummary: {
      operator: 'CDG ENGIE & Shell Recharge',
      locationDetail: 'Basement 2, Pillar E11–E14',
      freeCount: 4,
      totalCount: 8,
      powerDesc: '(2x 150kW, 6x 22kW)',
      speedBadge: '150kW High Power',
      tariffKwh: 0.62,
      hasFastCharging: true,
    },
    evBays: [
      { id: 'MBFC-01', connector: 'CCS2 High Power', type: 'DC Fast', powerKw: 150, status: 'available', tariffKwh: 0.62 },
      { id: 'MBFC-02', connector: 'CCS2 High Power', type: 'DC Fast', powerKw: 150, status: 'charging', timeRemaining: '24m left', tariffKwh: 0.62 },
      { id: 'MBFC-03', connector: 'Type 2 AC', type: 'AC Type 2', powerKw: 22, status: 'available', tariffKwh: 0.51 },
      { id: 'MBFC-04', connector: 'Type 2 AC', type: 'AC Type 2', powerKw: 22, status: 'available', tariffKwh: 0.51 },
    ],
    shelteredWalk: 'Direct air-conditioned underpass to Marina Bay MRT & Marina Bay Link Mall',
    seasonPassAccepted: true,
    description: 'Grade A corporate carpark with license plate auto-barrier recognition and concierge car wash.',
    operatingHours: '24 Hours Daily',
    historicalOccupancyToday: [
      { time: '08:00', pct: 40 },
      { time: '10:00', pct: 88 },
      { time: '12:00', pct: 92 },
      { time: '14:00', pct: 91 },
      { time: '16:00', pct: 84 },
      { time: '18:00', pct: 60 },
      { time: '20:00', pct: 32 },
    ],
  },
  {
    id: 'one-raffles-quay',
    name: 'One Raffles Quay (ORQ)',
    shortName: 'One Raffles Quay',
    address: '1 Raffles Quay, S048583 · North Tower Basement',
    area: 'Raffles Place CBD',
    pinPosition: { x: 26, y: 48 },
    availableLots: 6,
    totalLots: 410,
    ratePerFirstHour: 5.2,
    rateSubsequent: 2.6,
    subsequentIntervalMin: 30,
    eveningFlatRate: 4.5,
    eveningStartTime: '18:00',
    gracePeriodMinutes: 10,
    maxClearance: 1.95,
    clearanceNote: 'Max 1.95m Height Barrier',
    erpGantry: {
      name: 'Raffles Quay ERP',
      rate: 2.5,
      activeTill: '18:00',
      status: 'active',
    },
    distanceKm: 1.8,
    etaMin: 6,
    status: 'almost-full',
    ltaVerified: true,
    evSummary: {
      operator: 'SP Mobility',
      locationDetail: 'Basement 3, Near Core B',
      freeCount: 1,
      totalCount: 4,
      powerDesc: '(1x 50kW, 3x 22kW)',
      speedBadge: '50kW Rapid',
      tariffKwh: 0.59,
      hasFastCharging: true,
    },
    evBays: [
      { id: 'ORQ-01', connector: 'CCS2 DC', type: 'DC Fast', powerKw: 50, status: 'available', tariffKwh: 0.59 },
      { id: 'ORQ-02', connector: 'CCS2 DC', type: 'DC Fast', powerKw: 50, status: 'charging', timeRemaining: '8m left', tariffKwh: 0.59 },
    ],
    shelteredWalk: 'Underground pedestrian link to Raffles Place MRT Interchange',
    seasonPassAccepted: false,
    description: 'Core CBD business hub carpark. High demand during morning and lunch trading hours.',
    operatingHours: '06:00 – 23:59',
    historicalOccupancyToday: [
      { time: '08:00', pct: 60 },
      { time: '10:00', pct: 98 },
      { time: '12:00', pct: 99 },
      { time: '14:00', pct: 97 },
      { time: '16:00', pct: 94 },
      { time: '18:00', pct: 75 },
      { time: '20:00', pct: 40 },
    ],
  },
  {
    id: 'capitagreen',
    name: 'CapitaGreen Automated Tower',
    shortName: 'CapitaGreen',
    address: '138 Market Street, S048946 · Mechanised Stack',
    area: 'Central Business District',
    pinPosition: { x: 38, y: 36 },
    availableLots: 118,
    totalLots: 300,
    ratePerFirstHour: 4.5,
    rateSubsequent: 2.25,
    subsequentIntervalMin: 30,
    eveningFlatRate: 3.8,
    eveningStartTime: '18:00',
    gracePeriodMinutes: 10,
    maxClearance: 2.05,
    clearanceNote: 'Sedan & Mid SUV Bays',
    erpGantry: {
      name: 'Cecil Street ERP',
      rate: 1.5,
      activeTill: '18:30',
      status: 'active',
    },
    distanceKm: 2.4,
    etaMin: 8,
    status: 'optimal',
    ltaVerified: true,
    evSummary: {
      operator: 'Charge+',
      locationDetail: 'Level 2 EV Lounge',
      freeCount: 6,
      totalCount: 8,
      powerDesc: '(2x 60kW, 6x 22kW)',
      speedBadge: '60kW Dual Port',
      tariffKwh: 0.56,
      hasFastCharging: true,
    },
    evBays: [
      { id: 'CG-01', connector: 'CCS2 DC', type: 'DC Fast', powerKw: 60, status: 'available', tariffKwh: 0.56 },
      { id: 'CG-02', connector: 'CCS2 DC', type: 'DC Fast', powerKw: 60, status: 'available', tariffKwh: 0.56 },
    ],
    shelteredWalk: 'Sheltered linkway to Telok Ayer MRT (Downtown Line)',
    seasonPassAccepted: true,
    description: 'Biophilic architecture carpark with smart automated vehicle retrieval system.',
    operatingHours: '24 Hours Daily',
    historicalOccupancyToday: [
      { time: '08:00', pct: 35 },
      { time: '10:00', pct: 70 },
      { time: '12:00', pct: 76 },
      { time: '14:00', pct: 71 },
      { time: '16:00', pct: 60 },
      { time: '18:00', pct: 45 },
      { time: '20:00', pct: 25 },
    ],
  },
  {
    id: 'marina-square',
    name: 'Marina Square Basement Carpark',
    shortName: 'Marina Square',
    address: '6 Raffles Boulevard, S039594 · Yellow & Red Zones',
    area: 'Marina Centre',
    pinPosition: { x: 52, y: 22 },
    availableLots: 512,
    totalLots: 1200,
    ratePerFirstHour: 2.2,
    rateSubsequent: 1.1,
    subsequentIntervalMin: 30,
    eveningFlatRate: 3.2,
    eveningStartTime: '17:00',
    gracePeriodMinutes: 15,
    maxClearance: 2.1,
    clearanceNote: 'Spacious Multi-Level Access',
    erpGantry: {
      name: 'Raffles Ave Gantry',
      rate: 1.0,
      activeTill: '18:00',
      status: 'low',
    },
    distanceKm: 0.9,
    etaMin: 3,
    status: 'optimal',
    ltaVerified: true,
    evSummary: {
      operator: 'Tesla Supercharger & SP Mobility',
      locationDetail: 'Basement 1, Green Zone Lots 80–92',
      freeCount: 8,
      totalCount: 12,
      powerDesc: '(6x 250kW Superchargers, 6x 50kW)',
      speedBadge: '250kW V3 Supercharger',
      tariffKwh: 0.53,
      hasFastCharging: true,
    },
    evBays: [
      { id: 'MSQ-01', connector: 'Tesla V3', type: 'Supercharger', powerKw: 250, status: 'available', tariffKwh: 0.53 },
      { id: 'MSQ-02', connector: 'Tesla V3', type: 'Supercharger', powerKw: 250, status: 'available', tariffKwh: 0.53 },
      { id: 'MSQ-03', connector: 'CCS2 DC', type: 'DC Fast', powerKw: 50, status: 'available', tariffKwh: 0.55 },
    ],
    shelteredWalk: 'Connected via covered pedestrian bridge to Suntec Convention & Millenia Walk',
    seasonPassAccepted: true,
    description: 'Expansive family and shopper parking with easiest bay maneuvering and high ceiling clearances.',
    operatingHours: '24 Hours Daily',
    historicalOccupancyToday: [
      { time: '08:00', pct: 15 },
      { time: '10:00', pct: 35 },
      { time: '12:00', pct: 60 },
      { time: '14:00', pct: 62 },
      { time: '16:00', pct: 58 },
      { time: '18:00', pct: 50 },
      { time: '20:00', pct: 40 },
    ],
  },
  {
    id: 'millenia-walk',
    name: 'Millenia Singapore / Ritz-Carlton Carpark',
    shortName: 'Millenia Walk',
    address: '9 Raffles Boulevard, S039596 · Basement 1 & 2',
    area: 'Marina Centre',
    pinPosition: { x: 62, y: 16 },
    availableLots: 198,
    totalLots: 450,
    ratePerFirstHour: 3.0,
    rateSubsequent: 1.5,
    subsequentIntervalMin: 30,
    eveningFlatRate: 3.5,
    eveningStartTime: '17:00',
    gracePeriodMinutes: 15,
    maxClearance: 2.05,
    clearanceNote: 'Fits Full Size MPVs & SUVs',
    erpGantry: {
      name: 'Temasek Ave Gantry',
      rate: 1.0,
      activeTill: '18:00',
      status: 'low',
    },
    distanceKm: 0.7,
    etaMin: 2,
    status: 'optimal',
    ltaVerified: true,
    evSummary: {
      operator: 'Porsche Destination & Shell Recharge',
      locationDetail: 'Basement 1, Next to Millenia Tower Lobby',
      freeCount: 5,
      totalCount: 6,
      powerDesc: '(2x 175kW High Power, 4x 22kW)',
      speedBadge: '175kW Ultra-Fast',
      tariffKwh: 0.65,
      hasFastCharging: true,
    },
    evBays: [
      { id: 'MW-01', connector: 'CCS2 DC High Power', type: 'DC Fast', powerKw: 175, status: 'available', tariffKwh: 0.65 },
      { id: 'MW-02', connector: 'Type 2 AC', type: 'AC Type 2', powerKw: 22, status: 'available', tariffKwh: 0.52 },
    ],
    shelteredWalk: '1 min covered linkway directly to Promenade MRT Exit A',
    seasonPassAccepted: true,
    description: 'Premium curated shopping and hotel parking with wide individual bays and valet options.',
    operatingHours: '24 Hours Daily',
    historicalOccupancyToday: [
      { time: '08:00', pct: 20 },
      { time: '10:00', pct: 45 },
      { time: '12:00', pct: 70 },
      { time: '14:00', pct: 68 },
      { time: '16:00', pct: 62 },
      { time: '18:00', pct: 55 },
      { time: '20:00', pct: 42 },
    ],
  },
];

export interface ERPGantryInfo {
  id: string;
  name: string;
  zone: string;
  rate: number;
  timeWindow: string;
  vehicleType: string;
}

export const ERP_GANTRIES: ERPGantryInfo[] = [
  { id: 'erp-1', name: 'Sheares Avenue (Southbound)', zone: 'Marina Bay / CBD', rate: 2.0, timeWindow: '08:00 – 09:30 & 17:30 – 18:30', vehicleType: 'Passenger Cars' },
  { id: 'erp-2', name: 'Marina Coastal Expressway (MCE)', zone: 'Marina South', rate: 3.0, timeWindow: '08:30 – 09:30', vehicleType: 'Passenger Cars' },
  { id: 'erp-3', name: 'Nicoll Highway (Citybound)', zone: 'City Hall', rate: 1.0, timeWindow: '08:00 – 09:00', vehicleType: 'Passenger Cars' },
  { id: 'erp-4', name: 'Raffles Boulevard / Temasek Ave', zone: 'Marina Centre', rate: 1.0, timeWindow: '08:30 – 09:30', vehicleType: 'Passenger Cars' },
];

export interface VehicleProfile {
  plateNumber: string;
  model: string;
  batteryPercentage: number;
  estimatedRangeKm: number;
  obuBalance: number;
  iuNumber: string;
  seasonPasses: {
    carparkName: string;
    expiryDate: string;
    status: 'active' | 'expiring';
    type: string;
  }[];
  recentSessions: {
    id: string;
    carparkName: string;
    date: string;
    duration: string;
    parkingFee: number;
    erpFee: number;
    receiptRef: string;
  }[];
}

export const USER_VEHICLE: VehicleProfile = {
  plateNumber: 'SLL 4821 K',
  model: 'Tesla Model 3 Long Range',
  batteryPercentage: 68,
  estimatedRangeKm: 345,
  obuBalance: 48.5,
  iuNumber: '9842103982',
  seasonPasses: [
    {
      carparkName: 'Suntec City Multi-Storey',
      expiryDate: '31 Dec 2026',
      status: 'active',
      type: 'Commercial Full Season Pass',
    },
    {
      carparkName: 'URA Central Zone 1 Night Season',
      expiryDate: '15 Oct 2026',
      status: 'active',
      type: 'Off-Peak Evening & Weekend Permit',
    },
  ],
  recentSessions: [
    {
      id: 'SES-9418',
      carparkName: 'Suntec City Multi-Storey',
      date: 'Yesterday, 14:12 – 16:45',
      duration: '2h 33m',
      parkingFee: 6.0,
      erpFee: 2.0,
      receiptRef: 'PSG-2026-0922-841',
    },
    {
      id: 'SES-9382',
      carparkName: 'Marina Bay Financial Centre',
      date: '21 Sep 2026, 09:30 – 11:15',
      duration: '1h 45m',
      parkingFee: 9.6,
      erpFee: 3.0,
      receiptRef: 'PSG-2026-0921-120',
    },
    {
      id: 'SES-9310',
      carparkName: 'Marina Square',
      date: '19 Sep 2026, 19:10 – 21:40',
      duration: '2h 30m',
      parkingFee: 3.2,
      erpFee: 0.0,
      receiptRef: 'PSG-2026-0919-679',
    },
  ],
};
