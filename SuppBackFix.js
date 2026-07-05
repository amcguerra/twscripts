var countApiKey = "support_withdrawal";
var countNameSpace="madalinoTribalWarsScripts"

var troopsPop = {
    spear : 1,
    sword : 1,
    axe : 1,
    archer : 1,
    spy : 2,
    light : 4,
    marcher : 5,
    heavy : 6,
    ram : 5,
    catapult : 8,
    knight : 10,
    snob : 100,
    militia: 1
};
troopsPop.heavy=heavyCav


var units=game_data.units;
var unitsLength=units.length;
if(units.includes("snob"))
    unitsLength--;
if(units.includes("militia"))
    unitsLength--;
if(units.includes("knight"))
    unitsLength--;

units = Array.from(game_data.units.slice()).filter(value =>{
    return value != "snob" && value != "militia" && value != "knight"
})

if(!window.location.href.includes("screen=info_village")){
    alert("this script must be run from village information page on the map");
    throw new Error("this script must be run from village information page on the map")

}

var textColor="#2b1b08"
var widthInterface=50;//percentage
if(game_data.device != "desktop"){
    widthInterface = 98
}

var dataTroops = getDataTroops()


async function main(){

    injectStyle()

    console.log(dataTroops)
    console.log(dataTroops.dataOwn)
    console.log(dataTroops.dataAllies)

    let players = dataTroops.map(elem => elem.playerName).filter(elem => elem != game_data.player.name)
    players = [...new Set(players)]
    createMainInterface(dataTroops.dataOwn,dataTroops.dataAllies, players)
    addEvents()
    addEventPanel()
    hitCountApi()


}
main()

