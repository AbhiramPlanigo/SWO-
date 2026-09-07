export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  regNo: string;
  department: string;
  year: string;
  campus: string;
  email: string;
  phone: string;
  avatar: string;
}

export interface CustomField {
  id: string;
  label: string;
  type: 'text' | 'select' | 'checkbox';
  required: boolean;
  options?: string[];
}

export type EventCategory = 
  | 'Talk Series'
  | 'Cultural'
  | 'Literary'
  | 'Well-Being'
  | 'Tech & Innovation'
  | 'Social Welfare'
  | 'Sports & Fitness';

export type EventStatus = 'Draft' | 'Published' | 'Closed';

export interface EventSpeaker {
  name: string;
  role: string;
  bio: string;
  avatar: string;
}

export interface EventItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: EventCategory;
  date: string; // YYYY-MM-DD
  time: string;
  venue: string;
  bannerUrl: string;
  capacity: number;
  registeredCount: number;
  organizingCommittee: string;
  eligibility: string;
  registrationDeadline: string;
  status: EventStatus;
  inCarousel: boolean;
  carouselOrder?: number;
  featured?: boolean;
  customFields?: CustomField[];
  speaker?: EventSpeaker;
  requiresApproval?: boolean;
}

export type RegistrationStatus = 'Registered' | 'Waitlisted' | 'Attended' | 'Cancelled';

export interface Registration {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  studentId: string;
  studentName: string;
  studentRegNo: string;
  studentEmail: string;
  studentDept: string;
  studentYear: string;
  registeredAt: string;
  status: RegistrationStatus;
  customAnswers?: Record<string, string>;
  ticketCode: string;
}

export type AnnouncementCategory = 'Academic' | 'Circular' | 'Auditions' | 'Campus Life' | 'Talk Series';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  date: string;
  targetDept: string; // 'All Departments' or specific dept
  targetYear: string; // 'All Batches' or specific year
  isPinned: boolean;
  readBy: string[]; // array of studentIds
  authorName: string;
  authorRole: string;
}

export interface CompetitionWinner {
  rank: number;
  title: string; // 'First Place', 'Second Place', 'Best Speaker', etc.
  winnerName: string;
  regNo: string;
  department: string;
  prize?: string;
}

export interface EventResult {
  id: string;
  eventId: string;
  eventTitle: string;
  category: string;
  date: string;
  positions: CompetitionWinner[];
  judgesRemarks: string;
  certificateEligible: boolean;
}

export type CertificateType = 'Participation' | 'Merit' | 'Winner' | 'Volunteer' | 'Organizing Team';

export interface Certificate {
  id: string;
  certificateNo: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  studentName: string;
  studentRegNo: string;
  department: string;
  type: CertificateType;
  issuedDate: string;
  authorizedBy: string;
  designation: string;
  qrVerifyCode: string;
}

export interface CommitteeMember {
  id: string;
  name: string;
  role: string;
  regNo: string;
  department: string;
  avatar?: string;
  email: string;
  phone?: string;
  assignedEvents?: string[];
}

export interface Committee {
  id: string;
  name: string;
  wing: string;
  leadName: string;
  deputyName: string;
  memberCount: number;
  email: string;
  description: string;
  activeEventsCount: number;
  facultyCoordinator?: string;
  members: CommitteeMember[];
}

export interface SurveyQuestion {
  id: string;
  label: string;
  type: 'text' | 'rating' | 'choice';
  options?: string[];
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  studentId: string;
  submittedAt: string;
  answers: Record<string, string | number>;
}

export interface ResearchSurvey {
  id: string;
  title: string;
  description: string;
  category: string;
  deadline: string;
  responsesCount?: number;
  totalResponses: number;
  targetSample: number;
  status: 'Active' | 'Closed';
  questions?: SurveyQuestion[];
  questionsCount?: number;
}

export interface AttendanceRecord {
  id: string;
  eventId: string;
  studentId: string;
  studentName: string;
  studentRegNo: string;
  studentDept: string;
  checkInTime: string;
  method: 'QR' | 'Manual' | 'Bulk';
}

export interface HeroGuest {
  id: string;
  name: string;
  role: string;
  org: string;
  avatar: string;
}

export interface HeroBannerSettings {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  speakers: HeroGuest[];
  accentColor: string;
  bgImage: string;
  tags: string[];
}

export type SuggestionStatus = 'Under Review' | 'Approved' | 'In Planning' | 'Declined';

export interface EventSuggestion {
  id: string;
  title: string;
  category: EventCategory;
  description: string;
  proposedDate?: string;
  proposedVenue?: string;
  targetAudience?: string;
  estimatedParticipants?: number | string;
  suggestedSpeakers?: string;
  studentId: string;
  studentName: string;
  studentRegNo: string;
  studentDept: string;
  studentEmail: string;
  submittedAt: string;
  upvotes: string[]; // array of studentIds who upvoted
  status: SuggestionStatus;
  adminFeedback?: string;
  reviewedBy?: string;
}
