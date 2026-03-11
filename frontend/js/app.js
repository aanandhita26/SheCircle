// Simple vanilla JS page navigation system
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page-section');
    pages.forEach(page => {
        page.style.display = 'none';
        page.classList.remove('active');
    });

    // Show target page
    const target = document.getElementById(pageId);
    if(target) {
        target.style.display = 'block';
        // Add a small delay for animation if we add one later
        setTimeout(() => target.classList.add('active'), 10);
    }
}

// Mock AI Chatbot interaction
window.sendAIMessage = function() {
    const input = document.getElementById('ai-chat-input');
    const msg = input.value.trim();
    if (!msg) return;

    const history = document.getElementById('ai-chat-history');
    
    // Append user message
    const userBubble = document.createElement('div');
    userBubble.style.textAlign = 'right';
    userBubble.style.margin = '10px 0';
    userBubble.innerHTML = `<div style="display:inline-block; padding:10px 16px; background:var(--blush-pink); border-radius:14px 14px 0 14px; color:var(--text-dark);">${msg}</div>`;
    history.appendChild(userBubble);
    
    input.value = '';
    history.scrollTop = history.scrollHeight;

    // Mock AI response
    setTimeout(() => {
        const aiBubble = document.createElement('div');
        aiBubble.style.textAlign = 'left';
        aiBubble.style.margin = '10px 0';
        aiBubble.innerHTML = `<div style="display:inline-block; padding:10px 16px; background:white; border-radius:14px 14px 14px 0; color:var(--text-dark); box-shadow: 0 2px 5px rgba(0,0,0,0.05); max-width:80%;">
        That sounds overwhelming. You’re handling a lot right now. <br>Would you like to schedule some personal time or join a nearby support circle meetup?</div>`;
        history.appendChild(aiBubble);
        history.scrollTop = history.scrollHeight;
    }, 1000);
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // We could fetch initial data from our FastAPI backend here
    console.log("SheCircle Frontend Initialized");
});

// Google Maps Integration
let map;
let markers = [];

window.initMap = function() {
    // Default location (e.g., New York)
    const defaultLocation = { lat: 40.7128, lng: -74.0060 };
    
    // The map container must exist when this runs, but it might be hidden.
    // Google Maps needs the container to be visible to render correctly, 
    // so we render it when the meetups page is shown.
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: defaultLocation,
        styles: [
            { "featureType": "poi.business", "stylers": [{ "visibility": "off" }] }
        ]
    });

    // Attempt to get user location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                map.setCenter(pos);
                
                // Add marker for user location
                new google.maps.Marker({
                    position: pos,
                    map: map,
                    title: "Your Location",
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: "#4285F4",
                        fillOpacity: 1,
                        strokeWeight: 2,
                        strokeColor: "#ffffff",
                    }
                });
            },
            () => {
                console.log("Geolocation failed or denied.");
            }
        );
    }

    // Add a mock meetup marker
    addMarker({ lat: 40.730610, lng: -73.935242 }, "Coffee & Conversations", "The Daily Grind Cafe");
};

function addMarker(location, title, description) {
    if (!map) return;
    const marker = new google.maps.Marker({
        position: location,
        map: map,
        title: title,
        animation: google.maps.Animation.DROP,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#E09090", // var(--primary-rose)
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#ffffff",
        }
    });

    const infoWindow = new google.maps.InfoWindow({
        content: `<div><strong>${title}</strong><br>${description}</div>`
    });

    marker.addListener("click", () => {
        infoWindow.open(map, marker);
    });

    markers.push(marker);
}

// Hook into showPage to resize map if needed when tab becomes visible
const originalShowPage = showPage;
window.showPage = function(pageId) {
    originalShowPage(pageId);
    if (pageId === 'meetups-page' && map) {
        // Trigger resize so map renders fully if it was initialized while hidden
        google.maps.event.trigger(map, 'resize');
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    map.setCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
                }, 
                () => {
                    map.setCenter({ lat: 40.7128, lng: -74.0060 }); // Reset center to NY if failed
                }
            );
        } else {
            map.setCenter({ lat: 40.7128, lng: -74.0060 }); // Reset center
        }
    }
};

window.handleMeetupSubmit = async function(event) {
    event.preventDefault();
    
    const title = document.getElementById("meetup-title").value;
    const desc = document.getElementById("meetup-desc").value;
    const datetime = document.getElementById("meetup-datetime").value;
    const location = document.getElementById("meetup-location").value;
    const specialGuest = document.getElementById("meetup-guest").value;
    
    // In a real app, you'd geocode the location string to lat/lng.
    // For this demo, we'll try to put it near the current map center
    let center = map ? map.getCenter() : { lat: () => 40.7128, lng: () => -74.0060 };
    const mockLat = center.lat() + (Math.random() - 0.5) * 0.05;
    const mockLng = center.lng() + (Math.random() - 0.5) * 0.05;
    
    try {
        const response = await fetch("http://127.0.0.1:8000/api/meetups/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                description: desc,
                date_time: new Date(datetime).toISOString(),
                activity_type: "General",
                location: location,
                circle_id: 1, // Mock circle
                creator_id: 1, // Mock user
                special_guest: specialGuest || null
            })
        });
        
        if (response.ok) {
            // Update UI
            document.getElementById('organize-modal').style.display = 'none';
            alert("Meetup created successfully!");
            
            // Add marker to map
            addMarker({ lat: mockLat, lng: mockLng }, title, location);
            
            // Add to list
            const container = document.getElementById("meetups-container");
            const dateObj = new Date(datetime);
            const timeString = dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            const dateString = dateObj.toLocaleDateString();
            
            const guestHtml = specialGuest ? `<p style="font-size: 0.9em; margin-top: 5px; color: var(--primary-rose);"><strong>Special Guest:</strong> ${specialGuest}</p>` : '';
            
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                <h3>${title}</h3>
                <p><strong><i class="fa-regular fa-clock" style="color: var(--primary-rose)"></i> ${dateString}, ${timeString}</strong></p>
                <p><i class="fa-solid fa-location-dot" style="color: var(--primary-rose)"></i> ${location}</p>
                <p style="font-size: 0.9em; margin-top: 10px;">${desc}</p>
                ${guestHtml}
                <button class="btn-primary" style="margin-top: 15px; width: 100%; justify-content: center;">RSVP (1/8 spots)</button>
            `;
            container.appendChild(card);
            
            // Reset form
            document.getElementById("meetup-form").reset();
        } else {
            const data = await response.json();
            alert("Error creating meetup: " + (data.detail || "Unknown error"));
        }
    } catch (error) {
        console.error("Failed to create meetup:", error);
        alert("Cannot connect to server.");
    }
};