function injectStyle(){
    const cssStyle = `
        #div_container.scriptContainer {
            width: ${widthInterface}%;
            height: auto !important;
            min-height: unset !important;
            aspect-ratio: auto !important;
            background: #f1e3bd;
            border: 2px solid #5b3a16;
            border-radius: 2px;
            box-shadow: 0 4px 14px rgba(0,0,0,.55);
            cursor: move;
            z-index: 99999;
            font-family: Verdana, Arial, sans-serif;
            color: #2b1b08;
            overflow: hidden !important;
        }
        #div_container .scriptHeader {
            background: linear-gradient(to bottom, rgba(255,255,255,.12), rgba(0,0,0,.18)), #7b4a18;
            color: #f9e7b7;
            border-bottom: 2px solid #3d260d;
            min-height: 32px;
            display: flex; justify-content: center; align-items: center;
            text-shadow: 1px 1px #000;
            position: relative;
        }
        #div_container .scriptHeader h2 { font-size: 15px; margin: 0; letter-spacing: .2px; line-height: 32px; }
        #div_container .scriptFooter {
            background: linear-gradient(to bottom, rgba(255,255,255,.08), rgba(0,0,0,.18)), #6e4215;
            color: #f9e7b7; border-top: 1px solid #3d260d;
            display: flex; justify-content: flex-end; align-items: center;
            padding: 3px 10px; min-height: 22px; box-sizing: border-box; text-shadow: 1px 1px #000;
        }
        #div_container .scriptFooter h5 {
            margin: 0; font-size: 10px; line-height: 16px; font-weight: normal; color: #f9e7b7; white-space: nowrap;
        }
        #div_container #div_body {
            background: #f1e3bd; padding: 2px 0 5px;
            max-height: 600px !important; overflow-y: auto !important; overflow-x: hidden !important;
        }

        /* tabs */
        #div_container .tab-panels { margin: 0; }
        #div_container ul.tabs {
            list-style: none; margin: 0 auto 4px; padding: 0 6px;
            display: flex; gap: 3px; border-bottom: 2px solid #5b3a16;
        }
        #div_container ul.tabs li {
            list-style: none; padding: 4px 12px; cursor: pointer;
            background: linear-gradient(to bottom, #e2cd9c, #c8a869);
            border: 1px solid #8b652b; border-bottom: none;
            border-radius: 3px 3px 0 0; margin: 0;
        }
        #div_container ul.tabs li font { color: #2b1b08 !important; font-size: 12px; font-weight: bold; }
        #div_container ul.tabs li.active {
            background: linear-gradient(to bottom, #fff4d7, #f1e3bd);
            border-bottom: 1px solid #f1e3bd; position: relative; top: 1px;
        }
        #div_container .panel { padding: 4px; }

        /* kill the original blue inner-table backgrounds */
        #div_container #panel1,
        #div_container #panel2,
        #div_container .panel,
        #div_container #all_tabs,
        #div_container .tab-panels,
        #div_container #tabs_coord {
            background: #f1e3bd !important;
        }
        #div_container #div_body > table,
        #div_container #div_body > table > tbody > tr > td {
            background: #f1e3bd !important;
        }

        /* tables */
        #div_container .scriptTable {
            width: 96%; margin: 8px auto; border-collapse: separate; border-spacing: 0;
            table-layout: fixed; border: 1px solid #b09158; background: #f6e8c4;
        }
        #div_container .scriptTable td {
            border-right: 1px solid #c4a76f; border-bottom: 1px solid #c4a76f;
            padding: 5px; text-align: center; color: #2b1b08; font-size: 12px;
            overflow: hidden; text-overflow: ellipsis; word-wrap: break-word;
        }
        #div_container .scriptTable td:last-child { border-right: none; }
        #div_container .scriptTable tr:last-child td { border-bottom: none; }
        #div_container .scriptTable tr:nth-child(odd) td { background: #ead7aa; }
        #div_container .scriptTable tr:nth-child(even) td { background: #f7ebcb; }
        #div_container .scriptTable tr:not(:first-child):hover td { background: #fff4d7; }
        #div_container .scriptTable font { color: #2b1b08 !important; }

        /* settings tables: top row holds unit icons + radios, keep it plain parchment */
        #div_container .tableSettings tr:first-child td {
            background: linear-gradient(to bottom, rgba(255,255,255,.18), rgba(0,0,0,.10)), #cdb072;
            font-weight: bold;
        }
        #div_container .tableSettings .fm_unit { padding: 2px; }
        #div_container .tableSettings .fm_unit img { width: 18px; height: 18px; }

        /* inputs */
        #div_container .scriptInput,
        #div_container input[type="number"],
        #div_container input[type="text"],
        #div_container select {
            width: 70%; background: #fffaf0; color: #2b1b08;
            border: 1px solid #8b652b; border-radius: 2px; padding: 2px 4px;
            text-align: center; font-size: 12px;
            box-shadow: inset 0 1px 2px rgba(0,0,0,.18); box-sizing: border-box;
        }
        #div_container .tableSettings .scriptInput { width: 46px; }
        #div_container input:disabled { background: #d9c79a; color: #4a3513; }
        #div_container input[type="checkbox"], #div_container input[type="radio"] { vertical-align: middle; }
        #div_container label { color: #2b1b08; font-size: 11px; }

        /* buttons */
        #div_container button.btn, #div_container input[type="button"].btn {
            background: linear-gradient(to bottom, #f8dfaa, #b78943);
            border: 1px solid #5d3912; color: #2b1b08; font-weight: bold;
            border-radius: 2px; padding: 3px 10px; font-size: 12px; cursor: pointer;
            box-shadow: inset 0 1px rgba(255,255,255,.45);
        }
        #div_container button.btn:hover, #div_container input[type="button"].btn:hover {
            background: linear-gradient(to bottom, #fff0c4, #c79748);
        }
        #div_container img { vertical-align: middle; }

        /* scrollbars */
        #div_container #div_body::-webkit-scrollbar { width: 10px; height: 10px; }
        #div_container #div_body::-webkit-scrollbar-track { background: #d9c79a; }
        #div_container #div_body::-webkit-scrollbar-thumb { background: #8b652b; border: 1px solid #5b3a16; }
    `;
    $("head").append(`<style>${cssStyle}</style>`);
}

