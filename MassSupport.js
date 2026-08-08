// made by Costache Madalin (lllll llll)
// discord: costache madalin#8472
// original by Costache • optimized by amc

function isMassSupportPage() {
    const params = new URLSearchParams(window.location.search);
    return params.get("screen") === "place" && params.get("mode") === "call";
}

function getCurrentVillageId() {
    const params = new URLSearchParams(window.location.search);

    return (
        params.get("village") ||
        params.get("target") ||
        (
            typeof game_data !== "undefined" &&
            game_data.village &&
            game_data.village.id
                ? game_data.village.id
                : null
        )
    );
}

function redirectToMassSupport() {
    const villageId = getCurrentVillageId();

    if (!villageId) {
        alert("This script must be run from Rally point -> Mass support, but the village id could not be detected.");
        return;
    }

    window.location.href =
        game_data.link_base_pure +
        "place&mode=call&target=" +
        encodeURIComponent(villageId);
}

if (!isMassSupportPage()) {
    redirectToMassSupport();
    throw new Error("Redirecting to Rally point -> Mass support.");
}

let url = window.location.href;
var heavyCav = 6;

var units = game_data.units;
var unitsLength = units.length;

if (units.includes("snob")) {
    unitsLength--;
}

if (units.includes("militia")) {
    unitsLength--;
}

if (units.includes("knight")) {
    unitsLength--;
}

units = Array.from(game_data.units.slice()).filter(value => {
    return value != "snob" && value != "militia" && value != "knight";
});

var troupesPop = {
    spear: 1,
    sword: 1,
    axe: 1,
    archer: 1,
    spy: 2,
    light: 4,
    marcher: 5,
    heavy: 6,
    ram: 5,
    catapult: 8,
    knight: 10,
    snob: 100
};

troupesPop.heavy = heavyCav;

var keepTroopsHome = 21;

var textColor = "#2b1b08";
var widthInterface = game_data.device != "desktop" ? 98 : 50;

function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

