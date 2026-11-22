const { google } = require("googleapis");
const path = require("path");

const KEYFILEPATH = path.join(__dirname, "google-service-account.json");

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const calendar = google.calendar({ version: "v3", auth });

const generateMeetLink = async (summary) => {
  const startTime = new Date(Date.now() + 60000);
  const endTime = new Date(Date.now() + 3600000);

  const event = {
    summary,
    start: {
      dateTime: startTime.toISOString(),
      timeZone: "Asia/Kolkata",
    },
    end: {
      dateTime: endTime.toISOString(),
      timeZone: "Asia/Kolkata",
    },
  };

  try {
    await calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });

    // Stable Meet link fallback for mini project demo
    return "https://meet.google.com/new";

  } catch (error) {
    console.error("Google Calendar Error:", error.message);
    throw error;
  }
};

module.exports = generateMeetLink;