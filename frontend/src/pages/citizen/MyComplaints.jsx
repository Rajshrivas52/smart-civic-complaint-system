import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Clock,
  Activity,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  X,
  RotateCcw,
  Eye,
  MapPin,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Star,
  Building2,
  Tag,
  Check,
  ThumbsUp,
  ThumbsDown,
  Inbox
} from 'lucide-react';
import './MyComplaints.css';

// ============================================================================
// REALISTIC MOCK DATA (14 complaints in Gwalior region, matching 2026 timeline)
// ============================================================================
const INITIAL_COMPLAINTS = [
  {
    id: "SC-2026-0012",
    title: "Large pothole near City Center",
    category: "Roads & Potholes",
    location: "City Center, Gwalior",
    submittedDate: "2026-09-08",
    priority: "High",
    status: "In Progress",
    department: "Road Maintenance",
    description: "Large pothole causing severe difficulty for two-wheelers and buses near the primary traffic intersection.",
    image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=600",
    latitude: 26.2183,
    longitude: 78.1828,
    timeline: [
      { title: "Complaint Submitted", date: "2026-09-08 10:15 AM", note: "Reported via citizen portal" },
      { title: "Under Review", date: "2026-09-08 02:30 PM", note: "Verified by municipal control room" },
      { title: "Assigned to Department", date: "2026-09-09 09:00 AM", note: "Assigned to Road Maintenance Division" },
      { title: "Work in Progress", date: "2026-09-09 01:45 PM", note: "Paving crew dispatched with cold-mix asphalt" },
      { title: "Resolved", date: null, note: "Pending final resurfacing inspection" }
    ],
    resolution: null,
    resolvedDate: null
  },
  {
    id: "SC-2026-0014",
    title: "Overflowing community garbage container",
    category: "Garbage & Sanitation",
    location: "Maharaj Bada, Lashkar, Gwalior",
    submittedDate: "2026-09-09",
    priority: "Critical",
    status: "Pending",
    department: "Sanitation & Waste",
    description: "Solid waste dump overflowing into the pedestrian footpath, attracting stray cattle and spreading foul odor across the market.",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=600",
    latitude: 26.2052,
    longitude: 78.1610,
    timeline: [
      { title: "Complaint Submitted", date: "2026-09-09 08:30 AM", note: "Reported with photo verification" },
      { title: "Under Review", date: "2026-09-09 11:00 AM", note: "In verification queue at Central Ward Office" },
      { title: "Assigned to Department", date: null, note: "Awaiting sanitation supervisor allocation" },
      { title: "Work in Progress", date: null, note: "Pending compactor truck scheduling" },
      { title: "Resolved", date: null, note: "Pending waste clearance and chemical wash" }
    ],
    resolution: null,
    resolvedDate: null
  },
  {
    id: "SC-2026-0011",
    title: "Broken streetlights along main avenue",
    category: "Streetlight",
    location: "Thatipur Main Road, Gwalior",
    submittedDate: "2026-09-06",
    priority: "Medium",
    status: "In Progress",
    department: "Electricity & Lighting",
    description: "Four consecutive pole LED lights (Poles #34-#37) are flickering and blacked out, creating hazard for evening pedestrians.",
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=600",
    latitude: 26.2165,
    longitude: 78.1970,
    timeline: [
      { title: "Complaint Submitted", date: "2026-09-06 07:45 PM", note: "Logged via mobile app" },
      { title: "Under Review", date: "2026-09-07 09:15 AM", note: "Verified through street lighting SCADA" },
      { title: "Assigned to Department", date: "2026-09-07 11:30 AM", note: "Dispatched to Zone 3 Electrical Wing" },
      { title: "Work in Progress", date: "2026-09-08 04:00 PM", note: "Replacing driver units and cabling" },
      { title: "Resolved", date: null, note: "Final nighttime illumination test pending" }
    ],
    resolution: null,
    resolvedDate: null
  },
  {
    id: "SC-2026-0009",
    title: "Underground drinking water pipe leakage",
    category: "Water Supply",
    location: "Morar Cantonment, Gwalior",
    submittedDate: "2026-09-04",
    priority: "High",
    status: "Resolved",
    department: "Public Health Engineering",
    description: "Clean drinking water bursting through road pavement since morning, causing water loss and low pressure in residential taps.",
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&q=80&w=600",
    latitude: 26.2290,
    longitude: 78.2245,
    timeline: [
      { title: "Complaint Submitted", date: "2026-09-04 06:20 AM", note: "Emergency water line report filed" },
      { title: "Under Review", date: "2026-09-04 07:15 AM", note: "Assessed as Priority A pipeline breach" },
      { title: "Assigned to Department", date: "2026-09-04 08:00 AM", note: "Assigned to PHE Emergency Repair Unit" },
      { title: "Work in Progress", date: "2026-09-04 10:30 AM", note: "Excavation and pipe collar clamping underway" },
      { title: "Resolved", date: "2026-09-05 03:30 PM", note: "Pipeline repaired, pressure restored and trench backfilled" }
    ],
    resolution: "The 100mm cast-iron supply pipeline was excavated, the ruptured joint was replaced with a new collar valve, and road trench backfilled.",
    resolvedDate: "2026-09-05",
    rating: 5,
    feedbackSatisfied: 'yes'
  },
  {
    id: "SC-2026-0008",
    title: "Clogged stormwater drain causing street waterlogging",
    category: "Drainage",
    location: "Phoolbagh Chowk, Gwalior",
    submittedDate: "2026-08-28",
    priority: "High",
    status: "Resolved",
    department: "Storm Water & Drainage",
    description: "Silt and debris accumulated in open roadside drain causing water to overflow into pedestrian walkway after light rain.",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=600",
    latitude: 26.2120,
    longitude: 78.1750,
    timeline: [
      { title: "Complaint Submitted", date: "2026-08-28 11:30 AM", note: "Citizen complaint registered" },
      { title: "Under Review", date: "2026-08-28 01:00 PM", note: "Monitored via GIS flood hotspot tracker" },
      { title: "Assigned to Department", date: "2026-08-29 09:30 AM", note: "Sanitation Drainage Crew Ward 14" },
      { title: "Work in Progress", date: "2026-08-29 02:00 PM", note: "Super sucker machine deployed for desilting" },
      { title: "Resolved", date: "2026-08-30 05:00 PM", note: "Drain desilted and grating re-installed" }
    ],
    resolution: "Drainage channel cleared of 3 tons of sediment and plastic debris using high-pressure vacuum unit. Water flow restored completely.",
    resolvedDate: "2026-08-30",
    rating: 4,
    feedbackSatisfied: 'yes'
  },
  {
    id: "SC-2026-0007",
    title: "Broken traffic signal light at junction",
    category: "Traffic",
    location: "Hazira Vegetable Market, Gwalior",
    submittedDate: "2026-08-22",
    priority: "Critical",
    status: "In Progress",
    department: "Traffic Police Department",
    description: "Traffic signal controller stuck in yellow flashing mode during peak morning hours, leading to frequent bottlenecks.",
    image: "https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&q=80&w=600",
    latitude: 26.2340,
    longitude: 78.1810,
    timeline: [
      { title: "Complaint Submitted", date: "2026-08-22 09:00 AM", note: "Submitted by daily commuter" },
      { title: "Under Review", date: "2026-08-22 10:15 AM", note: "Reviewed by Traffic Operations Center" },
      { title: "Assigned to Department", date: "2026-08-22 11:45 AM", note: "Signaling & Telemetry contractor assigned" },
      { title: "Work in Progress", date: "2026-08-23 10:00 AM", note: "Microcontroller card replacement underway" },
      { title: "Resolved", date: null, note: "Synchronization with adaptive traffic controller pending" }
    ],
    resolution: null,
    resolvedDate: null
  },
  {
    id: "SC-2026-0006",
    title: "Fallen tree branches blocking public footpath",
    category: "Other",
    location: "Fort Road near Gwalior Fort Gate",
    submittedDate: "2026-08-14",
    priority: "Low",
    status: "Resolved",
    department: "Parks & Urban Horticulture",
    description: "Heavy winds brought down a large branch of banyan tree, partly blocking tourist walkway and heritage pathway.",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=600",
    latitude: 26.2295,
    longitude: 78.1695,
    timeline: [
      { title: "Complaint Submitted", date: "2026-08-14 02:40 PM", note: "Submitted by local resident" },
      { title: "Under Review", date: "2026-08-14 03:30 PM", note: "Horticulture section alerted" },
      { title: "Assigned to Department", date: "2026-08-15 08:30 AM", note: "Tree trimming and clearance wing" },
      { title: "Work in Progress", date: "2026-08-15 11:00 AM", note: "Wood cutting and hauling from pathway" },
      { title: "Resolved", date: "2026-08-16 01:00 PM", note: "Footpath cleared and opened for pedestrian traffic" }
    ],
    resolution: "Fallen limbs safely removed with chainsaw equipment, debris trucked to municipal composting facility, and footpath swept clean.",
    resolvedDate: "2026-08-16",
    rating: 5,
    feedbackSatisfied: 'yes'
  },
  {
    id: "SC-2026-0005",
    title: "Stagnant green water in vacant plot",
    category: "Drainage",
    location: "Pinto Park, Morar, Gwalior",
    submittedDate: "2026-07-30",
    priority: "Medium",
    status: "Pending",
    department: "Public Health Engineering",
    description: "Rainwater accumulated in vacant residential plot creating mosquito breeding ground for neighboring families.",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=600",
    latitude: 26.2360,
    longitude: 78.2320,
    timeline: [
      { title: "Complaint Submitted", date: "2026-07-30 04:15 PM", note: "Registered by RWA representative" },
      { title: "Under Review", date: "2026-07-31 10:00 AM", note: "Notice drafted for vacant plot land owner" },
      { title: "Assigned to Department", date: null, note: "Awaiting anti-larval spray squad assignment" },
      { title: "Work in Progress", date: null, note: "Pumping engine scheduling in progress" },
      { title: "Resolved", date: null, note: "Pending drainage pump operation" }
    ],
    resolution: null,
    resolvedDate: null
  },
  {
    id: "SC-2026-0004",
    title: "Open manhole without warning sign",
    category: "Roads & Potholes",
    location: "Deen Dayal Nagar, Sector 3, Gwalior",
    submittedDate: "2026-07-15",
    priority: "Critical",
    status: "Resolved",
    department: "Road Maintenance",
    description: "Manhole cover stolen or broken on a busy neighborhood curve. Extremely dangerous for cars and schoolchildren.",
    image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=600",
    latitude: 26.2410,
    longitude: 78.2050,
    timeline: [
      { title: "Complaint Submitted", date: "2026-07-15 08:10 AM", note: "Urgent citizen safety report" },
      { title: "Under Review", date: "2026-07-15 08:30 AM", note: "Escalated to Emergency Quick Response Team" },
      { title: "Assigned to Department", date: "2026-07-15 09:00 AM", note: "Roads & Storm Maintenance Unit" },
      { title: "Work in Progress", date: "2026-07-15 09:45 AM", note: "Temporary barricade erected & replacement cover cast" },
      { title: "Resolved", date: "2026-07-15 03:00 PM", note: "Heavy-duty ductile iron manhole cover locked in place" }
    ],
    resolution: "New heavy ductile-iron SFRC manhole cover installed with concrete rim reinforcement. High-visibility road markers painted.",
    resolvedDate: "2026-07-15",
    rating: 5,
    feedbackSatisfied: 'yes'
  },
  {
    id: "SC-2026-0003",
    title: "Commercial hoarding erected without municipal permit",
    category: "Other",
    location: "Shinde Ki Chhawani, Gwalior",
    submittedDate: "2026-06-25",
    priority: "Low",
    status: "Rejected",
    department: "Urban Development & Town Planning",
    description: "Unapproved steel advertising billboard erected over electrical wires near commercial complex.",
    image: "https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&q=80&w=600",
    latitude: 26.2085,
    longitude: 78.1680,
    timeline: [
      { title: "Complaint Submitted", date: "2026-06-25 11:15 AM", note: "Complaint filed by shopkeeper" },
      { title: "Under Review", date: "2026-06-26 03:00 PM", note: "Site inspection conducted by building inspector" },
      { title: "Assigned to Department", date: "2026-06-27 10:00 AM", note: "Advertising Licensing Section" },
      { title: "Work in Progress", date: null, note: "Review of municipal registration certificates" },
      { title: "Rejected", date: "2026-06-28 04:30 PM", note: "Structure possesses valid permission #ADV-2026-8941" }
    ],
    resolution: "Inspection revealed the advertisement board has valid municipal permission #ADV-2026-8941 with structural stability compliance certificate. Issue closed as non-violation.",
    resolvedDate: "2026-06-28"
  },
  {
    id: "SC-2026-0002",
    title: "Low water pressure during scheduled supply hours",
    category: "Water Supply",
    location: "Kampoo Road, Lashkar, Gwalior",
    submittedDate: "2026-06-08",
    priority: "Medium",
    status: "Resolved",
    department: "Public Health Engineering",
    description: "Water pressure has decreased substantially over the past two weeks, making it impossible to fill rooftop storage tanks.",
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&q=80&w=600",
    latitude: 26.1950,
    longitude: 78.1570,
    timeline: [
      { title: "Complaint Submitted", date: "2026-06-08 07:00 AM", note: "Submitted via citizen portal" },
      { title: "Under Review", date: "2026-06-08 12:30 PM", note: "Checked against water booster station logs" },
      { title: "Assigned to Department", date: "2026-06-09 09:00 AM", note: "Kampoo Feeder Valve Operations Team" },
      { title: "Work in Progress", date: "2026-06-10 11:00 AM", note: "Sluice valve descaling and air release valve servicing" },
      { title: "Resolved", date: "2026-06-11 02:00 PM", note: "Pressure restored to normal 2.2 bar level" }
    ],
    resolution: "Air lock removed from secondary distribution line and pressure reducing valve recalibrated. Full morning supply pressure restored.",
    resolvedDate: "2026-06-11",
    rating: null,
    feedbackSatisfied: null
  },
  {
    id: "SC-2026-0001",
    title: "Illegal construction debris dumped on vacant road corner",
    category: "Garbage & Sanitation",
    location: "Naya Bazaar, Lashkar, Gwalior",
    submittedDate: "2026-05-19",
    priority: "Medium",
    status: "Rejected",
    department: "Sanitation & Waste",
    description: "Cement rubble and bricks dumped on private boundary wall corner obstructing turn.",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=600",
    latitude: 26.2020,
    longitude: 78.1635,
    timeline: [
      { title: "Complaint Submitted", date: "2026-05-19 10:00 AM", note: "Logged with mobile photo" },
      { title: "Under Review", date: "2026-05-20 11:30 AM", note: "Field visit by ward sanitation inspector" },
      { title: "Assigned to Department", date: "2026-05-20 02:00 PM", note: "Private Encroachment Wing" },
      { title: "Work in Progress", date: null, note: "Ownership verification" },
      { title: "Rejected", date: "2026-05-21 04:00 PM", note: "Located inside demarcated private construction boundary" }
    ],
    resolution: "Site inspection verified that the material is within private registered property undergoing active renovation. Does not encroach public right of way.",
    resolvedDate: "2026-05-21"
  },
  {
    id: "SC-2026-0010",
    title: "Non-functional high mast light at roundabout",
    category: "Streetlight",
    location: "Padav Railway Station Area, Gwalior",
    submittedDate: "2026-04-12",
    priority: "Low",
    status: "Pending",
    department: "Electricity & Lighting",
    description: "Roundabout center high mast light tower has 3 of 6 sodium lamps fused, reducing night visibility for commuters.",
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=600",
    latitude: 26.2210,
    longitude: 78.1880,
    timeline: [
      { title: "Complaint Submitted", date: "2026-04-12 09:15 PM", note: "Reported by auto driver association" },
      { title: "Under Review", date: "2026-04-13 10:30 AM", note: "Hydraulic hoist crane request pending" },
      { title: "Assigned to Department", date: null, note: "High Mast Special Maintenance Wing" },
      { title: "Work in Progress", date: null, note: "Awaiting replacement luminaires" },
      { title: "Resolved", date: null, note: "Pending hoist elevation and lamp change" }
    ],
    resolution: null,
    resolvedDate: null
  },
  {
    id: "SC-2026-0013",
    title: "Deep road depression and asphalt cracking",
    category: "Roads & Potholes",
    location: "Alkapuri, City Center, Gwalior",
    submittedDate: "2026-03-20",
    priority: "High",
    status: "In Progress",
    department: "Road Maintenance",
    description: "Road surface sinking near culvert crossing, forming a 4-inch depression that violently jars car suspensions.",
    image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=600",
    latitude: 26.2140,
    longitude: 78.1845,
    timeline: [
      { title: "Complaint Submitted", date: "2026-03-20 03:30 PM", note: "Reported by resident" },
      { title: "Under Review", date: "2026-03-21 11:00 AM", note: "Culvert structural engineer survey" },
      { title: "Assigned to Department", date: "2026-03-22 09:30 AM", note: "Civil Infrastructure Division" },
      { title: "Work in Progress", date: "2026-03-24 10:00 AM", note: "Base leveling and sub-grade compaction" },
      { title: "Resolved", date: null, note: "Bituminous wearing course application scheduled" }
    ],
    resolution: null,
    resolvedDate: null
  }
];

