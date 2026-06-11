const firebaseConfig = {
    databaseURL:
    "https://YOUR_PROJECT-default-rtdb.firebaseio.com/"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();

let labels = [];
let tempData = [];
let foodData = [];

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
    plugins: {
        legend: {
            display: false
        }
    },
    scales: {
        y: {
            min: 0,
            max: 60,
            ticks: {
                stepSize: 10
            }
        }
    }
}
});

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
    plugins: {
        legend: {
            display: false
        }
    },
    scales: {
        y: {
            min: 10,
            max: 100,
            ticks: {
                stepSize: 10
            }
        }
    }
}
});

db.ref("iot")
.orderByChild("timestamp")
.limitToLast(1440)
.on("value",(snapshot)=>{

    labels.length = 0;
    tempData.length = 0;
    foodData.length = 0;

    snapshot.forEach((child)=>{

        let d = child.val();

        document.getElementById("temp").innerHTML =
        d.temperature + " °C";

        document.getElementById("food").innerHTML =
        d.food_level + "%";

        document.getElementById("status").innerHTML =
        d.status;

        let date =
        new Date(d.timestamp * 1000);

        labels.push(
            date.toLocaleString()
        );

        tempData.push(
            d.temperature
        );

        foodData.push(
            d.food_level
        );

    });

    tempChart.update();
    foodChart.update();

});