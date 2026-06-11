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
const db = firebase.firestore();

const docRef = db.collection("sensor-temperature-data").doc("latest");

docRef.onSnapshot((doc) => {

    console.log("Firestore data:", doc.data());

    if (!doc.exists) return;

    let d = doc.data();

    let temp = d.raw_temp_c;
    let food = d.timestamp.value;
    let time = d.timestamp.ph_time;

    let date = new Date(time);

    // reset
    labels.length = 0;
    tempData.length = 0;
    foodData.length = 0;

    // push
    labels.push(date.toLocaleString());
    tempData.push(temp);
    foodData.push(food);

    // update UI
    document.getElementById("temp").innerHTML = temp + " °C";
    document.getElementById("food").innerHTML = food + "%";
    document.getElementById("status").innerHTML = "ONLINE";

    // update charts
    tempChart.update();
    foodChart.update();
});
