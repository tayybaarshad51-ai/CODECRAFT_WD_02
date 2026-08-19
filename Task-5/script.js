const cityInput = document.getElementById("cityInput");

const searchBtn = document.getElementById("searchBtn");

const locationBtn = document.getElementById("locationBtn");

const refreshBtn = document.getElementById("refreshBtn");

const loading = document.getElementById("loading");

const errorMessage = document.getElementById("errorMessage");

const weatherContainer =
    document.getElementById("weatherContainer");


const cityName =
    document.getElementById("cityName");

const countryName =
    document.getElementById("countryName");

const dateTime =
    document.getElementById("dateTime");

const weatherIcon =
    document.getElementById("weatherIcon");

const temperature =
    document.getElementById("temperature");

const weatherDescription =
    document.getElementById("weatherDescription");

const feelsLike =
    document.getElementById("feelsLike");

const humidity =
    document.getElementById("humidity");

const windSpeed =
    document.getElementById("windSpeed");

const precipitation =
    document.getElementById("precipitation");

const cloudCover =
    document.getElementById("cloudCover");


let lastLatitude = null;

let lastLongitude = null;

let lastLocationName = "";



/* --------------------------------
   Weather Code
-------------------------------- */

function getWeatherInfo(code) {

    const weatherCodes = {

        0: {
            description: "Clear Sky",
            icon: "☀️"
        },

        1: {
            description: "Mainly Clear",
            icon: "🌤️"
        },

        2: {
            description: "Partly Cloudy",
            icon: "⛅"
        },

        3: {
            description: "Overcast",
            icon: "☁️"
        },

        45: {
            description: "Fog",
            icon: "🌫️"
        },

        48: {
            description: "Rime Fog",
            icon: "🌫️"
        },

        51: {
            description: "Light Drizzle",
            icon: "🌦️"
        },

        53: {
            description: "Moderate Drizzle",
            icon: "🌦️"
        },

        55: {
            description: "Dense Drizzle",
            icon: "🌧️"
        },

        61: {
            description: "Light Rain",
            icon: "🌦️"
        },

        63: {
            description: "Moderate Rain",
            icon: "🌧️"
        },

        65: {
            description: "Heavy Rain",
            icon: "🌧️"
        },

        71: {
            description: "Light Snow",
            icon: "🌨️"
        },

        73: {
            description: "Moderate Snow",
            icon: "❄️"
        },

        75: {
            description: "Heavy Snow",
            icon: "❄️"
        },

        80: {
            description: "Rain Showers",
            icon: "🌦️"
        },

        81: {
            description: "Moderate Rain Showers",
            icon: "🌧️"
        },

        82: {
            description: "Heavy Rain Showers",
            icon: "⛈️"
        },

        95: {
            description: "Thunderstorm",
            icon: "⛈️"
        },

        96: {
            description: "Thunderstorm with Hail",
            icon: "⛈️"
        },

        99: {
            description: "Heavy Thunderstorm",
            icon: "⛈️"
        }

    };


    return weatherCodes[code] || {
        description: "Unknown Weather",
        icon: "🌤️"
    };
}



/* --------------------------------
   Loading
-------------------------------- */

function showLoading() {

    loading.style.display = "block";

    errorMessage.style.display = "none";

    weatherContainer.style.display = "none";
}


function hideLoading() {

    loading.style.display = "none";
}



/* --------------------------------
   Error
-------------------------------- */

function showError(message) {

    hideLoading();

    errorMessage.textContent = message;

    errorMessage.style.display = "block";

    weatherContainer.style.display = "none";
}



/* --------------------------------
   Get Location by City Name
-------------------------------- */

async function searchCity() {

    const city = cityInput.value.trim();


    if (city === "") {

        showError("Please enter a city name.");

        return;
    }


    showLoading();


    try {

        const geocodingURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;


        const response =
            await fetch(geocodingURL);


        if (!response.ok) {

            throw new Error(
                "Unable to search location."
            );
        }


        const data =
            await response.json();


        if (
            !data.results ||
            data.results.length === 0
        ) {

            showError(
                "City not found. Please enter a valid city name."
            );

            return;
        }


        const location =
            data.results[0];


        lastLatitude =
            location.latitude;

        lastLongitude =
            location.longitude;

        lastLocationName =
            location.name;


        await getWeather(
            lastLatitude,
            lastLongitude,
            location.name,
            location.country
        );

    }

    catch (error) {

        console.error(error);

        showError(
            "Something went wrong. Please try again."
        );
    }
}