function createMainInterface(dataOwn,dataAllies, players){
    let rowsSpawnButtons = (game_data.units.includes("archer") == true)?6:5;

    let html=`

    <div id="div_container" class="scriptContainer">
        <div class="scriptHeader">
            <div style=" margin-top:10px;"><h2>Support withdrawal</h2></div>
            <div style="position:absolute;top:10px;right: 10px;"><a href="#" onclick="$('#div_container').remove()"><img src="https://img.icons8.com/emoji/24/000000/cross-mark-button-emoji.png"/></a></div>
            <div style="position:absolute;top:8px;right: 35px;" id="div_minimize"><a href="#"><img src="https://img.icons8.com/plasticine/28/000000/minimize-window.png"/></a></div>
        </div>

        <div id="div_body">`

        //create panels
        html+=`
        <br>
        <div class="tab-panels" id="tabs_coord" >
            <ul class="tabs">
                <li class="update_tab own active" rel="panel1" ><font >Own troops </font ></li>
                <li class="update_tab own" rel="panel2" ><font >Allies troops </font ></li>
            </ul>

            <div id="all_tabs">

            <div id="panel1" class="panel active">
            <table class="scriptTable tableSettings">
                <tr>
                    <td></td>`


    for(let i=0;i<units.length;i++){
        if(units[i]!="knight" && units[i]!="snob" && units[i]!="militia" && units[i]!="axe" && units[i]!="light" && units[i]!="ram" && units[i]!="catapult" && units[i]!="marcher"){
            html+=`<td class="fm_unit"><img src="https://dsen.innogamescdn.com/asset/1d2499b/graphic/unit/unit_${units[i]}.png"></td>`
        }
    }
    html+=`
                <td >pop</td>
            </tr>
            <tr id="totalTroops"
            >
                <td>Troops</td>
            `;

    for(let i=0;i<units.length;i++){
        if(units[i]!="knight" && units[i]!="snob" && units[i]!="militia" && units[i]!="axe" && units[i]!="light" && units[i]!="ram" && units[i]!="catapult" && units[i]!="marcher"){
            html+=` <td>
                        <input id="`+units[i]+`total" value="0" type="text"  class="totalTroops scriptInput"  disabled>
                        <font color="${textColor}" class="hideMobile">k</font>
                    </td>  `
        }
    }
    html+=`
                <td>
                    <input id="packets_total" value="0" type="text" class="scriptInput "  disabled>
                <font color="${textColor}" class="hideMobile">k</font>
                </td>
            </tr>
            <tr id="leaveTroops">
                <td>
                    <div style="display: flex; justify-content: space-between;flex-wrap:wrap;width:100px ">
                        <div>
                            <input type="radio" id="id_withdraw" name="typeAction" value="withdraw" checked>
                            <label for="withdraw">Withdraw</label>
                        </div>
                        <div>
                            <input type="radio" id="id_leave" name="typeAction" value="leave">
                            <label for="leave">Leave</label>
                        </div>
                    </div>
                </td>`;for(let i=0;i<units.length;i++){
        if(units[i]!="knight" && units[i]!="snob" && units[i]!="militia" && units[i]!="axe" && units[i]!="light" && units[i]!="ram" && units[i]!="catapult" && units[i]!="marcher"){
                html+=`
                        <td align="center" >
                            <input id="`+units[i]+`total" value="0" type="number"   class="scriptInput leaveTroops" >
                            <font color="${textColor}" class="hideMobile">k</font>
                        </td>  `
        }
    }
    html+=`
                <td align="center" >
                    <input id="packets_leave" value="0" type="number" class="scriptInput"  >
                    <font color="${textColor}" class="hideMobile">k</font>
                </td>
            </tr>`




    html+=`
            <tr>
                <td>
                    <div style="display: flex; justify-content: space-between;flex-wrap:wrap;width:100px ">
                        <div>
                            <input type="radio" id="id_even_spread" name="typeWithdraw" value="even" checked>
                            <label for="even">Even spread</label>
                        </div>
                        <div>
                            <input type="radio" id="id_closest_first" name="typeWithdraw" value="closest">
                            <label for="closest">Closest first</label>
                        </div>
                    </div>
                </td>
                <td>
                    <p>Distance min<p>
                    <input id="distanceMin" value="0" type="number"   class="scriptInput" >
                </td>
                <td>
                    <p>Distance max<p>
                    <input id="distanceMax" value="999" type="number"   class="scriptInput" >
                </td>
                <td colspan='${rowsSpawnButtons-2}' >
                    <font color="${textColor}" id="troops_own_withdrawn"></font>
                </td>

            </tr>
        </table>
        <center>
            <button type="button" class="btn evt-confirm-btn btn-confirm-yes"  onclick="withdrawOwn()" >Withdraw</button>
        </center>

        </div>`

        //allies settings
        html+=`
        <div id="panel2" class="panel">
        <table class="scriptTable tableSettings">
            <tr>
                <td></td>
                <td>Quantity</td>
                <td>Pop</td>
            </tr>
            <tr>
                <td>
                    <div style="display: flex; justify-content: space-between;flex-wrap:wrap;width:100px ">
                        <div>
                            <input type="radio" id="id_withdraw2" name="typeAction2" value="withdraw" checked>
                            <label for="withdraw">Withdraw</label>
                        </div>
                        <div>
                            <input type="radio" id="id_leave2" name="typeAction2" value="leave">
                            <label for="leave">Leave</label>
                        </div>
                    </div>
                </td>

                <td>
                    <input id="quantity_allies" value="0" type="text" class="scriptInput "  >
                    <font color="${textColor}" class="hideMobile">k</font>
                </td>
                <td>
                    <input id="packets_totalAllies" value="0" type="text" class="scriptInput "  disabled>
                    <font color="${textColor}" class="hideMobile">k</font>
                </td>
            </tr>
  <tr>
                <td>
                    <div style="display: flex; justify-content: space-between;flex-wrap:wrap;width:120px ">
                        <div>
                            <input type="radio" id="id_smallest" name="quantitySupport" value="smallest" checked>
                            <label for="closest">Smallest first</label>
                        </div>
                        <div>
                            <input type="radio" id="id_biggest" name="quantitySupport" value="biggest">
                            <label for="furthest">Biggest first</label>
                        </div>
                    </div>
                </td>
                <td>
                    <p>Distance min<p>
                    <input id="distanceMin2" value="0" type="number"   class="scriptInput" >
                </td>
                <td>
                    <p>Distance max<p>
                    <input id="distanceMax2" value="999" type="number"   class="scriptInput" >
                </td>
        </tr>
        </tr>
            <td colspan="2">
                <center>
                <table>
                    <tr>
                    </tr>`


                for(let i=0;i<players.length;i++){
                    html +=
                    `<tr>
                        <td>
                            <input type="checkbox" id="${players[i]}Filter" checked="true">
                        </td>
                        <td>
                            ${players[i]}
                        </td>
                    </tr>`
                }



        html+=`</table></center>

            </td>

            <td>
                <font color="${textColor}" id="troops_allies_withdrawn"></font>
            </td>
        </tr>
        </table>
        <center><button type="button" class="btn evt-confirm-btn btn-confirm-yes" id="alliesWithdraw" onclick="withdrawAllies()">Withdraw</button></center>

        </div>`




        html+=`
        <br>
        <br>
        </div>
        <div class="scriptFooter">
            <div style=" margin-top:5px;"><h5>original by Costache • optimized by amc</h5></div>
        </div>
    </div>`


    ////////////////////////////////////////add and remove window from page///////////////////////////////////////////
    $("#div_container").remove()
    $("#contentContainer").eq(0).prepend(html);
    $("#mobileContent").eq(0).prepend(html);

    //for mobile browser



    $("#div_container").css("position","fixed");
    $("#div_container").draggable();

    $("#div_minimize").on("click",()=>{
        let currentWidthPercentage=Math.ceil($('#div_container').width() / $('body').width() * 100);
        if(currentWidthPercentage >=widthInterface ){
            $('#div_container').css({'width' : '10%'});
            $('#div_body').hide();
        }
        else{
            $('#div_container').css({'width' : `${widthInterface}%`});
            $('#div_body').show();
        }
    })
    if(localStorage.getItem(game_data.world+"support_withdraw_settings")!=null ){
        //initialize radiobutton
        let list_radioButton=JSON.parse(localStorage.getItem(game_data.world+"support_withdraw_settings"))[0]
        $('.tableSettings input[type=radio]').each(function (index,elem) {
            this.checked=list_radioButton[index]
            // console.log(elem.value)
        });
        console.log(list_radioButton)

        //initialize input numbers
        let list_input=JSON.parse(localStorage.getItem(game_data.world+"support_withdraw_settings"))[1]
        $('.tableSettings input').each(function (index,elem) {
            if(!elem.id.includes("Filter"))
                this.value=list_input[index]
        });

        $('.totalTroops').each(function (index,elem) {
            console.log(elem)
            this.value=0
        });
        $("#packets_total").val(0)
    }
    //save settings
    $(".tableSettings input[type=radio], .tableSettings input").on("click input change",(elem)=>{
        if(!elem.currentTarget.id.includes("Filter")){
            let list_radioButton=[]
            let list_input=[]
            //save checkbox
            $('.tableSettings input[type=radio]').each(function () {
                var checked = this.checked
                // console.log(this)
                list_radioButton.push(checked)
            });

            //save inputs
            $('.tableSettings input').each(function () {
                // table_upload checked = this.checked
                var value=this.value
                // console.log(value)
                list_input.push(value)
            });

            let list_final=[list_radioButton,list_input]
            let data=JSON.stringify(list_final)
            let data_localStorage=localStorage.getItem(game_data.world+"support_withdraw_settings")
            console.log(data)
            console.log(data_localStorage)
            if(data!=data_localStorage){
                localStorage.setItem(game_data.world+"support_withdraw_settings",data)
            }

        }
        else{
            updateValuesAllies()
        }
    })

    if(game_data.device !="desktop"){
        $(".hideMobile").hide()
        $(".tableSettings").find("input[type=text]").css("width","100%")
    }
 Object.keys(dataOwn.troops).forEach(troopName=>{
        if(document.getElementById(troopName + "total") != undefined)
            document.getElementById(troopName + "total").value = (dataOwn.troops[troopName] / 1000).toFixed(1)
    })
    document.getElementById("packets_total").value = (dataOwn.totalPop / 1000).toFixed(1)
    document.getElementById("packets_totalAllies").value = (dataAllies.totalPop / 1000).toFixed(1)


    //input chance distance min max for own troops
    $(".tableSettings input[id=distanceMin], .tableSettings input[id=distanceMax] ").on("click input change",()=>{
        let distanceMin = parseFloat($("#distanceMin").val())
        let distanceMax = parseFloat($("#distanceMax").val())
        distanceMin = Number.isNaN(distanceMin) ? 0 : distanceMin
        distanceMax = Number.isNaN(distanceMax) ? 999 : distanceMax

        let dataTroopsOwn = dataTroops
            .filter(elem => elem.playerName == game_data.player.name)
            .filter(elem => elem.distance > distanceMin && elem.distance < distanceMax)

        let troopNames = ["spear", "sword", "archer", "spy", "heavy"]

        let troops = {
            spear: 0,
            archer: 0,
            sword: 0,
            spy: 0,
            heavy: 0
        }
        let pop = 0;
        dataTroopsOwn.forEach(row=>{
            pop += row.totalPop
            troopNames.forEach(troopName=>{
                if(row.troops[troopName] != undefined){
                    troops[troopName] += row.troops[troopName]
                }
            })

        })
        Array.from($(".totalTroops")).forEach(elem=>{
            let troopName = elem.id.replace("total", "")
            if(troops[troopName] != undefined)
                elem.value = parseInt((troops[troopName] /1000) * 100) / 100
        })
        document.getElementById("packets_total").value = parseInt((pop / 1000) * 100) / 100

        console.log(troops)
        console.log(pop)
    })//input chance distance min max for allies
    $(".tableSettings input[id=distanceMin2], .tableSettings input[id=distanceMax2] ").on("click input change",()=>{
        updateValuesAllies()

    })
    if(game_data.device !="desktop"){
        $(".hideMobile").hide()
        $("#div_body").find("input[type=text]").css("heigth","100%")
        $("#panel1").css("padding","1px")
        $("#panel2").css("padding","1px")
    }
}

