import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

app = Flask(__name__)
CORS(app)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_SECRET_KEY)


@app.route("/")
def home():
    return jsonify({
        "message": "TrustLink Python backend is working!"
    })


@app.route("/bookings", methods=["POST"])
def create_booking():
    data = request.get_json()

    booking = {
        "customer_name": data.get("customer_name"),
        "email": data.get("email"),
        "service": data.get("service"),
        "location": data.get("location"),
        "booking_date": data.get("booking_date"),
        "status": "Confirmed"
    }

    result = supabase.table("bookings").insert(booking).execute()

    return jsonify({
        "message": "Booking saved successfully",
        "data": result.data
    })


@app.route("/bookings", methods=["GET"])
def get_bookings():
    result = supabase.table("bookings").select("*").execute()
    return jsonify(result.data)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
    