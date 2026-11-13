import { ChangeEvent, FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  categories,
  demoReports,
  loadReports,
  Report,
  ReportCategory,
  ReportStatus,
  saveReports,
} from "./data";

type View = "overview" | "reports" | "map" | "community" | "insights" | "settings";
type IconName =
  | "overview"
  | "reports"
  | "map"
  | "community"
  | "insights"
  | "settings"
  | "search"
  | "bell"
  | "plus"
  | "arrow"
  | "filter"
  | "water"
  | "road"
  | "light"
  | "waste"
  | "pin"
  | "clock"
  | "close"
  | "camera"
  | "upload"
  | "location"
  | "chevron"
  | "check"
  | "menu"
  | "spark";

const viewLabels: Record<View, string> = {
  overview: "Overview",
  reports: "Reports",
  map: "Live map",
  community: "Community",
  insights: "Insights",
  settings: "Settings",
};

const navItems: { view: View; icon: IconName }[] = [
  { view: "overview", icon: "overview" },
  { view: "reports", icon: "reports" },
  { view: "map", icon: "map" },
  { view: "community", icon: "community" },
  { view: "insights", icon: "insights" },
];

const categoryIcon: Record<ReportCategory, IconName> = {
  "Water supply": "water",
  "Roads & potholes": "road",
  "Street lighting": "light",
  "Garbage collection": "waste",
  "Drainage & flooding": "water",
  "Public safety": "pin",
  Environment: "spark",
  Other: "spark",
};

