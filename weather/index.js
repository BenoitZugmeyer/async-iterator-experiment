import "core-js/modules/es7.symbol.async-iterator"

import {
    listenTo,
    map,
    filter,
    fromPromise,
    Replayable,
    distinct,
    flatMap,
    withLatestFrom,
    interval,
} from "./iter-util"

async function getTemperature(zip) {
    return { main: { temp: Math.round(Math.random() * 100), zip }}
    // const res = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${zip},us&units=imperial&appid=APPID`)
    // return res.json()
}

// Grab HTML elements
const appContainer = document.getElementById("app-container")
const zipcodeInput = document.getElementById("zipcode-input")
const addLocationBtn = document.getElementById("add-location")

function zipTemperatureStreamFactory(zip) {
    return map(({ main: { temp }}) => ({temp, zip}), fromPromise(getTemperature(zip)))
}

async function buildNewLocations(zipcodeStream) {
    const stream = flatMap(zipTemperatureStreamFactory, zipcodeStream)

    for await (const {zip, temp} of stream) {
        const locationEle = document.createElement("div")
        locationEle.id = `zip-${zip}`
        locationEle.classList.add("location")

        const zipEle = document.createElement("p")
        zipEle.classList.add("zip")
        zipEle.innerText = zip

        const tempEle = document.createElement("p")
        tempEle.classList.add("temp")
        tempEle.innerHTML = `${temp}&deg;F`

        locationEle.appendChild(zipEle)
        locationEle.appendChild(tempEle)
        appContainer.appendChild(locationEle)

        zipcodeInput.value = ""
    }
}

async function updateWeather(zipcodeStream) {
    const stream = flatMap(
        zipTemperatureStreamFactory,
        flatMap(
            () => zipcodeStream.replay(),
            interval(2000)
        )
    )

    for await (const {zip, temp} of stream) {
        console.log("Updating!", zip, temp)

        const locationEle = document.getElementById(`zip-${zip}`)
        const tempEle = locationEle.querySelector(".temp")

        tempEle.innerHTML = `${temp}&deg;F`
    }
}

async function runApp() {
    const zipInputStream = filter(
        (zip) => zip.length === 5,
        map(
            (e) => e.target.value,
            listenTo(zipcodeInput, "keyup"),
        )
    )

    const btnClickStream = listenTo(addLocationBtn, "click")

    const zipcodeStream = new Replayable(distinct(
        map(
            ([_, zip]) => zip,
            withLatestFrom(btnClickStream, zipInputStream),
        )
    ))

    await Promise.all([buildNewLocations(zipcodeStream), updateWeather(zipcodeStream)])
}

runApp()
    .then(() => console.log("FINISHED"))
    .catch((e) => console.error(e.stack || String(e)))
