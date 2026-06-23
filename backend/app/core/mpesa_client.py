import os
import base64
import requests
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

def get_mpesa_access_token():
    consumer_key = os.getenv("MPESA_CONSUMER_KEY")
    consumer_secret = os.getenv("MPESA_CONSUMER_SECRET")
    api_url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"

    res = requests.get(api_url, auth=(consumer_key, consumer_secret))
    return res.json().get("access_token")

def initiate_stk_push(phone_number: str, amount: int):
    access_token = get_mpesa_access_token()
    api_url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"

    business_short_code = os.getenv("MPESA_SHORTCODE")
    passkey = os.getenv("MPESA_PASSKEY")
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')

    password = base64.b64encode(f"{business_short_code}{passkey}{timestamp}".encode()).decode()

    headers = {"Authorization": f"Bearer {access_token}"}

    payload = {
        "BusinessShortCode": business_short_code,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": phone_number, # e.g. 2547XXXXXXXX
        "PartyB": business_short_code,
        "PhoneNumber": phone_number,
        "CallBackURL": os.getenv("MPESA_CALLBACK_URL"),
        "AccountReference": "LogSnap Pro",
        "TransactionDesc": "Upgrade to Pro Plan"
    }

    res = requests.post(api_url, json=payload, headers=headers)
    return res.json()
