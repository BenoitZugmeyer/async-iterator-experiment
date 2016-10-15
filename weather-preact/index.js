import "core-js/modules/es7.symbol.async-iterator"
import { h, render, Component } from "preact"

import {
    asyncIteratorNext,
    eventListener,
    map,
    scan,
    merge,
    filter,
    distinct,
    withLatestFrom,
    interval,
} from "./iter-util"

async function getTemperature(zip) {
    // const res = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${zip},us&units=imperial&appid=APPID`)
    // const { main: { temp } } = await res.json();
    const temp = Math.round(Math.random() * 100)
    return { zip, temp }
}

class AsyncIterComponent extends Component {
    constructor({iter, component, prop}) {
        super()
        this.iter = iter
        this.prop = prop
        this.component = component
    }

    getInitialState() {
        return { item: null }
    }

    render() {
        if (!this.state.item) return
        const value = this.state.item.value
        return h(this.component, this.prop ? {[this.prop]: value} : value)
    }

    componentWillMount() {
        const popNext = () => {
            if (!this.iter) return Promise.resolve()

            return asyncIteratorNext(this.iter)
            .then((item) => {
                this.setState({ item })
                if (!item.done) return popNext()
            })
        }

        popNext().catch((error) => console.error(error.stack || String(error)))
    }

    componentWillUnmount() {
        this.iter.return()
        this.iter = null
    }
}

const LocationList = ({list}) => (
    <div>{list.map((infos) => <Location key={infos.zip} {...infos} />)}</div>
)

const Location = ({zip, temp}) => (
    <div className="location">
        <p className="zip">
            {zip}
        </p>
        <p className="temp">
            {temp}&deg;F
        </p>
    </div>
)

const App = () => {
    const inputEvent = eventListener()
    const clickEvent = eventListener()

    // Emits 5 characters zip strings entered in the text input
    const zipInputStream = filter(
        (zip) => zip.length === 5,
        map((e) => e.target.value, inputEvent.output)
    )

    // Emits locations when the button is clicked
    const locationStream = distinct(
        map(
            ([_, zip]) => getTemperature(zip),
            withLatestFrom(clickEvent.output, zipInputStream)
        )
    )

    // Emits a function that will add a new location to a list
    const addLocationStream = map(
        (location) => (list) => list.concat(location),
        locationStream,
    )

    // Emits a function that will refresh a location list periodically
    const refreshLocationsStream = map(
        () => (list) => Promise.all(list.map(({zip}) => getTemperature(zip))),
        interval(2000)
    )

    const operationsStream = merge(addLocationStream, refreshLocationsStream)

    const locationListStream = scan((list, operation) => operation(list), [], operationsStream)

    return (
        <div>
            <div>
                <label>Zip Code:</label>
                <input type="text" id="zipcode-input" onKeyup={inputEvent.input} />
                <button onClick={clickEvent.input}>Add Location</button>
            </div>
            <AsyncIterComponent iter={locationListStream} prop="list" component={LocationList} />
        </div>
    )
}

render(<App />, document.body)
