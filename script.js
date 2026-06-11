const firebaseConfig = {
    apiKey: "AIzaSyBob43ZxNmd7TF8w88m1igpp_kmd3K4Hwo",
    authDomain: "crayfishmonitoring-30010.firebaseapp.com",
    databaseURL: "https://crayfishmonitoring-30010-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "crayfishmonitoring-30010"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();

let labels = [];
let tempData = [];
let foodData = [];

/* ================= TEMP CHART ================= */
const tempChart = new Chart(
document.getElementById('tempChart'),
{
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'Water Temperature (°C)',
            data: tempData,
            borderWidth: 2,
            fill: false
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: { min: 0, max: 60, ticks: { stepSize: 10 } }
        }
    }
});

/* ================= FOOD CHART ================= */
const foodChart = new Chart(
document.getElementById('foodChart'),
{
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'Food Level (%)',
            data: foodData,
            borderWidth: 2,
            fill: false
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: { min: 10, max: 100, ticks: { stepSize: 10 } }
        }
    }
});

/* ================= REALTIME DATA ================= */
db.ref("iot")
.orderByChild("timestamp")
.limitToLast(1440)
.on("value", (snapshot) => {

    labels.length = 0;
    tempData.length = 0;
    foodData.length = 0;

    let lastData = null;

    snapshot.forEach((child) => {
        let d = child.val();
        lastData = d;

        let date = new Date(d.timestamp * 1000);

        labels.push(date.toLocaleString());
        tempData.push(d.temperature);
        foodData.push(d.food_level);
    });

    /* UPDATE UI ONLY ONCE (FIXED) */
    if (lastData) {
        document.getElementById("temp").innerHTML = lastData.temperature + " °C";
        document.getElementById("food").innerHTML = lastData.food_level + "%";
        document.getElementById("status").innerHTML = lastData.status;
    }

    tempChart.update();
    foodChart.update();
});