const CATEGORIES = [
  "All Categories",
  "Roads & Potholes",
  "Garbage & Sanitation",
  "Streetlight",
  "Water Supply",
  "Drainage",
  "Traffic",
  "Other"
];

const STATUSES = [
  "All Status",
  "Pending",
  "In Progress",
  "Resolved",
  "Rejected"
];

const PRIORITIES = [
  "All Priority",
  "Low",
  "Medium",
  "High",
  "Critical"
];

const DATE_RANGES = [
  "All Time",
  "Last 7 Days",
  "Last 30 Days",
  "Last 6 Months"
];

// Reusable Status Badge
export const ComplaintStatusBadge = ({ status }) => {
  const norm = (status || 'pending').toLowerCase();
  if (norm === 'pending') {
    return (
      <span className="mc-status-badge mc-status-pending" aria-label="Status: Pending">
        <Clock size={12} /> Pending
      </span>
    );
  }
  if (norm === 'in progress') {
    return (
      <span className="mc-status-badge mc-status-progress" aria-label="Status: In Progress">
        <Activity size={12} /> In Progress
      </span>
    );
  }
  if (norm === 'resolved') {
    return (
      <span className="mc-status-badge mc-status-resolved" aria-label="Status: Resolved">
        <CheckCircle2 size={12} /> Resolved
      </span>
    );
  }
  if (norm === 'rejected') {
    return (
      <span className="mc-status-badge mc-status-rejected" aria-label="Status: Rejected">
        <XCircle size={12} /> Rejected
      </span>
    );
  }
  return <span className="mc-status-badge">{status}</span>;
};

