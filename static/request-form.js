const requestParamsTable = document.querySelector("#request-parameters-table");

let paramCount = 0;

function addRequestParam(key, value) {
    const row = document.createElement("div");
    row.classList.add("table-row");
    requestParamsTable.appendChild(row);
    paramCount++;

    row.appendChild(getRequestParamCell("Key", key));
    row.appendChild(getRequestParamCell("Value", value));
}

function getRequestParamCell(cellType, value) {
    const cell = document.createElement("div")
    cell.classList.add("table-cell");

    const input = document.createElement("input");
    input.type = "text";
    input.name = `parameter${cellType}${paramCount}`
    if (!!value) {
        input.value = value;
    }
    cell.appendChild(input);

    return cell;
}

const requestDetailsForm = document.querySelector("#request-details-form");
const linkContainer = document.querySelector("#link-container");
const redirectURI = window.location.origin + "/receive-code";

function generateLink() {
    const formValues = Object.fromEntries(new FormData(requestDetailsForm).entries());

    const urlParams = [];
    const formKeys = Object.keys(formValues);
    for (let i = 0; i < formKeys.length; i++) {
        const key = formKeys[i];
        const match = key.match(/parameterKey(\d+)/);
        if (!match) {
            continue
        }

        const paramName = formValues[key];
        const paramNum = match[1];
        const paramValue = formValues[`parameterValue${paramNum}`];
        if (paramName === "" || paramValue === "") {
            continue;
        }
        urlParams.push([paramName, paramValue]);
    }

    urlParams.push([formValues.redirectKeyName, redirectURI]);

    const requestURL = formValues.authorizationEndpoint + "?" + new URLSearchParams(urlParams).toString();
    const link = document.createElement("a");
    link.href = requestURL;
    link.target = "_blank"
    link.rel = "noopener noreferrer"
    link.appendChild(document.createTextNode("Make request"));
    linkContainer.replaceChildren(link);
}

function main() {
    displayRedirectURI();
    addDefaultRequestParams();
}

const redirectDisplay = document.querySelector("#redirect-uri-display");

function displayRedirectURI() {
    redirectDisplay.innerHTML = "";
    redirectDisplay.appendChild(document.createTextNode(redirectURI));
}

function addDefaultRequestParams() {
    addRequestParam("response_type", "code");
    addRequestParam("state", "strong");
    addRequestParam("client_id", "");
    addRequestParam("scope", "");
}

main();