function updateValuesAllies(){
    let distanceMin = parseFloat($("#distanceMin2").val())
    let distanceMax = parseFloat($("#distanceMax2").val())
    distanceMin = Number.isNaN(distanceMin) ? 0 : distanceMin
    distanceMax = Number.isNaN(distanceMax) ? 999 : distanceMax
    let playerAllies = Array.from($("input[type=checkbox]:checked")).map(elem=>elem.id).filter(elem=>elem.includes("Filter")).map(elem=>elem.replace("Filter",""))
    let dataTroopsAllies = dataTroops
        .filter(elem => elem.playerName != game_data.player.name)
        .filter(elem => elem.distance > distanceMin && elem.distance < distanceMax)
        .filter(elem => playerAllies.includes(elem.playerName))


    let pop = 0;
    dataTroopsAllies.forEach(row=>{
        pop += row.totalPop

    })

    document.getElementById("packets_totalAllies").value = parseInt((pop / 1000) * 100) / 100

    console.log(pop)
}

function addEventPanel(){
    $('.tab-panels .tabs li').each((index,item)=>{
        // console.log(item.id)
        if(item.id!="add_tab"){
            $(item).off("click")
        }
    })
    $('.tab-panels .tabs li').not("#add_tab").on('click', function(event) {
        // console.log("addEventPanel")
        if(event.target.src==undefined){
            // console.log("inside if")
            if($(this).hasClass("active")==false ){

                var $panel = $(this).closest('.tab-panels');
                $panel.find('.tabs li.active').removeClass('active');
                $(this).addClass('active');

                //figure out which panel to show
                var panelToShow = $(this).attr('rel');
                if(panelToShow!=undefined){
                    //hide current panel
                    $panel.find('.panel.active').slideUp(300, showNextPanel); //show next panel
                    function showNextPanel() {
                        $(this).removeClass('active');

                        $('#'+panelToShow).slideDown(300, function() {
                            $(this).addClass('active');
                        });
                    }
                }
            }
        }

    });
}