function addCssStyle() {
    document.getElementById("support_sender_css")?.remove();

    const cssStyle = `
        #div_container.scriptContainer {
            width: ${widthInterface}%;
            height: auto !important;
            min-height: unset !important;
            aspect-ratio: auto !important;
            background: #f1e3bd;
            border: 1px solid #c9ab72;
            border-radius: 10px;
            box-shadow: 0 8px 24px rgba(59,38,13,.25), 0 2px 6px rgba(59,38,13,.15);
            cursor: move;
            z-index: 99999;
            font-family: Verdana, Arial, sans-serif;
            color: #2b1b08;
            overflow: hidden !important;
            transition: box-shadow .2s ease;
        }

        #div_container .scriptHeader {
            background: linear-gradient(to bottom, #8a5a24, #7b4a18);
            color: #f9e7b7;
            border-bottom: none;
            min-height: 36px;
            display: flex;
            justify-content: center;
            align-items: center;
            text-shadow: 1px 1px 1px rgba(0,0,0,.4);
            position: relative;
        }

        #div_container .scriptHeader h2 {
            font-size: 14px;
            margin: 0;
            letter-spacing: .3px;
            line-height: normal;
            font-weight: bold;
        }

        #div_container .scriptHeader a img {
            opacity: .85;
            transition: opacity .15s ease, transform .15s ease;
            border-radius: 5px;
        }

        #div_container .scriptHeader a:hover img {
            opacity: 1;
            transform: scale(1.08);
        }

        #div_container .scriptFooter {
            background: #e9d7a8;
            color: #6b4a1e;
            border-top: 1px solid #d4bb84;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding: 4px 12px;
            min-height: 20px;
            box-sizing: border-box;
            text-shadow: none;
        }

        #div_container .scriptFooter h5 {
            margin: 0;
            font-size: 10px;
            line-height: 16px;
            font-weight: normal;
            color: #8a6a35;
            white-space: nowrap;
            letter-spacing: .2px;
        }

        #div_container #div_body {
            background: #f1e3bd;
            padding: 10px 10px 8px;
            height: auto !important;
            overflow: visible !important;
        }

        #div_container .scriptTable {
            width: 100%;
            margin: 0 auto;
            border-collapse: separate;
            border-spacing: 0 3px;
            table-layout: fixed;
            border: none;
            background: transparent;
        }

        #div_container .scriptTable td {
            border: none;
            padding: 7px 5px;
            text-align: center;
            color: #2b1b08;
            font-size: 12px;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        #div_container .scriptTable tr:not(:first-child) {
            background: #f8efd6;
            box-shadow: 0 1px 2px rgba(59,38,13,.08);
        }

        #div_container .scriptTable tr:not(:first-child) td:first-child {
            border-radius: 6px 0 0 6px;
        }

        #div_container .scriptTable tr:not(:first-child) td:last-child {
            border-radius: 0 6px 6px 0;
        }

        #div_container .scriptTable tr:nth-child(odd):not(:first-child) {
            background: #f2e4bf;
        }

        #div_container .scriptTable tr:first-child td {
            background: #dcc48c;
            color: #4a3210;
            font-weight: bold;
            text-shadow: none !important;
            border-radius: 6px;
            font-size: 11px;
            letter-spacing: .3px;
            text-transform: uppercase;
            padding: 5px;
        }

        #div_container .scriptTable tr:not(:first-child):hover {
            background: #fbeecb;
            box-shadow: 0 2px 5px rgba(59,38,13,.15);
        }

        #div_container #table_upload td,
        #div_container #table_upload center,
        #div_container #table_upload font,
        #div_container #table_upload center font,
        #div_container #table_upload td font {
            color: #2b1b08 !important;
        }

        #div_container .scriptInput,
        #div_container input[type="number"],
        #div_container input[type="text"],
        #div_container input[type="datetime-local"],
        #div_container select {
            width: 70%;
            background: #fffcf3;
            color: #2b1b08;
            border: 1px solid #d4bb84;
            border-radius: 5px;
            padding: 3px 6px;
            text-align: center;
            font-size: 12px;
            box-shadow: inset 0 1px 2px rgba(59,38,13,.08);
            box-sizing: border-box;
            transition: border-color .15s ease, box-shadow .15s ease;
        }

        #div_container .scriptInput:focus,
        #div_container input[type="number"]:focus,
        #div_container input[type="text"]:focus,
        #div_container input[type="datetime-local"]:focus {
            outline: none;
            border-color: #a97c37;
            box-shadow: 0 0 0 2px rgba(169,124,55,.25);
        }

        #div_container input:disabled {
            background: #eadfc0;
            color: #8a7248;
            border-color: #ddcda1;
        }

        #div_container input[type="checkbox"] {
            vertical-align: middle;
            accent-color: #8a5a24;
        }

        #div_container button.btn,
        #div_container input[type="button"].btn {
            background: linear-gradient(to bottom, #eec978, #cc9a44);
            border: 1px solid #a97c37;
            color: #3a2410;
            font-weight: bold;
            border-radius: 6px;
            padding: 5px 14px;
            font-size: 12px;
            cursor: pointer;
            box-shadow: 0 1px 2px rgba(59,38,13,.2), inset 0 1px rgba(255,255,255,.4);
            transition: transform .1s ease, box-shadow .15s ease, background .15s ease;
            margin: 2px;
        }

        #div_container button.btn:hover,
        #div_container input[type="button"].btn:hover {
            background: linear-gradient(to bottom, #f8dd9a, #dcae55);
            box-shadow: 0 2px 5px rgba(59,38,13,.28), inset 0 1px rgba(255,255,255,.5);
        }

        #div_container button.btn:active,
        #div_container input[type="button"].btn:active {
            transform: translateY(1px);
            box-shadow: 0 1px 1px rgba(59,38,13,.2), inset 0 1px rgba(255,255,255,.3);
        }

        #div_container img {
            vertical-align: middle;
        }
    `;

    const style = document.createElement("style");
    style.id = "support_sender_css";
    style.type = "text/css";
    style.appendChild(document.createTextNode(cssStyle));
    document.head.appendChild(style);
}

function main() {
    addCssStyle();
    createMainInterface();
    addEvents();
}

main();

