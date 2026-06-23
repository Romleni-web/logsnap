import os
import base64
import requests
import logging
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

def get_mpesa_access_token():
    consumer_key = os.getenv("MPESA_CONSUMER_KEY")
    consumer_secret = os.getenv("MPESA_CONSUMER_SECRET")

    if not consumer_key or not consumer_secret:
        raise ValueError("MPESA_CONSUMER_KEY or MPESA_CONSUMER_SECRET not set in environment")

    api_url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"

    try:
        res = requests.get(api_url, auth=(consumer_key, consumer_secret), timeout=10)
        res.raise_for_status()
        token = res.json().get("access_token")
        if not token:
            raise ValueError(f"No access token in response: {res.text}")
        return token
    except Exception as e:
        logger.error(f"Failed to get M-Pesa token: {str(e)}")
        if hasattr(e, 'response') and e.response is not None:
             logger.error(f"M-Pesa Token Error Response: {e.response.text}")
        raise

def initiate_stk_push(phone_number: str, amount: int, user_id: str):
    try:
        access_token = get_mpesa_access_token()
        api_url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"

        business_short_code = os.getenv("MPESA_SHORTCODE")
        passkey = os.getenv("MPESA_PASSKEY")
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')

        if not business_short_code or not passkey:
             raise ValueError("MPESA_SHORTCODE or MPESA_PASSKEY not set in environment")

        password = base64.b64encode(f"{business_short_code}{passkey}{timestamp}".encode()).decode()

        headers = {"Authorization": f"Bearer {access_token}"}

        payload = {
            "BusinessShortCode": business_short_code,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": amount,
            "PartyA": phone_number,
            "PartyB": business_short_code,
            "PhoneNumber": phone_number,
            "CallBackURL": os.getenv("MPESA_CALLBACK_URL"),
            "AccountReference": user_id, # Use user_id for tracking
            "TransactionDesc": "Upgrade to Pro Plan"
        }

        res = requests.post(api_url, json=payload, headers=headers, timeout=10)
        # Check if response is JSON
        try:
            result = res.json()
        except Exception:
            logger.error(f"M-Pesa STK Push returned non-JSON response: {res.text}")
            res.raise_for_status()
            raise ValueError("M-Pesa STK Push returned non-JSON response")

        return result
    except Exception as e:
        logger.error(f"Failed to initiate M-Pesa STK Push: {str(e)}")
        raise