function getDataTroops(){

    let troopsTable = document.getElementById("withdraw_selected_units_village_info").getElementsByTagName("tbody")[0]
    let rows = Array.from(troopsTable.getElementsByTagName("tr"))
    let rowsOutput = [];

    let homeCoord
    console.log(game_data.device)
    if(game_data.device == "desktop")
        homeCoord = $("#embedmap_village").parent().next().text().match(/[0-9]{3}\|[0-9]{3}/)[0]
    else
        homeCoord = $(".mobileKeyValue").find("div").text().match(/[0-9]{3}\|[0-9]{3}/)[0]

    let startRow = (rows[1].children[0].innerText.match(/[0-9]{3}\|[0-9]{3}/) != null)? 1 : 2 // for own villages start from 2 for others start from 1
    let lengthTd = rows[0].children.length
    console.log(lengthTd)
    let playerNameHtml = rows[0].insertCell(lengthTd-1);
    playerNameHtml.outerHTML="<th class='info'><a href=#>player name</a></th>";

    let popHtml = rows[0].insertCell(lengthTd-1);
    popHtml.outerHTML="<th class='info'><a href=#>pop</a></th>";

    let distanceHtml = rows[0].insertCell(lengthTd-1);
    distanceHtml.outerHTML="<th class='info'><a href=#>distance</a></th>";

//add first and second row
    let rowsSort = []
    if(startRow == 1){
        rowsSort.push({
            tr: rows[0],
            distance: -1
        })
    }else{
        rowsSort.push({
            tr: rows[0],
            distance: -2
        })
        rowsSort.push({
            tr: rows[1],
            distance: -1
        })

    }


    for(let i=startRow;i<rows.length-1;i++){
        let coordOrigin = rows[i].children[0].innerText.match(/[0-9]{3}\|[0-9]{3}/)[0]
        let playerOrigin = rows[i].children[0].innerText.split(coordOrigin)

        if(playerOrigin.length > 1){
            playerOrigin = playerOrigin[1].match(/\(.+\)/)

            if(playerOrigin != null){
                playerOrigin = playerOrigin[0].substring(1, playerOrigin[0].length-1)
            }
            else
                playerOrigin = game_data.player.name
        }
        else{
            playerOrigin = game_data.player.name
        }

        let distance = calcDistance(coordOrigin, homeCoord)

        let totalPop = 0
        let troops = {}
        Array.from(rows[i].getElementsByClassName("unit-item")).forEach(troop=>{
            let troopName = troop.id
            let troopValue = troop.innerText
            totalPop += troopValue * troopsPop[troopName]
            troops[troopName] = parseInt(troopValue)
        })
rowsSort.push({
            tr: rows[i],
            distance: distance
        })

        rowsOutput.push({
            distance: distance,
            totalPop: totalPop,
            playerName: playerOrigin,
            troops: troops,
            tr: rows[i]
        })

        playerNameHtml = rows[i].insertCell(lengthTd-1)
        playerNameHtml.outerHTML=`<td class='info'><center>${playerOrigin}</center></td>`

        popHtml = rows[i].insertCell(lengthTd-1)
        popHtml.outerHTML=`<td class='info'><center>${totalPop}</center></td>`

        distanceHtml = rows[i].insertCell(lengthTd-1)
        distanceHtml.outerHTML=`<td class='info'><center>${distance.toFixed(1)}</center></td>`
    }

    //add last row
    rowsSort.push({
        tr: rows[rows.length-1],
        distance: 999999999
    })

    rowsSort = rowsSort.sort((o1,o2)=>{
        return (o1.distance > o2.distance) ? 1 : (o1.distance < o2.distance) ? -1 : 0
    }).map(elem=>elem.tr)

    console.log(rowsSort)

    let troopNames = ["spear", "sword", "archer", "spy", "heavy"]
    let dataOwn = {
        troops:{
            spear: 0,
            archer: 0,
            sword: 0,
            spy: 0,
            heavy: 0
        },
        totalPop: 0
    }
    let dataAllies = {
        totalPop: 0
    }
    rowsOutput.forEach(row=>{
        if(row.playerName == game_data.player.name){
            dataOwn.totalPop += row.totalPop
            troopNames.forEach(troopName=>{
                if(row.troops[troopName] != undefined){
                    dataOwn.troops[troopName] += row.troops[troopName]
                }
            })

        }
        else{
            dataAllies.totalPop += row.totalPop
        }
    })
    rowsOutput.dataOwn = dataOwn
    rowsOutput.dataAllies = dataAllies




    return rowsOutput
}