function createMainInterface() {
    let rowsSpawnButtons = (game_data.units.includes("archer") == true) ? 7 : 6;
    let rowsSpawnDatetimes = (game_data.units.includes("archer") == true) ? 4 : 3;

    let html = `
    <div id="div_container" class="scriptContainer">
        <div class="scriptHeader">
            <div><h2>Support sender</h2></div>
            <div style="position:absolute;top:50%;right:10px;transform:translateY(-50%);">
                <a href="#" onclick="$('#div_container').remove()">
                    <img src="https://img.icons8.com/emoji/24/000000/cross-mark-button-emoji.png"/>
                </a>
            </div>
            <div style="position:absolute;top:50%;right:35px;" id="div_minimize">
                <a href="#" style="display:block;transform:translateY(-50%);">
                    <img src="https://img.icons8.com/plasticine/28/000000/minimize-window.png"/>
                </a>
            </div>
        </div>

        <div id="div_body">
            <table id="table_upload" class="scriptTable"> 
                <tr>
                    <td>troops</td>`;

    for (let i = 0; i < units.length; i++) {
        if (
            units[i] != "knight" &&
            units[i] != "snob" &&
            units[i] != "militia" &&
            units[i] != "axe" &&
            units[i] != "light" &&
            units[i] != "ram" &&
            units[i] != "catapult" &&
            units[i] != "marcher"
        ) {
            html += `<td class="fm_unit"><img src="https://dsen.innogamescdn.com/asset/1d2499b/graphic/unit/unit_${units[i]}.png"></td>`;
        }
    }

    html += `
                    <td>pop</td>
                </tr>
                <tr id="totalTroops">
                    <td>total</td>`;

    for (let i = 0; i < units.length; i++) {
        if (
            units[i] != "knight" &&
            units[i] != "snob" &&
            units[i] != "militia" &&
            units[i] != "axe" &&
            units[i] != "light" &&
            units[i] != "ram" &&
            units[i] != "catapult" &&
            units[i] != "marcher"
        ) {
            html += `
                    <td>
                        <input id="${units[i]}total" value="0" type="text" class="totalTroops scriptInput" disabled>
                        <font color="${textColor}" class="hideMobile">k</font>
                    </td>`;
        }
    }

    html += `
                    <td>
                        <input id="packets_total" value="0" type="text" class="scriptInput" disabled>
                        <font color="${textColor}" class="hideMobile">k</font>
                    </td>  
                </tr>
                <tr id="sendTroops">
                    <td>send</td>`;

    for (let i = 0; i < units.length; i++) {
        if (
            units[i] != "knight" &&
            units[i] != "snob" &&
            units[i] != "militia" &&
            units[i] != "axe" &&
            units[i] != "light" &&
            units[i] != "ram" &&
            units[i] != "catapult" &&
            units[i] != "marcher"
        ) {
            html += `
                    <td align="center">
                        <input id="${units[i]}total" value="0" type="number" class="scriptInput sendTroops">
                        <font color="${textColor}" class="hideMobile">k</font>
                    </td>`;
        }
    }

    html += `
                    <td align="center">
                        <input id="packets_send" value="0" type="number" class="scriptInput">
                        <font color="${textColor}" class="hideMobile">k</font>
                    </td> 
                </tr>
                <tr id="reserveTroops">
                    <td>reserve</td>`;

    for (let i = 0; i < units.length; i++) {
        if (
            units[i] != "knight" &&
            units[i] != "snob" &&
            units[i] != "militia" &&
            units[i] != "axe" &&
            units[i] != "light" &&
            units[i] != "ram" &&
            units[i] != "catapult" &&
            units[i] != "marcher"
        ) {
            html += `
                    <td align="center">
                        <input id="${units[i]}Reserve" value="0" type="number" class="scriptInput reserveTroops">
                        <font color="${textColor}" class="hideMobile">k</font>
                    </td>`;
        }
    }

    html += `
                    <td align="center">
                        <input id="packets_reserve" value="0" type="text" class="scriptInput" disabled>
                        <font color="${textColor}" class="hideMobile">k</font>
                    </td> 
                </tr>
                <tr>
                    <td colspan="1">
                        <center>
                            <font color="${textColor}">sigil:</font>
                            <input type="number" id="flag_boost" class="scriptInput" min="0" max="100" placeholder="0" value="0" style="text-align:center">
                        </center>
                    </td>
                    <td colspan="2">
                        <center>
                            <input type="checkbox" id="checkbox_window" value="land_specific">
                            <font color="${textColor}">packets land between:</font>
                        </center>
                    </td>
                    <td colspan="${rowsSpawnDatetimes}">
                        <center style="margin:5px">start:<input type="datetime-local" id="start_window" style="text-align:center;"></center>
                        <center style="margin:5px">end: <input type="datetime-local" id="stop_window" style="text-align:center;"></center>
                    </td>   
                </tr>
                <tr>
                    <td colspan="${rowsSpawnButtons}">
                        <button type="button" class="btn evt-confirm-btn btn-confirm-yes" id="fillInputs" onclick="fillInputs()">Fill inputs</button>
                        <button type="button" class="btn evt-confirm-btn btn-confirm-yes" id="calculateInputs" onclick="countTotalTroops()">Calculate</button>
                    </td>   
                </tr>
            </table>
        </div>

        <div class="scriptFooter">
            <div><h5>original by Costache • optimized by amc</h5></div>
        </div> 
    </div>`;

    $("#div_container").remove();
    $("#contentContainer").eq(0).prepend(html);
    $("#mobileContent").eq(0).prepend(html);

    $("#div_container").css("position", "fixed");
    $("#div_container").draggable();

    $("#div_minimize").on("click", () => {
        let currentWidthPercentage = Math.ceil($('#div_container').width() / $('body').width() * 100);

        if (currentWidthPercentage >= widthInterface) {
            $('#div_container').css({ 'width': '10%' });
            $('#div_body').hide();
        } else {
            $('#div_container').css({ 'width': `${widthInterface}%` });
            $('#div_body').show();
        }
    });

    if (localStorage.getItem(game_data.world + "support_sender_settings2") != null) {
        let list_checkbox = JSON.parse(localStorage.getItem(game_data.world + "support_sender_settings2"))[0];

        $('#table_upload input[type=checkbox]').each(function (index, elem) {
            this.checked = list_checkbox[index];
        });

        let list_input = JSON.parse(localStorage.getItem(game_data.world + "support_sender_settings2"))[1];

        $('#table_upload input').each(function (index, elem) {
            this.value = list_input[index];
        });

        $('.totalTroops').each(function (index, elem) {
            console.log(elem);
            this.value = 0;
        });

        $("#packets_total").val(0);
    }

    $("#table_upload input[type=checkbox], #table_upload input").on("click input change", () => {
        countTotalTroops();

        let list_checkbox = [];
        let list_input = [];

        $('#table_upload input[type=checkbox]').each(function () {
            var checked = this.checked;
            list_checkbox.push(checked);
        });

        $('#table_upload input').each(function () {
            var value = this.value;
            list_input.push(value);
        });

        let list_final = [list_checkbox, list_input];
        let data = JSON.stringify(list_final);
        let data_localStorage = localStorage.getItem(game_data.world + "support_sender_settings2");

        console.log(data);
        console.log(data_localStorage);

        if (data != data_localStorage) {
            localStorage.setItem(game_data.world + "support_sender_settings2", data);
        }
    });

    if (game_data.device != "desktop") {
        $(".hideMobile").hide();
        $("#table_upload").find("input[type=text]").css("width", "100%");
    }
}

