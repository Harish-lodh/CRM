import { Injectable } from "@nestjs/common";
import axios from "axios";
import { MsAuthService } from "./msAuth.service";
import { MsAccount } from "./entity/ms-account.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class MsGraphService {
  private readonly GRAPH_BASE = "https://graph.microsoft.com/v1.0";

  constructor(
    private readonly msAuth: MsAuthService,
    @InjectRepository(MsAccount)
    private readonly repo: Repository<MsAccount>
  ) {}

  // ================= INTERNAL HELPERS =================

 private async getTokenForUser(userId: number): Promise<string> {
  const acc = await this.repo.findOneBy({ userId });

  if (!acc || !acc.accessToken) {
    throw new Error("Outlook account not connected for this user");
  }

  return acc.accessToken;
}


  private async graphGet<T>(token: string, url: string): Promise<T> {
    const res = await axios.get(`${this.GRAPH_BASE}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }

  private async graphPost<T>(
    token: string,
    url: string,
    body: any
  ): Promise<T> {
    const res = await axios.post(`${this.GRAPH_BASE}${url}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  }

  // ================= PUBLIC METHODS =================

  /**
   * 👤 Outlook profile
   */
  async getProfile(userId: number) {
    const token = await this.getTokenForUser(userId);
    return this.graphGet(token, "/me");
  }

  /**
   * 📅 List calendar events
   */
  async listEventsForUser(userId: number) {
    const token = await this.getTokenForUser(userId);

    return this.graphGet(
      token,
      "/me/events?$top=20&$orderby=start/dateTime"
    );
  }

  /**
   * ➕ Create calendar event
   */
async createEventForUser(
  userId: number,
  payload: {
    subject: string;
    startISO: string;   // MUST be without Z if timezone != UTC
    endISO: string;     // MUST be without Z if timezone != UTC
    timezone?: string;
    attendees?: { email: string; name?: string }[];
    bodyHtml?: string;
  }
) {
  const token = await this.getTokenForUser(userId);

  const tz = payload.timezone || "Asia/Kolkata";
  console.log("attendees:", payload.attendees);
  // 🔐 SAFETY: validate attendees
  const attendees =
    payload.attendees?.map((a) => {
      if (!a.email) {
        throw new Error("Attendee email is required");
      }
      return {
        type: "required",
        emailAddress: {
          address: a.email,
          name: a.name || a.email,
        },
      };
    }) || [];

  if (attendees.length === 0) {
    throw new Error("At least one attendee is required");
  }

  // 🔐 SAFETY: validate date order
  if (new Date(payload.endISO) <= new Date(payload.startISO)) {
    throw new Error("End time must be after start time");
  }

  // ✅ FINAL GRAPH BODY
  const body = {
    subject: payload.subject,

    body: {
      contentType: "HTML",
      content: payload.bodyHtml || "Microsoft Teams meeting",
    },

    start: {
      dateTime: payload.startISO, // ❌ NO Z
      timeZone: tz,
    },

    end: {
      dateTime: payload.endISO,   // ❌ NO Z
      timeZone: tz,
    },

    // ✅ TEAMS MEETING
    isOnlineMeeting: true,
    onlineMeetingProvider: "teamsForBusiness",

    // ✅ FORCE OUTLOOK TO SEND INVITES
    responseRequested: true,
    attendees,
  };

  console.log(
    "CREATE EVENT BODY:",
    JSON.stringify(body, null, 2)
  );

  // 🚀 THIS FORCES EMAIL + CALENDAR UPDATE
  return this.graphPost(
    token,
    "/me/events?sendUpdates=All",
    body
  );
}



  /**
   * 🎥 Create Teams meeting
   */
  async createTeamsMeetingForUser(
    userId: number,
    payload: {
      subject: string;
      startISO: string;
      endISO: string;
    }
  ) {
    const token = await this.getTokenForUser(userId);

    const body = {
      subject: payload.subject,
      startDateTime: payload.startISO,
      endDateTime: payload.endISO,
    };

    return this.graphPost(token, "/me/onlineMeetings", body);
  }
}
