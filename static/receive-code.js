const redirectURI = window.location.origin + "/receive-code";

const requestDetailsForm = document.querySelector("#request-details-form");

async function sendTokenRequest() {
    const { tokenEndpoint, clientID, clientSecret, includeCredentialsInBody } = Object.fromEntries(new FormData(requestDetailsForm).entries());
    const code = getCodeFromLocation();

    displayLoadingTokenResponseInfo();

    let response;
    try {
        response = await fetch("/request-tokens", {
            method: "POST",
            body: JSON.stringify({
                tokenEndpoint,
                clientID,
                clientSecret,
                includeCredentialsInBody: includeCredentialsInBody === "on",
                code,
                redirectURI,
            }),
        })
    } catch {
        displayErrorTokenResponseInfo();
        return;
    }

    if (!response.ok) {
        displayErrorTokenResponseInfo();
        return;
    }

    const responseData = await response.json();
    displayTokenResponseInfo(responseData);
}

function getCodeFromLocation() {
    const params = new URLSearchParams(window.location.search);
    let code;
    for (const [key, value] of params.entries()) {
        if (key === "code") {
            code = value;
            break;
        }
    }
    return code;
}

const tokenResponseDisplay = document.querySelector("#token-response-display");

function displayLoadingTokenResponseInfo() {
    tokenResponseDisplay.innerHTML = "";
    tokenResponseDisplay.appendChild(document.createTextNode("Loading..."));
}

function displayErrorTokenResponseInfo() {
    tokenResponseDisplay.innerHTML = "";
    tokenResponseDisplay.appendChild(document.createTextNode("Error encountered."));
}

function displayTokenResponseInfo(tokenResponseData) {
    tokenResponseDisplay.innerHTML = "";

    tokenResponseDisplay.appendChild(document.createTextNode("Response:"));

    const table = document.createElement("table");
    const tableHeader = document.createElement("thead");
    const tableHeaderRow = document.createElement("tr");
    const tableKeyColHeaderCell = document.createElement("th");
    tableKeyColHeaderCell.appendChild(document.createTextNode("Key"));
    tableHeaderRow.appendChild(tableKeyColHeaderCell);
    const tableValueColHeaderCell = document.createElement("th");
    tableValueColHeaderCell.appendChild(document.createTextNode("Value"));
    tableHeaderRow.appendChild(tableValueColHeaderCell);
    tableHeader.appendChild(tableHeaderRow);
    table.appendChild(tableHeader);

    const tableBody = document.createElement("tbody");
    for (const [key, value] of Object.entries(tokenResponseData)) {
        const row = document.createElement("tr");

        const keyCell = document.createElement("td");
        const keyCellEl = document.createElement("code");
        keyCellEl.appendChild(document.createTextNode(key));
        keyCell.appendChild(keyCellEl);
        row.appendChild(keyCell);

        const valueCell = document.createElement("td");
        const valueCellEl = document.createElement("code");
        valueCellEl.appendChild(document.createTextNode(value));
        valueCell.appendChild(valueCellEl);
        row.appendChild(valueCell);

        tableBody.appendChild(row);
    }
    table.appendChild(tableBody);
    tokenResponseDisplay.appendChild(table);

    tokenResponseDisplay.appendChild(document.createElement("hr"));

    const timestampDisplay = document.createElement("div");
    timestampDisplay.appendChild(document.createTextNode(`Received at: ${new Date().toISOString()}`));
    tokenResponseDisplay.appendChild(timestampDisplay);
}

function main() {
    displayReceivedCode();
}

function displayReceivedCode() {
    const code = getCodeFromLocation();
    const codeDisplay = document.querySelector("#code-display");
    codeDisplay.innerHTML = "";
    codeDisplay.appendChild(document.createTextNode(code));
}

main();