function calcDistance(coord1,coord2){
    let x1=parseInt(coord1.split("|")[0])
    let y1=parseInt(coord1.split("|")[1])
    let x2=parseInt(coord2.split("|")[0])
    let y2=parseInt(coord2.split("|")[1])

    return Math.sqrt( (x1-x2)*(x1-x2) +  (y1-y2)*(y1-y2) );
}

function withdrawAllies(){
    let type = $('input[name="typeAction2"]:checked').val();
    let quantitySupport = $('input[name="quantitySupport"]:checked').val();

    let withdrawTroops = parseFloat(document.getElementById("quantity_allies").value) * 1000;
    let totalPop = parseFloat(document.getElementById("packets_totalAllies").value) * 1000
    if(withdrawTroops > totalPop){
        UI.ErrorMessage("quantity is bigger than total pop")
        throw new Error("quantity is bigger than total pop")
    }
    withdrawTroops = (type == "withdraw" ) ? withdrawTroops : totalPop - withdrawTroops
    let distanceMin = parseFloat($("#distanceMin2").val())
    let distanceMax = parseFloat($("#distanceMax2").val())
    distanceMin = Number.isNaN(distanceMin) ? 0 : distanceMin
    distanceMax = Number.isNaN(distanceMax) ? 999 : distanceMax

    let playerAllies = Array.from($("input[type=checkbox]:checked")).map(elem=>elem.id).filter(elem=>elem.includes("Filter")).map(elem=>elem.replace("Filter",""))
    console.log(playerAllies)
    let dataTroopsAllies = dataTroops
        .filter(elem => elem.playerName != game_data.player.name)
        .filter(elem => elem.distance > distanceMin && elem.distance < distanceMax)
        .filter(elem => playerAllies.includes(elem.playerName))

    console.log(dataTroopsAllies)

    let listWithdraw = []
    if(quantitySupport == "smallest"){
        dataTroopsAllies = dataTroopsAllies.sort((o1,o2) => {
            return (o1.totalPop > o2.totalPop) ? 1 : (o1.totalPop < o2.totalPop) ? -1 : 0
        })

    }
    else{
        dataTroopsAllies = dataTroopsAllies.sort((o1,o2) => {
            return (o1.totalPop > o2.totalPop) ? -1 : (o1.totalPop < o2.totalPop) ? 1 : 0
        })
    }

    console.log(dataTroopsAllies)
    let popWithdrawn = 0;
    for(let i=0;i<dataTroopsAllies.length;i++){
        if(dataTroopsAllies[i].totalPop <= withdrawTroops){
            withdrawTroops -= dataTroopsAllies[i].totalPop;
            popWithdrawn += dataTroopsAllies[i].totalPop
            listWithdraw.push(dataTroopsAllies[i])
        }
    }
    console.log("withdrawn pop: " + popWithdrawn)
    console.log(type)
    if(type == "withdraw")
        document.getElementById("troops_allies_withdrawn").innerText = "withdraw: " + (popWithdrawn / 1000).toFixed(1) +" k"
    else
        document.getElementById("troops_allies_withdrawn").innerText = "leave: " + ((totalPop - popWithdrawn) / 1000).toFixed(1) +" k"

    // $(".troop-request-selector").prop('checked', false);
    for(let i=0;i<dataTroopsAllies.length;i++){
        let checked = $(dataTroopsAllies[i].tr).find(".troop-request-selector").prop("checked")
        if(checked == true)
            $(dataTroopsAllies[i].tr).find(".troop-request-selector").click()
    }

    for(let i=0;i<listWithdraw.length;i++){
        $(listWithdraw[i].tr).find(".troop-request-selector").click()
    }
}

