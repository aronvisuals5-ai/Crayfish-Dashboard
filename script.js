const firebaseConfig = {
    apiKey: "AIzaSyBob43ZxNmd7TF8w88m1igpp_kmd3K4Hwo",
    authDomain: "crayfishmonitoring-30010.firebaseapp.com",
    databaseURL: "https://crayfishmonitoring-30010-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "crayfishmonitoring-30010",
    storageBucket: "crayfishmonitoring-30010.firebasestorage.app",
    messagingSenderId: "974642532197",
    appId: "1:974642532197:web:77e52d4505e45275381b8c"
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
db.ref("Sensor-temperature-data")
.on("value", (snapshot) => {

    let d = snapshot.val();

    if (!d) return;

    let temp = d.raw_temp_c;
    let food = d.timestamp.value;
    let time = d.timestamp.ph_time;

    let date = new Date(time);

    /* RESET ARRAYS */
    labels.length = 0;
    tempData.length = 0;
    foodData.length = 0;

    /* PUSH SINGLE VALUE */
    labels.push(date.toLocaleString());
    tempData.push(temp);
    foodData.push(food);

    /* UPDATE UI */
    document.getElementById("temp").innerHTML = temp + " °C";
    document.getElementById("food").innerHTML = food + "%";
    document.getElementById("status").innerHTML = "ONLINE";

    tempChart.update();
    foodChart.update();
});

    /* UPDATE UI ONLY ONCE */
    if (lastData) {
        document.getElementById("temp").innerHTML = lastData.raw_temp_c + " °C";
        document.getElementById("food").innerHTML = lastData.timestamp.value + "%";
        document.getElementById("status").innerHTML = "OK";
    }

    tempChart.update();
    foodChart.update();

});