function countTotalTroops() {
    let dateStart = new Date();
    let dateStop = new Date();

    dateStart.setFullYear(dateStart.getFullYear() - 1);
    dateStop.setFullYear(dateStop.getFullYear() + 1);

    let sigil = 0;
    let timeWindow = document.getElementById("checkbox_window").checked;

    if (timeWindow) {
        dateStart = new Date(document.getElementById("start_window").value);
        dateStop = new Date(document.getElementById("stop_window").value);
        sigil = parseInt(document.getElementById("flag_boost").value);

        if (dateStart == "Invalid Date") {
            UI.ErrorMessage("start date has an invalid format", 2000);
        }

        if (dateStop == "Invalid Date") {
            UI.ErrorMessage("stop date has an invalid format", 2000);
        }

        sigil = (Number.isNaN(sigil) == true) ? 0 : sigil;
    }

    let mapVillages = new Map();

    let coordDestination;

    if (game_data.device == "desktop") {
        coordDestination = $(".village-name").text().match(/\d+\|\d+/)[0];
    } else {
        coordDestination = $("#inputx").val() + "|" + $("#inputy").val();
    }

    let speedWorld = getSpeedConstant().worldSpeed;
    let speedTroupes = getSpeedConstant().unitSpeed;

    let speedTroop = {
        snob: 2100 * 1000 / (speedWorld * speedTroupes),
        ram: 1800 * 1000 / (speedWorld * speedTroupes),
        catapult: 1800 * 1000 / (speedWorld * speedTroupes),
        sword: 1320 * 1000 / (speedWorld * speedTroupes),
        axe: 1080 * 1000 / (speedWorld * speedTroupes),
        spear: 1080 * 1000 / (speedWorld * speedTroupes),
        archer: 1080 * 1000 / (speedWorld * speedTroupes),
        heavy: 660 * 1000 / (speedWorld * speedTroupes),
        light: 600 * 1000 / (speedWorld * speedTroupes),
        marcher: 600 * 1000 / (speedWorld * speedTroupes),
        knight: 600 * 1000 / (speedWorld * speedTroupes),
        spy: 540 * 1000 / (speedWorld * speedTroupes)
    };

    Array.from($("#village_troup_list tbody tr")).forEach(row => {
        let coord = row.children[0].innerText.match(/\d+\|\d+/)[0];
        let distance = calcDistance(coord, coordDestination);

        let objTroops = {
            distance: distance
        };

        units.forEach(troopName => {
            let totalTroops = parseInt($(row).find(`[data-unit='${troopName}']`).text());
            let reserveTroops = parseFloat($(`#${troopName}Reserve`).val());

            reserveTroops = (reserveTroops == undefined || Number.isNaN(reserveTroops) == true) ? 0 : reserveTroops * 1000;

            totalTroops = (totalTroops > reserveTroops) ? totalTroops - reserveTroops : 0;

            let timeTroop = speedTroop[troopName] * distance;
            timeTroop = timeTroop / (1 + sigil / 100.0);

            let serverTime = document.getElementById("serverTime").innerText;
            let serverDate = document.getElementById("serverDate").innerText.split("/");

            serverDate = serverDate[1] + "/" + serverDate[0] + "/" + serverDate[2];

            let date_current = new Date(serverDate + " " + serverTime);
            date_current = new Date(date_current.getTime() + timeTroop);

            if (totalTroops > 0 && dateStart.getTime() < date_current.getTime() && date_current.getTime() < dateStop.getTime()) {
                objTroops[troopName + "_speed"] = troopName;
            }

            objTroops[troopName] = totalTroops;

            if (timeWindow == false) {
                delete objTroops.ram;
                delete objTroops.catapult;
                delete objTroops.ram_speed;
                delete objTroops.catapult_speed;
            }
        });

        mapVillages.set(coord, objTroops);
    });

    let objTroopsTotal = {
        spear: 0,
        sword: 0,
        archer: 0,
        spy: 0,
        heavy: 0,
        totalPop: 0
    };

    Array.from(mapVillages.keys()).forEach(key => {
        let obj = mapVillages.get(key);

        if (obj["ram_speed"] != undefined || obj["catapult_speed"] != undefined || obj["sword_speed"] != undefined) {
            objTroopsTotal.spear += obj.spear;
            objTroopsTotal.sword += obj.sword;
            objTroopsTotal.spy += obj.spy;
            objTroopsTotal.heavy += obj.heavy;

            if (obj.archer != undefined) {
                objTroopsTotal.archer += obj.archer;
            }
        } else if (obj["spear_speed"] != undefined || obj["archer_speed"] != undefined) {
            objTroopsTotal.spear += obj.spear;
            objTroopsTotal.heavy += obj.heavy;
            objTroopsTotal.spy += obj.spy;

            if (obj.archer != undefined) {
                objTroopsTotal.archer += obj.archer;
            }
        } else if (obj["heavy_speed"] != undefined) {
            objTroopsTotal.heavy += obj.heavy;
            objTroopsTotal.spy += obj.spy;
        } else if (obj["spy_speed"] != undefined) {
            objTroopsTotal.spy += obj.spy;
        }
    });

    if (!game_data.units.includes("archer")) {
        delete objTroopsTotal.archer;
    }

    let totalPop = 0;

    console.log(objTroopsTotal);

    Object.keys(objTroopsTotal).forEach(key => {
        if (key == "spear" || key == "sword" || key == "archer" || key == "spy" || key == "heavy") {
            if (units.includes(key)) {
                document.getElementById(key + "total").value = (objTroopsTotal[key] / 1000).toFixed(2);
            }
        }

        if (key == "spear" || key == "sword" || key == "archer") {
            totalPop += objTroopsTotal[key];
        } else if (key == "heavy") {
            totalPop += objTroopsTotal[key] * heavyCav;
        }
    });

    console.log(objTroopsTotal);
    console.log("totalPop: " + totalPop);

    document.getElementById("packets_total").value = (totalPop / 1000).toFixed(2);

    addEvents();

    console.log(mapVillages);

    return mapVillages;
}