function Icon({
  name,
  size = 22,
  className = "",
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  const paths: Record<IconName, ReactNode> = {
    overview: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
    reports: (
      <>
        <path d="M7 3.5h7l5 5V20a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2Z" />
        <path d="M14 3.5V9h5M9 13h6M9 17h6" />
      </>
    ),
    map: (
      <>
        <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" />
        <path d="M9 3v15M15 6v15" />
      </>
    ),
    community: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
        <circle cx="9.5" cy="7" r="4" />
        <path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    insights: (
      <>
        <path d="M4 20V10M10 20V4M16 20v-7M22 20V8" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.5.9l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.5-.9l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-1.8l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.5-.9l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.5.9l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1 0 1.8Z" transform="translate(-1 -1)" />
      </>
    ),
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" /><path d="M20 4v3M21.5 5.5h-3" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    filter: <><path d="M4 6h16M7 12h10M10 18h4" /></>,
    water: <><path d="M12 3s-7 8-7 12a7 7 0 0 0 14 0c0-4-7-12-7-12Z" /></>,
    road: <><path d="m9 3-2 18M15 3l2 18M12 5v3M12 12v3M12 19v2" /></>,
    light: <><path d="M9 18h6M10 22h4M8 14a7 7 0 1 1 8 0c-.8.6-1 1.1-1 2H9c0-.9-.2-1.4-1-2Z" /></>,
    waste: <><path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3" /></>,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    camera: <><path d="M4 7h3l1.5-2h7L17 7h3v12H4z" /><circle cx="12" cy="13" r="3" /></>,
    upload: <><path d="M12 16V4M7 9l5-5 5 5M4 20h16" /></>,
    location: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2" /></>,
    chevron: <path d="m7 10 5 5 5-5" />,
    check: <path d="m5 12 4 4L19 6" />,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    spark: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3ZM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z" /></>,
  };
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function App() {
  const [reports, setReports] = useState<Report[]>(loadReports);
  const [view, setView] = useState<View>("overview");
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [mapMode, setMapMode] = useState<"Map" | "List">("Map");
  const [newReportOpen, setNewReportOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [toast, setToast] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      saveReports(reports);
    } catch (error) {
      setToast(error instanceof Error ? error.message : "Could not save your report.");
    }
  }, [reports]);

  useEffect(() => {
    function handleShortcuts(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
      if (event.key === "Escape") {
        setNewReportOpen(false);
        setSelectedReport(null);
        setNotificationsOpen(false);
        setProfileOpen(false);
        setMobileNavOpen(false);
      }
    }
    window.addEventListener("keydown", handleShortcuts);
    return () => window.removeEventListener("keydown", handleShortcuts);
  }, []);

  useEffect(() => {
    const isDialogOpen = newReportOpen || selectedReport !== null;
    if (!isDialogOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => {
      document.querySelector<HTMLElement>('[role="dialog"] button, [role="dialog"] input, [role="dialog"] select')?.focus();
    });
    return () => { document.body.style.overflow = previousOverflow; };
  }, [newReportOpen, selectedReport]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const filteredReports = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return reports.filter((report) => {
      const matchesQuery =
        !normalizedQuery ||
        [report.id, report.title, report.location, report.category, report.status]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesCategory =
        categoryFilter === "All categories" || report.category === categoryFilter;
      const matchesStatus = statusFilter === "All statuses" || report.status === statusFilter;
      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [reports, query, categoryFilter, statusFilter]);

  function navigate(nextView: View) {
    setView(nextView);
    setMobileNavOpen(false);
    setNotificationsOpen(false);
    setProfileOpen(false);
  }

  function openReport(report: Report) {
    setSelectedReport(report);
  }

  function addReport(report: Report) {
    setReports((current) => [report, ...current]);
    setNewReportOpen(false);
    setToast("Your report has been saved on this device.");
    setView("reports");
  }

  return (
    <div className="app-shell">
      {mobileNavOpen && (
        <button
          className="mobile-scrim"
          aria-label="Close navigation"
          onClick={() => setMobileNavOpen(false)}
        />
      )}
      <aside className={`sidebar ${mobileNavOpen ? "sidebar--open" : ""}`}>
        <a className="brand" href="#" onClick={(event) => { event.preventDefault(); navigate("overview"); }}>
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
          <span className="brand-word">Mtaa<span>Pulse</span></span>
        </a>
        <div className="side-scroll">
          <p className="nav-caption">Main menu</p>
          <nav className="side-nav" aria-label="Main navigation">
            {navItems.map(({ view: itemView, icon }) => (
              <button
                key={itemView}
                className={`nav-link ${view === itemView ? "nav-link--active" : ""}`}
                onClick={() => navigate(itemView)}
                aria-current={view === itemView ? "page" : undefined}
              >
                <Icon name={icon} />
                <span>{viewLabels[itemView]}</span>
                {itemView === "reports" && <span className="nav-count">{reports.filter((r) => r.status !== "Resolved").length}</span>}
              </button>
            ))}
          </nav>
          <p className="nav-caption nav-caption--preferences">Preferences</p>
          <button
            className={`nav-link ${view === "settings" ? "nav-link--active" : ""}`}
            onClick={() => navigate("settings")}
            aria-current={view === "settings" ? "page" : undefined}
          >
            <Icon name="settings" /><span>Settings</span>
          </button>
        </div>
        <div className="sidebar-bottom">
          <div className="community-score">
            <div className="eyebrow eyebrow--muted">Community score</div>
            <strong>Top 8%</strong>
            <p>Your reports helped resolve 7 local issues.</p>
            <div className="score-track"><span /></div>
          </div>
          <button className="profile-card" onClick={() => setProfileOpen((open) => !open)}>
            <span className="avatar">AM</span>
            <span className="profile-copy"><strong>Amina M.</strong><small>South B · Resident</small></span>
            <span className="profile-more" aria-hidden="true">···</span>
          </button>
          {profileOpen && (
            <div className="profile-popover">
              <strong>Amina M.</strong>
              <span>Resident account · demo</span>
              <button onClick={() => navigate("settings")}>Account settings <Icon name="arrow" size={16} /></button>
              <p>Sign-in and profile services are not connected in this project yet.</p>
            </div>
          )}
        </div>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setMobileNavOpen(true)}>
            <Icon name="menu" />
          </button>
          <label className="global-search">
            <Icon name="search" size={21} />
            <input
              ref={searchInputRef}
              type="search"
              placeholder="Search community reports"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => { if (event.key === "Enter") navigate("reports"); }}
              aria-label="Search community reports"
            />
            <kbd>⌘ K</kbd>
          </label>
          <div className="topbar-spacer" />
          <button className="weather" onClick={() => setToast("Weather updates are not connected yet.")} aria-label="Weather in Nairobi">
            <span className="weather-city">Nairobi</span>
            <span className="weather-reading">24° <small>Clear</small></span>
          </button>
          <span className="topbar-divider" />
          <div className="topbar-menu-wrap">
            <button
              className="icon-button notification-button"
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
              onClick={() => { setNotificationsOpen((open) => !open); setProfileOpen(false); }}
            >
              <Icon name="bell" />
              <span className="notification-dot" />
            </button>
            {notificationsOpen && (
              <div className="top-popover notification-popover">
                <div className="popover-heading"><strong>Updates</strong><span>Just now</span></div>
                <button onClick={() => { navigate("reports"); setNotificationsOpen(false); }}>
                  <span className="notification-icon"><Icon name="check" size={17} /></span>
                  <span><strong>Community reports are live</strong><small>Track reports near your neighborhood.</small></span>
                </button>
                <p>Live status notifications will appear here when the service is connected.</p>
              </div>
            )}
          </div>
          <button className="button button--primary top-new-report" onClick={() => setNewReportOpen(true)}>
            <Icon name="plus" size={20} /><span>New report</span>
          </button>
        </header>

        <main className="page-content">
          <div className="page-title-row">
            <div>
              <div className="eyebrow date-eyebrow">{new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(new Date()).toUpperCase()}</div>
              <h1>{view === "overview" ? "Community overview" : viewLabels[view]}</h1>
              <p className="page-subtitle">{pageSubtitle(view)}</p>
            </div>
            <div className="live-pill"><span />Live city updates</div>
          </div>

          {view === "overview" && (
            <Overview
              reports={filteredReports}
              allReports={reports}
              mapMode={mapMode}
              onMapMode={setMapMode}
              onViewAll={() => navigate("reports")}
              onOpenReport={openReport}
              onNewReport={() => setNewReportOpen(true)}
            />
          )}
          {view === "reports" && (
            <ReportsPage
              reports={filteredReports}
              query={query}
              setQuery={setQuery}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              onOpenReport={openReport}
              onNewReport={() => setNewReportOpen(true)}
            />
          )}
          {view === "map" && (
            <MapPage
              reports={filteredReports}
              mapMode={mapMode}
              onMapMode={setMapMode}
              onOpenReport={openReport}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
            />
          )}
          {view === "community" && <CommunityPage reports={reports} onOpenReport={openReport} />}
          {view === "insights" && <InsightsPage reports={reports} />}
          {view === "settings" && <SettingsPage onToast={setToast} />}
        </main>
      </div>

      {newReportOpen && <NewReportDialog onClose={() => setNewReportOpen(false)} onSubmit={addReport} />}
      {selectedReport && <ReportDialog report={selectedReport} onClose={() => setSelectedReport(null)} />}
      {toast && <div className="toast" role="status"><span className="toast-check"><Icon name="check" size={15} /></span>{toast}</div>}
    </div>
  );
}

