import { useState } from "react";
import { TextField, Button, Card } from "@mui/material";
import { outlookService } from "../../service/outlook.service";

export default function CreateEvent({ onCreated }) {
  const [form, setForm] = useState({
    subject: "",
    startISO: "",
    endISO: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      // 🔑 IMPORTANT: keep local time, DO NOT use toISOString()
      const toLocalISO = (v) => v; // yyyy-MM-ddTHH:mm

      await outlookService.createEvent({
        subject: form.subject,

        startISO: toLocalISO(form.startISO),
        endISO: toLocalISO(form.endISO),

        timezone: "Asia/Kolkata",

        attendees: form.email
          ? [
              {
                email: form.email,
                name: form.email,
              },
            ]
          : [],
      });

      setForm({ subject: "", startISO: "", endISO: "", email: "" });
      onCreated?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 space-y-3">
      <h3 className="font-semibold">Create Meeting</h3>

      <TextField
        label="Subject"
        fullWidth
        value={form.subject}
        onChange={(e) => setForm({ ...form, subject: e.target.value })}
      />

      <TextField
        type="datetime-local"
        fullWidth
        value={form.startISO}
        onChange={(e) => setForm({ ...form, startISO: e.target.value })}
      />

      <TextField
        type="datetime-local"
        fullWidth
        value={form.endISO}
        onChange={(e) => setForm({ ...form, endISO: e.target.value })}
      />

      <TextField
        label="Attendee Email"
        fullWidth
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <Button variant="contained" onClick={submit} disabled={loading}>
        {loading ? "Creating..." : "Create Event"}
      </Button>
    </Card>
  );
}
