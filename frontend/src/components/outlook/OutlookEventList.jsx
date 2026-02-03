import { Card, Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

/**
 * Props:
 * - events: array of MS Graph events
 * - onRefresh: function to reload events
 * - loading: boolean
 */
export default function OutlookEventList({
  events = [],
  onRefresh,
  loading = false,
}) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Upcoming Meetings</h3>

        {onRefresh && (
          <Button
            size="small"
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={onRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
        )}
      </div>

      {/* Empty state */}
      {!loading && events.length === 0 && (
        <div className="text-sm text-gray-500 border rounded p-4">
          No upcoming events found.
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-sm text-gray-500">Loading events…</div>
      )}

      {/* Event list */}
      <div className="space-y-3">
        {events.map((event) => {
          const start = event.start?.dateTime
            ? new Date(event.start.dateTime).toLocaleString()
            : "N/A";

          const end = event.end?.dateTime
            ? new Date(event.end.dateTime).toLocaleString()
            : "N/A";

          return (
            <Card
              key={event.id}
              className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            >
              {/* Event details */}
              <div>
                <p className="font-medium">
                  {event.subject || "No Subject"}
                </p>

                <p className="text-xs text-gray-500">
                  {start} – {end}
                </p>

                {event.organizer?.emailAddress?.address && (
                  <p className="text-xs text-gray-400">
                    Organizer: {event.organizer.emailAddress.address}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {event.onlineMeeting?.joinUrl && (
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      window.open(
                        event.onlineMeeting.joinUrl,
                        "_blank"
                      )
                    }
                  >
                    Join Teams
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