function pageSubtitle(view: View) {
  const subtitles: Record<View, string> = {
    overview: "See what’s happening around you today.",
    reports: "Follow the issues you and your neighbors have raised.",
    map: "Explore community reports across Nairobi.",
    community: "Small actions from neighbors make a stronger community.",
    insights: "A clearer picture of the issues around your neighborhood.",
    settings: "Manage your profile and community preferences.",
  };
  return subtitles[view];
}

function Overview({
  reports,
  allReports,
  mapMode,
  onMapMode,
  onViewAll,
  onOpenReport,
  onNewReport,
}: {
  reports: Report[];
  allReports: Report[];
  mapMode: "Map" | "List";
  onMapMode: (mode: "Map" | "List") => void;
  onViewAll: () => void;
  onOpenReport: (report: Report) => void;
  onNewReport: () => void;
}) {
  const nearby = reports.slice(0, 4);
  const active = allReports.find((report) => report.status === "In progress") ?? allReports[0];
  return (
    <>
      <section className="stat-grid" aria-label="Community report statistics">
        <StatCard label="Open reports" value="24" foot="↑ 12%" note="vs. last week" accent />
        <StatCard label="In progress" value="08" foot="33%" note="of open reports" />
        <StatCard label="Resolved this month" value="47" foot="↑ 8%" note="vs. last month" accent />
        <StatCard label="Avg. response" value="4.2" suffix="hrs" foot="" note="1.3 hrs faster" bars />
      </section>

      <section className="overview-grid">
        <div className="panel map-panel">
          <div className="panel-heading map-heading">
            <div><h2>Live issue map</h2><p>Reports within 5 km of your location</p></div>
            <div className="segmented-control" role="group" aria-label="Map display">
              {(["Map", "List"] as const).map((mode) => (
                <button key={mode} className={mapMode === mode ? "selected" : ""} onClick={() => onMapMode(mode)}>{mode}</button>
              ))}
            </div>
          </div>
          {mapMode === "Map" ? (
            <NeighborhoodMap reports={nearby} onOpenReport={onOpenReport} />
          ) : (
            <div className="map-list-view">
              {nearby.map((report) => <ReportRow key={report.id} report={report} onClick={() => onOpenReport(report)} compact />)}
              {nearby.length === 0 && <EmptyState title="No reports found" body="Try another search to see nearby issues." />}
            </div>
          )}
          <button className="map-featured" onClick={() => nearby[0] && onOpenReport(nearby[0])}>
            {nearby[0] ? (
              <>
                <ReportIcon category={nearby[0].category} />
                <span className="featured-copy"><small>{nearby[0].id} · {nearby[0].category.replace(" supply", "")}</small><strong>{nearby[0].title}</strong><span><Icon name="pin" size={16} />{nearby[0].location}</span></span>
                <span className="featured-status"><StatusBadge status={nearby[0].status} /><small>{nearby[0].reportedAt}</small></span>
                <Icon name="arrow" className="featured-arrow" />
              </>
            ) : <span className="featured-empty">No nearby reports to show.</span>}
          </button>
        </div>

        <div className="panel nearby-panel">
          <div className="panel-heading nearby-heading">
            <div><h2>Latest nearby</h2><p>Recently reported issues</p></div>
            <button className="icon-button outline-button" aria-label="View all reports" onClick={onViewAll}><Icon name="filter" /></button>
          </div>
          <div className="nearby-list">
            {nearby.map((report) => (
              <button className="nearby-item" key={report.id} onClick={() => onOpenReport(report)}>
                <ReportIcon category={report.category} />
                <span className="nearby-copy"><small>{report.id} · {report.reportedAt}</small><strong>{report.title}</strong><span>{report.location}</span></span>
                <span className={`status-dot status-dot--${statusClass(report.status)}`} />
              </button>
            ))}
            {nearby.length === 0 && <EmptyState title="No reports found" body="Try another search to see recent issues." />}
          </div>
          <button className="view-all-link" onClick={onViewAll}>View all reports <Icon name="arrow" size={18} /></button>
        </div>
      </section>

      <section className="bottom-grid">
        <div className="panel active-report-panel">
          {active ? (
            <>
              <div className="active-report-copy"><div className="eyebrow eyebrow--muted">Your active report</div><strong>{active.title}</strong><span><Icon name="clock" size={16} />Updated 2 hours ago</span></div>
              <ProgressTimeline status={active.status} compact />
              <button className="button button--outline track-button" onClick={() => onOpenReport(active)}>Track report <Icon name="arrow" size={18} /></button>
            </>
          ) : (
            <EmptyState title="No active reports" body="Submit a report to keep track of its progress." action={onNewReport} actionLabel="Create a report" />
          )}
        </div>
        <div className="impact-card">
          <div className="impact-medal"><strong>7</strong><span>resolved</span></div>
          <div><div className="eyebrow eyebrow--muted">Your impact</div><h2>Small reports.<br />Real change.</h2><p>You’ve helped 340+ neighbours this year.</p></div>
        </div>
      </section>
      <div className="demo-note"><span className="demo-dot" />Demo dashboard · sample community data</div>
    </>
  );
}

