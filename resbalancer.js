// made by Costache Madalin (lllll llll)
// discord: costache madalin#8472
// original by Costache • optimized by amc


if(typeof(TWMap) !="undefined" )
    var  originalSpawnSector = TWMap.mapHandler.spawnSector;

var textColor = "#2b1b08";
var widthInterface = (game_data.device != "desktop") ? "98%" : "760px";
var settingsOpen = true;
var minimizedWidth = (game_data.device != "desktop") ? "20%" : "220px";
    function main(){
        addCssStyle();
        createMainInterface();
    }
    main()

function addCssStyle(){
    document.getElementById("resource_balancer_css")?.remove();

    const cssStyle = `
        #div_container.scriptContainer {
            width: ${widthInterface};
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
            max-height: 75vh !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
        }

        #div_container .scriptTable,
        #div_container .scriptTableAlternate,
        #div_container .scriptTableBalancerResult {
            width: 100%;
            margin: 0 auto 8px;
            border-collapse: separate;
            border-spacing: 0 3px;
            table-layout: fixed;
            border: none;
            background: transparent;
        }

        #div_container .scriptTable td,
        #div_container .scriptTableAlternate td,
        #div_container .scriptTableBalancerResult td {
            border: none;
            padding: 7px 5px;
            text-align: center;
            color: #2b1b08;
            font-size: 12px;
            overflow: hidden;
            text-overflow: ellipsis;
            word-wrap: break-word;
        }

        #div_container .scriptTable tr:not(:first-child),
        #div_container .scriptTableAlternate tr:not(:first-child),
        #div_container .scriptTableBalancerResult tr:not(:first-child) {
            background: #f8efd6;
            box-shadow: 0 1px 2px rgba(59,38,13,.08);
        }

        #div_container .scriptTable tr:not(:first-child) td:first-child,
        #div_container .scriptTableAlternate tr:not(:first-child) td:first-child,
        #div_container .scriptTableBalancerResult tr:not(:first-child) td:first-child {
            border-radius: 6px 0 0 6px;
        }

        #div_container .scriptTable tr:not(:first-child) td:last-child,
        #div_container .scriptTableAlternate tr:not(:first-child) td:last-child,
        #div_container .scriptTableBalancerResult tr:not(:first-child) td:last-child {
            border-radius: 0 6px 6px 0;
        }

        #div_container .scriptTable tr:nth-child(odd):not(:first-child),
        #div_container .scriptTableAlternate tr:nth-child(odd):not(:first-child),
        #div_container .scriptTableBalancerResult tr:nth-child(odd):not(:first-child) {
            background: #f2e4bf;
        }

        #div_container .scriptTable tr:first-child td,
        #div_container .scriptTableAlternate tr:first-child td,
        #div_container .scriptTableBalancerResult tr:first-child td {
            background: #dcc48c;
            color: #4a3210;
            font-weight: bold;
            text-shadow: none !important;
            border-radius: 6px;
            font-size: 11px;
            letter-spacing: .3px;
            text-transform: uppercase;
            padding: 5px;
            position: sticky;
            top: 0;
            z-index: 2;
        }

        #div_container .scriptTable tr:not(:first-child):hover td,
        #div_container .scriptTableAlternate tr:not(:first-child):hover td,
        #div_container .scriptTableBalancerResult tr:not(:first-child):hover td {
            background: #fbeecb;
        }

        #div_container .scriptTable a font,
        #div_container .scriptTableAlternate a font,
        #div_container .scriptTableBalancerResult a font,
        #div_container .scriptTable font,
        #div_container .scriptTableAlternate font,
        #div_container .scriptTableBalancerResult font {
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

        #div_container #table_view {
            background: transparent;
        }

        #div_container #table_view::-webkit-scrollbar,
        #div_container #div_body::-webkit-scrollbar {
            width: 10px;
            height: 10px;
        }

        #div_container #table_view::-webkit-scrollbar-track,
        #div_container #div_body::-webkit-scrollbar-track {
            background: #e9d7a8;
            border-radius: 6px;
        }

        #div_container #table_view::-webkit-scrollbar-thumb,
        #div_container #div_body::-webkit-scrollbar-thumb {
            background: #b6863a;
            border-radius: 6px;
            border: 2px solid #e9d7a8;
        }

        #div_container .settingsPanel {
            background: #f1e3bd;
            border: 1px solid #c9ab72;
            border-radius: 8px;
            margin-bottom: 12px;
            overflow: hidden;
        }

        #div_container .settingsPanel summary {
            cursor: pointer;
            list-style: none;
            padding: 9px 12px;
            font-size: 12px;
            font-weight: bold;
            letter-spacing: .3px;
            color: #4a3210;
            background: #dcc48c;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        #div_container .settingsPanel summary::-webkit-details-marker {
            display: none;
        }

        #div_container .settingsPanel summary .settingsChevron {
            transition: transform .15s ease;
            font-size: 10px;
        }

        #div_container .settingsPanel[open] summary .settingsChevron {
            transform: rotate(90deg);
        }

        #div_container .settingsBody {
            padding: 10px 12px 12px;
        }

        #div_container .settingsGroup {
            margin-bottom: 10px;
        }

        #div_container .settingsGroup:last-child {
            margin-bottom: 0;
        }

        #div_container .settingsGroupTitle {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: .5px;
            color: #8a6a35;
            margin-bottom: 6px;
        }

        #div_container .settingsGroupFields {
            background: #f8efd6;
            border: 1px solid #dcc48c;
            border-radius: 6px;
            padding: 2px 10px;
        }

        #div_container .settingsFieldRow {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 6px 0;
        }

        #div_container .settingsFieldRow:not(:last-child) {
            border-bottom: 1px solid #ecdcb2;
        }

        #div_container .settingsFieldRow label {
            flex: 1;
            font-size: 12px;
            color: #2b1b08;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            gap: 5px;
        }

        #div_container .settingsFieldValue {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        #div_container .settingsFieldValue .scriptInput {
            width: 75px;
            text-align: center;
        }

        #div_container .capacityToggle {
            display: flex;
            border: 1px solid #c9ab72;
            border-radius: 5px;
            overflow: hidden;
        }

        #div_container .capacityToggle button {
            border: none;
            background: #fffcf3;
            color: #8a6a35;
            font-size: 11px;
            font-weight: bold;
            padding: 4px 14px;
            cursor: pointer;
        }

        #div_container .capacityToggle button:first-child {
            border-right: 1px solid #c9ab72;
        }

        #div_container .capacityToggle button.active {
            background: #cc9a44;
            color: #3a2410;
        }

        #div_container .startBalancing {
            width: 100%;
            padding: 12px;
            font-size: 13px;
            letter-spacing: .3px;
        }
    `;

    const style = document.createElement("style");
    style.id = "resource_balancer_css";
    style.type = "text/css";
    style.appendChild(document.createTextNode(cssStyle));
    document.head.appendChild(style);
}

