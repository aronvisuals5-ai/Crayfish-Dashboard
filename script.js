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

/* ================= FIRESTORE ================= */
firebase.initializeApp(firebaseConfig); // IMPORTANT: must exist in HTML

const db = firebase.firestore();
const docRef = db.collection("sensor-temperature-data").doc("latest");

docRef.onSnapshot((doc) => {

    if (!doc.exists) {
        console.log("No document found");
        return;
    }

    let d = doc.data();
    console.log("Firestore data:", d);

    let temp = d.raw_temp_c ?? 0;
    let food = d.timestamp?.value ?? 0;
    let time = d.timestamp?.ph_time;

    if (!time) return;

    let date = new Date(time);

    // reset
    labels.length = 0;
    tempData.length = 0;
    foodData.length = 0;

    // push
    labels.push(date.toLocaleString());
    tempData.push(temp);
    foodData.push(food);

    // UI
    document.getElementById("temp").innerHTML = temp + " °C";
    document.getElementById("food").innerHTML = food + "%";
    document.getElementById("status").innerHTML = "ONLINE";

    // charts
    tempChart.update();
    foodChart.update();
});