function StatCard({ label, value, suffix, foot, note, accent, bars }: { label: string; value: string; suffix?: string; foot: string; note: string; accent?: boolean; bars?: boolean }) {
  return (
    <div className="stat-card">
      <div className="stat-top"><span className="eyebrow">{label}</span><strong>{value}<small>{suffix}</small></strong></div>
      <div className={`stat-foot ${accent ? "stat-foot--accent" : ""}`}>{foot}</div>
      <span className="stat-note">{note}</span>
      {bars && <span className="mini-bars" aria-hidden="true">{[12, 18, 14, 23, 18, 28, 22, 33].map((height, index) => <i key={index} style={{ height }} />)}</span>}
    </div>
  );
}

function NeighborhoodMap({ reports, onOpenReport }: { reports: Report[]; onOpenReport: (report: Report) => void }) {
  const positions = [
    { left: "65%", top: "38%" },
    { left: "42%", top: "59%" },
    { left: "27%", top: "38%" },
    { left: "76%", top: "72%" },
  ];
  return (
    <div className="map-art" aria-label="Illustrated map of nearby community reports">
      <div className="map-block map-block--one" /><div className="map-block map-block--two" /><div className="map-block map-block--three" />
      <div className="map-road map-road--horizontal" /><div className="map-road map-road--diagonal" /><div className="map-road map-road--vertical" /><div className="map-road map-road--curve" />
      <span className="map-label map-label--west">Nairobi West</span><span className="map-label map-label--industrial">Industrial Area</span><span className="map-label map-label--makadara">Makadara</span><span className="map-label map-label--south">South B</span>
      {reports.map((report, index) => (
        <button
          key={report.id}
          className={`map-pin map-pin--${statusClass(report.status)}`}
          style={positions[index % positions.length]}
          onClick={() => onOpenReport(report)}
          aria-label={`${report.title}, ${report.location}`}
        >
          <Icon name={categoryIcon[report.category]} size={23} />
        </button>
      ))}
      <span className="you-marker"><i /><b>You</b></span>
      <div className="map-zoom"><button aria-label="Zoom in" onClick={(event) => { const map = event.currentTarget.closest(".map-art"); map?.classList.toggle("map-art--zoomed"); }}>+</button><button aria-label="Zoom out" onClick={(event) => { const map = event.currentTarget.closest(".map-art"); map?.classList.remove("map-art--zoomed"); }}>−</button></div>
      <div className="map-legend"><span><i className="urgent" />Urgent</span><span><i className="active" />Active</span><span><i className="assigned" />Assigned</span></div>
      {reports.length === 0 && <div className="map-empty">No reports match your search.</div>}
    </div>
  );
}

