import { 
  User, 
  AuditLog, 
  InspectionService, 
  InspectionRecord, 
  InspectionDefectLog, 
  QuoteRequest, 
  CertificateItem, 
  CaseStudy, 
  DbTable, 
  ErRelation, 
  ApiEndpointSpec, 
  ContactMessage 
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_jai_001',
    name: 'Jaisankar',
    email: 'r.sharma@jaioctginspection.com',
    password: 'password123',
    role: 'Super Admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    company: 'JAI OCTG Inspection Services Pte Ltd',
    status: 'Active',
    createdAt: '2023-03-10',
    lastLogin: '2026-08-05 08:30',
    mfaEnabled: true,
    department: 'Quality Assurance & Technical Operations',
    phone: '+65 9697 4165',
    asntLevel: 'PT, MT and UT ASNT Level II / PCN Level 2'
  },
 
];

export const SERVICES_LIST: InspectionService[] = [
  {
    id: 'srv_drillpipe_cat4',
    num: '01',
    title: 'DRILLPIPE INSPECTION - DS-1 CAT4',
    shortCode: 'DS-1 CAT4',
    category: 'Drillpipe Inspection',
    description: 'Drillpipe inspection performed in accordance with TH Hill DS-1 Category 4 standard for intermediate-to-high service severity drilling environments.',
    iconName: 'Wrench',
    heroImage: 'https://5.imimg.com/data5/YR/TE/MY-31437631/drill-pipes-500x500.jpg',
    features: [
      'Visual tube & tool joint external examination',
      'Full length electromagnetic inspection (EMI) for logitudinal flaws',
      'Ultrasonic wall thickness verification & end area inspection',
      'Visual & dimensional thread gauging with lead, taper, and depth checks',
      'Wet fluorescent magnetic particle testing (MPI) on tool joints'
    ],
    benefits: [
      'Compliance with DS-1 Category 4 quality specifications',
      'Prevention of downhole twist-offs and tool joint connection failures'
    ],
    standards: ['DS-1 CAT4', 'API RP 7G-2'],
    equipmentUsed: ['EMI Drillpipe Scanner', 'Fluorescent MPI Yokes', 'API Calibrated Thread Gauges', 'Ultrasonic Thickness Meter'],
    processSteps: [
      { step: 1, title: 'Surface Cleaning & Preparation', detail: 'High-pressure solvent degreasing and wire-brushing of threads and tube body.' },
      { step: 2, title: 'Full-Body EMI & Ultrasonic QA', detail: 'Scanning tube length for wall thinning, pitting, fatigue cracks, and slip cuts.' },
      { step: 3, title: 'Connection Gauging & MPI', detail: 'Dimensional thread profiling, shoulder flatness check, and wet fluorescent MPI.' }
    ],
    faqs: [
      { q: 'What is covered under DS-1 Category 4?', a: 'Category 4 is designed for high-risk drilling conditions requiring rigorous EMI, UT wall thickness checks, and magnetic particle inspection on tool joints.' }
    ]
  },
  {
    id: 'srv_drillpipe_cat5',
    num: '02',
    title: 'DRILLPIPE INSPECTION - DS-1 CAT5',
    shortCode: 'DS-1 CAT5',
    category: 'Drillpipe Inspection',
    description: 'The highest standard of drillpipe inspection under DS-1 Category 5 for critical ultra-deep, extended reach, HPHT, and offshore drilling operations.',
    iconName: 'Wrench',
    heroImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8G7DbdRsstZWHefP8fHzEDBxIM6UPIP4aWaC-W5DzG6svltnhd91aN9B4&s=10',
    features: [
      'Comprehensive DS-1 Category 5 non-destructive testing regimen',
      'Visual tube and connection and OD gauge Inspection',
      'Full body EMI and MPI slip/UPSET and connection Inspection ',
      'UT wall thickness, UT slip/UPSET area and heat checking Inspection',
      'Dimentional and External coating and RE-Dope Connection, stencil marking'
    ],
    benefits: [
      'Highest assurance level for ultra-deepwater, HPHT, and ERD wells',
      'Zero-tolerance defect screening certified to DS-1 Cat 5'
    ],
    standards: ['DS-1 CAT5', 'API RP 7G-2', 'NS-2'],
    equipmentUsed: ['High-Resolution Multi-Channel EMI', 'Dual-Probe Ultrasonic Unit', 'Blacklight UV Lamps', 'Precision Lead & Taper Gauges'],
    processSteps: [
      { step: 1, title: 'Preparation & Ultra-Clean', detail: 'Complete steam/chemical degreasing and blast cleaning of connection areas.' },
      { step: 2, title: 'Dual-Axis EMI & Continuous UT', detail: 'High-speed transverse and longitudinal defect detection with continuous wall tracking.' },
      { step: 3, title: 'Critical Stress Area MPI & Stenciling', detail: 'Fluorescent MPI on upset transitions and digital verification marking.' }
    ],
    faqs: [
      { q: 'When is DS-1 Category 5 required?', a: 'Category 5 is required in ultra-deepwater, HPHT wells, or critical drilling environments where drill string failure carries severe financial or environmental consequences.' }
    ]
  },
  {
    id: 'srv_bha',
    num: '03',
    title: 'BHA INSPECTION - DS-1 CAT3-5',
    shortCode: 'DS-1 CAT3-5',
    category: 'BHA Inspection',
    description: 'Bottom Hole Assembly (BHA) component inspection performed in accordance with DS-1 Category 3-5 standards covering drill collars, heavy weight drill pipe, stabilizers, and subs.',
    iconName: 'Compass',
    heroImage: 'https://www.dpmaster.com.sg/wp-content/uploads/2020/02/image061.png',
    features: [
      'BHA component non-destructive testing (Drill Collars, HWDP, Subs, Stabilizers)',
      'Visual thread and Dimensional Inspection',
      'MPI/LPI connection, body and CWP upset area',
      'Stress relief groove & bore back cylinder dimensional verification',
      'Elevator groove and slip area inspection for mechanical damage and fatigue'
    ],
    benefits: [
      'Strict adherence to DS-1 Category 3-5 specifications',
      'Verification of BHA connection soundness under extreme cyclic fatigue and torsional loads'
    ],
    standards: ['DS-1 CAT3-5', 'API Spec 7-1'],
    equipmentUsed: ['MPI Yoke Units', 'High-Intensity UV Blacklight', 'Internal Borescope', 'Calibrated API Thread Gauges'],
    processSteps: [
      { step: 1, title: 'Cleaning & Pre-Check', detail: 'Thorough solvent cleaning of BHA threads, relief grooves, and shoulder surfaces.' },
      { step: 2, title: 'Dimensional & NDT Verification', detail: 'Gauging connection geometry, bevel diameter, and executing wet MPI on threads.' },
      { step: 3, title: 'Stabilizer Blade & Hardfacing Check', detail: 'Measuring stabilizer blade OD wear and inspecting hardfacing matrix for cracks.' }
    ],
    faqs: [
      { q: 'Which DS-1 categories apply to BHA components?', a: 'Services comply with DS-1 Category 3, Category 4, and Category 5 criteria tailored to well profile severity.' }
    ]
  },
  {
    id: 'srv_pup_joint',
    num: '04',
    title: 'PUP JOINT INSPECTION - DS-1 CAT3-5',
    shortCode: 'DS-1 CAT3-5',
    category: 'Pup Joint Inspection',
    description: 'Drill pipe and tubing pup joint inspection performed in accordance with DS-1 Category 3-5 standards ensuring short-length tubular integrity.',
    iconName: 'Layers',
    heroImage: 'https://images.squarespace-cdn.com/content/v1/5446b167e4b04f59b9aa7674/1415312307393-LCJJLJ7YD046BMAZMEWR/image-asset.jpeg',
    features: [
      'MPI connection and Full body area',
      'Visual tube, OD gauge, Visual thread and dimensional Inspection',
      'Ultrasonic wall thickness measurement and Ultrasonic slip and upsets area Inspection',
      'External coating Redope connection stencil marking'
    ],
    benefits: [
      'Compliance with DS-1 Category 3-5 guidelines',
      'Quality verification of short-length tubular spacers prior to rig deployment'
    ],
    standards: ['DS-1 CAT3-5', 'API RP 7G-2'],
    equipmentUsed: ['UT unit Ultrasonic Thickness Gauge', 'AC Yokes', 'DC coil', 'API Thread Gauges', 'Straightedge & Optical Levels'],
    processSteps: [
      { step: 1, title: 'Inspection Setup & Cleaning', detail: 'Cleaning and visual pre-check of pup joint body, upsets, and threads.' },
      { step: 2, title: 'NDT & Wall Thickness Testing', detail: 'Ultrasonic wall thickness grid verification and thread MPI.' },
      { step: 3, title: 'Final Color Banding & Stencil', detail: 'DS-1 compliant paint banding and condition classification tagging.' }
    ],
    faqs: [
      { q: 'What standards govern pup joint testing?', a: 'Inspection follows DS-1 Category 3-5 procedures and API RP 7G-2 recommendations.' }
    ]
  },
  {
    id: 'srv_fishing_tools',
    num: '05',
    title: 'FISHING TOOLS INSPECTION - DS-1 VOL4',
    shortCode: 'DS-1 VOL4',
    category: 'Fishing Tools Inspection',
    description: 'Downhole fishing and remedial tools inspection executed in accordance with TH Hill DS-1 Volume 4 standards.',
    iconName: 'Wrench',
    heroImage: 'https://rigrs.com/wp-content/uploads/2024/06/fishing-tool-2.jpg',
    features: [
      'Dimensional & visual inspection of fishing tools (Overshots, Spears, Jars, Mills, Grapples)',
      'Wet magnetic particle & liquid dye penetrant testing on connection and body area',
      'Connection threads, catch mechanisms, and critical stress area evaluation',
      'Verification of bowl wear, spiral grapple engagement, and circulation sub threads'
    ],
    benefits: [
      'Compliance with DS-1 Volume 4 specifications',
      'Assurance of mechanical integrity before critical fishing and recovery jobs'
    ],
    standards: ['DS-1 VOL4'],
    equipmentUsed: ['DC coil, AC yoke, Black light', 'Liquid Penetrant Kits', 'API profile Gauges'],
    processSteps: [
      { step: 1, title: 'Disassembly & Degreasing', detail: 'Disassembling tool components and thoroughly cleaning internal mating surfaces.' },
      { step: 2, title: 'NDT Examination & Crack Detection', detail: 'Executing MPI/PT on body, welds, and threaded connections per DS-1 Vol 4.' },
      { step: 3, title: 'Dimensional Verification', detail: 'Checking catch clearances, thread pitch diameters, and wall dimensions.' }
    ],
    faqs: [
      { q: 'What specification governs fishing tool inspection?', a: 'Inspection is conducted per TH Hill DS-1 Volume 4 Drilling & Fishing Tool Inspection standard.' }
    ]
  },
  {
    id: 'srv_tubing',
    num: '06',
    title: 'TUBING INSPECTION - API RP 7G-2',
    shortCode: 'API RP 74-2',
    category: 'Tubing Inspection',
    description: 'Production tubing inspection performed in accordance with API RP 74-2 guidelines and API 5CT specifications for downhole completion strings.',
    iconName: 'Flame',
    heroImage: 'https://www.wittyservices.com/img/OCTG.png',
    features: [
      'Full-body electromagnetic inspection (EMI) for transverse flaws and wall loss',
      'Visual tube and Visual connection Inspection',
      'Full-length cylindrical drift testing using API standard drift mandrels',
      'Ultrasonic wall thickness spot checks and Black light connection Inspection'
    ],
    benefits: [
      'Adherence to API RP 74-2 and API 5A5 recommended practices',
      'Verification of production tubing soundness and corrosion-free sealing surfaces'
    ],
    standards: ['API RP 74-2', 'API 5CT', 'API 5A5'],
    equipmentUsed: ['High-Sensitivity Tubing EMI Unit', 'API Drift Mandrels', 'Thread Gauges', 'Ultrasonic Gauges'],
    processSteps: [
      { step: 1, title: 'Tubing Cleaning & Drift', detail: 'Internal high-pressure water blasting followed by full-length API cylindrical drift.' },
      { step: 2, title: 'EMI & Ultrasonic Scanning', detail: 'Electromagnetic scanning for internal/external wall loss and pitting defects.' },
      { step: 3, title: 'Thread & Seal QA', detail: 'Visual thread profile verification and seal face micro-scratch assessment.' }
    ],
    faqs: [
      { q: 'Which API recommended practice is followed for production tubing?', a: 'Inspections strictly follow API RP 74-2 recommended practices for used tubing and API 5CT for OCTG manufacturing standards.' }
    ]
  },
  {
    id: 'srv_casing',
    num: '07',
    title: 'CASING INSPECTION - API 5CT/API 5A5',
    shortCode: 'API 5CT/API 5A5',
    category: 'Casing Inspection',
    description: 'Comprehensive oilfield casing inspection conducted in accordance with API 5CT and API 5A5 standards for well construction and surface/production casing strings.',
    iconName: 'Building2',
    heroImage: 'https://immusco.com/services/images/services/casingandtubing/img3.jpg',
    features: [
      'Visible tube and Visual thread Inspection',
      'UT wall thickness measurment ',
      'Full length API cylindrical drift testing',
      'Special end area magnetic particle inspection (SEA MPI) and thread compound application'
    ],
    benefits: [
      'Compliance with API 5CT and API 5A5 specifications',
      'Verification of casing wall thickness, steel grade integrity, and pressure containment reliability'
    ],
    standards: ['API 5CT', 'API 5A5', 'ISO 11960'],
    equipmentUsed: ['Digital Ultrasonic Gauge', 'Thread profile Gauges', 'Black light and CDS MPI unit'],
    processSteps: [
      { step: 1, title: 'Visual & Drift Test', detail: 'Visual external check and API cylindrical drift pass through entire casing length.' },
      { step: 2, title: 'EMI Scan & Ultrasonic QA', detail: 'Full body NDT scanning for longitudinal/transverse flaws and minimum wall verification.' },
      { step: 3, title: 'Thread QA & Protection', detail: 'Connection inspection, dry cleaning, applying certified thread compound, and installing clean protectors.' }
    ],
    faqs: [
      { q: 'What standards govern casing testing?', a: 'Casing inspection strictly complies with API Spec 5CT (OCTG specifications) and API RP 5A5 (Field Inspection of New Casing, Tubing, and Plain-End Drill Pipe).' }
    ]
  },
  {
    id: 'srv_handling_tools',
    num: '08',
    title: 'HANDLING TOOLS INSPECTION - API RP 8B',
    shortCode: 'API RP 8B',
    category: 'Handling Tools Inspection',
    description: 'Drilling rig handling tools and hoisting equipment inspection performed in accordance with API RP 8B guidelines to ensure drilling safety.',
    iconName: 'Cpu',
    heroImage: 'https://rig-spareparts.com/photo/pc46275799-carbon_steel_drilling_equipment_api_single_arm_elevator_links_for_workover_rig.jpg',
    features: [
      'Visual & magnetic particle inspection of elevators, links, bails, tongs, slips, and safety clamps',
      'Dimensional checking of critical load-bearing hinge pins, latch mechanisms, and bore profiles',
      'Non-destructive examination of full body areas',
      'Wear limit evaluation against OEM operational tolerances and safety thresholds'
    ],
    benefits: [
      'Adherence to API RP 8B Category III and Category IV recommended practices',
      'Assurance of hoisting safety and prevention of dropped object incidents on rig floors'
    ],
    standards: ['API RP 8B', 'API Spec 8C'],
    equipmentUsed: ['MPI Yoke Units', 'Ultrasonic wall thickness gauge', 'Precision Vernier Calipers', 'Black light UV and white light meter'],
    processSteps: [
      { step: 1, title: 'Cleaning & Visual Survey', detail: 'Surface degreasing, paint removal on critical zones, and initial visual assessment.' },
      { step: 2, title: 'Magnetic Particle / UT Testing', detail: 'Performing fluorescent MPI on critical load areas, hook ears, and link eyes per API RP 8B.' },
      { step: 3, title: 'Dimensional Profiling & Tagging', detail: 'Bore measurement, wear assessment, and recertification tagging.' }
    ],
    faqs: [
      { q: 'What inspection categories under API RP 8B are conducted?', a: 'We perform Category III (thorough on-site visual and NDT inspection) and Category IV (periodic major overhaul/strip-down inspection).' }
    ]
  }
];


