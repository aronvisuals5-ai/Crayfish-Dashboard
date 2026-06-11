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
const db = firebase.firestore();

const collectionRef = db.collection("sensor-temperature-data");

collectionRef.onSnapshot((snapshot) => {

    let labels = [];
    let tempData = [];
    let foodData = [];

    let lastDoc = null;

    snapshot.forEach((doc) => {
        let d = doc.data();
        lastDoc = d;

        let temp = d.raw_temp_c;
        let food = d.timestamp?.value;
        let time = d.timestamp?.ph_time;

        if (time) {
            let date = new Date(time);
            labels.push(date.toLocaleString());
        }

        tempData.push(temp);
        foodData.push(food);
    });

    // update UI with latest record
    if (lastDoc) {
        document.getElementById("temp").innerHTML = lastDoc.raw_temp_c + " °C";
        document.getElementById("food").innerHTML = lastDoc.timestamp.value + "%";
        document.getElementById("status").innerHTML = "ONLINE";
    }

    tempChart.update();
    foodChart.update();
});
