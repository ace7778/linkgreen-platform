const { google } = require('googleapis')

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
)

const getAuthUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar']
  })
}

const getTokens = async (code) => {
  const { tokens } = await oauth2Client.getToken(code)
  return tokens
}

const insertEvent = async (accessToken, refreshToken, event) => {
  oauth2Client.setCredentials({ access_token: accessToken, refresh_token: refreshToken })
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
  return calendar.events.insert({
    calendarId: 'primary',
    requestBody: event
  })
}

module.exports = { getAuthUrl, getTokens, insertEvent }