function ReportIcon({ category }: { category: ReportCategory }) {
  const color = categoryColor(category);
  return <span className={`report-icon report-icon--${color}`}><Icon name={categoryIcon[category]} size={23} /></span>;
}

function categoryColor(category: ReportCategory) {
  if (category === "Water supply" || category === "Drainage & flooding") return "coral";
  if (category === "Roads & potholes") return "orange";
  if (category === "Street lighting") return "blue";
  if (category === "Garbage collection") return "gold";
  return "green";
}

function statusClass(status: ReportStatus) {
  if (status === "Urgent") return "urgent";
  if (status === "Resolved") return "resolved";
  if (status === "Assigned") return "assigned";
  return "active";
}

function StatusBadge({ status }: { status: ReportStatus }) {
  return <span className={`status-badge status-badge--${statusClass(status)}`}>{status}</span>;
}

function ReportsPage({
  reports,
  query,
  setQuery,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  onOpenReport,
  onNewReport,
}: {
  reports: Report[];
  query: string;
  setQuery: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  onOpenReport: (report: Report) => void;
  onNewReport: () => void;
}) {
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const pageCount = Math.max(1, Math.ceil(reports.length / pageSize));
  const visible = reports.slice((page - 1) * pageSize, page * pageSize);
  useEffect(() => setPage(1), [query, categoryFilter, statusFilter]);
  return (
    <>
      <section className="report-summary-row">
        <div className="panel reports-summary"><span><strong>{reports.length}</strong><small>Matching reports</small></span><span><strong>{reports.filter((r) => r.status === "In progress").length}</strong><small>In progress</small></span><span><strong>{reports.filter((r) => r.status === "Resolved").length}</strong><small>Resolved</small></span></div>
        <button className="button button--primary" onClick={onNewReport}><Icon name="plus" size={19} />New report</button>
      </section>
      <section className="panel reports-panel">
        <div className="reports-toolbar">
          <div><h2>Community reports</h2><p>Reports from your neighborhood</p></div>
          <div className="filter-controls">
            <label className="filter-search"><Icon name="search" size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search reports" aria-label="Search reports" /></label>
            <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} aria-label="Filter by category">
              <option>All categories</option>{categories.map((category) => <option key={category}>{category}</option>)}
            </select>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter by status">
              <option>All statuses</option>{(["Urgent", "In progress", "Assigned", "Resolved"] as ReportStatus[]).map((status) => <option key={status}>{status}</option>)}
            </select>
          </div>
        </div>
        <div className="report-table-wrap">
          <table className="report-table">
            <thead><tr><th>Report</th><th>Category</th><th>Location</th><th>Reported</th><th>Status</th><th><span className="sr-only">Open</span></th></tr></thead>
            <tbody>{visible.map((report) => (
              <tr key={report.id} onClick={() => onOpenReport(report)} tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter") onOpenReport(report); }}>
                <td><span className="table-report"><ReportIcon category={report.category} /><span><small>{report.id}</small><strong>{report.title}</strong></span></span></td>
                <td>{report.category}</td><td>{report.location}</td><td>{report.reportedAt}</td><td><StatusBadge status={report.status} /></td>
                <td><button className="row-arrow" aria-label={`View ${report.id}`} onClick={(event) => { event.stopPropagation(); onOpenReport(report); }}><Icon name="arrow" size={18} /></button></td>
              </tr>
            ))}</tbody>
          </table>
          {visible.length === 0 && <EmptyState title="No reports match those filters" body="Try a different search, category, or status." />}
        </div>
        <div className="pagination"><span>Showing {reports.length === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, reports.length)} of {reports.length} reports</span><div><button disabled={page === 1} onClick={() => setPage((current) => current - 1)}>Previous</button><span>{page} / {pageCount}</span><button disabled={page >= pageCount} onClick={() => setPage((current) => current + 1)}>Next</button></div></div>
      </section>
      <p className="demo-note"><span className="demo-dot" />Demo dashboard · sample community data</p>
    </>
  );
}

