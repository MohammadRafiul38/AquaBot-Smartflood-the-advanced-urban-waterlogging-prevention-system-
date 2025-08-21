from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

OPENWEATHER_API_KEY = "YOUR_OPENWEATHER_API_KEY"

@app.route('/flood_risk')
def flood_risk():
    lat = request.args.get('lat')
    lon = request.args.get('lon')

    # Get weather data
    url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric"
    res = requests.get(url).json()
    rain = res.get('rain', {}).get('1h', 0)

    if rain > 20:
        risk = "High 🌊"
    elif rain > 5:
        risk = "Moderate 💧"
    else:
        risk = "Low ☀️"

    return jsonify({"risk": risk})

@app.route('/chat')
def chat():
    message = request.args.get('message').lower()
    if "flood" in message or "waterlogging" in message:
        reply = "Looks like you are asking about flood risks. Make sure to stay safe and check local updates!"
    elif "weather" in message:
        reply = "Check your local weather forecast for current updates."
    else:
        reply = "I'm SmartFlood, I can help you with flood and waterlogging information."
    return jsonify({"reply": reply})

if __name__ == "__main__":
    app.run(debug=True)