/* --------------------------------
   Get Weather
-------------------------------- */

async function getWeather(
    latitude,
    longitude,
    locationName = "Your Location",
    country = ""
) {

    showLoading();


    try {

        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,wind_speed_10m&timezone=auto`;


        const response =
            await fetch(weatherURL);


        if (!response.ok) {

            throw new Error(
                "Weather data unavailable."
            );
        }


        const data =
            await response.json();


        displayWeather(
            data,
            locationName,
            country
        );

    }

    catch (error) {

        console.error(error);

        showError(
            "Unable to fetch weather data. Please try again."
        );
    }
}



/* --------------------------------
   Display Weather
-------------------------------- */

function displayWeather(
    data,
    locationName,
    country
) {

    hideLoading();

    errorMessage.style.display = "none";

    weatherContainer.style.display = "block";


    const current =
        data.current;


    const weatherInfo =
        getWeatherInfo(
            current.weather_code
        );


    cityName.textContent =
        locationName;


    countryName.textContent =
        country;


    temperature.textContent =
        Math.round(
            current.temperature_2m
        );


    feelsLike.textContent =
        Math.round(
            current.apparent_temperature
        );


    humidity.textContent =
        current.relative_humidity_2m;


    windSpeed.textContent =
        Math.round(
            current.wind_speed_10m
        );


    precipitation.textContent =
        current.precipitation;


    cloudCover.textContent =
        current.cloud_cover;


    weatherIcon.textContent =
        weatherInfo.icon;


    weatherDescription.textContent =
        weatherInfo.description;


    dateTime.textContent =
        formatDateTime(
            current.time
        );
}



/* --------------------------------
   Format Date and Time
-------------------------------- */

function formatDateTime(dateString) {

    const date =
        new Date(dateString);


    return date.toLocaleString(
        [],
        {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}



/* --------------------------------
   Get User Location
-------------------------------- */

function getUserLocation() {

    if (!navigator.geolocation) {

        showError(
            "Geolocation is not supported by your browser."
        );

        return;
    }


    showLoading();


    navigator.geolocation.getCurrentPosition(

        async function(position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            lastLatitude = latitude;

            lastLongitude = longitude;


            try {

                /*
                    Reverse geocoding is used to
                    display the user's city name.
                */

                const reverseURL =
                    `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&count=1&language=en&format=json`;


                let locationName =
                    "Your Location";

                let country =
                    "";


                const response =
                    await fetch(reverseURL);


                if (response.ok) {

                    const locationData =
                        await response.json();


                    if (
                        locationData.results &&
                        locationData.results.length > 0
                    ) {

                        locationName =
                            locationData.results[0].name;

                        country =
                            locationData.results[0].country;
                    }
                }


                await getWeather(
                    latitude,
                    longitude,
                    locationName,
                    country
                );

            }

            catch (error) {

                console.error(error);

                await getWeather(
                    latitude,
                    longitude
                );
            }

        },

        function(error) {

            hideLoading();


            if (error.code === 1) {

                showError(
                    "Location permission was denied. Please allow location access."
                );

            }

            else if (error.code === 2) {

                showError(
                    "Your location could not be determined."
                );

            }

            else {

                showError(
                    "Unable to get your location."
                );
            }

        }

    );

}



/* --------------------------------
   Refresh Weather
-------------------------------- */

function refreshWeather() {

    if (
        lastLatitude !== null &&
        lastLongitude !== null
    ) {

        getWeather(
            lastLatitude,
            lastLongitude,
            cityName.textContent,
            countryName.textContent
        );

    }

    else {

        getUserLocation();

    }
}



/* --------------------------------
   Event Listeners
-------------------------------- */

searchBtn.addEventListener(
    "click",
    searchCity
);


locationBtn.addEventListener(
    "click",
    getUserLocation
);


refreshBtn.addEventListener(
    "click",
    refreshWeather
);


cityInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            searchCity();

        }

    }
);



/* --------------------------------
   Start with User Location
-------------------------------- */

window.addEventListener(
    "load",
    function() {

        getUserLocation();

    }
);