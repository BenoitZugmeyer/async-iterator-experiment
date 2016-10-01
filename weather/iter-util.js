
export function listenTo(element, event) {
    let resolve = null
    const listener = (event) => {
        if (resolve) resolve({ done: false, value: event})
    }

    element.addEventListener(event, listener)

    return {
        [Symbol.asyncIterator]() {
            return this
        },

        next() {
            return new Promise((resolve_) => resolve = resolve_)
        },

        return() {
            element.removeEventListener(event, listener)
        },
    }
}

export async function* map(fn, iterator) {
    for await (const value of iterator) yield fn(value)
}

export async function* filter(fn, iterator) {
    for await (const value of iterator) if (fn(value)) yield value
}

export async function* fromPromise(promise) {
    yield await promise
}

async function asyncIteratorNext(iterator) {
    const item = await iterator.next()
    const value = await item.value
    return { ...item, value }
}

export function select(...iterators) {
    const STOP = 0, RUN = 1, END = 2
    const states = iterators.map(() => STOP)
    const pendingValues = []
    let resolved, resolve, reject

    function run(iterator, index) {
        if (states[index] !== STOP) return

        states[index] = RUN
        asyncIteratorNext(iterator).then(

            (item) => {
                states[index] = item.done ? END : STOP
                const newValue = { index, ...item }
                if (resolved) {
                    pendingValues.push(newValue)
                }
                else {
                    resolved = true
                    resolve({ value: [newValue], done: false })
                }
            },

            (error) => {
                states[index] = END
                resolved = true
                reject(error)
            }

        )
    }

    return {
        [Symbol.asyncIterator]() { return this },

        next() {
            if (pendingValues.length) {
                const value = pendingValues.slice()
                pendingValues.length = 0
                return Promise.resolve({ value, done: false })
            }

            if (states.every((s) => s === END)) {
                return Promise.resolve({ done: true })
            }

            return new Promise((resolve_, reject_) => {
                resolved = false
                resolve = resolve_
                reject = reject_

                iterators.forEach(run)
            })
        },

        return() {
            for (const iterator of iterators) iterator.return()
            return { done: true }
        },
    }
}

export async function* withLatestFrom(iterator, fromIterator) {
    let latest
    for await (const items of select(iterator, fromIterator)) {
        for (const item of items) {
            if (item.index === 0) {
                if (item.done) return
                yield [item.value, latest]
            }
            else if (!item.done) {
                latest = item.value
            }
        }
    }
}

export async function* flatMap(fn, iterator) {
    for await (const value of iterator) {
        // yield* await fn(value)
        for await (const transformed of fn(value)) {
            yield transformed
        }
    }
}

export async function* distinct(iterator) {
    const pastValues = new Set()
    for await (const value of iterator) {
        if (pastValues.has(value)) continue
        pastValues.add(value)
        yield value
    }
}


function sleep(ms) {
    return new Promise((resolve) => setTimeout(() => resolve(), ms))
}

export async function* interval(ms) {
    for (let i = 0; true; i++) yield sleep(ms)
}

export class Replayable {
    constructor(source) {
        this._source = source
        this._values = []
    }

    [Symbol.asyncIterator]() {
        return this
    }

    next() {
        return asyncIteratorNext(this._source).then((item) => {
            if (!item.done) this._values.push(item.value)
            return item
        })
    }

    return() {
        return this._source.return()
    }

    replay() {
        return this._values[Symbol.iterator]()
    }
}