function getColorDarker(hexInput, percent) {
    let hex = hexInput;

    hex = hex.replace(/^\s*#|\s*$/g, "");

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

function createMainInterface(){
    let message_info_factor=`<p>Controls how full each village is topped up to, as a share of the average, before any construction reservation is added on top.\n</p>
        <p><b>0</b> — villages get nothing from the average pool, only their construction-time reservation (if any).\n</p>
        <p><b>1</b> — full average: every village ends up holding the same amount, aside from construction reservations.\n</p>
        <p><b>in between</b>, e.g. 0.2 — each village is topped up to 20% of the average, plus its construction reservation on top.</p>`
    let message_info_construction=`<p>Reserves enough resources at each village to cover this many hours of queued Account Manager construction (max 50).\n</p>
                <p>Requires the Account Manager to be active and the village to have a construction template assigned — otherwise this setting is skipped for that village.</p>`

    let message_info_cluster=`<p>Splits your villages into this many location-based groups and balances within each group separately, instead of across your whole account.\n</p>
        <p><b>1 cluster</b> — resources can travel anywhere on your account.\n</p>
        <p><b>more clusters</b> — shorter delivery distances, but less optimal since resources can't flow between groups.\n</p>
        <p>Grouping is recalculated randomly each run, so results (and max travel distance) can vary run to run.\n</p>
        <p>If you're on the map screen, cluster boundaries are drawn visually after balancing.</p>`

    let message_max_construction=`<p>Only takes effect when the average factor above is 0.5 or lower.\n</p>
        <p>When enabled, the construction time value is ignored and calculated automatically instead — the script searches upward hour by hour and fills in the highest value where every cluster still has enough surplus to cover the extra construction demand, for every resource.</p>`

    let twServers = [
        "pt_PT",
        "de_DE",
    ]
    let showCapacity = twServers.includes(game_data.locale)

    let html_info=`

    <div id="div_container" class="scriptContainer" >
        <div class="scriptHeader">
    <div><h2>Resources balancer</h2></div>
    <div style="position:absolute;top:50%;right:10px;transform:translateY(-50%);"><a href="#" onclick="$('#div_container').remove()"><img src="https://img.icons8.com/emoji/24/000000/cross-mark-button-emoji.png"/></a></div>
    <div style="position:absolute;top:50%;right:35px;" id="div_minimize"><a href="#" style="display:block;transform:translateY(-50%);"><img src="https://img.icons8.com/plasticine/28/000000/minimize-window.png"/></a></div>
        </div>
        <div id="div_body">

            <details class="settingsPanel" ${settingsOpen ? "open" : ""}>
                <summary>Settings <span class="settingsChevron">▶</span></summary>
                <div class="settingsBody">

                    <div class="settingsGroup">
                        <div class="settingsGroupFields">
                            <div class="settingsFieldRow">
                                <label>construction time [hours] <a href="#" onclick="UI.InfoMessage(\`${message_info_construction}\`,15000)"><img src="https://dsen.innogamescdn.com/asset/dbeaf8db/graphic/questionmark.png" style="width: 12px; height: 12px"/></a></label>
                                <div class="settingsFieldValue">
                                    <input type="number" id="time_construction" class="scriptInput" placeholder="0" value="0">
                                </div>
                            </div>
                            <div class="settingsFieldRow">
                                <label>average factor [0-1] <a href="#" onclick="UI.InfoMessage(\`${message_info_factor}\`,20000)"><img src="https://dsen.innogamescdn.com/asset/dbeaf8db/graphic/questionmark.png" style="width: 12px; height: 12px"/></a></label>
                                <div class="settingsFieldValue">
                                    <input type="number" id="nr_average_factor" class="scriptInput" placeholder="1" value="1" min="0" max="1" step="0.1">
                                </div>
                            </div>
                            <div class="settingsFieldRow">
                                <label>number of clusters <a href="#" onclick="UI.InfoMessage(\`${message_info_cluster}\`,20000)"><img src="https://dsen.innogamescdn.com/asset/dbeaf8db/graphic/questionmark.png" style="width: 12px; height: 12px"/></a></label>
                                <div class="settingsFieldValue">
                                    <input type="number" id="nr_clusters" class="scriptInput" placeholder="1" value="1">
                                </div>
                            </div>
                            <div class="settingsFieldRow settingsFieldRow--checkbox">
                                <label>max construction <a href="#" onclick="UI.InfoMessage(\`${message_max_construction}\`,20000)"><img src="https://dsen.innogamescdn.com/asset/dbeaf8db/graphic/questionmark.png" style="width: 12px; height: 12px"/></a></label>
                                <div class="settingsFieldValue">
                                    <input type="checkbox" id="max_construction" class="scriptInput" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="settingsGroup">
                        <div class="settingsGroupTitle">Merchants</div>
                        <div class="settingsGroupFields">
                            <div class="settingsFieldRow">
                                <label>reserve <a href="#" onclick="UI.InfoMessage('Merchants withheld at each village so they aren\\'t used to send resources this run.',4500)"><img src="https://dsen.innogamescdn.com/asset/dbeaf8db/graphic/questionmark.png" style="width: 12px; height: 12px"/></a></label>
                                <div class="settingsFieldValue">
                                    <input type="number" id="nr_merchants_reserve" class="scriptInput" placeholder="15" value="0">
                                </div>
                            </div>
                            <div class="settingsFieldRow" ${showCapacity?"":'style="display:none"'} id="tr_merchant_capacity">
                                <label>capacity <a href="#" onclick="UI.InfoMessage('How much each merchant can carry on your server — 1000 on most worlds, 1500 on some.',4500)"><img src="https://dsen.innogamescdn.com/asset/dbeaf8db/graphic/questionmark.png" style="width: 12px; height: 12px"/></a></label>
                                <div class="settingsFieldValue">
                                    <div class="capacityToggle" id="capacity_toggle">
                                        <button type="button" data-value="1000" class="active">1000</button>
                                        <button type="button" data-value="1500">1500</button>
                                    </div>
                                </div>
                                <input type="number" id="merchant_capacity" value="1000" style="display:none">
                            </div>
                        </div>
                    </div>

                </div>
            </details>

            <center>
                <input class="btn evt-confirm-btn btn-confirm-yes startBalancing" type="button" onclick="settingsOpen=false; balancingResources()" value="start">
            </center>

            <div id="div_tables" hidden>
                <center><div id="table_stats" style="width:100%"></div></center><br>
                <center><div id="table_view" style="height:500px;width:100%;overflow:auto"></div></center>
            </div>
        </div>

        <div class="scriptFooter">
            <div><h5>original by Costache • optimized by amc</h5></div>
        </div>
    </div>`
    $("#div_container").remove()
    $("#contentContainer").eq(0).prepend(html_info);
    $("#mobileContent").eq(0).prepend(html_info);

    if(game_data.device != "desktop"){
    $("#div_body").css("max-height","500px")
}

    $("#div_container").css("position","fixed");
   $("#div_container").draggable()

    $("#div_container").css({left:0, right:0, top:0, bottom:0, margin:"auto"})
    document.getElementById("div_container").style.setProperty("height","fit-content","important")

    let isMinimized = false
    $("#div_minimize").on("click",()=>{
        isMinimized = !isMinimized
        if(isMinimized){
            $('#div_container').css({'width': minimizedWidth})
            $('#div_body').hide()
        }
        else{
            $('#div_container').css({'width': widthInterface})
            $('#div_body').show()
        }
    })

    if(localStorage.getItem(game_data.world+"settings_resources_balancer2")!=null ){
        let saved=JSON.parse(localStorage.getItem(game_data.world+"settings_resources_balancer2"))
        if(Array.isArray(saved)){
            saved={
                nr_merchants_reserve: saved[0],
                time_construction:    saved[1],
                nr_average_factor:    saved[2],
                nr_clusters:          saved[3],
                merchant_capacity:    saved[4],
                max_construction:     saved[5]
            }
        }
        Object.keys(saved).forEach(id=>{
            let el=document.getElementById(id)
            if(!el) return
            if(el.type==="checkbox") el.checked=saved[id]
            else el.value=saved[id]
        })
    }

    let capacityInput = document.getElementById("merchant_capacity")
    let capacityToggle = document.getElementById("capacity_toggle")
    function setCapacityActive(value){
        capacityToggle.querySelectorAll("button").forEach(btn=>{
            btn.classList.toggle("active", btn.dataset.value == value)
        })
    }
    setCapacityActive(capacityInput.value)
    capacityToggle.querySelectorAll("button").forEach(btn=>{
        btn.addEventListener("click",()=>{
            capacityInput.value = btn.dataset.value
            setCapacityActive(btn.dataset.value)
            capacityInput.dispatchEvent(new Event("change", {bubbles:true}))
        })
    })

    $("#div_container input[type=number], #div_container input[type=checkbox]").on("click input change",()=>{
        let settings_obj={}

        $('#div_container input[type=number], #div_container input[type=checkbox]').each(function(){
            settings_obj[this.id] = (this.type==="checkbox") ? this.checked : this.value
        });

        let data=JSON.stringify(settings_obj)
        let data_localStorage=localStorage.getItem(game_data.world+"settings_resources_balancer2")
        if(data!=data_localStorage){
            localStorage.setItem(game_data.world+"settings_resources_balancer2",data)
        }
    })

}

async function balancingResources(){

    let time_construction_total=parseFloat(document.getElementById("time_construction").value)
    let averageFactor=parseFloat(document.getElementById("nr_average_factor").value)
    let reserveMerchants=parseInt(document.getElementById("nr_merchants_reserve").value)
    let merchantCapacity=parseInt(document.getElementById("merchant_capacity").value)
    let nrClusters=parseInt(document.getElementById("nr_clusters").value)
    let maxConstruction=document.getElementById("max_construction").checked

    reserveMerchants=(Number.isNaN(reserveMerchants)==true || reserveMerchants<0 )?0:reserveMerchants
    nrClusters=(Number.isNaN(nrClusters)==true || nrClusters<1 )?1:nrClusters
    time_construction_total=(Number.isNaN(time_construction_total)==true || time_construction_total<0 )?20:time_construction_total
    time_construction_total=(time_construction_total > 50)?50:time_construction_total

    averageFactor=(Number.isNaN(averageFactor)==true)?1:(averageFactor<0)?0:(averageFactor>1)?1:averageFactor
    merchantCapacity=(Number.isNaN(merchantCapacity)==true)?1000:(merchantCapacity<1000)?1000:(merchantCapacity>1500)?1500:merchantCapacity

    $("#div_container").remove()
    let {list_production, map_farm_usage} = await getDataProduction().catch(err=>alert(err))
    let map_incoming = await getDataIncoming().catch(err=>alert(err))
    let map_resources_get_AM_data = await getResourcesForAM(map_farm_usage).catch(err=>alert(err))
    let list_production_home=JSON.parse(JSON.stringify(list_production))

    let map_resources_get_AM;
    if(time_construction_total > 0)
        map_resources_get_AM = map_resources_get_AM_data[time_construction_total - 1];
    else
        map_resources_get_AM = new Map();

    let start=new Date().getTime()

    let kmeans_coords=[]
    for(let i=0;i<list_production.length;i++){
        kmeans_coords.push([
                parseInt(list_production[i].coord.split("|")[0]),
                parseInt(list_production[i].coord.split("|")[1])
            ])
    }
    let options={
        numberOfClusters:nrClusters,
        maxIterations:100
    }
    let clusters= getClusters(kmeans_coords,options)

    let list_production_cluster=[]
    let list_production_home_cluster=[]
    let map_draw_on_map=new Map()

    for(let i=0;i<clusters.length;i++){
        let list_coords=clusters[i].data
        let list_prod=[],list_prod_home=[]
        for(let j=0;j<list_coords.length;j++){
            let coord=list_coords[j].join("|")
            for(let k=0;k<list_production.length;k++){
                if(list_production[k].coord == coord){
                    list_prod.push(list_production[k])
                    list_prod_home.push(list_production_home[k])

                    let total_resources_get=0
                    if(map_incoming.has(coord)){
                        total_resources_get=map_incoming.get(coord).wood+map_incoming.get(coord).stone+map_incoming.get(coord).iron
                    }
                    map_draw_on_map.set(list_production[k].id,{
                        label_cluster:i,
                        villageId:list_production[k].id,
                        total_resources_get:total_resources_get,
                        total_resources_send:0
                    })

                    break;
                }
            }
        }

        list_production_cluster.push(list_prod)
        list_production_home_cluster.push(list_prod_home)
    }

    let total_wood_home=0,total_stone_home=0,total_iron_home=0
    let avg_wood_total=0,avg_stone_total=0,avg_iron_total=0

    for(let i=0;i<list_production.length;i++){
        let coord=list_production[i].coord
        if(map_incoming.has(coord)){
            list_production[i].wood  += map_incoming.get(coord).wood
            list_production[i].stone += map_incoming.get(coord).stone
            list_production[i].iron  += map_incoming.get(coord).iron

            list_production[i].wood = Math.min(list_production[i].wood , list_production[i].capacity)
            list_production[i].stone= Math.min(list_production[i].stone, list_production[i].capacity)
            list_production[i].iron = Math.min(list_production[i].iron , list_production[i].capacity)

        }
        avg_wood_total +=list_production[i].wood/list_production.length
        avg_stone_total+=list_production[i].stone/list_production.length
        avg_iron_total +=list_production[i].iron/list_production.length

        total_wood_home +=list_production[i].wood
        total_stone_home+=list_production[i].stone
        total_iron_home +=list_production[i].iron
    }

    let list_launches, list_clusters_stats
    let total_wood_send_stats, total_stone_send_stats, total_iron_send_stats
    let total_wood_get_stats, total_stone_get_stats, total_iron_get_stats
    let constructionTimeCalculated = 0

    if(maxConstruction == false || averageFactor > 0.5){
        let launchesData = calculateLaunches(
            list_production_cluster,
            list_production_home_cluster,
            map_resources_get_AM,
            clusters,
            averageFactor,
            reserveMerchants,
            merchantCapacity
        )
        list_launches = launchesData.list_launches
        list_clusters_stats = launchesData.list_clusters_stats
        total_wood_send_stats = launchesData.total_wood_send_stats
        total_stone_send_stats = launchesData.total_stone_send_stats
        total_iron_send_stats = launchesData.total_iron_send_stats
        total_wood_get_stats = launchesData.total_wood_get_stats
        total_stone_get_stats = launchesData.total_stone_get_stats
        total_iron_get_stats = launchesData.total_iron_get_stats
    }
    else{
        let map_resources_get_AM = map_resources_get_AM_data[0];

        let launchesData = calculateLaunches(
            list_production_cluster,
            list_production_home_cluster,
            map_resources_get_AM,
            clusters,
            averageFactor,
            reserveMerchants,
            merchantCapacity
        )
        list_launches = launchesData.list_launches
        list_clusters_stats = launchesData.list_clusters_stats
        total_wood_send_stats = launchesData.total_wood_send_stats
        total_stone_send_stats = launchesData.total_stone_send_stats
        total_iron_send_stats = launchesData.total_iron_send_stats
        total_wood_get_stats = launchesData.total_wood_get_stats
        total_stone_get_stats = launchesData.total_stone_get_stats
        total_iron_get_stats = launchesData.total_iron_get_stats

        let count = 1;
        let maxConstruction = 100;
        while(count < maxConstruction){
            map_resources_get_AM = map_resources_get_AM_data[count];
            launchesData = calculateLaunches(
                list_production_cluster,
                list_production_home_cluster,
                map_resources_get_AM,
                clusters,
                averageFactor,
                reserveMerchants,
                merchantCapacity
            )
            let stats = launchesData.list_clusters_stats;
            let notEnoughRes = false;
            for(let i=0;i<stats.length;i++){
                if( stats[i].total_iron_get > stats[i].total_iron_send ||
                    stats[i].total_stone_get > stats[i].total_stone_send ||
                    stats[i].total_wood_get > stats[i].total_wood_send
                ){
                    notEnoughRes = true;
                    break;
                }
            }
            if(notEnoughRes){
                constructionTimeCalculated = count
                break;
            }

            if(count == maxConstruction - 1){
                constructionTimeCalculated = count
            }

            list_launches = launchesData.list_launches
            list_clusters_stats = launchesData.list_clusters_stats
            total_wood_send_stats = launchesData.total_wood_send_stats
            total_stone_send_stats = launchesData.total_stone_send_stats
            total_iron_send_stats = launchesData.total_iron_send_stats
            total_wood_get_stats = launchesData.total_wood_get_stats
            total_stone_get_stats = launchesData.total_stone_get_stats
            total_iron_get_stats = launchesData.total_iron_get_stats
            count++;
        }

    }

    list_clusters_stats.sort((o1,o2)=>{
        return (o1.max_distance > o2.max_distance)?-1:(o1.max_distance < o2.max_distance)?1:0
    })

    let map_nr_merchants=new Map()
    for(let i=0;i<list_launches.length;i++){
        let nr_merchants=list_launches[i].wood+list_launches[i].stone+list_launches[i].iron
        nr_merchants=Math.ceil(nr_merchants/merchantCapacity)

        if(map_nr_merchants.has(list_launches[i].coord_origin)){
            let nr_update=map_nr_merchants.get(list_launches[i].coord_origin)
            map_nr_merchants.set(list_launches[i].coord_origin,nr_merchants+nr_update)
        }
        else{
            map_nr_merchants.set(list_launches[i].coord_origin,nr_merchants)

        }
    }
    for(let i=0;i<list_production.length;i++){
        let nr_merchants=0
        if(map_nr_merchants.get(list_production[i].coord))
            nr_merchants=map_nr_merchants.get(list_production[i].coord)

        list_production[i].merchantAvailable = list_production[i].merchants - nr_merchants
    }

    let obj_stats={}
    obj_stats.avg_wood=Math.round(avg_wood_total)
    obj_stats.avg_stone=Math.round(avg_stone_total)
    obj_stats.avg_iron=Math.round(avg_iron_total)

    obj_stats.total_wood_send=Math.round(total_wood_send_stats)
    obj_stats.total_stone_send=Math.round(total_stone_send_stats)
    obj_stats.total_iron_send=Math.round(total_iron_send_stats)

    obj_stats.total_wood_get=Math.round(total_wood_get_stats)
    obj_stats.total_stone_get=Math.round(total_stone_get_stats)
    obj_stats.total_iron_get=Math.round(total_iron_get_stats)

    obj_stats.total_wood_home=Math.round(total_wood_home)
    obj_stats.total_stone_home=Math.round(total_stone_home)
    obj_stats.total_iron_home=Math.round(total_iron_home)

    for(let i=0;i<list_production.length;i++){
        for(let j=0;j<list_launches.length;j++){
            if(list_production[i].coord == list_launches[j].coord_destination){
                list_production[i].wood +=list_launches[j].wood
                list_production[i].stone+=list_launches[j].stone
                list_production[i].iron +=list_launches[j].iron
            }
            else if(list_production[i].coord == list_launches[j].coord_origin){
                list_production[i].wood -=list_launches[j].wood
                list_production[i].stone-=list_launches[j].stone
                list_production[i].iron -=list_launches[j].iron
            }
            list_production[i].result_wood =list_production[i].wood -Math.round(avg_wood_total)
            list_production[i].result_stone=list_production[i].stone-Math.round(avg_stone_total)
            list_production[i].result_iron =list_production[i].iron -Math.round(avg_iron_total)
            list_production[i].result_total=list_production[i].result_wood+list_production[i].result_stone+list_production[i].result_iron
        }

    }
    list_production.sort((o1,o2)=>{
        return (o1.result_total>o2.result_total)?1:(o1.result_total<o2.result_total)?-1:0
    })

    let map_launches_mass=new Map()

    for(let i=0;i<list_launches.length;i++){
        let target_id=list_launches[i].id_destination
        let origin_id=list_launches[i].id_origin
        let woodKey=`resource[${origin_id}][wood]`
        let stoneKey=`resource[${origin_id}][stone]`
        let ironKey=`resource[${origin_id}][iron]`
        let send_resources={}

        if(map_launches_mass.has(target_id)){
            let obj_update=map_launches_mass.get(target_id)
            obj_update.send_resources[woodKey]=list_launches[i].wood
            obj_update.send_resources[stoneKey]=list_launches[i].stone
            obj_update.send_resources[ironKey]=list_launches[i].iron

            obj_update.total_send+=list_launches[i].total_send
            obj_update.total_wood+=list_launches[i].wood
            obj_update.total_stone+=list_launches[i].stone
            obj_update.total_iron+=list_launches[i].iron

            obj_update.distance=Math.max(obj_update.distance,list_launches[i].distance)
            map_launches_mass.set(target_id,obj_update)

        }else{
            send_resources[woodKey]=list_launches[i].wood
            send_resources[stoneKey]=list_launches[i].stone
            send_resources[ironKey]=list_launches[i].iron

            map_launches_mass.set(target_id,{
                target_id:target_id,
                coord_destination:list_launches[i].coord_destination,
                name_destination:list_launches[i].name_destination,
                send_resources:send_resources,
                total_send:list_launches[i].total_send,
                total_wood:list_launches[i].wood,
                total_stone:list_launches[i].stone,
                total_iron:list_launches[i].iron,
                distance:list_launches[i].distance
            })
        }

        if(map_draw_on_map.has(target_id)){
            let obj_update=map_draw_on_map.get(target_id)
            obj_update.total_resources_get+=list_launches[i].wood+list_launches[i].stone+list_launches[i].iron
            map_draw_on_map.set(target_id,obj_update)
        }

        if(map_draw_on_map.has(origin_id)){
            let obj_update=map_draw_on_map.get(origin_id)
            obj_update.total_resources_send+=list_launches[i].wood+list_launches[i].stone+list_launches[i].iron

            map_draw_on_map.set(origin_id,obj_update)
        }

    }

    let list_launches_mass=Array.from(map_launches_mass.entries()).map(e=>e[1])
    list_launches_mass.sort((o1,o2)=>{
        return (o1.total_send > o2.total_send)?-1:(o1.total_send < o2.total_send)?1:0
    })

    let stop= new Date().getTime()

    createMainInterface()
    $("#div_tables").show()
    createTable(list_launches_mass,obj_stats,list_production,list_clusters_stats)
    if(constructionTimeCalculated){
        document.getElementById("time_construction").value = constructionTimeCalculated
    }

    if (typeof (TWMap) != 'undefined') {
        document.getElementById("map_container").remove()
        TWMap.mapHandler.spawnSector=originalSpawnSector

        let random_color=[]
        for(let i=0;i<clusters.length;i++){
            let opacity=0.2
            let randomColor=getRandomColor(opacity)
            random_color.push(randomColor)
        }

        addInfoOnMap(map_draw_on_map,random_color)
        TWMap.init();

    }

}

function calculateCapacityAwareAverage(list, resKey, capacityFactor=0.95){
    let total = 0
    for(let i=0;i<list.length;i++){
        total += list[i][resKey]
    }
    let count = list.length
    if(count === 0) return 0

    let avg = Math.floor(total / count)

    for(let i=0;i<list.length;i++){
        avg = Math.floor(total / count)
        let cap = list[i].capacity * capacityFactor
        if(cap < avg){
            total -= (avg - cap)
            count--
            if(count <= 0){
                count = 1
                break
            }
        }
    }
    avg = Math.floor(total / count)
    return avg
}

function calculateLaunches(
    list_production_cluster,
    list_production_home_cluster,
    map_resources_get_AM,
    clusters,
    averageFactor,
    reserveMerchants,
    merchantCapacity)
    {
    let list_launches=[]
    let list_clusters_stats=[]

    let total_wood_send_stats=0,total_stone_send_stats=0,total_iron_send_stats=0
    let total_wood_get_stats=0,total_stone_get_stats=0,total_iron_get_stats=0

    for(let i=0;i<list_production_cluster.length;i++){

        let list_prod=list_production_cluster[i]
        let list_prod_home=list_production_home_cluster[i]

        let avg_wood=0,avg_stone=0,avg_iron=0
        let avg_wood_factor=0,avg_stone_factor=0,avg_iron_factor=0
        let total_wood_send=0,total_stone_send=0,total_iron_send=0
        let total_wood_get=0,total_stone_get=0,total_iron_get=0
        let list_res_send=[],list_res_get=[]
        let total_wood_cluster=0,total_stone_cluster=0,total_iron_cluster=0

        for(let j=0;j<list_prod.length;j++){

            total_wood_cluster+=list_prod[j].wood
            total_stone_cluster+=list_prod[j].stone
            total_iron_cluster+=list_prod[j].iron

        }

        avg_wood  = calculateCapacityAwareAverage(list_prod,"wood")
        avg_stone = calculateCapacityAwareAverage(list_prod,"stone")
        avg_iron  = calculateCapacityAwareAverage(list_prod,"iron")

        avg_wood_factor   = avg_wood  * averageFactor
        avg_stone_factor  = avg_stone * averageFactor
        avg_iron_factor   = avg_iron  * averageFactor

        for(let j=0;j<list_prod.length;j++){
            let coord=list_prod[j].coord
            let name=list_prod[j].name
            let id=list_prod[j].id
            let merchants=list_prod[j].merchants
            merchants-=reserveMerchants

            let capacity=list_prod[j].capacity*0.95
            let capacity_travel=merchants*merchantCapacity

            let avg_wood_res = avg_wood_factor
            let avg_stone_res = avg_stone_factor
            let avg_iron_res = avg_iron_factor

            if(map_resources_get_AM.has(list_prod[j].coord)){
                let obj_res_AM = map_resources_get_AM.get(list_prod[j].coord)

                avg_wood_res  += obj_res_AM.total_wood
                avg_stone_res += obj_res_AM.total_stone
                avg_iron_res  += obj_res_AM.total_iron
                list_prod[j].time_finished=obj_res_AM.time_finished
            }
            else{
                list_prod[j].time_finished=0
            }

            let diff_wood =list_prod[j].wood - Math.round(avg_wood_res)
            let diff_stone =list_prod[j].stone - Math.round(avg_stone_res)
            let diff_iron =list_prod[j].iron - Math.round(avg_iron_res)

            diff_wood=(diff_wood < 0)?diff_wood:(list_prod_home[j].wood - diff_wood > 0)?diff_wood: (list_prod_home[j].wood)
            diff_stone=(diff_stone < 0)?diff_stone:(list_prod_home[j].stone - diff_stone > 0)?diff_stone: (list_prod_home[j].stone)
            diff_iron=(diff_iron < 0)?diff_iron:(list_prod_home[j].iron - diff_iron > 0)?diff_iron: (list_prod_home[j].iron)

            let total_res_available=0
            total_res_available=(diff_wood>0)?  total_res_available+diff_wood :  total_res_available
            total_res_available=(diff_stone>0)? total_res_available+diff_stone : total_res_available
            total_res_available=(diff_iron>0)?  total_res_available+diff_iron :  total_res_available

            let norm_factor=(capacity_travel <= total_res_available) ? capacity_travel/total_res_available:1
            let send_wood=0,send_stone=0,send_iron=0
            let get_wood=0,get_stone=0,get_iron=0

            send_wood =(diff_wood>0) ?  parseInt(diff_wood * norm_factor):send_wood
            send_stone=(diff_stone>0) ?  parseInt(diff_stone* norm_factor):send_stone
            send_iron =(diff_iron>0) ?  parseInt(diff_iron * norm_factor):send_iron

            get_wood =(diff_wood>0) ?get_wood :(list_prod[j].wood +Math.abs(diff_wood) < capacity)? Math.abs(diff_wood) : capacity-list_prod[j].wood
            get_stone=(diff_stone>0)?get_stone:(list_prod[j].stone+Math.abs(diff_stone)< capacity)? Math.abs(diff_stone): capacity-list_prod[j].stone
            get_iron =(diff_iron>0) ?get_iron :(list_prod[j].iron +Math.abs(diff_iron) < capacity)? Math.abs(diff_iron) : capacity-list_prod[j].iron

            total_wood_send+=send_wood
            total_stone_send+=send_stone
            total_iron_send+=send_iron

            total_wood_get+=get_wood
            total_stone_get+=get_stone
            total_iron_get+=get_iron

            let obj_send={
                coord:coord,
                id:id,
                name:name
            }
            let obj_get={
                coord:coord,
                id:id,
                name:name
            }

            obj_send.wood =(send_wood  > 0)?send_wood :0
            obj_send.stone=(send_stone > 0)?send_stone:0
            obj_send.iron =(send_iron  > 0)?send_iron :0
            if(obj_send.wood > 0 || obj_send.stone > 0 || obj_send.iron > 0)
                list_res_send.push(obj_send)

            obj_get.wood =(get_wood  > 0)?parseInt(get_wood) :0
            obj_get.stone=(get_stone > 0)?parseInt(get_stone):0
            obj_get.iron =(get_iron  > 0)?parseInt(get_iron) :0
            if(obj_get.wood > 0 || obj_get.stone > 0 || obj_get.iron > 0)
                list_res_get.push(obj_get)

        }

        let norm_wood=(total_wood_get>total_wood_send)?(total_wood_send/total_wood_get):1
        let norm_stone=(total_stone_get>total_stone_send)?(total_stone_send/total_stone_get):1
        let norm_iron=(total_iron_get>total_iron_send)?(total_iron_send/total_iron_get):1

        for(let j=0;j<list_res_get.length;j++){
            list_res_get[j].wood =parseInt(list_res_get[j].wood *norm_wood)
            list_res_get[j].stone=parseInt(list_res_get[j].stone*norm_stone)
            list_res_get[j].iron =parseInt(list_res_get[j].iron *norm_iron)
        }

        let list_maxDistance=[]
        let minim_resources= (merchantCapacity==1000)?700:1200

        const processPair = (g, s, distance) => {
            let send_wood =(s.wood  > 0) ? Math.min(g.wood , s.wood)  : 0
            let send_stone=(s.stone > 0) ? Math.min(g.stone, s.stone) : 0
            let send_iron =(s.iron  > 0) ? Math.min(g.iron , s.iron)  : 0

            g.wood  -= send_wood
            g.stone -= send_stone
            g.iron  -= send_iron

            s.wood  -= send_wood
            s.stone -= send_stone
            s.iron  -= send_iron

            let total_send=send_wood+send_stone+send_iron

            let restDivision=total_send%merchantCapacity
            if(restDivision < minim_resources){
                if(send_wood>restDivision){
                    send_wood-=restDivision
                    total_send-=restDivision
                }
                else if(send_stone>restDivision){
                    send_stone-=restDivision
                    total_send-=restDivision
                }
                else if(send_iron>restDivision){
                    send_iron-=restDivision
                    total_send-=restDivision
                }
            }

            list_maxDistance.push(distance)

            if(total_send>=minim_resources){
                list_launches.push({
                    total_send:total_send,
                    wood:send_wood,
                    stone:send_stone,
                    iron:send_iron,
                    coord_origin:s.coord,
                    name_origin:s.name,
                    id_destination:g.id,
                    id_origin:s.id,
                    coord_destination:g.coord,
                    name_destination:g.name,
                    distance:distance
                })
            }
        }

        const remainingTotal = (o) => o.wood + o.stone + o.iron

        let allPairs=[]
        for(let j=0;j<list_res_get.length;j++){
            for(let k=0;k<list_res_send.length;k++){
                allPairs.push({
                    j:j,
                    k:k,
                    distance:calcDistance(list_res_get[j].coord,list_res_send[k].coord)
                })
            }
        }
        allPairs.sort((o1,o2)=>{
            return (o1.distance>o2.distance)?1:(o1.distance<o2.distance)?-1:0
        })
        for(let p=0;p<allPairs.length;p++){
            let g=list_res_get[allPairs[p].j]
            let s=list_res_send[allPairs[p].k]
            if(remainingTotal(g)<=0 || remainingTotal(s)<=0) continue
            processPair(g,s,allPairs[p].distance)
        }

        for(let j=0;j<list_res_get.length;j++){
            let g=list_res_get[j]
            if(remainingTotal(g)<=0) continue

            for(let k=0;k<list_res_send.length;k++){
                list_res_send[k].distance=calcDistance(g.coord,list_res_send[k].coord)
            }
            list_res_send.sort((o1,o2)=>{
                return (o1.distance>o2.distance)?1:(o1.distance<o2.distance)?-1:0
            })

            for(let k=0;k<list_res_send.length;k++){
                let s=list_res_send[k]
                if(remainingTotal(s)<=0) continue
                processPair(g,s,s.distance)

                if(remainingTotal(g) < minim_resources){
                    break;
                }
            }
        }

        total_wood_send_stats +=total_wood_send
        total_stone_send_stats+=total_stone_send
        total_iron_send_stats +=total_iron_send

        total_wood_get_stats +=total_wood_get
        total_stone_get_stats+=total_stone_get
        total_iron_get_stats +=total_iron_get

        let max_distance=0
        for(let j=0;j<list_maxDistance.length;j++){
            if(max_distance < list_maxDistance[j])
                max_distance = list_maxDistance[j]
        }

        list_clusters_stats.push({
            nr_coords:clusters[i].data.length,
            center: parseInt(clusters[i].mean[0])+"|"+parseInt(clusters[i].mean[1]),
            max_distance:max_distance,

            avg_wood:Math.round(avg_wood),
            avg_stone:Math.round(avg_stone),
            avg_iron:Math.round(avg_iron),

            total_wood_send:total_wood_send,
            total_stone_send:total_stone_send,
            total_iron_send:total_iron_send,

            total_wood_get:total_wood_get,
            total_stone_get:total_stone_get,
            total_iron_get:total_iron_get,

            total_wood_cluster:total_wood_cluster,
            total_stone_cluster:total_stone_cluster,
            total_iron_cluster:total_iron_cluster
        })

    }

    return{
        list_clusters_stats: list_clusters_stats,
        list_launches: list_launches,

        total_wood_send_stats: total_wood_send_stats,
        total_stone_send_stats: total_stone_send_stats,
        total_iron_send_stats: total_iron_send_stats,

        total_wood_get_stats: total_wood_get_stats,
        total_stone_get_stats: total_stone_get_stats,
        total_iron_get_stats: total_iron_get_stats
    }
}

function buildUrl(path){
    let sitterParam = (game_data.player.sitter > 0) ? `t=${game_data.player.id}&` : ""
    return game_data.link_base_pure.replace("game.php?", `game.php?${sitterParam}`) + path
}

function getDataProduction(){

    return new Promise((resolve,reject)=>{
        let link_combined_production=buildUrl("overview_villages&mode=prod")
        let dataPage = httpGet(link_combined_production)
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(dataPage, 'text/html');
        let list_pages=[]

        if($(htmlDoc).find(".paged-nav-item").parent().find("select").length>0){
            Array.from($(htmlDoc).find(".paged-nav-item").parent().find("select").find("option")).forEach(function(item){
                list_pages.push(item.value)
            })
            list_pages.pop();
        }
        else if(htmlDoc.getElementsByClassName("paged-nav-item").length>0){
            let nr=0;
            Array.from(htmlDoc.getElementsByClassName("paged-nav-item")).forEach(function(item){
                let current=item.href;
                current=current.split("page=")[0]+"page="+nr
                nr++;
                list_pages.push(current);
            })
        }
        else{
            list_pages.push(link_combined_production);
        }
        list_pages=list_pages.reverse();

        let list_production=[]
        let map_farm_usage=new Map()
        function ajaxRequest (urls) {
            let current_url
            if(urls.length>0){
                current_url=urls.pop()
            }
            else{
                current_url="stop"
            }
            let start_ajax=new Date().getTime()
            if (urls.length >= 0 && current_url!="stop") {
                $.ajax({
                    url: current_url,
                    method: 'get',
                    success: (data) => {
                        const parser = new DOMParser();
                        const htmlDoc = parser.parseFromString(data, 'text/html');

                        if(game_data.device == "desktop"){
                            let table_production=Array.from($(htmlDoc).find(".row_a, .row_b"))
                            for(let i=0;i<table_production.length;i++){
                                let name=table_production[i].getElementsByClassName("quickedit-vn")[0].innerText
                                let coord=table_production[i].getElementsByClassName("quickedit-vn")[0].innerText.match(/[0-9]{3}\|[0-9]{3}/)[0]
                                let id=table_production[i].getElementsByClassName("quickedit-vn")[0].getAttribute("data-id")

                                let wood=parseInt(table_production[i].getElementsByClassName("wood")[0].innerText.replace(".",""))
                                let stone=parseInt(table_production[i].getElementsByClassName("stone")[0].innerText.replace(".",""))
                                let iron=parseInt(table_production[i].getElementsByClassName("iron")[0].innerText.replace(".",""))
                                let merchants=parseInt(table_production[i].querySelector("a[href*='market']").innerText.split("/")[0])
                                let merchants_total=parseInt(table_production[i].querySelector("a[href*='market']").innerText.split("/")[1])
                                let capacity=parseInt(table_production[i].children[4].innerText)
                                let points=parseInt(table_production[i].children[2].innerText.replace(".",""))
                                let farm_current_pop=parseInt(table_production[i].children[6].innerText.split("/")[0])
                                let farm_total_pop=parseInt(table_production[i].children[6].innerText.split("/")[1])
                                let farm_usage=farm_current_pop/farm_total_pop

                                let obj={
                                    coord:coord,
                                    id:id,
                                    wood:wood,
                                    stone:stone,
                                    iron:iron,
                                    name:name.trim(),
                                    merchants:merchants,
                                    merchants_total:merchants_total,
                                    capacity:capacity,
                                    points:points,

                                }
                                list_production.push(obj)

                                map_farm_usage.set(coord,farm_usage)
                            }
                        }
                        else{

                            let table_production = Array.from($(htmlDoc).find(".overview-container").find(".overview-container-item"))
                            for(let i=0;i<table_production.length;i++){
                                let name = $(table_production[i]).find(".quickedit-label").text().trim()
                                let coord = name.match(/\d+\|\d+/)[0]
                                let id = $(table_production[i]).find(".quickedit-vn").attr("data-id")

                                let wood = parseInt(table_production[i].getElementsByClassName("mwood")[0].innerText.replace(".",""))
                                let stone = parseInt(table_production[i].getElementsByClassName("mstone")[0].innerText.replace(".",""))
                                let iron = parseInt(table_production[i].getElementsByClassName("miron")[0].innerText.replace(".",""))
                                let merchants=parseInt($(table_production[i]).find(".vertical_center").text().trim())
                                let merchants_total=500
                                let capacity = parseInt(table_production[i].getElementsByClassName("ressources")[0].parentElement.innerText)
                                let points = parseInt($(table_production[i]).find(".grey").parent().text().replace(".",""))
                                let farm_current_pop=parseInt(table_production[i].getElementsByClassName("population")[0].parentElement.innerText.split("/")[0])
                                let farm_total_pop=parseInt(table_production[i].getElementsByClassName("population")[0].parentElement.innerText.split("/")[1])
                                let farm_usage=farm_current_pop/farm_total_pop

                                let obj={
                                    coord:coord,
                                    id:id,
                                    wood:wood,
                                    stone:stone,
                                    iron:iron,
                                    name:name,
                                    merchants:merchants,
                                    merchants_total:merchants_total,
                                    capacity:capacity,
                                    points:points,

                                }
                                list_production.push(obj)

                                map_farm_usage.set(coord,farm_usage)
                            }

                        }

                        let stop_ajax=new Date().getTime();
                        let diff=stop_ajax-start_ajax
                        window.setTimeout(function(){
                            ajaxRequest (list_pages)
                            UI.SuccessMessage("get production page: "+urls.length)
                        },200-diff)
                    },
                    error: (err)=>{
                        reject(err)
                    }
                })

            }
            else
            {
                UI.SuccessMessage("done")
                resolve({
                    list_production:list_production,
                    map_farm_usage:map_farm_usage
                })

            }
        }
        ajaxRequest(list_pages);

    })
}

function getDataIncoming(){
    return new Promise((resolve,reject)=>{
        let link_combined_production=buildUrl("overview_villages&mode=trader&type=inc")
        let dataPage = httpGet(link_combined_production)
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(dataPage, 'text/html');

        let list_pages=[]

        if($(htmlDoc).find(".paged-nav-item").parent().find("select").length>0){
            Array.from($(htmlDoc).find(".paged-nav-item").parent().find("select").find("option")).forEach(function(item){
                list_pages.push(item.value)
            })
            list_pages.pop();
        }
        else if(htmlDoc.getElementsByClassName("paged-nav-item").length>0){
            let nr=0;
            Array.from(htmlDoc.getElementsByClassName("paged-nav-item")).forEach(function(item){
                let current=item.href;
                current=current.split("page=")[0]+"page="+nr
                nr++;
                list_pages.push(current);
            })
        }
        else{
            list_pages.push(link_combined_production);
        }
        list_pages=list_pages.reverse();

        let  map_incoming=new Map()
        function ajaxRequest (urls) {
            let current_url
            if(urls.length>0){
                current_url=urls.pop()
            }
            else{
                current_url="stop"
            }
            let start_ajax=new Date().getTime()
            if (urls.length >= 0 && current_url!="stop") {
                $.ajax({
                    url: current_url,
                    method: 'get',
                    success: (data) => {
                        const parser = new DOMParser();
                        const htmlDoc = parser.parseFromString(data, 'text/html');
                        let table_incoming=Array.from($(htmlDoc).find(".row_a, .row_b"))

                        for(let i=0;i<table_incoming.length;i++){
                            let coord = ""
                            if(game_data.device == "desktop"){
                                coord=table_incoming[i].children[4].innerText.match(/[0-9]{3}\|[0-9]{3}/)[0]
                            }
                            else{
                                coord=table_incoming[i].children[3].innerText.match(/[0-9]{3}\|[0-9]{3}/g)[1]
                            }

                            let wood=parseInt($(table_incoming[i]).find(".wood").parent().text().replace(".",""))
                            let stone=parseInt($(table_incoming[i]).find(".stone").parent().text().replace(".",""))
                            let iron=parseInt($(table_incoming[i]).find(".iron").parent().text().replace(".",""))
                            wood=(Number.isNaN(wood) ==true)?0:wood
                            stone=(Number.isNaN(stone) ==true)?0:stone
                            iron=(Number.isNaN(iron) ==true)?0:iron

                            let obj={
                                wood:wood,
                                stone:stone,
                                iron:iron,
                            }
                            if(map_incoming.has(coord)){
                                let obj_update=map_incoming.get(coord)
                                obj_update.wood+=wood
                                obj_update.stone+=stone
                                obj_update.iron+=iron
                                map_incoming.set(coord,obj_update)
                            }
                            else{
                                map_incoming.set(coord,obj)
                            }
                        }
                        let stop_ajax=new Date().getTime();
                        let diff=stop_ajax-start_ajax
                        window.setTimeout(function(){
                            ajaxRequest (list_pages)
                            UI.SuccessMessage("get incoming page: "+urls.length)
                        },200-diff)
                    },
                    error:(err)=>{
                        reject(err)
                    }
                })

            }
            else
            {
                UI.SuccessMessage("done")
                resolve(map_incoming)

            }
        }
        ajaxRequest(list_pages);
    })

}

function httpGet(theUrl){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function calcDistance(coord1,coord2){
    let x1=parseInt(coord1.split("|")[0])
    let y1=parseInt(coord1.split("|")[1])
    let x2=parseInt(coord2.split("|")[0])
    let y2=parseInt(coord2.split("|")[1])

    return Math.sqrt( (x1-x2)*(x1-x2) +  (y1-y2)*(y1-y2) );
}

async function createTable(list_launches,obj_stats,list_production,list_clusters_stats){

    let html_prod_table=`
        <table  class="scriptTableAlternate">
        <tr>
            <td style="width:3%">nr</td>
            <td style="width:35%">target</td>
            <td><a href="#" id="sort_distance"><font color="${textColor}">max distance</font></a></td>
            <td><a href="#" id="sort_total"><font color="${textColor}">total send</font></a></td>
            <td class="hide_mobile"><a href="#" id="sort_wood"><img src="https://dsen.innogamescdn.com/asset/c2e59f13/graphic/buildings/wood.png"/></a></td>
            <td class="hide_mobile"><a href="#" id="sort_stone"><img src="https://dsen.innogamescdn.com/asset/c2e59f13/graphic/buildings/stone.png"/></a></td>
            <td class="hide_mobile"><a href="#" id="sort_iron"><img src="https://dsen.innogamescdn.com/asset/c2e59f13/graphic/buildings/iron.png"/></a></td>
            <td>send</td>
        </tr>`

    for(let i=0;i<list_launches.length;i++){
        let target_id = list_launches[i].target_id
        let wood = list_launches[i].total_wood
        let stone = list_launches[i].total_stone
        let iron = list_launches[i].total_iron
        let origin_id=list_launches[i].id_origin
        let data=JSON.stringify(list_launches[i].send_resources)

        html_prod_table+=`
            <tr id="delete_row" >
                <td>${i+1}</td>
                <td><a href="${game_data.link_base_pure}info_village&id=${list_launches[i].target_id}"><font color="${textColor}">${list_launches[i].name_destination}</font></a></td>
                <td>${list_launches[i].distance.toFixed(1)}</td>
                <td>${formatNumber(list_launches[i].total_send)}</td>
                <td class="hide_mobile">${formatNumber(wood)}</td>
                <td class="hide_mobile">${formatNumber(stone)}</td>
                <td class="hide_mobile">${formatNumber(iron)}</td>
                <td><input class="btn evt-confirm-btn btn-confirm-yes btn_send" target_id="${target_id}" data='${data}'  type="button" value="send"></td>

            </tr>`
    }

    html_prod_table+=`
        </table>`

    document.getElementById("table_view").innerHTML=html_prod_table

    if(game_data.device !="desktop")
        $(".hide_mobile").hide()

    $(".btn_send").on("click",async(event)=>{

        if($(event.target).is(":disabled")==false){
            let target_id=$(event.target).attr("target_id")
            let data=JSON.parse($(event.target).attr("data"))

            $(".btn_send").attr("disabled", true)

            let start=new Date().getTime()
            sendResources(target_id,data)
            let stop=new Date().getTime()
            let diff_time=stop-start

            window.setTimeout(()=>{
                $(event.target).closest("#delete_row").remove()
                $(".btn_send").attr("disabled", false)
            },200-diff_time)

        }

    })

    let html_stats_table=`
        <table id="table_stats" class="scriptTable">
        <tr>
            <td><input class="btn evt-confirm-btn btn-confirm-yes" id="btn_result" type="button" value="results"></td>
            <td><input class="btn evt-confirm-btn btn-confirm-yes" id="btn_cluster" type="button" value="clusters"></td>
            <td><img src="https://dsen.innogamescdn.com/asset/c2e59f13/graphic/buildings/wood.png"/></td>
            <td><img src="https://dsen.innogamescdn.com/asset/c2e59f13/graphic/buildings/stone.png"/></td>
            <td><img src="https://dsen.innogamescdn.com/asset/c2e59f13/graphic/buildings/iron.png"/></td>
        </tr>
        <tr>
            <td colspan="2">total</td>
            <td>${formatNumber(obj_stats.total_wood_home)}</td>
            <td>${formatNumber(obj_stats.total_stone_home)}</td>
            <td>${formatNumber(obj_stats.total_iron_home)}</td>

        </tr>
        <tr>
            <td colspan="2">average</td>
            <td>${formatNumber(obj_stats.avg_wood)}</td>
            <td>${formatNumber(obj_stats.avg_stone)}</td>
            <td>${formatNumber(obj_stats.avg_iron)}</td>
        </tr>
        <tr>
            <td colspan="2">surplus</td>
            <td>${formatNumber(obj_stats.total_wood_send)}</td>
            <td>${formatNumber(obj_stats.total_stone_send)}</td>
            <td>${formatNumber(obj_stats.total_iron_send)}</td>
        </tr>
        <tr>
            <td colspan="2">deficit</td>
            <td>${formatNumber(obj_stats.total_wood_get)}</td>
            <td>${formatNumber(obj_stats.total_stone_get)}</td>
            <td>${formatNumber(obj_stats.total_iron_get)}</td>
        </tr>

    </table>
    `
    document.getElementById("table_stats").innerHTML=html_stats_table

    $("#btn_result").on("click",()=>{
        createTableResults(list_production)
    })
    $("#btn_cluster").on("click",()=>{
        createTableClusters(list_clusters_stats)
    })

    document.getElementById("sort_distance").addEventListener("click",()=>{
        list_launches.sort((o1,o2)=>{
            return (parseFloat(o1.distance) > parseFloat(o2.distance))?1:(parseFloat(o1.distance) < parseFloat(o2.distance))?-1:0
        })
        document.getElementById("table_stats").innerHTML=""
        createTable(list_launches,obj_stats,list_production,list_clusters_stats)

    })
    document.getElementById("sort_total").addEventListener("click",()=>{
        list_launches.sort((o1,o2)=>{
            return (o1.total_send > o2.total_send)?-1:(o1.total_send < o2.total_send)?1:0
        })
        document.getElementById("table_view").innerHTML=""
        createTable(list_launches,obj_stats,list_production,list_clusters_stats)

    })
    document.getElementById("sort_wood").addEventListener("click",()=>{
        list_launches.sort((o1,o2)=>{
            return (o1.total_wood > o2.total_wood)?-1:(o1.total_wood < o2.total_wood)?1:0
        })
        document.getElementById("table_view").innerHTML=""
        createTable(list_launches,obj_stats,list_production,list_clusters_stats)

    })
    document.getElementById("sort_stone").addEventListener("click",()=>{
        list_launches.sort((o1,o2)=>{
            return (o1.total_stone > o2.total_stone)?-1:(o1.total_stone < o2.total_stone)?1:0
        })
        document.getElementById("table_view").innerHTML=""
        createTable(list_launches,obj_stats,list_production,list_clusters_stats)

    })
    document.getElementById("sort_iron").addEventListener("click",()=>{
        list_launches.sort((o1,o2)=>{
            return (o1.total_iron > o2.total_iron)?-1:(o1.total_iron < o2.total_iron)?1:0
        })
        document.getElementById("table_view").innerHTML=""
        createTable(list_launches,obj_stats,list_production,list_clusters_stats)

    })

    if(document.getElementsByClassName("btn_send").length>0){
        document.getElementsByClassName("btn_send")[0].focus()
    }

    window.onkeydown = function(e) {
        if(e.which == 13 ){

            if(document.getElementsByClassName("btn_send").length>0){
                document.getElementsByClassName("btn_send")[0].click()
            }
        }
    }

}

function formatNumber(number){
    return new Intl.NumberFormat().format(number)
}

function createTableResults(list_production){
    let html_end_result=`
    <center><div id="table_results" style="height:800px;width:800px;overflow:auto">
    <table id="table_stats"  class="scriptTableBalancerResult">
    <tr>
        <td>coord</td>
        <td ><a href="#" id="order_points"><font  color="${textColor}">points</font></a></td>
        <td style="width:10%"><a href="#" id="order_merchants"><font  color="${textColor}">merchants</font></a></td>
        <td >
            <img src="https://dsen.innogamescdn.com/asset/c2e59f13/graphic/buildings/main.png"/>
            <a href="#" id="order_hours"><font  color="${textColor}">[hours]</font></a>
        </td>
        <td colspan="2">
            <a href="#" class="order_deficit">
                <center style="margin:10px"><img src="https://dsen.innogamescdn.com/asset/c2e59f13/graphic/buildings/wood.png"/></center>
            </a>
        </td>
        <td colspan="2">
            <a href="#" class="order_deficit">
                <center style="margin:10px"><img src="https://dsen.innogamescdn.com/asset/c2e59f13/graphic/buildings/stone.png"/></center>
            </a>
        </td>
        <td colspan="2">
            <a href="#" class="order_deficit">
                <center style="margin:10px"><img src="https://dsen.innogamescdn.com/asset/c2e59f13/graphic/buildings/iron.png"/></center>
            </a>
        </td>
        <td >
            <a href="#" class="order_wh">
            <center style="margin:10px"><img src="https://dsen.innogamescdn.com/asset/04d88c84/graphic/buildings/storage.png"/></center>
            </a>
        </td>

    </tr>`

    for(let i=0;i<list_production.length;i++){

        let greenColor="#013e27",greenColorEven="#026440"
        let redColor="#5f0000",redColorEven="#9a0000"

        if(i%2!=0){
            header_status_wood =(parseInt(list_production[i].result_wood) >=0)?greenColor:redColor
            header_status_stone=(parseInt(list_production[i].result_stone)>=0)?greenColor:redColor
            header_status_iron =(parseInt(list_production[i].result_iron) >=0)?greenColor:redColor
        }
        else{
            header_status_wood =(parseInt(list_production[i].result_wood) >=0)?greenColorEven:redColorEven
            header_status_stone=(parseInt(list_production[i].result_stone)>=0)?greenColorEven:redColorEven
            header_status_iron =(parseInt(list_production[i].result_iron) >=0)?greenColorEven:redColorEven
        }

        html_end_result+=`
        <tr >
            <td><a href="${game_data.link_base_pure}info_village&id=${list_production[i].id}"><font color="${textColor}">${list_production[i].coord}</font></a>
            <td>${formatNumber(list_production[i].points)}</td>
            <td><b>${list_production[i].merchantAvailable}</b> / ${list_production[i].merchants_total}</td>
            <td>${formatNumber(parseInt(list_production[i].time_finished*10)/10)}</td>
            <td>${formatNumber(list_production[i].wood)}</td>
            <td style="background-color:${header_status_wood}">${formatNumber(list_production[i].result_wood)}</td>
            <td>${formatNumber(list_production[i].stone)}</td>
            <td style="background-color:${header_status_stone}">${formatNumber(list_production[i].result_stone)}</td>
            <td>${formatNumber(list_production[i].iron)}</td>
            <td style="background-color:${header_status_iron}">${formatNumber(list_production[i].result_iron)}</td>
            <td>${formatNumber(list_production[i].capacity)}</td>

        </tr>
        `
    }

    html_end_result+=`
    </table>
    </div></center>
    `
    Dialog.show("content",html_end_result)
    $("#order_points").on("click",()=>{
        list_production.sort((o1,o2)=>{
            return (o1.points>o2.points)?1:(o1.points<o2.points)?-1:0
        })
        $(".popup_box_close").click()
        createTableResults(list_production)

    })
    $("#order_merchants").on("click",()=>{
        list_production.sort((o1,o2)=>{
            return (o1.merchantAvailable>o2.merchantAvailable)?1:(o1.merchantAvailable<o2.merchantAvailable)?-1:0
        })
        $(".popup_box_close").click()
        createTableResults(list_production)

    })
    $("#order_hours").on("click",()=>{
        list_production.sort((o1,o2)=>{
            return (o1.time_finished>o2.time_finished)?-1:(o1.time_finished<o2.time_finished)?1:0
        })
        $(".popup_box_close").click()
        createTableResults(list_production)

    })
    $(".order_deficit").on("click",()=>{
        list_production.sort((o1,o2)=>{
            return (o1.result_total>o2.result_total)?1:(o1.result_total<o2.result_total)?-1:0

        })
        $(".popup_box_close").click()
        createTableResults(list_production)

    })
    $("#order_wh").on("click",()=>{
        list_production.sort((o1,o2)=>{
            return (o1.capacity>o2.capacity)?1:(o1.capacity<o2.capacity)?-1:0

        })
        $(".popup_box_close").click()
        createTableResults(list_production)

    })
}

function createTableClusters(list_clusters_stats){
    let html_end_result=`
    <center><div id="table_results" style="height:800px;width:700px;overflow:auto">
    <table id="table_stats" class="scriptTable">
    <tr>
        <td style="width:5%">nr</td>
        <td >coords/\ncluster</td>
        <td >center of cluster</td>
        <td style="width:50%">resources</td>
        <td >max distance</td>
    </tr>`

    for(let i=0;i<list_clusters_stats.length;i++){

        let gray="#202825",grayEven="#313e39"
        let header_status_wh = (i%2==0)?gray:grayEven

        html_end_result+=`
        <tr >
            <td>${i+1}</td>
            <td>${formatNumber(list_clusters_stats[i].nr_coords)}</td>
            <td>${list_clusters_stats[i].center}</td>
            <td >
                <table id="table_stats" class="scriptTableInner" >
                    <tr>
                        <td>type</td>
                        <td><img src="https://dsen.innogamescdn.com/asset/c2e59f13/graphic/buildings/wood.png"/></td>
                        <td><img src="https://dsen.innogamescdn.com/asset/c2e59f13/graphic/buildings/stone.png"/></td>
                        <td><img src="https://dsen.innogamescdn.com/asset/c2e59f13/graphic/buildings/iron.png"/></td>
                    </tr>
                    <tr>
                        <td>total</td>
                        <td>${formatNumber(list_clusters_stats[i].total_wood_cluster)}</td>
                        <td>${formatNumber(list_clusters_stats[i].total_stone_cluster)}</td>
                        <td>${formatNumber(list_clusters_stats[i].total_iron_cluster)}</td>
                    </tr>
                    <tr>
                        <td>average</td>
                        <td>${formatNumber(list_clusters_stats[i].avg_wood)}</td>
                        <td>${formatNumber(list_clusters_stats[i].avg_stone)}</td>
                        <td>${formatNumber(list_clusters_stats[i].avg_iron)}</td>
                    </tr>
                    <tr>
                        <td>surplus</td>
                        <td>${formatNumber(list_clusters_stats[i].total_wood_send)}</td>
                        <td>${formatNumber(list_clusters_stats[i].total_stone_send)}</td>
                        <td>${formatNumber(list_clusters_stats[i].total_iron_send)}</td>
                    </tr>
                    <tr>
                        <td>deficit</td>
                        <td>${formatNumber(list_clusters_stats[i].total_wood_get)}</td>
                        <td>${formatNumber(list_clusters_stats[i].total_stone_get)}</td>
                        <td>${formatNumber(list_clusters_stats[i].total_iron_get)}</td>
                    </tr>
                </table>
            </td>
            <td>${list_clusters_stats[i].max_distance.toFixed(1)}</td>
        </tr>
        `
    }

    html_end_result+=`
    </table>
    </div></center>
    `
    Dialog.show("content",html_end_result)
}

function sendResources(target_id,data) {
    let options={
        "village":target_id,
        "ajaxaction" : "call",
        "h" : window.csrf_token,
    }

    TribalWars.post("market",options, data, function(response) {
        UI.SuccessMessage(response.success,1000)
    }, function(error){
    });
}

async function getResourcesForAM(map_farm_usage){
    let {map_construction_templates, map_coord_templates, map_priortize_farm} = await getTemplates().catch(e=>alert(e))
    let map_buildings_data = await getDataBuildings().catch(e=>alert(e))

    let map_constants_buildings = getConstantsTwBuildings()

    let time_construction_total = 100
    let list_map_resources_get_AM = []

    return new Promise((resolve,reject)=>{

        for(let current_time_construction=1;current_time_construction <= time_construction_total;current_time_construction++){
            let map_resources_get_AM=new Map()
            let map_buildings = new Map(JSON.parse(JSON.stringify(Array.from(map_buildings_data.entries()))))

            Array.from(map_buildings.keys()).forEach(key=>{
                if(key.includes("_time_queued")){
                    map_resources_get_AM.set(key.replace("_time_queued",""),{
                        total_wood:0,
                        total_stone:0,
                        total_iron:0,
                        time_finished:Math.round(map_buildings.get(key)/3600)
                    })
                }
            })

            Array.from(map_coord_templates.keys()).forEach(key=>{
                let coord=key
                let count_time_construction=map_buildings.get(coord+"_time_queued")
                let template_name=map_coord_templates.get(coord)
                let list_template=map_construction_templates.get(template_name)
                let farmCapacity = map_priortize_farm.get(template_name) / 100

                if(map_buildings.get(coord+"_farm")<30 && map_farm_usage.get(coord) >= farmCapacity){
                    let lv_building_HQ=map_buildings.get(coord+"_main")
                    let lv_building_current=map_buildings.get(coord+"_farm")
                    let obj_constants_buildings=map_constants_buildings.get("farm")

                    lv_building_current++;
                    let list_info_construction=calculateTimeAndResConstruction(lv_building_HQ, lv_building_current, obj_constants_buildings)
                    let time_construction=list_info_construction[0]
                    let total_wood=list_info_construction[1]
                    let total_stone=list_info_construction[2]
                    let total_iron=list_info_construction[3]
                    count_time_construction+=time_construction

                    map_resources_get_AM.set(coord,{
                        total_wood:total_wood,
                        total_stone:total_stone,
                        total_iron:total_iron,
                        time_finished:count_time_construction/3600
                    })
                }

                for(let i=0;i<list_template.length;i++){
                    let name_building=list_template[i].name
                    let key_building=coord+"_"+name_building

                    let lv_building_AM=list_template[i].level_absolute
                    let lv_building_current=map_buildings.get(key_building)

                    if(lv_building_AM>lv_building_current){
                        let nr_levels=lv_building_AM-lv_building_current

                        for(let j=0;j<nr_levels;j++){

                            lv_building_current++
                            let lv_building_HQ=map_buildings.get(coord+"_main")
                            let obj_constants_buildings=map_constants_buildings.get(name_building)
                            let list_info_construction=calculateTimeAndResConstruction(lv_building_HQ, lv_building_current, obj_constants_buildings)
                            let time_construction=list_info_construction[0]
                            let total_wood=list_info_construction[1]
                            let total_stone=list_info_construction[2]
                            let total_iron=list_info_construction[3]

                            count_time_construction+=time_construction
                            if(map_resources_get_AM.has(coord)){
                                let obj_update = map_resources_get_AM.get(coord)
                                obj_update.total_wood += total_wood
                                obj_update.total_stone += total_stone
                                obj_update.total_iron += total_iron
                                obj_update.time_finished = count_time_construction/3600
                                map_resources_get_AM.set(coord,obj_update)

                            }
                            else{
                                map_resources_get_AM.set(coord,{
                                    total_wood:total_wood,
                                    total_stone:total_stone,
                                    total_iron:total_iron,
                                    time_finished:count_time_construction/3600
                                })
                            }

                            map_buildings.set(key_building,lv_building_current)

                            if(count_time_construction > current_time_construction * 3600){
                                break;
                            }

                        }
                    }

                    if(count_time_construction > current_time_construction * 3600){
                        break;
                    }
                }
            })

            list_map_resources_get_AM.push(map_resources_get_AM)

        }

        resolve(list_map_resources_get_AM)

    })

}

function getTemplates(){
    return new Promise((resolve,reject)=>{

        if(game_data.features.AccountManager.active == false){
            resolve({
                map_coord_templates:new Map(),
                map_construction_templates:new Map(),
                map_priortize_farm: new Map()
            })
        }

        let link_combined_production=buildUrl("am_village")
        let dataPage = httpGet(link_combined_production)
        const parserMain = new DOMParser();
        const htmlDocMain = parserMain.parseFromString(dataPage, 'text/html');
        let list_pages=[]

        if($(htmlDocMain).find("#village_table").prev().find("select").length>0){
            Array.from($(htmlDocMain).find("#village_table").prev().find("select").get(0)).forEach(function(item){
                list_pages.push(item.value)
            })
        }
        else if($(htmlDocMain).find("#village_table").prev().find(".paged-nav-item").length>0){
            let nr_pages=$(htmlDocMain).find("#village_table").prev().find(".paged-nav-item").length
            for(let i=nr_pages-2;i>=0;i--){
                let link=buildUrl(`am_village&page=${i}`)
                list_pages.push(link);
            }

        }
        else{
            list_pages.push(link_combined_production);
        }
        list_pages=list_pages.reverse();

        let map_coord_templates=new Map()
        let map_construction_templates=new Map()
        let map_priortize_farm=new Map()

        async function ajaxRequest (urls) {
            let current_url
            if(urls.length>0){
                current_url=urls.pop()
            }
            else{
                current_url="stop"
            }
            let start_ajax=new Date().getTime()
            if (urls.length >= 0 && current_url!="stop") {
                $.ajax({
                    url: current_url,
                    method: 'get',
                    success: (data) => {
                        const parser = new DOMParser();
                        const htmlDoc = parser.parseFromString(data, 'text/html');

                        let table_construction=Array.from($(htmlDoc).find(".row_a, .row_b"))
                        for(let i=0;i<table_construction.length;i++){
                            let coord=table_construction[i].children[0].innerText.match(/[0-9]{3}\|[0-9]{3}/)[0]
                            let template_name=table_construction[i].children[1].innerText.trim()
                            if(template_name!=""){
                                map_coord_templates.set(coord,template_name)
                                map_construction_templates.set(template_name,0)
                                map_priortize_farm.set(template_name,0)
                            }

                        }

                        let stop_ajax=new Date().getTime();
                        let diff=stop_ajax-start_ajax
                        window.setTimeout(function(){
                            ajaxRequest (list_pages)
                            UI.SuccessMessage("get AM construction page: "+urls.length)
                        },200-diff)
                    },
                    error:(err)=>{
                        reject(err)
                    }
                })

            }
            else
            {
                let table_name_tamplate=Array.from($(htmlDocMain).find("select[name=template]").eq(0).find("option"))
                for(let i=0;i<table_name_tamplate.length;i++){

                    let link=buildUrl(`am_village&mode=queue&template=${table_name_tamplate[i].value}`)
                    let name
                    if(i<3)
                        name=table_name_tamplate[i].innerText.replaceAll("\n","").replaceAll("\t","").replace(/\(\w+\)/,"")
                    else
                        name=table_name_tamplate[i].innerText.replaceAll("\n","").replaceAll("\t","")

                    if(map_construction_templates.has(name)){
                        let data=await ajaxPromise(link)
                        const parser = new DOMParser();
                        const htmlDoc = parser.parseFromString(data, 'text/html');

                        let template_construction=[]
                        Array.from($(htmlDoc).find(".sortable_row")).forEach(item=>{
                            template_construction.push({
                                name:item.getAttribute("data-building"),
                                level_relative:parseInt($(item).find(".level_relative").text()),
                                level_absolute:parseInt($(item).find(".level_absolute").text().match(/\d+/)[0])
                            })
                        })
                        map_construction_templates.set(name,template_construction)

                        let farmMaxCapacity = 99;
                        let hasCustomCapacity = $(htmlDoc).find("input[name=farm_upgrade_toggle]").eq(0).is(":checked")

                        if(hasCustomCapacity){
                            farmMaxCapacity = 100 - parseInt($(htmlDoc).find("select[name=population_upgrades]").val())
                        }
                        map_priortize_farm.set(name, farmMaxCapacity)
                    }

                }

                UI.SuccessMessage("done")
                resolve({
                    map_coord_templates:map_coord_templates,
                    map_construction_templates:map_construction_templates,
                    map_priortize_farm: map_priortize_farm
                })

            }
        }
        ajaxRequest(list_pages);
    })

}

function ajaxPromise(link){
    return new Promise((resolve,reject)=>{

        let startAjax=new Date().getTime()
        $.ajax({
            url: link,
            method: 'get',
            success: (data) => {

                let stopAjax=new Date().getTime()
                let difAjax=stopAjax-startAjax
                window.setTimeout(()=>{
                    resolve(data)
                },200-difAjax)

            },error:(data)=>{
                reject(data)
            }

        })
    })
}

function getDataBuildings(){

    return new Promise((resolve,reject)=>{
        let link_combined_production=buildUrl("overview_villages&mode=buildings")
        let dataPage = httpGet(link_combined_production)
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(dataPage, 'text/html');
        let list_pages=[]

        if($(htmlDoc).find(".paged-nav-item").parent().find("select").length>0){
            Array.from($(htmlDoc).find(".paged-nav-item").parent().find("select").find("option")).forEach(function(item){
                list_pages.push(item.value)
            })
            list_pages.pop();
        }
        else if(htmlDoc.getElementsByClassName("paged-nav-item").length>0){
            let nr=0;
            Array.from(htmlDoc.getElementsByClassName("paged-nav-item")).forEach(function(item){
                let current=item.href;
                current=current.split("page=")[0]+"page="+nr
                nr++;
                list_pages.push(current);
            })

        }
        else{
            list_pages.push(link_combined_production);
        }
        list_pages=list_pages

        let  map_buildings=new Map()
        function ajaxRequest (urls) {
            let current_url
            if(urls.length>0){
                current_url=urls.pop()
            }
            else{
                current_url="stop"
            }
            let start_ajax=new Date().getTime()
            if (urls.length >= 0 && current_url!="stop") {
                $.ajax({
                    url: current_url,
                    method: 'get',
                    success: (data) => {
                        const parser = new DOMParser();
                        const htmlDoc = parser.parseFromString(data, 'text/html');

                        if(game_data.device == "desktop"){
                            let table_buildings=Array.from($(htmlDoc).find(".row_a, .row_b"))
                            for(let i=0;i<table_buildings.length;i++){
                                let coord=$(table_buildings[i]).find(".nowrap").text().match(/[0-9]{3}\|[0-9]{3}/)[0]
                                let time_last_construction=$(table_buildings[i]).find(".queue_icon img").last().attr("title")
                                if(time_last_construction==undefined){
                                    time_last_construction=0
                                }
                                else{
                                    time_last_construction=time_last_construction.split("-")[1]
                                    time_last_construction=getFinishTime(time_last_construction)

                                }
                                map_buildings.set(coord+"_time_queued",time_last_construction)

                                let buildings=$(table_buildings[i]).find(".upgrade_building")
                                for(let j=0;j<buildings.length;j++){
                                    let name=buildings[j].classList[1].replace("b_","")
                                    let level=parseInt(buildings[j].innerText)
                                    let key=coord+"_"+name
                                    map_buildings.set(key,level)
                                }

                                let list_queued=Array.from($(table_buildings[i]).find(".queue_icon img")).map(e => e.src.match(/\w+\.(webp|png)/)[0].replace(/\.(webp|png)/, ""));
                                for(let j=0;j<list_queued.length;j++){
                                    let key=coord+"_"+list_queued[j]

                                    if(map_buildings.has(key)){
                                        let value=map_buildings.get(key)
                                        map_buildings.set(key,value+1)
                                    }else{
                                        map_buildings.set(key,1)
                                    }
                                }

                            }
                        }
                        else{
                            let table_buildings=Array.from($(htmlDoc).find(".row_a, .row_b"))
                            for(let i=0;i<table_buildings.length;i++){

                                let coord = $(table_buildings[i]).find(".nowrap").text().match(/[0-9]{3}\|[0-9]{3}/)[0]
                                let time_last_construction = $(table_buildings[i].nextElementSibling.nextElementSibling).find("img").last().attr("title")
                                if(time_last_construction==undefined){
                                    time_last_construction=0
                                }
                                else{
                                    time_last_construction=time_last_construction.split("-")[1]
                                    time_last_construction=getFinishTime(time_last_construction)

                                }
                                map_buildings.set(coord+"_time_queued",time_last_construction)

                                let buildingsLevel = $(table_buildings[i].nextElementSibling).find('table').find('td')
                                let buildingsName = $(table_buildings[i].nextElementSibling).find('table').find('th')
                                for(let j=0;j<buildingsLevel.length;j++){
                                    let name=buildingsName[j].getElementsByTagName("img")[0].src.split("buildings/")[1].replace(".png","")
                                    let level=parseInt(buildingsLevel[j].innerText)
                                    let key=coord+"_"+name
                                    map_buildings.set(key,level)
                                }

                                let list_queued=Array.from($(table_buildings[i].nextElementSibling.nextElementSibling).find("img")).map(e => e.src.match(/\w+\.(webp|png)/)[0].replace(/\.(webp|png)/, ""));
                                for(let j=0;j<list_queued.length;j++){
                                    let key=coord+"_"+list_queued[j]

                                    if(map_buildings.has(key)){
                                        let value=map_buildings.get(key)
                                        map_buildings.set(key,value+1)
                                    }else{
                                        map_buildings.set(key,1)
                                    }
                                }

                            }

                        }

                        let stop_ajax=new Date().getTime();
                        let diff=stop_ajax-start_ajax
                        window.setTimeout(function(){
                            ajaxRequest (list_pages)
                            UI.SuccessMessage("get building page: "+urls.length)
                        },200-diff)
                    },
                    error: (err)=>{
                        reject(err)
                    }
                })

            }
            else
            {
                UI.SuccessMessage("done")
                resolve(map_buildings)

            }
        }
        ajaxRequest(list_pages);

    })
}

function getFinishTime(time_finished){
    var date_finished=""
    let server_date=document.getElementById("serverDate").innerText.split("/")
    if(time_finished.includes(lang["aea2b0aa9ae1534226518faaefffdaad"].replace(" %s",""))){
        date_finished=server_date[1]+"/"+server_date[0]+"/"+server_date[2]+" "+time_finished.match(/\d+:\d+/)[0]
    }
    else if(time_finished.includes(lang["57d28d1b211fddbb7a499ead5bf23079"].replace(" %s",""))){
        var tomorrow_date=new Date(server_date[1]+"/"+server_date[0]+"/"+server_date[2]);
        tomorrow_date.setDate(tomorrow_date.getDate()+1);
        date_finished= ("0"+(tomorrow_date.getMonth()+1)).slice(-2)+"/"+("0"+tomorrow_date.getDate()).slice(-2)+"/"+tomorrow_date.getFullYear()+" "+time_finished.match(/\d+:\d+/)[0];
    }else if(time_finished.includes(lang["0cb274c906d622fa8ce524bcfbb7552d"].split(" ")[0])){
        var on=time_finished.match(/\d+.\d+/)[0].split(".");
        date_finished=on[1]+"/"+on[0]+"/"+server_date[2]+" "+time_finished.match(/\d+:\d+/)[0];
    }
    date_finished=new Date(date_finished)

    let serverTime=document.getElementById("serverTime").innerText
    let serverDate=document.getElementById("serverDate").innerText.split("/")
    serverDate=serverDate[1]+"/"+serverDate[0]+"/"+serverDate[2]
    let date_current=new Date(serverDate+" "+serverTime)

    let result_seconds=parseInt((date_finished.getTime()-date_current.getTime())/1000)

    if(result_seconds < 0){
        date_finished.setDate(date_finished.getDate()+1)
        result_seconds=parseInt((date_finished.getTime()-date_current.getTime())/1000)
    }

    return result_seconds;
}

function getConstantsTwBuildings(){
    if (localStorage.getItem(game_data.world+"constantBuildings") !== null) {
        let map_constants_buildings = new Map(JSON.parse(localStorage.getItem(game_data.world+"constantBuildings")))
        return map_constants_buildings
    }
    else{
            let data=httpGet("/interface.php?func=get_building_info")

            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(data, 'text/html');
            let map_constants_buildings=new Map()
            let list_buildings=htmlDoc.getElementsByTagName("config")[0].children
            for(let i=0;i<list_buildings.length;i++){
                let name_building=list_buildings[i].tagName.toLowerCase()
                let wood=Number(list_buildings[i].getElementsByTagName("wood")[0].innerText)
                let stone=Number(list_buildings[i].getElementsByTagName("stone")[0].innerText)
                let iron=Number(list_buildings[i].getElementsByTagName("iron")[0].innerText)

                let wood_factor=Number(list_buildings[i].getElementsByTagName("wood_factor")[0].innerText)
                let stone_factor=Number(list_buildings[i].getElementsByTagName("stone_factor")[0].innerText)
                let iron_factor=Number(list_buildings[i].getElementsByTagName("iron_factor")[0].innerText)

                let build_time=Number(list_buildings[i].getElementsByTagName("build_time")[0].innerText)
                let build_time_factor=Number(list_buildings[i].getElementsByTagName("build_time_factor")[0].innerText)

                map_constants_buildings.set(name_building,{
                    wood:wood,
                    stone:stone,
                    iron:iron,
                    wood_factor:wood_factor,
                    stone_factor:stone_factor,
                    iron_factor:iron_factor,
                    build_time:build_time,
                    build_time_factor:build_time_factor
                })
            }
            let data_save=JSON.stringify(Array.from(map_constants_buildings.entries()))
            localStorage.setItem(game_data.world+"constantBuildings",data_save);
        return map_constants_buildings
    }

}

function calculateTimeAndResConstruction(hq, level, obj_data) {

    let constantLvl={
        1:1,
        2:1,
        3:0.112292,
        4:0.289555,
        5:0.46113,
        6:0.606372,
        7:0.723059,
        8:0.815935,
        9:0.889947,
        10:0.948408,
        11:0.994718,
        12:1.031,
        13:1.059231,
        14:1.080939,
        15:1.09729,
        16:1.109156,
        17:1.117308,
        18:1.122392,
        19:1.124817,
        20:1.124917,
        21:1.123181,
        22:1.119778,
        23:1.114984,
        24:1.109038,
        25:1.102077,
        26:1.0942,
        27:1.085601,
        28:1.076369,
        29:1.066566,
        30:1.056291,
    }

    var buildTime = obj_data.build_time * Math.pow(1.2, (level -1)) * Math.pow(1.05, -hq) * constantLvl[level]

    let total_wood = Math.round(obj_data.wood * Math.pow(obj_data.wood_factor, level - 1))
    let total_stone = Math.round(obj_data.stone * Math.pow(obj_data.stone_factor, level - 1))
    let total_iron = Math.round(obj_data.iron * Math.pow(obj_data.iron_factor, level - 1))

    return [Math.round(buildTime), total_wood , total_stone, total_iron];
}

function getClusters(data, options) {
    let result_cluster=[]
    let maxDistanceGlobal=999999;
    let repeat=50;

    for(let rep=0;rep<repeat;rep++){
        let result=insideGetCluster(data,options)
        if(maxDistanceGlobal > result.maxDistance){
            maxDistanceGlobal=result.maxDistance
            result_cluster=result
        }
    }

    return result_cluster
}

function insideGetCluster(data,options){
    var numberOfClusters, distanceFunction, vectorFunction, minMaxValues, maxIterations;

    if (!options || !options.numberOfClusters) { numberOfClusters = 1 }
    else { numberOfClusters = options.numberOfClusters; }

    if (!options || !options.distanceFunction) { distanceFunction = getDistance; }
    else { distanceFunction = options.distanceFunction; }

    if (!options || !options.vectorFunction) { vectorFunction = defaultVectorFunction; }
    else { vectorFunction = options.vectorFunction; }

    if (!options || !options.maxIterations) { maxIterations = 1000; }
    else { maxIterations = options.maxIterations; }

    let result_cluster=getClustersWithParams(data, numberOfClusters, distanceFunction, vectorFunction, maxIterations).clusters;

    let maxDistance=0;
    for(let i=0;i<result_cluster.length;i++){
        let list_coord=result_cluster[i].data
        for(let j=0;j<list_coord.length;j++){
            for(let k=j+1;k<list_coord.length;k++){
                let dist=getDistance(list_coord[j],list_coord[k])
                maxDistance=(maxDistance > dist)?maxDistance:dist
            }
        }
    }
    result_cluster.maxDistance=maxDistance
    return result_cluster

}

function getClustersWithParams(data ,numberOfClusters, distanceFunction, vectorFunction, maxIterations) {

    let means=[]
    for(let i=0;i<numberOfClusters;i++){
        let random_index=parseInt(Math.random()*Object.keys(data).length)
        means.push(data[random_index])
    }

    var clusters = createClusters(means);

    var prevMeansDistance = 999999;

    var numOfInterations = 0;
    var iterations = [];

    while(numOfInterations < maxIterations) {

        initClustersData(clusters);

        assignDataToClusters(data, clusters, distanceFunction, vectorFunction);

        updateMeans(clusters, vectorFunction);

        var meansDistance = getMeansDistance(clusters, vectorFunction, distanceFunction);

        numOfInterations++;
    }

    return { clusters: clusters, iterations: iterations };
}

function defaultVectorFunction(vector) {
    return vector;
}

function getMeansDistance(clusters, vectorFunction, distanceFunction) {

    var meansDistance = 0;

    clusters.forEach(function (cluster) {

        cluster.data.forEach(function (vector) {

            meansDistance = meansDistance + Math.pow(distanceFunction(cluster.mean, vectorFunction(vector)), 2);
        });
    });

    return meansDistance;
}

function updateMeans(clusters, vectorFunction) {

    clusters.forEach(function (cluster) {
        updateMean(cluster, vectorFunction);

    });
}

function updateMean(cluster, vectorFunction) {

    var newMean = [];

    for (var i = 0; i < cluster.mean.length; i++) {
        newMean.push(getMean(cluster.data, i, vectorFunction));
    };

    cluster.mean = newMean;

}

function getMean(data, index, vectorFunction) {
    var sum =  0;
    var total = data.length;

    if(total == 0) return 0;

    data.forEach(function (vector) {

            sum = sum + vectorFunction(vector)[index];
    });

    return sum / total;
}

function assignDataToClusters(data, clusters, distanceFunction, vectorFunction) {

    data.forEach(function (vector) {
        var cluster = findClosestCluster(vectorFunction(vector), clusters, distanceFunction);

        if(!cluster.data) cluster.data = [];

        cluster.data.push(vector);
    });
}

function findClosestCluster(vector, clusters, distanceFunction) {

    var closest = {};
    var minDistance = 9999999;

    clusters.forEach(function (cluster) {

        var distance = distanceFunction(cluster.mean, vector);
        if (distance < minDistance) {
            minDistance = distance;
            closest = cluster;
        };
    });

    return closest;
}

function initClustersData(clusters) {
    clusters.forEach(function (cluster) {
        cluster.data = [];
    });
}

function createClusters(means) {
    var clusters = [];

    means.forEach(function (mean) {
        var cluster = { mean : mean, data : []};

        clusters.push(cluster);
    });

    return clusters;
}

function getDistance(vector1, vector2) {
    var sum = 0;

    for (var i = 0; i < vector1.length; i++) {
        sum = sum + Math.pow(vector1[i] - vector2[i],2)
    };

    return Math.sqrt(sum);

}

function addInfoOnMap(mapInfoResources,random_color){
    let drawInfo=true
    TWMap.mapHandler.spawnSector = function (data, sector) {
        originalSpawnSector.call(TWMap.mapHandler, data, sector);

        if(drawInfo==true){
            drawInfo=false
            window.setTimeout(() => {

                let visibleSectors=TWMap.map._visibleSectors
                Object.keys(visibleSectors).forEach(key=>{
                    let elements=visibleSectors[key]._elements
                    Object.keys(elements).forEach(key=>{
                        let villageId=elements[key].id.match(/\d+/)
                        if(villageId!=null){
                            if(mapInfoResources.has(villageId[0])){
                                let obj=mapInfoResources.get(villageId[0])
                                createMapInfo(obj,random_color[obj.label_cluster])
                            }
                        }
                    })
                })
                drawInfo=true
            }, 50);
        }
    };
}

function createMapInfo(obj,random_color){

    try {
        if(document.getElementById(`info_extra${obj.villageId}`) == null ){
            let greenColor="#026440"
            let redColor="#E80000"
            let villageImg=document.getElementById(`map_village_${obj.villageId}`)

            let parent=document.getElementById(`map_village_${obj.villageId}`).parentElement
            let leftImg=villageImg.style.left
            let topImg=villageImg.style.top

            while(document.getElementById(`map_icons_${obj.villageId}`)!=null){
                document.getElementById(`map_icons_${obj.villageId}`).remove()
            }
            if(document.getElementById(`map_cmdicons_${obj.villageId}_0`)!=null)
                document.getElementById(`map_cmdicons_${obj.villageId}_0`).remove()
            if(document.getElementById(`map_cmdicons_${obj.villageId}_1`)!=null)
                document.getElementById(`map_cmdicons_${obj.villageId}_1`).remove()

            let html_info=`
                <div class="border_info" id="info_extra${obj.villageId}" style="position:absolute;left:${leftImg};top:${topImg};width:51px;height:36px;z-index:3; ${`background-color:${random_color.colorOpacity};outline:${random_color.color} solid 2px`}"></div>
                <center><font color="${textColor}"  class="shadow20" style="position:absolute;left:${leftImg};top:${topImg};width:14px;height:14px;z-index:4;margin-left:0px;; font-size: 12px">nr:${obj.label_cluster} </font></center>
                <center><font color="${greenColor}"  class="shadow20" style="position:absolute;left:${leftImg};top:${topImg};width:14px;height:14px;z-index:4;margin-left:0px;margin-top:11px; font-size: 12px">${parseInt(obj.total_resources_get/1000)}k </font></center>
                <center><font color="${redColor}"  class="shadow20" style="position:absolute;left:${leftImg};top:${topImg};width:14px;height:14px;z-index:4;margin-left:0px;margin-top:23px; font-size: 12px">${parseInt(obj.total_resources_send/1000)}k </font></center>
                `
            $(html_info).appendTo(parent);

        }

    } catch (error) {

    }
}

function getRandomColor(opacity) {
    let  color = 'rgb(';
    let colorOpacity = 'rgba(';

    for (let i = 0; i < 3; i++) {
        let randomNr=Math.floor(Math.random() * 255)
        color += randomNr + ',';
        colorOpacity += randomNr + ',';

    }
    color=color.substr(0,color.length-1)  + ')';
    colorOpacity=colorOpacity + opacity + ')';

    return {
        color:color,
        colorOpacity:colorOpacity
    }

}
