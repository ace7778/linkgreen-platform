// utils/getErrorMessage.js
const errorMessages = {
  400: '請求錯誤，請檢查輸入資料',
  401: '帳號或密碼錯誤，請重新輸入',
  403: '您沒有權限訪問此頁面',
  404: '找不到請求的資源',
  409: '資料衝突，請檢查後再試',
  500: '伺服器錯誤，請稍後再試',
  503: '服務暫時不可用，請稍後再試',
};

const getErrorMessage = (error) => {
  if (error.response) {
    const message = errorMessages[error.response.status] || error.response.data.error || '發生未知錯誤';
    console.error(`API Error [${error.response.status}]:`, error.response.data);
    return message;
  } else if (error.request) {
    console.error('Network Error:', error.request);
    return '無法連接伺服器，請檢查您的網路連線';
  } else {
    console.error('Unknown Error:', error.message);
    return '發生未知錯誤，請稍後再試';
  }
};

export default getErrorMessage;
  