function fillInputs() {
    let mapVillages = countTotalTroops();
    let listTotal = [];

    let troopsTotal = Array.from(document.getElementsByClassName("totalTroops")).map(e => parseFloat(e.value) * 1000);

    let sendTotalObj = {};

    let sendTotal = Array.from(document.getElementsByClassName("sendTroops")).map(e => ({
        value: (Number.isNaN(parseFloat(e.value) * 1000) ? 0 : parseFloat(e.value) * 1000),
        troopName: e.id.replace("total", "")
    }));

    sendTotal.forEach(e => {
        sendTotalObj[e.troopName] = e.value;
    });

    console.log(sendTotal);

    for (let i = 0; i < troopsTotal.length; i++) {
        if (troopsTotal[i] < sendTotal[i].value) {
            alert("wrong input\n not enough troops");
            return;
        }
    }

    let checkbox = document.getElementById("village_troup_list").children[0].children[0].getElementsByTagName("input");

    for (let i = 0; i < checkbox.length - 1; i++) {
        let id = checkbox[i].id.split("_")[1];

        console.log(id);

        let troops = ["spear", "sword", "archer", "spy", "heavy", "ram", "catapult"];

        if (troops.includes(id)) {
            checkbox[i].checked = true;
        } else {
            checkbox[i].checked = false;
        }
    }

    document.getElementById("place_call_select_all").click();
    $("#village_troup_list").find("input[type=number]:visible").val(0);

    Array.from(mapVillages.keys()).forEach(key => {
        let obj = mapVillages.get(key);

        let objTotal = {
            coord: key
        };

        if (obj.ram_speed != undefined) {
            objTotal.ram = 1;
            objTotal.catapult = 0;
            objTotal.sword = (sendTotalObj["sword"] > 0) ? obj.sword : 0;
            objTotal.spear = (sendTotalObj["spear"] > 0) ? obj.spear : 0;
            objTotal.heavy = (sendTotalObj["heavy"] > 0) ? obj.heavy : 0;
            objTotal.spy = (sendTotalObj["spy"] > 0) ? obj.spy : 0;
            objTotal.speedTroop = "ram";

            if (obj.archer != undefined) {
                objTotal.archer = (sendTotalObj["archer"] > 0) ? obj.archer : 0;
            }
        } else if (obj.catapult_speed != undefined) {
            console.log(sendTotalObj);

            objTotal.ram = 0;
            objTotal.catapult = 1;
            objTotal.sword = (sendTotalObj["sword"] > 0) ? obj.sword : 0;
            objTotal.spear = (sendTotalObj["spear"] > 0) ? obj.spear : 0;
            objTotal.heavy = (sendTotalObj["heavy"] > 0) ? obj.heavy : 0;
            objTotal.spy = (sendTotalObj["spy"] > 0) ? obj.spy : 0;
            objTotal.speedTroop = "catapult";

            if (obj.archer != undefined) {
                objTotal.archer = (sendTotalObj["archer"] > 0) ? obj.archer : 0;
            }
        } else if (obj.sword_speed != undefined) {
            objTotal.ram = 0;
            objTotal.catapult = 0;
            objTotal.sword = (sendTotalObj["sword"] > 0) ? obj.sword : 0;
            objTotal.spear = (sendTotalObj["spear"] > 0) ? obj.spear : 0;
            objTotal.heavy = (sendTotalObj["heavy"] > 0) ? obj.heavy : 0;
            objTotal.spy = (sendTotalObj["spy"] > 0) ? obj.spy : 0;
            objTotal.speedTroop = "sword";

            if (obj.archer != undefined) {
                objTotal.archer = (sendTotalObj["archer"] > 0) ? obj.archer : 0;
            }
        } else if (obj.spear_speed != undefined) {
            objTotal.ram = 0;
            objTotal.catapult = 0;
            objTotal.sword = 0;
            objTotal.spear = (sendTotalObj["spear"] > 0) ? obj.spear : 0;
            objTotal.heavy = (sendTotalObj["heavy"] > 0) ? obj.heavy : 0;
            objTotal.spy = (sendTotalObj["spy"] > 0) ? obj.spy : 0;
            objTotal.speedTroop = "spear";

            if (obj.archer != undefined) {
                objTotal.archer = (sendTotalObj["archer"] > 0) ? obj.archer : 0;
            }
        } else if (obj.archer_speed != undefined) {
            objTotal.ram = 0;
            objTotal.catapult = 0;
            objTotal.sword = 0;
            objTotal.spear = (sendTotalObj["spear"] > 0) ? obj.spear : 0;
            objTotal.heavy = (sendTotalObj["heavy"] > 0) ? obj.heavy : 0;
            objTotal.spy = (sendTotalObj["spy"] > 0) ? obj.spy : 0;
            objTotal.speedTroop = "archer";

            if (obj.archer != undefined) {
                objTotal.archer = (sendTotalObj["archer"] > 0) ? obj.archer : 0;
            }
        } else if (obj.heavy_speed != undefined) {
            objTotal.ram = 0;
            objTotal.catapult = 0;
            objTotal.sword = 0;
            objTotal.spear = 0;
            objTotal.spy = obj.spy;
            objTotal.speedTroop = "heavy";
            objTotal.heavy = (sendTotalObj["heavy"] > 0) ? obj.heavy : 0;

            if (obj.archer != undefined) {
                objTotal.archer = 0;
            }
        } else if (obj.spy_speed != undefined) {
            objTotal.ram = 0;
            objTotal.catapult = 0;
            objTotal.sword = 0;
            objTotal.spear = 0;
            objTotal.heavy = 0;
            objTotal.spy = (sendTotalObj["spy"] > 0) ? obj.spy : 0;
            objTotal.speedTroop = "spy";

            if (obj.archer != undefined) {
                objTotal.archer = 0;
            }
        }

        objTotal.axe = 0;
        objTotal.light = 0;

        if (obj.marcher != undefined) {
            objTotal.marcher = 0;
        }

        listTotal.push(objTotal);
    });

    console.log(listTotal);

    let listTotalRange = [];

    listTotal.forEach(row => {
        if (row.speedTroop != undefined) {
            listTotalRange.push(row);
        }
    });

    let factorTroopSent = {};

    sendTotal.forEach(elem => {
        factorTroopSent[elem.troopName] = elem.value / listTotalRange.length;
    });

    console.log(factorTroopSent);

    let mapResult = new Map();

    Object.keys(factorTroopSent).forEach(troopName => {
        let factorValue = factorTroopSent[troopName];

        listTotalRange.sort((o1, o2) => {
            return o1[troopName] > o2[troopName] ? 1 : o1[troopName] < o2[troopName] ? -1 : 0;
        });

        console.log(listTotalRange);

        for (let i = 0; i < listTotalRange.length; i++) {
            let troopValue = listTotalRange[i][troopName];

            if (troopValue < factorValue) {
                let redistribute = factorValue - troopValue;
                factorValue += redistribute / (listTotalRange.length - i - 1);
                listTotalRange[i][troopName] = troopValue;
            } else {
                let module = factorValue % parseInt(factorValue);

                if (listTotalRange[i][troopName] + 1 > factorValue) {
                    let randomValue = (Math.random() < module) ? 1 : 0;
                    listTotalRange[i][troopName] = parseInt(factorValue) + randomValue;
                } else {
                    listTotalRange[i][troopName] = factorValue;
                    console.log(`troop name ${troopName}, value: ${listTotalRange[i][troopName]}`);
                }
            }

            let timeWindow = document.getElementById("checkbox_window").checked;

            if (listTotalRange[i]["speedTroop"] == troopName && listTotalRange[i][troopName] == 0 && timeWindow == true) {
                listTotalRange[i][troopName] = 1;
            }

            if (timeWindow == false) {
                listTotalRange[i]["ram"] = 0;
                listTotalRange[i]["catapult"] = 0;
            }

            mapResult.set(listTotalRange[i].coord, listTotalRange[i]);
        }
    });

    console.log(mapResult);

    let table = Array.from($(".overview_table .selected"));

    table.forEach(row => {
        let coord = row.children[0].innerText.match(/\d+\|\d+/).pop();

        if (mapResult.has(coord)) {
            let obj = mapResult.get(coord);

            console.log(obj);

            let totalTroopCount = 0;

            Object.keys(obj).forEach(troopName => {
                if (troopName != "speedTroop" && troopName != "coord") {
                    totalTroopCount += obj[troopName];
                }
            });

            if (totalTroopCount > 1) {
                Object.keys(obj).forEach(troopName => {
                    if (troopName != "speedTroop") {
                        let value = obj[troopName];
                        $(row).find(`.call-unit-box-${troopName}`).val(value);
                    }
                });
            }
        }
    });
}