export const RECENT_INSPECTION_RECORDS: InspectionRecord[] = [
  {
    id: 'INS-2026-8801',
    rigLocation: 'Dammam Yard - Batch A',
    clientName: 'Client Project Alpha',
    pipeType: 'Casing 9-5/8" P110',
    pipeSize: '9-5/8" OD, 47.0#, P110',
    totalJoints: 1420,
    acceptedJoints: 1398,
    rejectedJoints: 14,
    reworkJoints: 8,
    inspectorName: 'Marcus Sterling',
    asntLevel: 'ASNT Level II',
    inspectionDate: '2026-08-04',
    status: 'Completed',
    certificateId: 'CERT-JAI-2026-9912',
    standardsApplied: 'API 5CT / API 5A5'
  },
  {
    id: 'INS-2026-8802',
    rigLocation: 'Supply Yard Base - Unit 4',
    clientName: 'Client Project Beta',
    pipeType: 'Tubing 3-1/2" Super 13Cr',
    pipeSize: '3-1/2" OD, 9.2#, Super 13Cr-110',
    totalJoints: 850,
    acceptedJoints: 842,
    rejectedJoints: 3,
    reworkJoints: 5,
    inspectorName: 'Eng. Rajesh Sharma',
    asntLevel: 'ASNT Level II',
    inspectionDate: '2026-08-05',
    status: 'In Progress',
    certificateId: 'CERT-JAI-2026-4410',
    standardsApplied: 'API RP 74-2'
  },
  {
    id: 'INS-2026-8803',
    rigLocation: 'Tubular Yard - String C',
    clientName: 'Client Project Gamma',
    pipeType: 'Drill Pipe 5-1/2" S-135',
    pipeSize: '5-1/2" OD, 21.9#, S-135',
    totalJoints: 620,
    acceptedJoints: 602,
    rejectedJoints: 12,
    reworkJoints: 6,
    inspectorName: 'Marcus Sterling',
    asntLevel: 'ASNT Level II',
    inspectionDate: '2026-08-03',
    status: 'Completed',
    certificateId: 'CERT-JAI-2026-1102',
    standardsApplied: 'DS-1 Category 5'
  },
  {
    id: 'INS-2026-8804',
    rigLocation: 'Inspection Base Yard - Sector 2',
    clientName: 'Client Project Delta',
    pipeType: 'Drill Collars 8" Spiral NC50',
    pipeSize: '8" OD x 2-13/16" ID',
    totalJoints: 180,
    acceptedJoints: 180,
    rejectedJoints: 0,
    reworkJoints: 0,
    inspectorName: 'Suresh Kumar',
    asntLevel: 'ASNT Level II',
    inspectionDate: '2026-08-01',
    status: 'Completed',
    certificateId: 'CERT-JAI-2026-0091',
    standardsApplied: 'API RP 7G-2'
  }
];