// Reusable Priority Badge
export const ComplaintPriorityBadge = ({ priority }) => {
  const norm = (priority || 'medium').toLowerCase();
  let className = 'mc-priority-medium';
  if (norm === 'low') className = 'mc-priority-low';
  if (norm === 'high') className = 'mc-priority-high';
  if (norm === 'critical') className = 'mc-priority-critical';

  return (
    <span className={`mc-priority-badge ${className}`} aria-label={`Priority: ${priority}`}>
      <span className="mc-priority-dot" />
      {priority}
    </span>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const MyComplaints = () => {
  const navigate = useNavigate();

  // Primary state
  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);
  const [loading, setLoading] = useState(true);

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedPriority, setSelectedPriority] = useState('All Priority');
  const [selectedDateRange, setSelectedDateRange] = useState('All Time');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal inspection state
  const [activeComplaint, setActiveComplaint] = useState(null);

  // Local feedback state for resolved complaints
  const [hoverRating, setHoverRating] = useState(0);

  // Simulated initial mount loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  // Summary counts calculated dynamically
  const stats = useMemo(() => {
    return {
      total: complaints.length,
      pending: complaints.filter(c => c.status === 'Pending').length,
      inProgress: complaints.filter(c => c.status === 'In Progress').length,
      resolved: complaints.filter(c => c.status === 'Resolved').length
    };
  }, [complaints]);

  // Handle Clear Filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Categories');
    setSelectedStatus('All Status');
    setSelectedPriority('All Priority');
    setSelectedDateRange('All Time');
    setCurrentPage(1);
  };

  // Helper date checker (relative to simulated current date 2026-09-10)
  const isDateWithinRange = (dateStr, range) => {
    if (range === 'All Time') return true;
    const itemDate = new Date(dateStr);
    const simulatedNow = new Date('2026-09-10T14:30:00Z');
    const diffMs = simulatedNow - itemDate;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (range === 'Last 7 Days') {
      return diffDays >= 0 && diffDays <= 7;
    }
    if (range === 'Last 30 Days') {
      return diffDays >= 0 && diffDays <= 30;
    }
    if (range === 'Last 6 Months') {
      return diffDays >= 0 && diffDays <= 180;
    }
    return true;
  };

  // Filtered complaints logic
  const filteredComplaints = useMemo(() => {
    return complaints.filter(complaint => {
      // Search matching: ID, Title, Location
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = complaint.id.toLowerCase().includes(q);
        const matchesTitle = complaint.title.toLowerCase().includes(q);
        const matchesLocation = complaint.location.toLowerCase().includes(q);
        if (!matchesId && !matchesTitle && !matchesLocation) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'All Categories' && complaint.category !== selectedCategory) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'All Status' && complaint.status !== selectedStatus) {
        return false;
      }

      // Priority filter
      if (selectedPriority !== 'All Priority' && complaint.priority !== selectedPriority) {
        return false;
      }

      // Date range filter
      if (!isDateWithinRange(complaint.submittedDate, selectedDateRange)) {
        return false;
      }

      return true;
    });
  }, [complaints, searchQuery, selectedCategory, selectedStatus, selectedPriority, selectedDateRange]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage) || 1;
  const activePage = Math.min(currentPage, totalPages);
  const paginatedComplaints = useMemo(() => {
    const start = (activePage - 1) * itemsPerPage;
    return filteredComplaints.slice(start, start + itemsPerPage);
  }, [filteredComplaints, activePage, itemsPerPage]);

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    selectedCategory !== 'All Categories' ||
    selectedStatus !== 'All Status' ||
    selectedPriority !== 'All Priority' ||
    selectedDateRange !== 'All Time';

  // Handle citizen star rating update
  const handleSetRating = (score) => {
    if (!activeComplaint) return;
    const updated = { ...activeComplaint, rating: score };
    setActiveComplaint(updated);
    setComplaints(prev => prev.map(c => c.id === activeComplaint.id ? updated : c));
  };

  // Handle satisfaction feedback
  const handleSetSatisfaction = (val) => {
    if (!activeComplaint) return;
    const updated = { ...activeComplaint, feedbackSatisfied: val };
    setActiveComplaint(updated);
    setComplaints(prev => prev.map(c => c.id === activeComplaint.id ? updated : c));
  };

  return (
    <div className="my-complaints-page">
      {/* ------------------------------------------------------------------ */}
      {/* 1. PAGE HEADER                                                     */}
      {/* ------------------------------------------------------------------ */}
      <div className="mc-header">
        <div className="mc-header-title-area">
          <h1 className="mc-header-title">
            <FileText size={28} style={{ color: 'var(--primary)' }} />
            My Complaints
          </h1>
          <p className="mc-header-subtitle">
            Track and manage the civic issues you have reported.
          </p>
        </div>

        <button
          className="mc-btn-submit"
          onClick={() => navigate('/citizen/submit-complaint')}
          aria-label="Submit New Complaint"
        >
          <Plus size={18} />
          + Submit New Complaint
        </button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. SUMMARY STATS CARDS                                             */}
      {/* ------------------------------------------------------------------ */}
      <div className="mc-summary-grid">
        <div className="mc-stat-card stat-total">
          <div className="mc-stat-icon">
            <FileText size={24} />
          </div>
          <div className="mc-stat-info">
            <div className="mc-stat-title">Total Complaints</div>
            <div className="mc-stat-value">{stats.total}</div>
            <div className="mc-stat-desc">All submitted complaints</div>
          </div>
        </div>

        <div className="mc-stat-card stat-pending">
          <div className="mc-stat-icon">
            <Clock size={24} />
          </div>
          <div className="mc-stat-info">
            <div className="mc-stat-title">Pending</div>
            <div className="mc-stat-value">{stats.pending}</div>
            <div className="mc-stat-desc">Awaiting action</div>
          </div>
        </div>

        <div className="mc-stat-card stat-progress">
          <div className="mc-stat-icon">
            <Activity size={24} />
          </div>
          <div className="mc-stat-info">
            <div className="mc-stat-title">In Progress</div>
            <div className="mc-stat-value">{stats.inProgress}</div>
            <div className="mc-stat-desc">Currently being worked on</div>
          </div>
        </div>

        <div className="mc-stat-card stat-resolved">
          <div className="mc-stat-icon">
            <CheckCircle2 size={24} />
          </div>
          <div className="mc-stat-info">
            <div className="mc-stat-title">Resolved</div>
            <div className="mc-stat-value">{stats.resolved}</div>
            <div className="mc-stat-desc">Successfully resolved</div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 3. SEARCH & FILTER TOOLBAR                                         */}
      {/* ------------------------------------------------------------------ */}
      <div className="mc-toolbar-card">
        <div className="mc-toolbar-top">
          {/* Search bar */}
          <div className="mc-search-wrapper">
            <Search className="mc-search-icon" size={18} />
            <input
              type="text"
              className="mc-search-input"
              placeholder="Search complaints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search complaints by ID, title, or location"
            />
            {searchQuery && (
              <button
                className="mc-search-clear"
                onClick={() => setSearchQuery('')}
                title="Clear search text"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="mc-filter-group">
            {/* Category */}
            <div className="mc-select-wrapper">
              <select
                className="mc-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filter by category"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <ChevronDown className="mc-select-arrow" size={16} />
            </div>

            {/* Status */}
            <div className="mc-select-wrapper">
              <select
                className="mc-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                aria-label="Filter by status"
              >
                {STATUSES.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
              <ChevronDown className="mc-select-arrow" size={16} />
            </div>

            {/* Priority */}
            <div className="mc-select-wrapper">
              <select
                className="mc-select"
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                aria-label="Filter by priority"
              >
                {PRIORITIES.map(pr => (
                  <option key={pr} value={pr}>{pr}</option>
                ))}
              </select>
              <ChevronDown className="mc-select-arrow" size={16} />
            </div>

            {/* Date */}
            <div className="mc-select-wrapper">
              <select
                className="mc-select"
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                aria-label="Filter by date range"
              >
                {DATE_RANGES.map(dr => (
                  <option key={dr} value={dr}>{dr}</option>
                ))}
              </select>
              <ChevronDown className="mc-select-arrow" size={16} />
            </div>

            {/* Clear button */}
            {hasActiveFilters && (
              <button
                className="mc-btn-clear-filters"
                onClick={handleClearFilters}
                aria-label="Clear all applied filters"
              >
                <RotateCcw size={14} /> Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Toolbar metadata & active chips */}
        <div className="mc-toolbar-meta">
          <div>
            Showing <strong>{filteredComplaints.length}</strong> of <strong>{complaints.length}</strong> complaints
          </div>
          {hasActiveFilters && (
            <div className="mc-active-filter-chips">
              {searchQuery && (
                <span className="mc-filter-chip">
                  Search: "{searchQuery}"
                </span>
              )}
              {selectedCategory !== 'All Categories' && (
                <span className="mc-filter-chip">
                  Category: {selectedCategory}
                </span>
              )}
              {selectedStatus !== 'All Status' && (
                <span className="mc-filter-chip">
                  Status: {selectedStatus}
                </span>
              )}
              {selectedPriority !== 'All Priority' && (
                <span className="mc-filter-chip">
                  Priority: {selectedPriority}
                </span>
              )}
              {selectedDateRange !== 'All Time' && (
                <span className="mc-filter-chip">
                  Date: {selectedDateRange}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 4. COMPLAINT LIST (DESKTOP TABLE & MOBILE CARDS)                    */}
      {/* ------------------------------------------------------------------ */}
      {loading ? (
        <div className="mc-loading-state">
          <div className="mc-spinner" />
          <p>Loading complaints...</p>
        </div>
      ) : filteredComplaints.length === 0 ? (
        /* Empty State */
        <div className="mc-empty-state">
          <div className="mc-empty-icon">
            <Inbox size={32} />
          </div>
          <h3 className="mc-empty-title">No complaints found</h3>
          <p className="mc-empty-desc">
            Try changing your search or filters to see more results.
          </p>
          <button className="mc-btn-clear-filters" onClick={handleClearFilters}>
            <RotateCcw size={14} /> Clear Filters
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="mc-table-card">
            <div className="mc-table-responsive">
              <table className="mc-table">
                <thead>
                  <tr>
                    <th>Complaint ID</th>
                    <th>Complaint</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Submitted</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Department</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedComplaints.map(complaint => (
                    <tr key={complaint.id}>
                      {/* ID */}
                      <td>
                        <span className="mc-cell-id">{complaint.id}</span>
                      </td>

                      {/* Complaint (Title + ID) */}
                      <td className="mc-cell-complaint">
                        <div className="mc-complaint-title">{complaint.title}</div>
                        <div className="mc-complaint-subid">{complaint.id}</div>
                      </td>

                      {/* Category */}
                      <td className="mc-cell-category">
                        {complaint.category}
                      </td>

                      {/* Location */}
                      <td>
                        <div className="mc-cell-location" title={complaint.location}>
                          <MapPin size={14} style={{ flexShrink: 0, color: 'var(--text-light)' }} />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {complaint.location}
                          </span>
                        </div>
                      </td>

                      {/* Submitted */}
                      <td className="mc-cell-date">
                        {complaint.submittedDate}
                      </td>

                      {/* Priority */}
                      <td>
                        <ComplaintPriorityBadge priority={complaint.priority} />
                      </td>

                      {/* Status */}
                      <td>
                        <ComplaintStatusBadge status={complaint.status} />
                      </td>

                      {/* Department */}
                      <td className="mc-cell-dept">
                        {complaint.department}
                      </td>

                      {/* Action */}
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="mc-btn-view"
                          onClick={() => setActiveComplaint(complaint)}
                          aria-label={`View details for ${complaint.id}`}
                        >
                          <Eye size={14} /> View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Stacked Cards */}
          <div className="mc-mobile-cards">
            {paginatedComplaints.map(complaint => (
              <div key={complaint.id} className="mc-card-item">
                <div className="mc-card-header">
                  <span className="mc-cell-id">{complaint.id}</span>
                  <ComplaintStatusBadge status={complaint.status} />
                </div>

                <div className="mc-card-title">{complaint.title}</div>

                <div className="mc-card-meta-row">
                  <div className="mc-card-meta-item">
                    <Tag size={14} style={{ color: 'var(--text-light)' }} />
                    <span>{complaint.category}</span>
                  </div>
                  <div className="mc-card-meta-item">
                    <Building2 size={14} style={{ color: 'var(--text-light)' }} />
                    <span>{complaint.department}</span>
                  </div>
                </div>

                <div className="mc-card-meta-row">
                  <div className="mc-card-meta-item">
                    <MapPin size={14} style={{ color: 'var(--text-light)' }} />
                    <span>{complaint.location}</span>
                  </div>
                  <div className="mc-card-meta-item">
                    <Calendar size={14} style={{ color: 'var(--text-light)' }} />
                    <span>{complaint.submittedDate}</span>
                  </div>
                </div>

                <div className="mc-card-footer">
                  <ComplaintPriorityBadge priority={complaint.priority} />
                  <button
                    className="mc-btn-view"
                    onClick={() => setActiveComplaint(complaint)}
                    aria-label={`View details for ${complaint.id}`}
                  >
                    <Eye size={14} /> View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* -------------------------------------------------------------- */}
          {/* 5. PAGINATION CONTROLS                                         */}
          {/* -------------------------------------------------------------- */}
          <div className="mc-pagination-bar">
            <div className="mc-pagination-info">
              Showing{' '}
              <strong>{(activePage - 1) * itemsPerPage + 1}</strong> -{' '}
              <strong>{Math.min(activePage * itemsPerPage, filteredComplaints.length)}</strong> of{' '}
              <strong>{filteredComplaints.length}</strong> complaints
            </div>

            <div className="mc-pagination-controls">
              <button
                className="mc-pagination-btn"
                disabled={activePage === 1}
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                aria-label="Previous Page"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                <button
                  key={pageNumber}
                  className={`mc-pagination-btn ${pageNumber === activePage ? 'active' : ''}`}
                  onClick={() => setCurrentPage(pageNumber)}
                  aria-label={`Go to page ${pageNumber}`}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                className="mc-pagination-btn"
                disabled={activePage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                aria-label="Next Page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 6. VIEW DETAILS MODAL                                              */}
      {/* ------------------------------------------------------------------ */}
      {activeComplaint && (
        <div
          className="mc-modal-overlay"
          onClick={() => setActiveComplaint(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-complaint-title"
        >
          <div
            className="mc-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="mc-modal-header">
              <div className="mc-modal-header-left">
                <span className="mc-modal-id">{activeComplaint.id}</span>
                <ComplaintStatusBadge status={activeComplaint.status} />
              </div>
              <button
                className="mc-modal-close"
                onClick={() => setActiveComplaint(null)}
                aria-label="Close modal dialog"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="mc-modal-body">
              {/* Title */}
              <div className="mc-modal-title-box">
                <h3 id="modal-complaint-title">{activeComplaint.title}</h3>
              </div>

              {/* Key Details Grid */}
              <div className="mc-details-grid">
                <div className="mc-detail-item">
                  <span className="mc-detail-label">Category</span>
                  <span className="mc-detail-value">{activeComplaint.category}</span>
                </div>

                <div className="mc-detail-item">
                  <span className="mc-detail-label">Location</span>
                  <span className="mc-detail-value">
                    <MapPin size={14} style={{ color: 'var(--primary)' }} />
                    {activeComplaint.location}
                  </span>
                </div>

                <div className="mc-detail-item">
                  <span className="mc-detail-label">Submitted Date</span>
                  <span className="mc-detail-value">
                    <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
                    {activeComplaint.submittedDate}
                  </span>
                </div>

                <div className="mc-detail-item">
                  <span className="mc-detail-label">Priority</span>
                  <div>
                    <ComplaintPriorityBadge priority={activeComplaint.priority} />
                  </div>
                </div>

                <div className="mc-detail-item">
                  <span className="mc-detail-label">Assigned Department</span>
                  <span className="mc-detail-value">
                    <Building2 size={14} style={{ color: 'var(--info)' }} />
                    {activeComplaint.department}
                  </span>
                </div>

                <div className="mc-detail-item">
                  <span className="mc-detail-label">Current Status</span>
                  <div>
                    <ComplaintStatusBadge status={activeComplaint.status} />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mc-modal-desc-box">
                <span className="mc-detail-label">Description</span>
                <p className="mc-modal-desc-text">
                  {activeComplaint.description}
                </p>
              </div>

              {/* Attached Photo */}
              {activeComplaint.image && (
                <div className="mc-modal-image-box">
                  <span className="mc-detail-label">Attached Photo / Proof</span>
                  <img
                    src={activeComplaint.image}
                    alt={activeComplaint.title}
                    className="mc-modal-image-preview"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* ---------------------------------------------------------- */}
              {/* STATUS TIMELINE                                            */}
              {/* ---------------------------------------------------------- */}
              <div className="mc-timeline-card">
                <div className="mc-timeline-title">
                  <Activity size={18} style={{ color: 'var(--primary)' }} />
                  Complaint Progress Timeline
                </div>

                <div className="mc-timeline-steps">
                  {/* Step 1: Complaint Submitted */}
                  <div className="mc-timeline-step completed">
                    <div className="mc-step-connector" />
                    <div className="mc-step-icon">
                      <Check size={16} />
                    </div>
                    <div className="mc-step-content">
                      <span className="mc-step-name">Complaint Submitted</span>
                      <span className="mc-step-date">{activeComplaint.submittedDate}</span>
                      <span className="mc-step-note">Issue registered and verified on Smart Civic portal</span>
                    </div>
                  </div>

                  {/* Step 2: Under Review */}
                  <div className={`mc-timeline-step ${
                    activeComplaint.status === 'Pending' ? 'active' : 'completed'
                  }`}>
                    <div className="mc-step-connector" />
                    <div className="mc-step-icon">
                      {activeComplaint.status === 'Pending' ? (
                        <Clock size={16} />
                      ) : (
                        <Check size={16} />
                      )}
                    </div>
                    <div className="mc-step-content">
                      <span className="mc-step-name">Under Review</span>
                      <span className="mc-step-date">
                        {activeComplaint.status === 'Pending' ? 'Current Stage' : 'Completed'}
                      </span>
                      <span className="mc-step-note">
                        {activeComplaint.status === 'Pending'
                          ? 'Gwalior Municipal Control Room is currently inspecting ticket verification'
                          : 'Review completed by municipal control room'}
                      </span>
                    </div>
                  </div>

                  {/* Step 3: Assigned to Department */}
                  <div className={`mc-timeline-step ${
                    activeComplaint.status === 'Pending'
                      ? 'upcoming'
                      : activeComplaint.status === 'Rejected'
                      ? 'rejected'
                      : 'completed'
                  }`}>
                    <div className="mc-step-connector" />
                    <div className="mc-step-icon">
                      {activeComplaint.status === 'Pending' ? (
                        <span>3</span>
                      ) : activeComplaint.status === 'Rejected' ? (
                        <XCircle size={16} />
                      ) : (
                        <Check size={16} />
                      )}
                    </div>
                    <div className="mc-step-content">
                      <span className="mc-step-name">
                        {activeComplaint.status === 'Rejected' ? 'Application Closed' : 'Assigned to Department'}
                      </span>
                      <span className="mc-step-date">
                        {activeComplaint.status === 'Pending'
                          ? 'Awaiting Assignment'
                          : activeComplaint.department}
                      </span>
                      <span className="mc-step-note">
                        {activeComplaint.status === 'Pending'
                          ? 'Will be routed to official department unit upon review approval'
                          : `Allocated to ${activeComplaint.department}`}
                      </span>
                    </div>
                  </div>

                  {/* Step 4: Work in Progress */}
                  <div className={`mc-timeline-step ${
                    activeComplaint.status === 'In Progress'
                      ? 'active'
                      : activeComplaint.status === 'Resolved'
                      ? 'completed'
                      : activeComplaint.status === 'Rejected'
                      ? 'rejected'
                      : 'upcoming'
                  }`}>
                    <div className="mc-step-connector" />
                    <div className="mc-step-icon">
                      {activeComplaint.status === 'In Progress' ? (
                        <Activity size={16} />
                      ) : activeComplaint.status === 'Resolved' ? (
                        <Check size={16} />
                      ) : activeComplaint.status === 'Rejected' ? (
                        <XCircle size={16} />
                      ) : (
                        <span>4</span>
                      )}
                    </div>
                    <div className="mc-step-content">
                      <span className="mc-step-name">Work in Progress</span>
                      <span className="mc-step-date">
                        {activeComplaint.status === 'In Progress'
                          ? 'Current Stage'
                          : activeComplaint.status === 'Resolved'
                          ? 'Field Operations Done'
                          : 'Pending'}
                      </span>
                      <span className="mc-step-note">
                        {activeComplaint.status === 'In Progress'
                          ? 'Department field personnel and materials are dispatched on site'
                          : activeComplaint.status === 'Resolved'
                          ? 'On-site civic remediation successfully executed'
                          : 'Awaiting field crew dispatch'}
                      </span>
                    </div>
                  </div>

                  {/* Step 5: Resolved or Rejected */}
                  <div className={`mc-timeline-step ${
                    activeComplaint.status === 'Resolved'
                      ? 'completed'
                      : activeComplaint.status === 'Rejected'
                      ? 'rejected'
                      : 'upcoming'
                  }`}>
                    <div className="mc-step-icon">
                      {activeComplaint.status === 'Resolved' ? (
                        <CheckCircle2 size={18} />
                      ) : activeComplaint.status === 'Rejected' ? (
                        <XCircle size={18} />
                      ) : (
                        <span>5</span>
                      )}
                    </div>
                    <div className="mc-step-content">
                      <span className="mc-step-name">
                        {activeComplaint.status === 'Rejected' ? 'Complaint Rejected' : 'Resolved'}
                      </span>
                      <span className="mc-step-date">
                        {activeComplaint.resolvedDate ? activeComplaint.resolvedDate : 'Pending'}
                      </span>
                      <span className="mc-step-note">
                        {activeComplaint.status === 'Resolved'
                          ? 'Inspection completed and verified by civic officers'
                          : activeComplaint.status === 'Rejected'
                          ? 'Complaint closed after jurisdictional or regulatory inspection'
                          : 'Final stage upon resolution verification'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ---------------------------------------------------------- */}
              {/* RESOLUTION DETAILS (Resolved Complaints Only)              */}
              {/* ---------------------------------------------------------- */}
              {activeComplaint.status === 'Resolved' && activeComplaint.resolution && (
                <div className="mc-resolution-card">
                  <div className="mc-resolution-header">
                    <CheckCircle2 size={18} />
                    Resolution Information
                  </div>
                  <p className="mc-resolution-text">
                    <strong>Resolution:</strong> {activeComplaint.resolution}
                  </p>
                  <div className="mc-resolution-date">
                    <strong>Resolved Date:</strong> {activeComplaint.resolvedDate}
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------------- */}
              {/* CITIZEN FEEDBACK (Resolved Complaints Only)                */}
              {/* ---------------------------------------------------------- */}
              {activeComplaint.status === 'Resolved' && (
                <div className="mc-feedback-card">
                  <div className="mc-feedback-title">
                    Rate Resolution & Civic Feedback
                  </div>

                  {/* 1-5 Star rating */}
                  <div className="mc-feedback-rating-row">
                    <span className="mc-detail-label">Rate Resolution</span>
                    <div className="mc-stars-container">
                      {[1, 2, 3, 4, 5].map((starVal) => {
                        const isFilled = (hoverRating || activeComplaint.rating || 0) >= starVal;
                        return (
                          <button
                            key={starVal}
                            type="button"
                            className={`mc-star-btn ${isFilled ? 'filled' : ''}`}
                            onMouseEnter={() => setHoverRating(starVal)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => handleSetRating(starVal)}
                            aria-label={`Rate ${starVal} out of 5 stars`}
                          >
                            <Star size={24} fill={isFilled ? '#f59e0b' : 'none'} />
                          </button>
                        );
                      })}
                      {activeComplaint.rating && (
                        <span className="mc-star-label">
                          {activeComplaint.rating} of 5 stars
                          {activeComplaint.rating === 5 && ' - Excellent'}
                          {activeComplaint.rating === 4 && ' - Very Good'}
                          {activeComplaint.rating === 3 && ' - Satisfactory'}
                          {activeComplaint.rating === 2 && ' - Needs Improvement'}
                          {activeComplaint.rating === 1 && ' - Poor'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Yes / No Satisfaction Toggle */}
                  <div className="mc-feedback-satisfaction">
                    <p className="mc-satisfaction-prompt">
                      Was this issue resolved satisfactorily?
                    </p>
                    <div className="mc-satisfaction-buttons">
                      <button
                        type="button"
                        className={`mc-btn-choice ${
                          activeComplaint.feedbackSatisfied === 'yes' ? 'selected-yes' : ''
                        }`}
                        onClick={() => handleSetSatisfaction('yes')}
                        aria-pressed={activeComplaint.feedbackSatisfied === 'yes'}
                      >
                        <ThumbsUp size={14} style={{ display: 'inline', marginRight: '6px' }} />
                        Yes
                      </button>
                      <button
                        type="button"
                        className={`mc-btn-choice ${
                          activeComplaint.feedbackSatisfied === 'no' ? 'selected-no' : ''
                        }`}
                        onClick={() => handleSetSatisfaction('no')}
                        aria-pressed={activeComplaint.feedbackSatisfied === 'no'}
                      >
                        <ThumbsDown size={14} style={{ display: 'inline', marginRight: '6px' }} />
                        No
                      </button>
                    </div>

                    {(activeComplaint.rating || activeComplaint.feedbackSatisfied) && (
                      <div className="mc-feedback-confirmed">
                        <Check size={14} /> Thank you! Your feedback has been recorded.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="mc-modal-footer">
              <button
                className="mc-btn-close-modal"
                onClick={() => setActiveComplaint(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyComplaints;
