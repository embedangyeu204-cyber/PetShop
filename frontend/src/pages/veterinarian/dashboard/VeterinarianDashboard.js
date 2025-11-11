import React, { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { FiDownload, FiEdit3, FiInbox } from "react-icons/fi";
import "./VeterinarianDashboard.css";
import {
  fetchVeterinarianDashboard,
  updateVeterinarianAppointmentStatus,
} from "../../../services/vetDashboardService";
import VetSidebar from "../../../components/VetSidebar";

dayjs.extend(utc);
const VET_UTC_OFFSET = 7 * 60;
const toVetLocal = (value) =>
  value ? dayjs(value).utc().utcOffset(VET_UTC_OFFSET) : null;

const defaultPagination = {
  page: 1,
  pageSize: 5,
  totalItems: 0,
  totalPages: 1,
};

const emptyDashboardState = {
  appointmentRequests: [],
  todaySchedule: [],
  statusRows: [],
  statusPagination: defaultPagination,
  workingHours: [],
  services: [],
  summary: {
    pendingRequests: 0,
    processedToday: 0,
    upcomingAppointments: 0,
    activeFilters: "Open",
  },
};

const filterPendingRequests = (requests) =>
  (requests ?? []).filter((request) => {
    const status = (request?.status ?? "").toLowerCase();
    return status === "" || status === "pending";
  });

const mapDashboardPayload = (payload) => ({
  appointmentRequests: filterPendingRequests(payload?.appointmentRequests),
  todaySchedule: payload?.todaySchedule ?? [],
  statusRows: payload?.statusRows ?? [],
  statusPagination: payload?.statusPagination ?? defaultPagination,
  workingHours: payload?.workingHours ?? [],
  services: payload?.services ?? [],
  summary: {
    pendingRequests:
      payload?.summary?.pendingRequests ??
      filterPendingRequests(payload?.appointmentRequests).length,
    processedToday: payload?.summary?.processedToday ?? 0,
    upcomingAppointments: payload?.summary?.upcomingAppointments ?? 0,
    activeFilters: payload?.summary?.activeFilters ?? "Open",
  },
});

const formatTime = (value) => {
  const local = toVetLocal(value);
  return local ? local.format("hh:mm A") : "--:--";
};

const formatDayDescriptor = (value) => {
  const local = toVetLocal(value);
  if (!local) {
    return "";
  }
  const today = dayjs().utc().utcOffset(VET_UTC_OFFSET).startOf("day");
  const targetDay = local.startOf("day");
  if (targetDay.isSame(today)) {
    return "Today";
  }
  if (targetDay.diff(today, "day") === 1) {
    return "Tomorrow";
  }
  return local.format("ddd, MMM D");
};

const buildPetLabel = (name, species) => {
  if (name && species) {
    return `${name} (${species})`;
  }
  return name || species || "Unassigned pet";
};

const getAvatarSource = (avatarUrl, name) => {
  if (avatarUrl) {
    return avatarUrl;
  }
  const safeName = encodeURIComponent(name || "Pet parent");
  return `https://ui-avatars.com/api/?background=F472B6&color=fff&name=${safeName}`;
};

const getStatusModifier = (status) =>
  status ? status.toLowerCase().replace(/\s+/g, "-") : "pending";

const statusDisplayMap = {
  Pending: "Pending",
  Confirmed: "Scheduled",
  Completed: "Checked-In",
  Cancelled: "Cancelled",
};

const getDisplayStatus = (status) => statusDisplayMap[status] ?? status ?? "Pending";

const updateStatusOptions = [
  { value: "Confirmed", label: "Mark as Scheduled" },
  { value: "Completed", label: "Mark as Checked-In" },
  { value: "Pending", label: "Revert to Pending" },
  { value: "Cancelled", label: "Cancel appointment" },
];

const statusFilterOptions = [
  { label: "All statuses", value: "all" },
  { label: "Pending", value: "Pending" },
  { label: "Scheduled", value: "Confirmed" },
  { label: "Checked-In", value: "Completed" },
  { label: "Cancelled", value: "Cancelled" },
];

const initialFilters = {
  search: "",
  date: new Date().toISOString().slice(0, 10),
  status: "all",
  serviceId: "all",
  page: 1,
  pageSize: 5,
};

const buildRequestParams = (currentFilters) => {
  const payload = {
    page: currentFilters.page,
    pageSize: currentFilters.pageSize,
  };

  if (currentFilters.date) {
    payload.date = currentFilters.date;
  }

  if (currentFilters.status && currentFilters.status !== "all") {
    payload.status = currentFilters.status;
  }

  if (currentFilters.serviceId && currentFilters.serviceId !== "all") {
    payload.serviceId = currentFilters.serviceId;
  }

  if (currentFilters.search && currentFilters.search.trim().length > 0) {
    payload.search = currentFilters.search.trim();
  }

  return payload;
};

function VeterinarianDashboard() {
  const [notes, setNotes] = useState("Internal note for front desk...");
  const [dashboardData, setDashboardData] = useState(emptyDashboardState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingStatuses, setPendingStatuses] = useState({});
  const [filters, setFilters] = useState(initialFilters);
  const [comingSoonContent, setComingSoonContent] = useState(null);
  const [activeSidebarItem, setActiveSidebarItem] = useState("appointments");

  const loadDashboard = useCallback(
    async ({ signal, withSpinner = true } = {}) => {
      const isAborted = () => signal?.aborted;
      if (withSpinner) {
        setLoading(true);
      }
      setError(null);

      try {
        const params = buildRequestParams(filters);
        const response = await fetchVeterinarianDashboard(params, { signal });
        if (isAborted()) return;
        const mappedData = mapDashboardPayload(response ?? {});
        setDashboardData(mappedData);

        if (
          mappedData?.statusPagination?.page &&
          mappedData.statusPagination.page !== filters.page
        ) {
          setFilters((prev) => ({
            ...prev,
            page: mappedData.statusPagination.page,
          }));
        }
      } catch (err) {
        if (isAborted()) return;
        const message =
          err?.response?.data?.message ||
          err.message ||
          "Unable to load dashboard right now.";
        setError(message);
      } finally {
        if (isAborted()) return;
        if (withSpinner) {
          setLoading(false);
        }
      }
    },
    [filters]
  );

  useEffect(() => {
    const controller = new AbortController();
    loadDashboard({ signal: controller.signal });
    return () => controller.abort();
  }, [loadDashboard]);

  const applyLocalStatusUpdate = useCallback((appointmentId, nextStatus) => {
    setDashboardData((prev) => {
      if (!prev) {
        return prev;
      }

      const formatStatus = getDisplayStatus(nextStatus);

      const updateCollection = (collection) =>
        collection.map((entry) =>
          entry.appointmentId === appointmentId
            ? { ...entry, status: formatStatus }
            : entry
        );

      const updateRequests = (collection) => {
        if (!collection?.length) {
          return collection ?? [];
        }
        if (nextStatus !== "Pending") {
          return collection.filter(
            (entry) => entry.appointmentId !== appointmentId
          );
        }
        return updateCollection(collection);
      };

      return {
        ...prev,
        appointmentRequests: updateRequests(prev.appointmentRequests ?? []),
        todaySchedule: updateCollection(prev.todaySchedule ?? []),
        statusRows: updateCollection(prev.statusRows ?? []),
      };
    });
  }, []);

  const handleStatusUpdate = useCallback(
    async (appointmentId, nextStatus) => {
      if (!appointmentId || !nextStatus) {
        return;
      }

      setPendingStatuses((current) => ({
        ...current,
        [appointmentId]: nextStatus,
      }));

      try {
        await updateVeterinarianAppointmentStatus(appointmentId, {
          status: nextStatus,
        });
        applyLocalStatusUpdate(appointmentId, nextStatus);
        await loadDashboard({ withSpinner: false });
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err.message ||
          "Unable to update appointment status.";
        setError(message);
      } finally {
        setPendingStatuses((current) => {
          const clone = { ...current };
          delete clone[appointmentId];
          return clone;
        });
      }
    },
    [applyLocalStatusUpdate, loadDashboard]
  );

  const appointmentRequests = dashboardData.appointmentRequests ?? [];
  const todaysSchedule = dashboardData.todaySchedule ?? [];
  const statusRows = dashboardData.statusRows ?? [];
  const workingHours = dashboardData.workingHours ?? [];
  const serviceOptions = dashboardData.services ?? [];
  const statusPagination = dashboardData.statusPagination ?? defaultPagination;
  const summary = dashboardData.summary ?? emptyDashboardState.summary;

  const currentPage = statusPagination.page || 1;
  const totalPages = statusPagination.totalPages || 1;
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const handleFilterValue = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
      page: field === "page" ? value : 1,
    }));
  };

  const handlePagination = (direction) => {
    const nextPage = direction === "next" ? currentPage + 1 : currentPage - 1;
    if (nextPage < 1 || nextPage > totalPages) {
      return;
    }
    setFilters((prev) => ({
      ...prev,
      page: nextPage,
    }));
  };

  const handleSidebarClick = (item) => {
    setActiveSidebarItem(item.id);

    if (!item.path) {
      setComingSoonContent({
        title: item.title,
        description: `${item.title} page is coming soon. We are preparing the best experience for you.`,
      });
      return false;
    }

    setComingSoonContent(null);
    return true;
  };

  const requestSummary = [
    { label: "Requests in queue", value: `${summary.pendingRequests} pending` },
    { label: "Recently processed", value: `${summary.processedToday} today` },
    { label: "Filters", value: summary.activeFilters || "Open" },
  ];

  const getPendingStatus = (appointmentId) =>
    pendingStatuses?.[appointmentId] ?? null;

  return (
    <div className="vet-dashboard">
      <VetSidebar activeId={activeSidebarItem} onNavigate={handleSidebarClick} />
      <main className="vet-main">
        {comingSoonContent ? (
          <section className="coming-soon-page">
            <h1>{comingSoonContent.title}</h1>
            <p>{comingSoonContent.description}</p>
            <button
              type="button"
              className="pill-button"
              onClick={() => {
                setComingSoonContent(null);
                setActiveSidebarItem("appointments");
              }}
            >
              Back to appointment management
            </button>
          </section>
        ) : (
          <>
        <header className="vet-header">
          <div>
            <p className="welcome">Good Morning, Dr. Patterson</p>
            <h1>Here’s your schedule overview</h1>
          </div>
          <div className="header-actions">
            <button type="button" className="pill-button ghost">
              <FiInbox aria-hidden="true" />
              Inbox
            </button>
            <button type="button" className="pill-button">
              <FiDownload aria-hidden="true" />
              Export
            </button>
          </div>
        </header>

        <section className="control-panel">
          <div className="control-fields">
            <div className="control-field">
              <span className="field-label">Search</span>
              <input
                type="search"
                value={filters.search}
                placeholder="Search pet, owner, note"
                onChange={(event) => handleFilterValue("search", event.target.value)}
              />
            </div>
            <div className="control-field">
              <span className="field-label">Date</span>
              <input
                type="date"
                value={filters.date}
                onChange={(event) => handleFilterValue("date", event.target.value)}
              />
            </div>
            <div className="control-field">
              <span className="field-label">Status</span>
              <select
                value={filters.status}
                onChange={(event) => handleFilterValue("status", event.target.value)}
              >
                {statusFilterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="control-field">
              <span className="field-label">Type</span>
              <select
                value={filters.serviceId}
                onChange={(event) => handleFilterValue("serviceId", event.target.value)}
              >
                <option value="all">All services</option>
                {serviceOptions.map((service) => (
                  <option key={service.serviceId} value={service.serviceId}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {loading && (
          <section className="panel board-panel">
            <p>Loading veterinarian dashboard...</p>
          </section>
        )}

        {!loading && error && (
          <section className="panel board-panel">
            <p>{error}</p>
            <button
              type="button"
              className="pill-button"
              onClick={() => loadDashboard()}
            >
              Retry
            </button>
          </section>
        )}

        <section className="panel-grid board-panels">
          <div className="panel board-panel">
            <div className="panel-header">
              <h3>Appointment Requests</h3>
            </div>
            <div className="section-caption">
              Past 24 hours • {summary.pendingRequests} waiting approvals
            </div>
            <div className="request-table">
              <div className="request-table-headings">
                <span>Requested</span>
                <span>Pet &amp; owner</span>
                <span>Type</span>
                <span>Preferred</span>
                <span>Actions</span>
              </div>
              <div className="request-table-body">
                {appointmentRequests.length === 0 && !loading ? (
                  <p className="request-table-empty">
                    No appointment requests at the moment.
                  </p>
                ) : (
                  appointmentRequests.map((request) => {
                    const pendingStatus = getPendingStatus(request.appointmentId);
                    const busy = Boolean(pendingStatus);
                    return (
                      <article key={request.appointmentId} className="request-row">
                        <div className="request-time">
                          <strong>{formatTime(request.requestedAt)}</strong>
                          <span>{formatDayDescriptor(request.requestedAt)}</span>
                        </div>
                        <div className="request-pet">
                          <img
                            src={getAvatarSource(request.ownerAvatarUrl, request.ownerName)}
                            alt={request.ownerName}
                          />
                          <div>
                            <strong>{buildPetLabel(request.petName, request.petSpecies)}</strong>
                            <span>{request.ownerName}</span>
                          </div>
                        </div>
                        <div className="request-type">
                          <span className="request-type-pill">
                            <FiEdit3 aria-hidden="true" />
                            {request.serviceName}
                          </span>
                        </div>
                        <div className="request-preferred">
                          <strong>{formatTime(request.preferredStartTime)}</strong>
                          <span>{formatDayDescriptor(request.preferredStartTime)}</span>
                        </div>
                        <div className="request-actions">
                          <button
                            type="button"
                            className="pill-button danger"
                            disabled={busy}
                            onClick={() =>
                              handleStatusUpdate(request.appointmentId, "Cancelled")
                            }
                          >
                            {busy && pendingStatus === "Cancelled"
                              ? "Rejecting..."
                              : "Reject"}
                          </button>
                          <button
                            type="button"
                            className="pill-button primary"
                            disabled={busy}
                            onClick={() =>
                              handleStatusUpdate(request.appointmentId, "Confirmed")
                            }
                          >
                            {busy && pendingStatus === "Confirmed"
                              ? "Approving..."
                              : "Approve"}
                          </button>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className="panel board-panel compact">
            <div className="panel-header">
              <h3>Today's Schedule ({todaysSchedule.length})</h3>
            </div>
            <div className="schedule-list">
              {todaysSchedule.length === 0 && !loading && (
                <p>There are no scheduled appointments for today.</p>
              )}
              {todaysSchedule.map((slot) => (
                <div key={slot.appointmentId} className="schedule-row">
                  <span>
                    {`${formatTime(slot.startTime)} - ${buildPetLabel(
                      slot.petName,
                      slot.petSpecies
                    )} (${slot.serviceName})`}
                  </span>
                  <span className={`status-pill status-${getStatusModifier(slot.status)}`}>
                    {slot.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h3>Update appointment status</h3>
          </div>
          <div className="status-table-headings">
            <span>Time</span>
            <span>Pet &amp; owner</span>
            <span>Type</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          <div className="status-table">
            {statusRows.length === 0 && !loading && (
              <p className="status-empty">No appointments to update.</p>
            )}
            {statusRows.map((row) => {
              const pendingStatus = getPendingStatus(row.appointmentId);
              const isUpdating = Boolean(pendingStatus);
              const isCancelled = row.status?.toLowerCase() === "cancelled";

              return (
                <div key={row.appointmentId} className="status-row">
                  <div className="status-time">
                    <strong>{formatTime(row.startTime)}</strong>
                    <span>{formatDayDescriptor(row.startTime)}</span>
                  </div>
                  <div className="status-pet">
                    <img
                      src={getAvatarSource(row.ownerAvatarUrl, row.ownerName)}
                      alt={row.ownerName}
                    />
                    <div>
                      <strong>{buildPetLabel(row.petName, row.petSpecies)}</strong>
                      <span>{row.ownerName}</span>
                    </div>
                  </div>
                  <div className="status-type">{row.serviceName}</div>
                  <div className="status-badge">
                    <span className={`status-pill status-${getStatusModifier(row.status)}`}>
                      {row.status}
                    </span>
                  </div>
                  <div className="status-actions">
                    <select
                      className="status-action-select"
                      aria-label={`Update status for ${row.petName}`}
                      value={pendingStatus ?? ""}
                      disabled={isCancelled || isUpdating}
                      onChange={(event) => {
                        const nextStatus = event.target.value;
                        if (!nextStatus) {
                          return;
                        }
                        handleStatusUpdate(row.appointmentId, nextStatus);
                      }}
                    >
                      <option value="">
                        {isCancelled
                          ? "Cancelled"
                          : isUpdating
                          ? "Updating..."
                          : "Select action"}
                      </option>
                      {updateStatusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="status-pagination">
            <div className="status-pagination-summary">
              Page {currentPage} of {totalPages} • {statusPagination.totalItems} items
            </div>
            <div className="pagination-actions">
              <button
                type="button"
                className="pagination-button"
                onClick={() => handlePagination("prev")}
                disabled={!canGoPrev}
              >
                Previous
              </button>
              <button
                type="button"
                className="pagination-button"
                onClick={() => handlePagination("next")}
                disabled={!canGoNext}
              >
                Next
              </button>
            </div>
          </div>
        </section>

        <section className="panel-grid">
          <div className="panel">
            <div className="panel-header">
              <h3>View schedule</h3>
            </div>
            <div className="week-grid">
              {workingHours.map((day) => (
                <div
                  key={day.day}
                  className={`week-card ${day.active ? "active" : "inactive"}`}
                >
                  <span className="week-day">{day.day}</span>
                  {day.slots.length ? (
                    day.slots.map((slot) => (
                      <span key={slot} className="week-slot">
                        {slot}
                      </span>
                    ))
                  ) : (
                    <span className="week-slot muted">Off</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>View appointment requests</h3>
            </div>
            <div className="request-summary">
              {requestSummary.map((item) => (
                <div key={item.label} className="request-summary-card">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h3>Notes</h3>
          </div>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
          <div className="notes-actions">
            <button type="button" className="pill-button ghost">
              Save
            </button>
            <button type="button" className="pill-button">
              Share with team
            </button>
          </div>
        </section>
          </>
        )}
      </main>
    </div>
  );
}

export default VeterinarianDashboard;