export const DEFECT_LOGS: InspectionDefectLog[] = [
  {
    id: 'DEF-101',
    jointNumber: 'JNT-0842',
    defectType: 'Wall Reduction > 12.5%',
    severity: 'Reject',
    depthMm: 1.85,
    locationFromBoxFt: 14.2,
    remedialAction: 'Pipe rejected per API 5CT guidelines.'
  },
  {
    id: 'DEF-102',
    jointNumber: 'JNT-0319',
    defectType: 'Thread Imperfection',
    severity: 'Minor Rework',
    depthMm: 0.45,
    locationFromBoxFt: 0.2,
    remedialAction: 'Pin thread dressing recommended.'
  },
  {
    id: 'DEF-103',
    jointNumber: 'JNT-1105',
    defectType: 'Transverse Defect (UT)',
    severity: 'Reject',
    depthMm: 2.10,
    locationFromBoxFt: 2.1,
    remedialAction: 'Indication identified in slip area. Joint set aside.'
  }
];

export const SAMPLE_QUOTES: QuoteRequest[] = [
  {
    id: 'JAI-RFP-2026-9041',
    clientName: 'Ramesh Patel',
    company: 'Energy Project Logistics',
    email: 'r.patel@client-energy.com',
    phone: '+65 9697 4165',
    serviceType: 'Full-Length OCTG Inspection (Casing & Tubing)',
    location: 'Singapore Base Yard',
    pipeSpecs: '13-3/8" Casing 68# K55 & 9-5/8" P110',
    estimatedJoints: 2400,
    urgency: 'Standard (1-2 weeks)',
    status: 'Under Review',
    createdAt: '2026-08-04'
  },
  {
    id: 'JAI-RFP-2026-9042',
    clientName: 'Anil Mehta',
    company: 'Apex Drilling Services',
    email: 'a.mehta@apexdrilling.com',
    phone: '+65 9697 4165',
    serviceType: 'Rig & Structural Inspection (API 4F)',
    location: 'Rig Operational Site',
    pipeSpecs: 'Derrick Structure & BOP Assembly',
    estimatedJoints: 1,
    urgency: 'Emergency (24-48 hrs)',
    status: 'Under Review',
    createdAt: '2026-08-03'
  }
];

