// made by Costache Madalin (lllll llll)
// discord: costache madalin#8472


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



var defaultTheme= '[["theme1",["#E0E0E0","#000000","#C5979D","#2B193D","#2C365E","#484D6D","#4B8F8C","50"]],["currentTheme","theme1"],["theme2",["#E0E0E0","#000000","#F76F8E","#113537","#37505C","#445552","#294D4A","50"]],["theme3",["#E0E0E0","#000000","#ACFCD9","#190933","#665687","#7C77B9","#623B5A","50"]],["theme4",["#E0E0E0","#000000","#181F1C","#60712F","#274029","#315C2B","#214F4B","50"]],["theme5",["#E0E0E0","#000000","#9AD1D4","#007EA7","#003249","#1F5673","#1C448E","50"]],["theme6",["#E0E0E0","#000000","#EA8C55","#81171B","#540804","#710627","#9E1946","50"]],["theme7",["#E0E0E0","#000000","#754043","#37423D","#171614","#3A2618","#523A34","50"]],["theme8",["#E0E0E0","#000000","#9E0031","#8E0045","#44001A","#600047","#770058","50"]],["theme9",["#E0E0E0","#000000","#C1BDB3","#5F5B6B","#323031","#3D3B3C","#575366","50"]],["theme10",["#E0E0E0","#000000","#E6BCCD","#29274C","#012A36","#14453D","#7E52A0","50"]]]'
var localStorageThemeName = "supportWithdrawTheme"
if(localStorage.getItem(localStorageThemeName)!=undefined){
    let mapTheme = new Map(JSON.parse(localStorage.getItem(localStorageThemeName)))
    Array.from(mapTheme.keys()).forEach((key)=>{
        if(key!="currentTheme"){
            let listColors=mapTheme.get(key);
            if(listColors.length == 7){
                listColors.push(50);
                mapTheme.set(key,listColors)
            }
        }
    })
    localStorage.setItem(localStorageThemeName, JSON.stringify(Array.from(mapTheme.entries())))
}
var headerWood="#001a33"
var headerWoodEven="#002e5a"
var headerStone="#3b3b00"
var headerStoneEven="#626200"
var headerIron="#1e003b"
var headerIronEven="#3c0076"
var textColor="#ffffff"
var backgroundInput="#000000"


var borderColor = "#C5979D";//#026440
var backgroundContainer="#2B193D"
var backgroundHeader="#2C365E"
var backgroundMainTable="#484D6D"
var backgroundInnerTable="#4B8F8C"

var widthInterface=50;//percentage
var headerColorDarken=-50 //percentage( how much the header should be darker) if it's with -(darker) + (lighter)
var headerColorAlternateTable=-30;
var headerColorAlternateHover=30;

var backgroundAlternateTableEven=backgroundContainer;
var backgroundAlternateTableOdd=getColorDarker(backgroundContainer,headerColorAlternateTable);

var dataTroops = getDataTroops()


async function main(){

    initializationTheme()
    await $.getScript("https://dl.dropboxusercontent.com/s/i5c0so9hwsizogm/styleCSSGlobal.js?dl=0");

    console.log(dataTroops)
    console.log(dataTroops.dataOwn)
    console.log(dataTroops.dataAllies)
    
    let players = dataTroops.map(elem => elem.playerName).filter(elem => elem != game_data.player.name)
    players = [...new Set(players)]
    createMainInterface(dataTroops.dataOwn,dataTroops.dataAllies, players)
    changeTheme()
    addEvents()
    addEventPanel()
    hitCountApi()


}
main()


function createMainInterface(dataOwn,dataAllies, players){
    let rowsSpawnButtons = (game_data.units.includes("archer") == true)?6:5;
    
    let html=`
    
    <div id="div_container" class="scriptContainer">
        <div class="scriptHeader">
            <div style=" margin-top:10px;"><h2>Support withdrawal</h2></div>
            <div style="position:absolute;top:10px;right: 10px;"><a href="#" onclick="$('#div_container').remove()"><img src="https://img.icons8.com/emoji/24/000000/cross-mark-button-emoji.png"/></a></div>
            <div style="position:absolute;top:8px;right: 35px;" id="div_minimize"><a href="#"><img src="https://img.icons8.com/plasticine/28/000000/minimize-window.png"/></a></div>
            <div style="position:absolute;top:10px;right: 60px;" id="div_theme"><a href="#" onclick="$('#theme_settings').toggle()"><img src="https://img.icons8.com/material-sharp/24/fa314a/change-theme.png"/></a></div>
        </div>

        <div id="theme_settings"></div>
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
                </td>`;

        
    for(let i=0;i<units.length;i++){
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
            <div style=" margin-top:5px;"><h5>made by Costache</h5></div>
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
    })

    //input chance distance min max for allies
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