function MapPage({
  reports,
  mapMode,
  onMapMode,
  onOpenReport,
  categoryFilter,
  setCategoryFilter,
}: {
  reports: Report[];
  mapMode: "Map" | "List";
  onMapMode: (mode: "Map" | "List") => void;
  onOpenReport: (report: Report) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
}) {
  return (
    <section className="panel full-map-panel">
      <div className="panel-heading map-heading">
        <div><h2>Neighborhood issue map</h2><p>Explore reports near Nairobi, Kenya</p></div>
        <div className="map-page-controls">
          <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} aria-label="Filter map by category"><option>All categories</option>{categories.map((category) => <option key={category}>{category}</option>)}</select>
          <div className="segmented-control" role="group" aria-label="Map display">{(["Map", "List"] as const).map((mode) => <button key={mode} className={mapMode === mode ? "selected" : ""} onClick={() => onMapMode(mode)}>{mode}</button>)}</div>
        </div>
      </div>
      {mapMode === "Map" ? <NeighborhoodMap reports={reports} onOpenReport={onOpenReport} /> : <div className="map-list-view map-list-view--full">{reports.map((report) => <ReportRow key={report.id} report={report} onClick={() => onOpenReport(report)} />)}{reports.length === 0 && <EmptyState title="No reports on this map" body="Choose another category or clear your search." />}</div>}
      <div className="map-page-foot"><span><i className="status-dot status-dot--urgent" />Urgent <i className="status-dot status-dot--active" />In progress <i className="status-dot status-dot--assigned" />Assigned</span><small>Illustrative neighborhood map · not for navigation</small></div>
    </section>
  );
}

function ReportRow({ report, onClick, compact = false }: { report: Report; onClick: () => void; compact?: boolean }) {
  return <button className={`report-row ${compact ? "report-row--compact" : ""}`} onClick={onClick}><ReportIcon category={report.category} /><span><small>{report.id} · {report.reportedAt}</small><strong>{report.title}</strong><em>{report.location}</em></span><StatusBadge status={report.status} /><Icon name="arrow" size={18} /></button>;
}

function CommunityPage({ reports, onOpenReport }: { reports: Report[]; onOpenReport: (report: Report) => void }) {
  const resolved = reports.filter((report) => report.status === "Resolved").length;
  return (
    <>
      <section className="community-hero panel"><div className="community-hero-icon"><Icon name="community" size={28} /></div><div><div className="eyebrow">Together, block by block</div><h2>Your neighborhood is stronger when everyone is heard.</h2><p>Share what needs attention, follow local updates, and help your neighbors stay informed.</p></div><div className="community-hero-stat"><strong>{resolved + 7}</strong><span>issues resolved<br />with neighbors</span></div></section>
      <section className="community-grid">
        <div className="panel community-card"><span className="community-card-icon"><Icon name="reports" /></span><div className="eyebrow">Community activity</div><h2>Latest neighbor reports</h2><p>Recent reports submitted around your area.</p><div className="community-report-list">{reports.slice(0, 3).map((report) => <ReportRow key={report.id} report={report} onClick={() => onOpenReport(report)} compact />)}</div></div>
        <div className="impact-card community-impact"><div className="impact-medal"><strong>7</strong><span>resolved</span></div><div><div className="eyebrow eyebrow--muted">Your impact</div><h2>Small reports.<br />Real change.</h2><p>You’ve helped 340+ neighbours this year.</p></div></div>
      </section>
      <p className="demo-note"><span className="demo-dot" />Community statistics are illustrative sample data.</p>
    </>
  );
}

function InsightsPage({ reports }: { reports: Report[] }) {
  const byCategory = categories.map((category) => ({ category, count: reports.filter((report) => report.category === category).length })).filter((item) => item.count > 0).sort((a, b) => b.count - a.count);
  const maxCount = Math.max(1, ...byCategory.map((item) => item.count));
  return (
    <>
      <section className="insights-kpis"><div className="panel insight-kpi"><span className="eyebrow">Reports in this demo</span><strong>{reports.length}</strong><small>Sample reports saved on this device</small></div><div className="panel insight-kpi"><span className="eyebrow">Currently active</span><strong>{reports.filter((report) => report.status !== "Resolved").length}</strong><small>Not yet marked resolved</small></div><div className="panel insight-kpi"><span className="eyebrow">Resolved</span><strong>{reports.filter((report) => report.status === "Resolved").length}</strong><small>Completed sample reports</small></div></section>
      <section className="panel insights-panel"><div className="panel-heading"><div><h2>Reports by category</h2><p>Based on the reports saved in this browser</p></div><span className="insight-tag"><Icon name="spark" size={16} />Local demo</span></div><div className="category-chart">{byCategory.map(({ category, count }) => <div className="category-bar-row" key={category}><span>{category}</span><div><i style={{ width: `${Math.max(7, (count / maxCount) * 100)}%` }} /></div><strong>{count}</strong></div>)}{byCategory.length === 0 && <EmptyState title="No category data yet" body="Create a report to see category insights." />}</div></section>
      <p className="demo-note"><span className="demo-dot" />This preview has no live department or city data source.</p>
    </>
  );
}

