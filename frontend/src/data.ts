export type ReportStatus = "Urgent" | "In progress" | "Assigned" | "Resolved";
export type ReportCategory =
  | "Water supply"
  | "Roads & potholes"
  | "Street lighting"
  | "Garbage collection"
  | "Drainage & flooding"
  | "Public safety"
  | "Environment"
  | "Other";

export type Report = {
  id: string;
  title: string;
  category: ReportCategory;
  location: string;
  neighborhood: string;
  reportedAt: string;
  status: ReportStatus;
  description: string;
  photos: string[];
  timeline: { label: string; detail: string; completed: boolean }[];
};

export const categories: ReportCategory[] = [
  "Roads & potholes",
  "Garbage collection",
  "Water supply",
  "Street lighting",
  "Drainage & flooding",
  "Public safety",
  "Environment",
  "Other",
];

export const demoReports: Report[] = [
  {
    id: "MP-1048",
    title: "Burst water pipe flooding the road",
    category: "Water supply",
    location: "Likoni Road, Industrial Area",
    neighborhood: "Industrial Area",
    reportedAt: "18 min ago",
    status: "Urgent",
    description:
      "A water pipe has burst near the junction, and water is spreading across the road. It is becoming difficult for pedestrians and vehicles to pass.",
    photos: [],
    timeline: [
      { label: "Submitted", detail: "Today · 10:02 AM", completed: true },
      { label: "Reviewed", detail: "Today · 10:08 AM", completed: true },
      { label: "In progress", detail: "Awaiting field team", completed: false },
      { label: "Resolved", detail: "Not yet resolved", completed: false },
    ],
  },
  {
    id: "MP-1047",
    title: "Deep pothole near bus stop",
    category: "Roads & potholes",
    location: "Jogoo Road, Makadara",
    neighborhood: "Makadara",
    reportedAt: "1 hr ago",
    status: "In progress",
    description:
      "There is a deep pothole beside the bus stop. Drivers are swerving into the next lane to avoid it.",
    photos: [],
    timeline: [
      { label: "Submitted", detail: "Today · 9:19 AM", completed: true },
      { label: "Reviewed", detail: "Today · 9:42 AM", completed: true },
      { label: "In progress", detail: "Roads team assigned", completed: false },
      { label: "Resolved", detail: "Not yet resolved", completed: false },
    ],
  },
  {
    id: "MP-1044",
    title: "Streetlight not working",
    category: "Street lighting",
    location: "Nairobi West Estate",
    neighborhood: "Nairobi West",
    reportedAt: "3 hrs ago",
    status: "Assigned",
    description:
      "The streetlight by the estate entrance has been out for several nights, leaving the footpath very dark.",
    photos: [],
    timeline: [
      { label: "Submitted", detail: "Today · 7:21 AM", completed: true },
      { label: "Reviewed", detail: "Today · 8:00 AM", completed: true },
      { label: "In progress", detail: "Assigned to public lighting", completed: false },
      { label: "Resolved", detail: "Not yet resolved", completed: false },
    ],
  },
  {
    id: "MP-1039",
    title: "Uncollected waste by the market",
    category: "Garbage collection",
    location: "Wakulima Market",
    neighborhood: "Central Nairobi",
    reportedAt: "Yesterday",
    status: "Resolved",
    description:
      "Waste had accumulated beside the market entrance. The collection team has cleared the area.",
    photos: [],
    timeline: [
      { label: "Submitted", detail: "Yesterday · 8:15 AM", completed: true },
      { label: "Reviewed", detail: "Yesterday · 9:03 AM", completed: true },
      { label: "In progress", detail: "Yesterday · 11:30 AM", completed: true },
      { label: "Resolved", detail: "Yesterday · 2:10 PM", completed: true },
    ],
  },
];

const STORAGE_KEY = "mtaapulse.demo.reports.v1";

export function loadReports(): Report[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return demoReports;
    const parsed: unknown = JSON.parse(stored);
    if (Array.isArray(parsed)) return parsed as Report[];
    return demoReports;
  } catch (error) {
    console.error("Could not load locally saved demo reports.", error);
    return demoReports;
  }
}

export function saveReports(reports: Report[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch (error) {
    console.error("Could not save demo reports in this browser.", error);
    throw new Error("Your browser could not save this report. Please try again.");
  }
}
