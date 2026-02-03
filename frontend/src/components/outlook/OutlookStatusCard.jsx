import { useEffect, useState } from "react";
import { Card, Button } from "@mui/material";
import { outlookService } from "../../service/outlook.service";

export default function OutlookStatusCard() {
  const [status, setStatus] = useState({
    connected: false,
    expired: false,
    loading: true,
    email: "",
  });

  useEffect(() => {
    outlookService
      .getStatus()
      .then((res) => {
        setStatus({
          connected: res.data.connected,
          expired: res.data.expired,
          loading: false,
          email: res.data.username || "",
        });
      })
      .catch(() => {
        setStatus({
          connected: false,
          expired: false,
          loading: false,
          email: "",
        });
      });
  }, []);

  if (status.loading) {
    return (
      <Card className="p-4">
        <p className="text-gray-500">Checking Outlook connection…</p>
      </Card>
    );
  }

  return (
    <Card className="p-4 space-y-2">
      {status.connected ? (
        <>
          <p className="text-green-600 font-medium">
            ✅ Outlook connected {status.email && `(${status.email})`}
          </p>

          {status.expired && (
            <p className="text-yellow-600 text-sm">
              ⚠️ Session expired — reconnect required
            </p>
          )}
        </>
      ) : (
        <p className="text-red-600 font-medium">
          ❌ Outlook not connected
        </p>
      )}
    </Card>
  );
}