function withdrawOwn(){
    let type = $('input[name="typeAction"]:checked').val();
    let typeWithdraw = $('input[name="typeWithdraw"]:checked').val();
    let packetWithdraw = parseFloat($("#packets_leave").val()) * 1000
    let packetsTotal = parseFloat($("#packets_total").val()) * 1000
    packetWithdraw = (type == "withdraw") ? packetWithdraw : packetsTotal - packetWithdraw

    let distanceMin = parseFloat($("#distanceMin").val())
    let distanceMax = parseFloat($("#distanceMax").val())
    distanceMin = Number.isNaN(distanceMin) ? 0 : distanceMin
    distanceMax = Number.isNaN(distanceMax) ? 999 : distanceMax

    let dataTroopsOwn = dataTroops
        .filter(elem => elem.playerName == game_data.player.name)
        .filter(elem => elem.distance > distanceMin && elem.distance < distanceMax)

    let totalTroops = Array.from($(".totalTroops")).map(elem => parseFloat(elem.value) * 1000)
    let leaveTroops = Array.from($(".leaveTroops")).map(elem => parseFloat(elem.value) * 1000)
    let troopNames = Array.from($(".totalTroops")).map(elem => elem.id.replace("total", ""))

    let factorAverage = {}
    for(let i=0;i<totalTroops.length;i++){
        if(totalTroops[i] < leaveTroops[i]){
            UI.ErrorMessage("too many troops set to withdraw/leave", 1500)
            throw new Error("too many troops set to withdraw/leave")
        }
        if(type == "withdraw")
            factorAverage[troopNames[i]] = Number.isNaN(leaveTroops[i] / totalTroops[i]) ? 0 : leaveTroops[i] / totalTroops[i]
        else
            factorAverage[troopNames[i]] = Number.isNaN((totalTroops[i] - leaveTroops[i]) / totalTroops[i]) ? 0 : (totalTroops[i] - leaveTroops[i]) / totalTroops[i]
    }

    for(let i=0;i<dataTroopsOwn.length;i++){
        let checked = $(dataTroopsOwn[i].tr).find(".troop-request-selector").prop("checked")
        if(checked == true)
            $(dataTroopsOwn[i].tr).find(".troop-request-selector").click()
    }

    if(typeWithdraw == "even"){
        for(let i=0;i<dataTroopsOwn.length;i++){
            $(dataTroopsOwn[i].tr).find(".troop-request-selector").click()
            troopNames.forEach(troopName => {
                let newValue = parseInt(dataTroopsOwn[i].troops[troopName] * factorAverage[troopName])
                $(dataTroopsOwn[i].tr).find(`#${troopName}`).find("input").val(newValue)
            })
        }
        if(type == "withdraw")
            document.getElementById("troops_own_withdrawn").innerText = "withdraw: " + (packetWithdraw / 1000).toFixed(1) + " k"
        else
            document.getElementById("troops_own_withdrawn").innerText = "leave: " + ((packetsTotal - packetWithdraw) / 1000).toFixed(1) + " k"
    }
    else{
        dataTroopsOwn = dataTroopsOwn.sort((o1,o2) => o1.distance - o2.distance)

        let needPerType = {}
        for(let i=0;i<troopNames.length;i++){
            let need = (type == "withdraw") ? leaveTroops[i] : totalTroops[i] - leaveTroops[i]
            needPerType[troopNames[i]] = Number.isNaN(need) ? 0 : Math.max(0, need)
        }

        let popWithdrawn = 0
        for(let i=0;i<dataTroopsOwn.length;i++){
            let village = dataTroopsOwn[i]
            let take = {}
            let anySelected = false
            troopNames.forEach(troopName => {
                let available = village.troops[troopName] || 0
                let t = Math.min(needPerType[troopName], available)
                t = (Number.isNaN(t) || t < 0) ? 0 : parseInt(t)
                take[troopName] = t
                if(t > 0) anySelected = true
            })
            if(!anySelected) continue

            $(village.tr).find(".troop-request-selector").click()
            troopNames.forEach(troopName => {
                let input = village.tr.querySelector(`td#${troopName} input`)
                if(input && !input.disabled){
                    input.value = take[troopName]
                    needPerType[troopName] -= take[troopName]
                    if(troopName != "spy")
                        popWithdrawn += take[troopName] * troopsPop[troopName]
                }
            })

            if(troopNames.every(tn => needPerType[tn] <= 0)) break
        }

        if(type == "withdraw")
            document.getElementById("troops_own_withdrawn").innerText = "withdraw: " + (popWithdrawn / 1000).toFixed(1) + " k"
        else
            document.getElementById("troops_own_withdrawn").innerText = "leave: " + ((packetsTotal - popWithdrawn) / 1000).toFixed(1) + " k"
    }
}

