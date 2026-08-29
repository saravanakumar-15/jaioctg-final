export type UserRole = 'Super Admin' | 'Inspection Manager' | 'Level III NDT Inspector' | 'QA Lead' | 'Client Enterprise Admin' | 'Lead NDT Inspector' | 'Operations Manager' | 'Senior QA Inspector';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar: string;
  company: string;
  status: 'Active' | 'Pending' | 'Suspended';
  createdAt: string;
  lastLogin: string;
  mfaEnabled: boolean;
  department?: string;
  phone?: string;
  asntLevel?: string;
}

export interface InspectionService {
  id: string;
  num?: string;
  title: string;
  subLines?: string[];
  shortCode: string;
  category: string;
  description: string;
  iconName: string;
  heroImage: string;
  features: string[];
  benefits: string[];
  standards: string[];
  equipmentUsed: string[];
  processSteps: { step: number; title: string; detail: string }[];
  faqs: { q: string; a: string }[];
}

export interface InspectionRecord {
  id: string;
  rigLocation: string;
  clientName: string;
  pipeType: string;
  pipeSize: string;
  totalJoints: number;
  acceptedJoints: number;
  rejectedJoints: number;
  reworkJoints: number;
  inspectorName: string;
  asntLevel: string;
  inspectionDate: string;
  status: 'Completed' | 'In Progress' | 'Flagged Anomaly' | 'Pending Review';
  certificateId: string;
  standardsApplied: string;
}

export interface InspectionDefectLog {
  id: string;
  jointNumber: string;
  defectType: 'Thread Damage' | 'Pit Depth >12.5%' | 'Crack (UT)' | 'Ovality' | 'Seal Surface Gouge' | 'Wall Thinning' | 'Wall Reduction > 12.5%' | 'Thread Imperfection' | 'Transverse Defect (UT)';
  severity: 'Critical Reject' | 'Minor Rework' | 'Pass With Note' | 'Reject';
  depthMm: number;
  locationFromBoxFt: number;
  remedialAction: string;
}

export interface QuoteRequest {
  id: string;
  quotationNumber?: string;
  clientName: string;
  company: string;
  email: string;
  phone: string;
  serviceType: string;
  servicesList?: string[];
  location: string;
  pipeSpecs: string;
  estimatedJoints: number;
  urgency: string;
  status: 'Received' | 'Under Review' | 'Quoted' | 'Approved';
  createdAt: string;
}

export interface CertificateItem {
  id: string;
  certNumber: string;
  clientName: string;
  wellName: string;
  inspectionType: string;
  issueDate: string;
  expiryDate: string;
  leadInspector: string;
  standards: string;
  qrCodeUrl: string;
  status: 'Valid' | 'Audited' | 'Archived';
}

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  location: string;
  challenge: string;
  solution: string;
  resultMetric: string;
  image: string;
}

export interface SystemMetric {
  timestamp: string;
  jointsProcessedPerHour: number;
  activeRigs: number;
  defectDetectionAccuracyPercent: number;
  apiLatencyMs: number;
  requestCount: number;
  errorRatePercent: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  details: string;
}

export interface ApiLog {
  id: string;
  timestamp: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  statusCode: number;
  responseTimeMs: number;
  clientIp: string;
}

export interface DbTableColumn {
  name: string;
  type: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  nullable: boolean;
  references?: string;
  description: string;
}

export interface DbTable {
  name: string;
  description: string;
  columns: DbTableColumn[];
  rowCountEstimate: number;
  indexes: string[];
}

export interface ErRelation {
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
  type: '1:1' | '1:N' | 'N:M';
}

export interface ApiEndpointSpec {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  category: 'Auth' | 'Inspections' | 'Certificates' | 'Quotes' | 'System';
  description: string;
  parameters?: { name: string; type: string; required: boolean; description: string }[];
  requestBodyExample?: Record<string, any>;
  responseExample: Record<string, any>;
  requiresAuth: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'New' | 'In Progress' | 'Resolved';
}