export const DIGITAL_CERTIFICATES: CertificateItem[] = [
  {
    id: 'CERT-JAI-2026-9912',
    certNumber: 'JAI-CERT-9912-A',
    clientName: 'Client Project Alpha',
    wellName: 'Well Site SF-881',
    inspectionType: 'OCTG Casing 9-5/8"',
    issueDate: '2026-08-04',
    expiryDate: '2027-08-04',
    leadInspector: 'Marcus Sterling (ASNT Level II / PCN Level 2)',
    standards: 'API 5CT / API 5A5',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=JAI-CERT-9912-A',
    status: 'Valid'
  },
  {
    id: 'CERT-JAI-2026-4410',
    certNumber: 'JAI-CERT-4410-B',
    clientName: 'Client Project Beta',
    wellName: 'Well Site US-12',
    inspectionType: 'Tubing 3-1/2" Super 13Cr',
    issueDate: '2026-08-05',
    expiryDate: '2027-08-05',
    leadInspector: 'Eng. Rajesh Sharma (ASNT Level II)',
    standards: 'API RP 74-2',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=JAI-CERT-4410-B',
    status: 'Valid'
  }
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'cs_01',
    title: 'Full Casing String QA & Flaw Identification',
    client: 'Client Project Alpha',
    location: 'Supply Pipe Yard',
    challenge: 'A batch of 9-5/8" casing required 100% EMI and thread dimensional inspection prior to field release.',
    solution: 'Deployed JAI OCTG Inspection Services Pte Ltd mobile inspection crew and EMI scanning equipment to inspect 1,420 joints.',
    resultMetric: 'Identified 14 rejected joints with wall loss and thread defects prior to shipment, ensuring string integrity.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHmndgM8aXgOqpIEyWLbGNqovi0te7LkcEsvgT0r7Ajg&s=10'
  },
  {
    id: 'cs_02',
    title: 'Drill String Inspection & Thread Verification',
    client: 'Client Project Beta',
    location: 'Regional Logistics Base',
    challenge: 'Scheduled inspection of drill pipe and bottom hole assembly components following operational rotation.',
    solution: 'Executed full DS-1 category inspection including tool joint dimensional checks, thread wet MPI, and tube EMI.',
    resultMetric: 'Completed inspection of 620 joints on schedule with complete digital tally and certificate documentation.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYu0pCfp8dar0OROzkYcSsb8b4kXO8tFUHrvstuKkC_w&s=10'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log_901',
    timestamp: '2026-08-05 10:14:22',
    actor: 'r.sharma@jaioctginspection.com',
    role: 'Super Admin',
    action: 'PUBLISH_INSPECTION_CERTIFICATE',
    ipAddress: '192.168.1.104',
    status: 'SUCCESS',
    details: 'Issued Certificate JAI-CERT-9912-A for Batch INS-2026-8801'
  },
  {
    id: 'log_902',
    timestamp: '2026-08-05 09:45:10',
    actor: 'm.sterling@jaioctginspection.com',
    role: 'Lead NDT Inspector',
    action: 'DOWNLOAD_PIPE_TALLY',
    ipAddress: '192.168.1.105',
    status: 'SUCCESS',
    details: 'Downloaded Pipe Tally and Defect Map for Batch INS-2026-8801'
  }
];