function SettingsPage({ onToast }: { onToast: (message: string) => void }) {
  return (
    <>
      <section className="panel settings-panel"><div className="panel-heading"><div><h2>Profile & preferences</h2><p>These controls are local to this demo.</p></div></div><div className="settings-person"><span className="avatar avatar--large">AM</span><div><strong>Amina M.</strong><span>South B · Resident</span></div><span className="demo-chip">Demo profile</span></div><div className="settings-option"><div><strong>Neighborhood updates</strong><small>Get status updates about reports near you.</small></div><button className="toggle-switch" role="switch" aria-checked="true" aria-label="Neighborhood updates" onClick={(event) => { const button = event.currentTarget; const active = button.getAttribute("aria-checked") === "true"; button.setAttribute("aria-checked", String(!active)); onToast(`Neighborhood updates ${active ? "paused" : "enabled"} for this preview.`); }}><span /></button></div><div className="settings-option"><div><strong>Location</strong><small>South B, Nairobi County</small></div><button className="button button--outline" onClick={() => onToast("Location can be set when submitting a report.")}>Update location</button></div><div className="settings-option"><div><strong>Account access</strong><small>Registration and authentication are not connected yet.</small></div><button className="button button--outline" onClick={() => onToast("Connect the authentication API to enable account access.")}>Not connected</button></div></section>
      <p className="demo-note"><span className="demo-dot" />Account settings are a UI preview; no profile or notification service is configured.</p>
    </>
  );
}

function EmptyState({ title, body, action, actionLabel }: { title: string; body: string; action?: () => void; actionLabel?: string }) {
  return <div className="empty-state"><span className="empty-icon"><Icon name="reports" size={22} /></span><strong>{title}</strong><p>{body}</p>{action && <button className="button button--outline" onClick={action}>{actionLabel}</button>}</div>;
}

function ProgressTimeline({ status, compact = false }: { status: ReportStatus; compact?: boolean }) {
  const currentStep = status === "Resolved" ? 4 : status === "Urgent" || status === "In progress" ? 3 : status === "Assigned" ? 2 : 1;
  const steps = ["Submitted", "Reviewed", "In progress", "Resolved"];
  return <div className={`progress-timeline ${compact ? "progress-timeline--compact" : ""}`} aria-label={`Report status: ${status}`}>
    {steps.map((step, index) => {
      const number = index + 1;
      const complete = number < currentStep || status === "Resolved";
      const current = number === currentStep && status !== "Resolved";
      return <div className={`progress-step ${complete ? "is-complete" : ""} ${current ? "is-current" : ""}`} key={step}><span className="step-marker">{complete ? <Icon name="check" size={14} /> : <i />}</span><small>{step}</small></div>;
    })}
  </div>;
}