function addEvents(){
    $('.leaveTroops').on('input',function(e){
        let leaveTotal = document.getElementsByClassName("leaveTroops")
        let totalPop = 0
        for(let i=0;i<leaveTotal.length;i++){
            let id = leaveTotal[i].id
            let value = (leaveTotal[i].value=="") ? 0 : leaveTotal[i].value
            console.log(id)
            if(id.includes("spear") || id.includes("sword") || id.includes("archer") || id.includes("heavy")){
                totalPop += parseFloat(value) * 1000 * troopsPop[id.replace("total", "")]
            }

        }
        document.getElementById("packets_leave").value=(totalPop/1000).toFixed(2)

    });
    // $('.packets_send').off('input')
    $('#packets_leave').on('input',function(e){
        let needTroops=parseFloat(document.getElementById("packets_leave").value)
        let totalPop =parseFloat(document.getElementById("packets_total").value)
        let sendTotal=document.getElementsByClassName("leaveTroops")
        let totalTroops=document.getElementsByClassName("totalTroops")

        console.log(needTroops)
        console.log(totalPop)
        let ratio = needTroops/totalPop
        console.log(ratio)
        for(let i=0;i<totalTroops.length;i++){
            let id=sendTotal[i].id
            if(!id.includes("spy")){
                sendTotal[i].value= parseInt(parseFloat(totalTroops[i].value)*ratio*100)/100.0
            }
            else{
                sendTotal[i].value=0
            }
        }



    });
}

function hitCountApi(){
    $.getJSON(`https://api.counterapi.dev/v1/${countNameSpace}/${countApiKey}/up`, response=>{
        console.log(`This script has been run: ${response.count} times`);
    });
    if(game_data.device !="desktop"){
        $.getJSON(`https://api.counterapi.dev/v1/${countNameSpace}/${countApiKey}_phone/up`, response=>{
            console.log(`This script has been run on mobile: ${response.count} times`);
        });
    }

    $.getJSON(`https://api.counterapi.dev/v1/${countNameSpace}/${countApiKey}_id2${game_data.player.id}/up`, response=>{
        if(response.count == 1){
            $.getJSON(`https://api.counterapi.dev/v1/${countNameSpace}/${countApiKey}_scriptUsers/up`, response=>{});
        }

    });

    try {
        $.getJSON(`https://api.counterapi.dev/v1/${countNameSpace}/${countApiKey}_scriptUsers`, response=>{
            console.log(`Total number of users: ${response.count}`);
        });

    } catch (error) {}

}
