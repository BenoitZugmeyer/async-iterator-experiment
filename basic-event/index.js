import "core-js/modules/es7.symbol.async-iterator";

function listenTo(element, event) {
    let resolve = null;
    let listener = (event) => {
        if (resolve) resolve(event);
    };

    element.addEventListener(event, listener);

    return {
        [Symbol.asyncIterator]() {
            return this;
        },

        next() {
            return {
                done: false,
                value: new Promise((resolve_) => resolve = resolve_),
            };
        },

        return() {
            element.removeEventListener(event, listener);
        }
    };
}

async function* downloadClicks() {
    for await (const event of listenTo(document.documentElement, "click")) {
        if (event.target.matches("[data-download]")) {
            yield event.target.getAttribute("data-download");
        }
    }
}

async function downloadAll() {
    for await (const url of downloadClicks()) {
        console.log("Download", url);
    }
}

downloadAll().catch((e) => console.error(e.stack));



document.body.insertAdjacentHTML(
    "beforeEnd",
    `
    <button type="button" data-download="foo">Download foo!</button>
    `,
);