export const DB_SCHEMA_TABLES: DbTable[] = [
  {
    name: 'inspection_records',
    description: 'Core pipe inspection batches, joint counts, yard location, and status.',
    rowCountEstimate: 48500,
    indexes: ['idx_inspections_client_id', 'idx_inspections_date', 'idx_inspections_cert_id'],
    columns: [
      { name: 'id', type: 'VARCHAR(50)', isPrimaryKey: true, isForeignKey: false, nullable: false, description: 'Inspection Batch Number (INS-YYYY-XXXX)' },
      { name: 'client_id', type: 'UUID', isPrimaryKey: false, isForeignKey: true, nullable: false, references: 'clients.id', description: 'Client account' },
      { name: 'rig_location', type: 'VARCHAR(255)', isPrimaryKey: false, isForeignKey: false, nullable: false, description: 'Yard location / project site' },
      { name: 'pipe_type', type: 'VARCHAR(150)', isPrimaryKey: false, isForeignKey: false, nullable: false, description: 'Pipe classification and connection type' },
      { name: 'pipe_size_od_in', type: 'NUMERIC(5,2)', isPrimaryKey: false, isForeignKey: false, nullable: false, description: 'Outer diameter in inches' },
      { name: 'total_joints', type: 'INT', isPrimaryKey: false, isForeignKey: false, nullable: false, description: 'Total joints inspected' },
      { name: 'accepted_joints', type: 'INT', isPrimaryKey: false, isForeignKey: false, nullable: false, description: 'Passed joints' },
      { name: 'rejected_joints', type: 'INT', isPrimaryKey: false, isForeignKey: false, nullable: false, description: 'Failed joints' },
      { name: 'inspector_id', type: 'UUID', isPrimaryKey: false, isForeignKey: true, nullable: false, references: 'users.id', description: 'Lead NDT Inspector' },
      { name: 'created_at', type: 'TIMESTAMPTZ', isPrimaryKey: false, isForeignKey: false, nullable: false, description: 'Record entry timestamp' }
    ]
  },
  {
    name: 'joint_defects',
    description: 'Detailed joint-level flaw measurements, ultrasonic depth, and defect severity.',
    rowCountEstimate: 142000,
    indexes: ['idx_defects_inspection_id', 'idx_defects_joint_no'],
    columns: [
      { name: 'id', type: 'UUID', isPrimaryKey: true, isForeignKey: false, nullable: false, description: 'Defect unique ID' },
      { name: 'inspection_id', type: 'VARCHAR(50)', isPrimaryKey: false, isForeignKey: true, nullable: false, references: 'inspection_records.id', description: 'Parent inspection batch' },
      { name: 'joint_number', type: 'VARCHAR(50)', isPrimaryKey: false, isForeignKey: false, nullable: false, description: 'Stenciled pipe joint number' },
      { name: 'defect_code', type: 'VARCHAR(100)', isPrimaryKey: false, isForeignKey: false, nullable: false, description: 'API/DS-1 defect classification' },
      { name: 'wall_loss_percent', type: 'NUMERIC(5,2)', isPrimaryKey: false, isForeignKey: false, nullable: true, description: 'Ultrasonic wall thickness loss' },
      { name: 'disposition', type: 'VARCHAR(50)', isPrimaryKey: false, isForeignKey: false, nullable: false, description: 'REJECT, REWORK, ACCEPT' }
    ]
  },
  {
    name: 'certificates',
    description: 'Digital quality certificates with verification QR signatures.',
    rowCountEstimate: 28000,
    indexes: ['idx_certs_cert_number (UNIQUE)', 'idx_certs_client_id'],
    columns: [
      { name: 'id', type: 'UUID', isPrimaryKey: true, isForeignKey: false, nullable: false, description: 'Certificate UUID' },
      { name: 'cert_number', type: 'VARCHAR(100)', isPrimaryKey: false, isForeignKey: false, nullable: false, description: 'Official JAI Certificate Number' },
      { name: 'client_id', type: 'UUID', isPrimaryKey: false, isForeignKey: true, nullable: false, references: 'clients.id', description: 'Client company' },
      { name: 'issue_date', type: 'DATE', isPrimaryKey: false, isForeignKey: false, nullable: false, description: 'Date of issuance' },
      { name: 'qr_signature', type: 'TEXT', isPrimaryKey: false, isForeignKey: false, nullable: false, description: 'SHA-256 hash for QR verification' }
    ]
  }
];

