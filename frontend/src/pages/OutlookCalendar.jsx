import { useEffect, useState } from "react";
import CreateEvent from "../components/outlook/CreateEvent";
import { outlookService } from "../service/outlook.service";
import OutlookEventList from "../components/outlook/OutlookEventList";

export default function OutlookCalendar() {
  const [events, setEvents] = useState([]);
  const [loading,setLoading]=useState(true)
  const load = async () => {
    const res = await outlookService.getEvents();
    setEvents(res.data.value || []);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold">Outlook Calendar</h2>

      <CreateEvent onCreated={load} />
      <OutlookEventList
        events={events}
        onRefresh={load}
        loading={loading}
      />
      <div className="space-y-3">
        {events.map((e) => (
          <div key={e.id} className="border p-3 rounded">
            <p className="font-medium">{e.subject}</p>
            <p className="text-xs text-gray-500">
              {new Date(e.start.dateTime).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
