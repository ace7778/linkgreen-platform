const axios = require('axios')

const sendLineNotify = async (message, token) => {
  try {
    await axios.post(
      'https://notify-api.line.me/api/notify',
      new URLSearchParams({ message }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${token}`
        }
      }
    )
  } catch (err) {
    console.error('Line Notify 發送失敗：', err.response?.data || err.message)
  }
}

module.exports = sendLineNotify
