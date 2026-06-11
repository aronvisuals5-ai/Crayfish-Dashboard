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
db.ref("sensor-temperature-data-raw_temp_c").on("value", (snapshot) => {

    console.log("Firebase data:", snapshot.val());

    let d = snapshot.val();
    if (!d) return;

    let temp = d.raw_temp_c;
    let food = d.timestamp?.value;
    let time = d.timestamp?.ph_time;

    let date = new Date(time);

    // RESET
    labels.length = 0;
    tempData.length = 0;
    foodData.length = 0;

    // PUSH DATA
    labels.push(date.toLocaleString());
    tempData.push(temp);
    foodData.push(food);

    // UPDATE UI
    document.getElementById("temp").innerHTML = temp + " °C";
    document.getElementById("food").innerHTML = food + "%";
    document.getElementById("status").innerHTML = "ONLINE";

    // UPDATE CHARTS
    tempChart.update();
    foodChart.update();
});
