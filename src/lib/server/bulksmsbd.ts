export async function sendSMS(number: string, message: string) {
  const apiKey = process.env.BULKSMSBD_API_KEY;
  const senderId = process.env.BULKSMSBD_SENDER_ID;

  if (!apiKey || !senderId) {
    console.warn('BulkSMSBD credentials not found in env, skipping actual SMS send.');
    console.log(`[MOCK SMS] To: ${number} | Message: ${message}`);
    return true;
  }

  try {
    const response = await fetch('http://bulksmsbd.net/api/smsapi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        api_key: apiKey,
        senderid: senderId,
        number: number,
        message: message
      })
    });

    const data = await response.json();
    if (data.response_code === 202) {
      return true;
    } else {
      console.error('BulkSMSBD error:', data);
      return false;
    }
  } catch (error) {
    console.error('Failed to send SMS:', error);
    return false;
  }
}