function addEvents() {
    $('.sendTroops').on('input', function (e) {
        let sendTotal = document.getElementsByClassName("sendTroops");
        let totalPop = 0;

        for (let i = 0; i < sendTotal.length; i++) {
            let id = sendTotal[i].id;
            let value = (sendTotal[i].value == "") ? 0 : sendTotal[i].value;

            if (id.includes("spear") || id.includes("sword") || id.includes("archer")) {
                totalPop += parseFloat(value) * 1000;
            }

            if (id.includes("heavy")) {
                totalPop += parseFloat(value) * 1000 * heavyCav;
            }
        }

        document.getElementById("packets_send").value = (totalPop / 1000).toFixed(2);
    });

    $('#packets_send').on('input', function (e) {
        let needTroops = parseFloat(document.getElementById("packets_send").value);
        let totalPop = parseFloat(document.getElementById("packets_total").value);
        let sendTotal = document.getElementsByClassName("sendTroops");
        let totalTroops = document.getElementsByClassName("totalTroops");

        console.log(needTroops);
        console.log(totalPop);

        let ratio = needTroops / totalPop;

        console.log(ratio);

        for (let i = 0; i < totalTroops.length; i++) {
            let id = sendTotal[i].id;

            if (!id.includes("spy")) {
                sendTotal[i].value = parseInt(parseFloat(totalTroops[i].value) * ratio * 100) / 100.0;
            } else {
                sendTotal[i].value = 0;
            }
        }
    });
}

function calcDistance(coord1, coord2) {
    let x1 = parseInt(coord1.split("|")[0]);
    let y1 = parseInt(coord1.split("|")[1]);
    let x2 = parseInt(coord2.split("|")[0]);
    let y2 = parseInt(coord2.split("|")[1]);

    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

function getSpeedConstant() {
    if (localStorage.getItem(game_data.world + "speedWorld") !== null) {
        let obj = JSON.parse(localStorage.getItem(game_data.world + "speedWorld"));
        console.log("speed world already exist");
        return obj;
    } else {
        let data = httpGet("/interface.php?func=get_config");
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(data, "text/html");

        let obj = {};
        let worldSpeed = Number(htmlDoc.getElementsByTagName("speed")[0].innerHTML);
        let unitSpeed = Number(htmlDoc.getElementsByTagName("unit_speed")[0].innerHTML);

        obj.unitSpeed = unitSpeed;
        obj.worldSpeed = worldSpeed;

        localStorage.setItem(game_data.world + "speedWorld", JSON.stringify(obj));

        console.log("save speed world");

        return obj;
    }
}