function getColorDarker(hexInput, percent) {
    let hex = hexInput;

    // strip the leading # if it's there
    hex = hex.replace(/^\s*#|\s*$/g, "");

    // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
    if (hex.length === 3) {
        hex = hex.replace(/(.)/g, "$1$1");
    }

    let r = parseInt(hex.substr(0, 2), 16);
    let g = parseInt(hex.substr(2, 2), 16);
    let b = parseInt(hex.substr(4, 2), 16);

    const calculatedPercent = (100 + percent) / 100;

    r = Math.round(Math.min(255, Math.max(0, r * calculatedPercent)));
    g = Math.round(Math.min(255, Math.max(0, g * calculatedPercent)));
    b = Math.round(Math.min(255, Math.max(0, b * calculatedPercent)));

    return `#${("00"+r.toString(16)).slice(-2).toUpperCase()}${("00"+g.toString(16)).slice(-2).toUpperCase()}${("00"+b.toString(16)).slice(-2).toUpperCase()}`
}

function changeTheme(){
    let html= `
    <h3 style="color:${textColor};padding-left:10px;padding-top:5px">after theme is selected run the script again<h3>
    <table class="scriptTable" >
        
        <tr>
            <td>
                <select  id="select_theme">
                    <option value="theme1">theme1</option>
                    <option value="theme2">theme2</option>
                    <option value="theme3">theme3</option>
                    <option value="theme4">theme4</option>
                    <option value="theme5">theme5</option>
                    <option value="theme6">theme6</option>
                    <option value="theme7">theme7</option>
                    <option value="theme8">theme8</option>
                    <option value="theme9">theme9</option>
                    <option value="theme10">theme10</option>
                </select>
            </td>
            <td>value</td>
            <td >color hex</td>
        </tr>
        <tr>
            <td>textColor</td>
            <td style="background-color:${textColor}" class="td_background"></td>
            <td><input type="text" class="scriptInput input_theme" value="${textColor}"></td>
        </tr>
        <tr>
            <td>backgroundInput</td>
            <td style="background-color:${backgroundInput}" class="td_background"></td>
            <td><input type="text" class="scriptInput input_theme" value="${backgroundInput}"></td>
        </tr>
        <tr>
            <td>borderColor</td>
            <td style="background-color:${borderColor}" class="td_background"></td>
            <td><input type="text" class="scriptInput input_theme" value="${borderColor}"></td>
        </tr>
        <tr>
            <td>backgroundContainer</td>
            <td style="background-color:${backgroundContainer}" class="td_background"></td>
            <td><input type="text" class="scriptInput input_theme" value="${backgroundContainer}"></td>
        </tr>
        <tr>
            <td>backgroundHeader</td>
            <td style="background-color:${backgroundHeader}" class="td_background"></td>
            <td><input type="text" class="scriptInput input_theme" value="${backgroundHeader}"></td>
        </tr>
        <tr>
            <td>backgroundMainTable</td>
            <td style="background-color:${backgroundMainTable}" class="td_background"></td>
            <td><input type="text" class="scriptInput input_theme" value="${backgroundMainTable}"></td>
        </tr>
        <tr>
            <td>backgroundInnerTable</td>
            <td style="background-color:${backgroundInnerTable}" class="td_background"></td>
            <td><input type="text" class="scriptInput input_theme" value="${backgroundInnerTable}"></td>
        </tr>
        <tr>
            <td>widthInterface</td>
            <td><input type="range" min="25" max="100" class="slider input_theme" id="input_slider_width" value="${widthInterface}"></td>
            <td id="td_width">${widthInterface}%</td>
        </tr>
        <tr >
            <td><input class="btn evt-confirm-btn btn-confirm-yes" type="button" id="btn_save_theme" value="Save"></td>
            <td><input class="btn evt-confirm-btn btn-confirm-yes" type="button" id="btn_reset_theme" value="Default themes"></td>
            <td></td>
        </tr>

    </table>
    `
    $("#theme_settings").append(html)
    $("#theme_settings").hide()

    let selectedTheme = ""
    let colours =[]
    let mapTheme = new Map()

    $("#select_theme").on("change",()=>{
        if(localStorage.getItem(localStorageThemeName) != undefined){
            selectedTheme = $('#select_theme').find(":selected").text();
            colours = Array.from($(".input_theme")).map(elem=>elem.value.toUpperCase().trim())
            mapTheme = new Map(JSON.parse(localStorage.getItem(localStorageThemeName)))
            console.log(selectedTheme)
            console.log(mapTheme)
            colours = mapTheme.get(selectedTheme)
            console.log(colours)
            Array.from($(".input_theme")).forEach((elem,index)=>{
                elem.value = colours[index]
            })
            Array.from($(".td_background")).forEach((elem,index)=>{
                elem.style.background = colours[index]
            })

            mapTheme.set("currentTheme",selectedTheme)
            localStorage.setItem(localStorageThemeName, JSON.stringify(Array.from(mapTheme.entries())))
        }
    })

    $("#btn_save_theme").on("click",()=>{
        colours = Array.from($(".input_theme")).map(elem=>elem.value.toUpperCase().trim())
        selectedTheme = $('#select_theme').find(":selected").text();

        for(let i=0;i<colours.length-1;i++){
            if(colours[i].match(/#[0-9 A-F]{6}/) == null ){
                UI.ErrorMessage("wrong colour: "+colours[i])  
                throw new Error("wrong colour")
            }
        }

        if(localStorage.getItem(localStorageThemeName) != undefined)
            mapTheme = new Map(JSON.parse(localStorage.getItem(localStorageThemeName)))


        mapTheme.set(selectedTheme,colours)
        mapTheme.set("currentTheme",selectedTheme)

        localStorage.setItem(localStorageThemeName, JSON.stringify(Array.from(mapTheme.entries())))
        console.log("saved colours for: "+selectedTheme)
        UI.SuccessMessage(`saved colours for: ${selectedTheme} \n run the script again`,1000)


    })

    $("#btn_reset_theme").on("click",()=>{
        localStorage.setItem(localStorageThemeName, defaultTheme)
        UI.SuccessMessage("run the script again",1000)

    })
    $("#input_slider_width").on("input",()=>{
        $("#td_width").text($("#input_slider_width").val()+"%")
    })


    if(localStorage.getItem(localStorageThemeName) != undefined){
        mapTheme = new Map(JSON.parse(localStorage.getItem(localStorageThemeName)))
        let currentTheme=mapTheme.get("currentTheme")
        document.querySelector('#select_theme').value=currentTheme
    }

    
}

function initializationTheme(){
    if(localStorage.getItem(localStorageThemeName) != undefined){
        let mapTheme = new Map(JSON.parse(localStorage.getItem(localStorageThemeName)))
        let currentTheme=mapTheme.get("currentTheme")
        let colours=mapTheme.get(currentTheme)

        textColor=colours[0]
        backgroundInput=colours[1]

        borderColor = colours[2]
        backgroundContainer=colours[3]
        backgroundHeader=colours[4]
        backgroundMainTable=colours[5]
        backgroundInnerTable=colours[6]
        widthInterface=colours[7]

        if(game_data.device != "desktop"){
            widthInterface = 98
        }

        backgroundAlternateTableEven=backgroundContainer;
        backgroundAlternateTableOdd=getColorDarker(backgroundContainer,headerColorAlternateTable);       
        console.log("textColor: "+textColor)
        console.log("backgroundContainer: "+backgroundContainer)
        
    }
    else{
        localStorage.setItem(localStorageThemeName, defaultTheme)

        let mapTheme = new Map(JSON.parse(localStorage.getItem(localStorageThemeName)))
        let currentTheme=mapTheme.get("currentTheme")
        let colours=mapTheme.get(currentTheme)

        textColor=colours[0]
        backgroundInput=colours[1]

        borderColor = colours[2]
        backgroundContainer=colours[3]
        backgroundHeader=colours[4]
        backgroundMainTable=colours[5]
        backgroundInnerTable=colours[6]
        widthInterface=colours[7]

        if(game_data.device != "desktop"){
            widthInterface = 98
        }

        backgroundAlternateTableEven=backgroundContainer;
        backgroundAlternateTableOdd=getColorDarker(backgroundContainer,headerColorAlternateTable);  
    }

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
                    $panel.find('.panel.active').slideUp(300, showNextPanel);
            
                    //show next panel
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

    // $("#withdraw_selected_units_village_info tbody tr").remove()
    // $("#withdraw_selected_units_village_info tbody").append(rowsSort)

    
    // console.log(rowsSort)
    // console.log(rows)
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
  

    // console.log(listWithdraw)
    // console.log(dataTroops)
}

function withdrawOwn(){
    let type = $('input[name="typeAction"]:checked').val();
    let typeWithdraw = $('input[name="typeWithdraw"]:checked').val();
    let packetWithdraw = parseFloat($("#packets_leave").val()) * 1000
    let packetsTotal = parseFloat($("#packets_total").val()) * 1000
    let spyTotal = parseFloat($("#spytotal").val()) * 1000
    packetWithdraw = (type == "withdraw") ? packetWithdraw : packetsTotal - packetWithdraw
    console.log("withdraw",packetWithdraw)

    let distanceMin = parseFloat($("#distanceMin").val())
    let distanceMax = parseFloat($("#distanceMax").val())
    distanceMin = Number.isNaN(distanceMin) ? 0 : distanceMin
    distanceMax = Number.isNaN(distanceMax) ? 999 : distanceMax

    let dataTroopsOwn = dataTroops
        .filter(elem => elem.playerName == game_data.player.name)
        .filter(elem => elem.distance > distanceMin && elem.distance < distanceMax)


    let totalTroops = Array.from($(".totalTroops")).map(elem=>parseFloat(elem.value) * 1000)
    let leaveTroops = Array.from($(".leaveTroops")).map(elem=>parseFloat(elem.value) * 1000)
    let troopNames =  Array.from($(".totalTroops")).map(elem=>elem.id.replace("total",""))



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

    console.log(dataTroopsOwn)
    for(let i=0;i<dataTroopsOwn.length;i++){
        let checked = $(dataTroopsOwn[i].tr).find(".troop-request-selector").prop("checked")
        if(checked == true)
            $(dataTroopsOwn[i].tr).find(".troop-request-selector").click()
    }
    if(packetWithdraw == 0  && spyTotal == 0)
        throw new Error("nothing to withdraw")


    let tempPacketWithdraw = packetWithdraw
    if(typeWithdraw == "even"){
        for(let i=0;i<dataTroopsOwn.length;i++){
            $(dataTroopsOwn[i].tr).find(".troop-request-selector").click()
            troopNames.forEach(troopName => {
                let newValue = parseInt(dataTroopsOwn[i].troops[troopName] * factorAverage[troopName])
                $(dataTroopsOwn[i].tr).find(`#${troopName}`).find("input").val(newValue)
            })
        }
    }
    else{
        dataTroopsOwn = dataTroopsOwn.sort((o1,o2) => {
            return (o1.distance > o2.distance) ? 1 : (o1.distance < o2.distance) ? -1 : 0
        })

        for(let i=0;i<dataTroopsOwn.length;i++){
            if(tempPacketWithdraw <= 0) break

            let rowPop = 0
            let perUnit = {}

            troopNames.forEach(troopName => {
                let baseValue = parseInt(dataTroopsOwn[i].troops[troopName] * factorAverage[troopName])
                baseValue = Number.isNaN(baseValue) ? 0 : baseValue
                perUnit[troopName] = baseValue
                rowPop += baseValue * troopsPop[troopName]
            })

            if(rowPop <= 0) continue

            $(dataTroopsOwn[i].tr).find(".troop-request-selector").click()

            if(tempPacketWithdraw < rowPop){
                let scale = tempPacketWithdraw / rowPop
                troopNames.forEach(troopName => {
                    let newValue = parseInt(perUnit[troopName] * scale)
                    $(dataTroopsOwn[i].tr).find(`#${troopName}`).find("input").val(newValue)
                })
                tempPacketWithdraw = 0
            }else{
                troopNames.forEach(troopName => {
                    $(dataTroopsOwn[i].tr).find(`#${troopName}`).find("input").val(perUnit[troopName])
                })
                tempPacketWithdraw -= rowPop
            }
        }
    }
    console.log("wtf"+((packetWithdraw)))
    console.log("tempPacketWithdraw: " +tempPacketWithdraw)

    if(type == "withdraw" && typeWithdraw == "closest")
        document.getElementById("troops_own_withdrawn").innerText = "withdraw: " + ((packetWithdraw - tempPacketWithdraw) / 1000).toFixed(1) +" k"
    else if (type == "leave" && typeWithdraw == "closest")
        document.getElementById("troops_own_withdrawn").innerText = "leave: " + ((packetsTotal - packetWithdraw + tempPacketWithdraw) / 1000).toFixed(1) +" k"
    if(type == "withdraw" && typeWithdraw == "even")
        document.getElementById("troops_own_withdrawn").innerText = "withdraw: " + ((packetWithdraw ) / 1000).toFixed(1) +" k"
    else if (type == "leave" && typeWithdraw == "even")
        document.getElementById("troops_own_withdrawn").innerText = "leave: " + ((packetsTotal - packetWithdraw ) / 1000).toFixed(1) +" k"
         


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
