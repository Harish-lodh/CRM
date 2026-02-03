import OutlookStatusCard from "../components/outlook/OutlookStatusCard";
import { connectMicrosoft } from "../utils/index";
import { Button } from "@mui/material";

export default function OutlookIntegration() {
  const user = JSON.parse(localStorage.getItem("user"));
 console.log(user)
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Microsoft Integration</h2>

      <OutlookStatusCard />

      <Button
        variant="outlined"
        onClick={() =>
            connectMicrosoft(user.id)}
      >
        Connect Microsoft Account
      </Button>
    </div>
  );
}