export const DB_RELATIONS: ErRelation[] = [
  { fromTable: 'inspection_records', fromColumn: 'client_id', toTable: 'clients', toColumn: 'id', type: '1:N' },
  { fromTable: 'joint_defects', fromColumn: 'inspection_id', toTable: 'inspection_records', toColumn: 'id', type: '1:N' },
  { fromTable: 'certificates', fromColumn: 'client_id', toTable: 'clients', toColumn: 'id', type: '1:N' }
];

export const API_ENDPOINTS: ApiEndpointSpec[] = [
  {
    id: 'api_jai_01',
    method: 'GET',
    path: '/api/health',
    category: 'System',
    description: 'System health check and operational state of inspection server nodes.',
    requiresAuth: false,
    responseExample: { status: 'healthy', version: '3.4.0', service: 'JAI OCTG Inspection Gateway', activeInspectors: 4, timestamp: '2026-08-05T10:15:00Z' }
  },
  {
    id: 'api_jai_02',
    method: 'GET',
    path: '/api/inspections',
    category: 'Inspections',
    description: 'Retrieve list of OCTG & Rig inspection batches and joint tallies.',
    requiresAuth: true,
    responseExample: { data: RECENT_INSPECTION_RECORDS, totalRecords: 48500 }
  },
  {
    id: 'api_jai_03',
    method: 'POST',
    path: '/api/quotes',
    category: 'Quotes',
    description: 'Submit an RFP/Quotation request for OCTG or Rig inspection services.',
    requiresAuth: false,
    requestBodyExample: {
      clientName: 'Ramesh Patel',
      company: 'Energy Project Logistics',
      email: 'r.patel@client-energy.com',
      serviceType: 'Full-Length OCTG Inspection',
      location: 'Dammam Yard',
      estimatedJoints: 1500
    },
    responseExample: { success: true, quoteRef: 'JAI-RFP-2026-9901', message: 'Quote submitted successfully. Contact us for a customized quotation.' }
  }
];

export const DOCKER_CONFIG = {
  dockerfile: `# Multi-stage Dockerfile for JAI OCTG Inspection Services Pte Ltd
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
USER node
CMD ["node", "dist/server.cjs"]
`,
  dockerCompose: `version: '3.8'

services:
  jai-app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DATABASE_URL=\${DATABASE_URL}
    restart: always

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: \${POSTGRES_DB}
      POSTGRES_USER: \${POSTGRES_USER}
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
    ports:
      - "5432:5432"
`
};
