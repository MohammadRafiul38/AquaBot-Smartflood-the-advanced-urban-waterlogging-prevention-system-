// Initialize map
var map = L.map('map').setView([0, 0], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © OpenStreetMap contributors'
}).addTo(map);

var marker;

// Get user location
navigator.geolocation.getCurrentPosition(function(position){
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    map.setView([lat, lon], 13);
    marker = L.marker([lat, lon]).addTo(map).bindPopup("You are here").openPopup();

    // Send location to backend for flood risk
    fetch(`http://127.0.0.1:5000/flood_risk?lat=${lat}&lon=${lon}`)
    .then(response => response.json())
    .then(data => {
        addChatMessage("SmartFlood", `Flood risk at your location: ${data.risk}`);
    });
});

// Chat logic
document.getElementById("send-btn").addEventListener("click", function(){
    let input = document.getElementById("user-input").value;
    addChatMessage("You", input);

    fetch(`http://127.0.0.1:5000/chat?message=${encodeURIComponent(input)}`)
    .then(response => response.json())
    .then(data => {
        addChatMessage("SmartFlood", data.reply);
    });

    document.getElementById("user-input").value = "";
});

function addChatMessage(sender, message){
    let chatBox = document.getElementById("chat-box");
    chatBox.innerHTML += `<b>${sender}:</b> ${message}<br>`;
    chatBox.scrollTop = chatBox.scrollHeight;
}