function NewReportDialog({ onClose, onSubmit }: { onClose: () => void; onSubmit: (report: Report) => void }) {
  const [category, setCategory] = useState<ReportCategory | "">("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);

  useEffect(() => {
    const next = files.map((file) => URL.createObjectURL(file));
    setPreviews(next);
    return () => next.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const nextFiles = Array.from(event.target.files ?? []);
    const allowed = nextFiles.filter((file) => file.type.startsWith("image/") && file.size <= 1_000_000);
    if (allowed.length !== nextFiles.length) setError("Images must be under 1 MB each. Please choose JPG, PNG, or another image.");
    else setError("");
    setFiles((current) => [...current, ...allowed].slice(0, 3));
    event.target.value = "";
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setError("Location access is not available in this browser. Enter a nearby street or neighborhood.");
      return;
    }
    setGeoLoading(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation(`${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`);
        setGeoLoading(false);
      },
      () => {
        setError("Could not access your location. Please enter a nearby street or neighborhood.");
        setGeoLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10000 },
    );
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!category || !title.trim() || !description.trim() || !location.trim()) {
      setError("Please complete all required fields.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const photoData = await Promise.all(files.map(readAsDataUrl));
      const id = `MP-${Math.max(1048, ...demoReports.map((report) => Number(report.id.slice(3)))) + Date.now() % 1000}`;
      const now = new Date();
      onSubmit({
        id,
        title: title.trim(),
        category,
        location: location.trim(),
        neighborhood: location.split(",").at(-1)?.trim() || location.trim(),
        reportedAt: "Just now",
        status: "Assigned",
        description: description.trim(),
        photos: photoData,
        timeline: [
          { label: "Submitted", detail: `Today · ${new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(now)}`, completed: true },
          { label: "Reviewed", detail: "Waiting for review", completed: false },
          { label: "In progress", detail: "Not yet assigned", completed: false },
          { label: "Resolved", detail: "Not yet resolved", completed: false },
        ],
      });
    } catch {
      setError("The selected photos could not be read. Please try smaller images.");
      setBusy(false);
    }
  }

  return <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="dialog new-report-dialog" role="dialog" aria-modal="true" aria-labelledby="new-report-title">
      <div className="dialog-heading"><div><span className="dialog-kicker">Make your neighborhood better</span><h2 id="new-report-title">Submit a report</h2><p>Share an issue and help the right people find it.</p></div><button className="icon-button" aria-label="Close dialog" onClick={onClose}><Icon name="close" /></button></div>
      <form className="report-form" onSubmit={submit} noValidate>
        <label className="field-label">What needs attention? <span>*</span><select value={category} onChange={(event) => setCategory(event.target.value as ReportCategory | "")} required><option value="">Choose a category</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <label className="field-label">Short title <span>*</span><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Streetlight out near the bus stop" maxLength={100} required /></label>
        <label className="field-label">Tell us more <span>*</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe what is happening and how it affects your neighborhood." rows={4} maxLength={1000} required /><small className="field-hint">{description.length}/1000 characters</small></label>
        <label className="field-label">Where is the issue? <span>*</span><span className="location-input"><Icon name="pin" size={18} /><input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Street, landmark, or neighborhood" required /><button type="button" onClick={useCurrentLocation} disabled={geoLoading}>{geoLoading ? "Locating…" : "Use my location"}</button></span><small className="field-hint">You can enter a place name or share your device location.</small></label>
        <div className="field-label">Add photos <small className="optional">(optional · up to 3 images, 1 MB each)</small><label className="upload-zone"><input type="file" accept="image/*" multiple onChange={handleFiles} /><span className="upload-icon"><Icon name="camera" size={20} /></span><span><strong>Choose photos</strong><small>Photos help your community understand the issue.</small></span><Icon name="upload" size={19} /></label>
          {previews.length > 0 && <div className="photo-previews">{previews.map((src, index) => <span className="photo-preview" key={src}><img src={src} alt={`Selected report photo ${index + 1}`} /><button type="button" aria-label={`Remove photo ${index + 1}`} onClick={() => setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))}><Icon name="close" size={14} /></button></span>)}</div>}
        </div>
        <div className="privacy-note"><Icon name="location" size={17} /><span>Your report will be visible to the community. Avoid including private or sensitive information.</span></div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="dialog-actions"><button type="button" className="button button--outline" onClick={onClose}>Cancel</button><button type="submit" className="button button--primary" disabled={busy}>{busy ? <><span className="spinner" />Submitting…</> : <><Icon name="plus" size={18} />Submit report</>}</button></div>
        <p className="form-demo-note">Preview only: reports and photos are stored in this browser, not sent to a city department.</p>
      </form>
    </section>
  </div>;
}

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Unsupported photo."));
    reader.onerror = () => reject(new Error("Photo read failed."));
    reader.readAsDataURL(file);
  });
}

function ReportDialog({ report, onClose }: { report: Report; onClose: () => void }) {
  return <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="dialog report-detail-dialog" role="dialog" aria-modal="true" aria-labelledby="detail-title">
      <div className="dialog-heading"><div><span className="dialog-kicker">{report.id} · {report.reportedAt}</span><h2 id="detail-title">{report.title}</h2><p><Icon name="pin" size={16} />{report.location}</p></div><button className="icon-button" aria-label="Close report details" onClick={onClose}><Icon name="close" /></button></div>
      <div className="detail-meta"><ReportIcon category={report.category} /><span><small>Category</small><strong>{report.category}</strong></span><StatusBadge status={report.status} /></div>
      <div className="detail-description"><h3>About this report</h3><p>{report.description}</p></div>
      {report.photos.length > 0 && <div className="detail-photos">{report.photos.map((photo, index) => <img src={photo} alt={`Report photo ${index + 1}`} key={photo} />)}</div>}
      <div className="detail-timeline"><h3>Report activity</h3><ProgressTimeline status={report.status} /><div className="timeline-details">{report.timeline.map((item, index) => <div className={item.completed ? "timeline-detail--done" : ""} key={`${item.label}-${index}`}><strong>{item.label}</strong><span>{item.detail}</span></div>)}</div></div>
      <div className="detail-footer"><span><Icon name="spark" size={17} />Updates from your community will appear here.</span><button className="button button--outline" onClick={onClose}>Done</button></div>
    </section>
  </div>;
}

export default App;
