(function() {

var scriptName = "Barb List";
var scriptTag = "fmBarbList";
var runScreen = "screen=map";
var sitter = "";
var barbList = [];
var fmBarbSettings;

function main(){
    if($(`#${scriptTag}_popup_container`).length){
        UI.ErrorMessage("Script has already been loaded, reload the page before calling it again");
        return;
    }
    let sitterQuery = window.location.search.match(/t=\d+/g);
    if(sitterQuery)
        sitter = sitterQuery;
    if(window.location.href.indexOf(`${runScreen}`)==-1){
        UI.ErrorMessage("Script must be run in map");
        window.location.href = window.location.pathname + `?${sitter?sitter+"&":""}${runScreen}`;
        return;
    }
    getCache();
    setHTML();
}

function getCache(){
    let cached = window.localStorage.getItem(`${scriptTag}_Settings`);
    fmBarbSettings = cached ? JSON.parse(cached) : {mode:"loaded", radius:30, format:"coords"};
}

function setCache(){
    window.localStorage.setItem(`${scriptTag}_Settings`, JSON.stringify(fmBarbSettings));
}

function setHTML(){
    let html = `
    <div id="${scriptTag}_popup_container" class="fm_popup_container">
        <div>
            <a class="popup_box_close tooltip-delayed" id="${scriptTag}_popup_cross" href="javascript:void(0)"></a>
            <div id="${scriptTag}_popup_content" class="fm_popup_content">
                <h3 class="fm_centered">${scriptName}</h3>
                <div style="padding:5px;">
                    <select id="${scriptTag}_mode" style="width:100%;">
                        <option value="loaded">Currently loaded map view</option>
                        <option value="radius">Live scan: within radius</option>
                    </select>
                    <br><br>
                    <div id="${scriptTag}_radiusRow" style="display:none;">
                        <span>Radius (tiles): </span>
                        <input type="text" id="${scriptTag}_radius" value="${fmBarbSettings.radius}" size="4">
                    </div>
                    <input type="submit" class="btn btn-confirm-yes" id="${scriptTag}_scan" value="Scan">
                    <br><br>
                    <span><b id="${scriptTag}_count">0</b> barbarian villages found</span>
                    <br><br>
                    <textarea id="${scriptTag}_textarea" rows="8" cols="20" readonly></textarea>
                    <br><br>
                    <select id="${scriptTag}_format">
                        <option value="coords">x|y</option>
                        <option value="coords_comma">x|y,</option>
                        <option value="link">BB link</option>
                    </select>
                    <input type="submit" class="btn btn-confirm-yes" id="${scriptTag}_copy" value="Copy to clipboard">
                </div>
            </div>
        </div>
    </div>
    <style>
        .fm_popup_container {
            border: 19px solid #804000;
            -moz-border-image: url("/graphic/popup/border.png") 9 19 19 19 repeat;
            -webkit-border-image: url("/graphic/popup/border.png") 9 19 19 19 repeat;
            -o-border-image: url("/graphic/popup/border.png") 19 19 19 19 repeat;
            border-image: url("/graphic/popup/border.png") 19 19 19 19 repeat;
            display: block;
            position: fixed;
            top: 8%;
            left: 70%;
            z-index: 14000;
        }
        .fm_popup_content {
            min-width: 230px;
            padding: 5px;
            background-image: url('/graphic/popup/content_background.png');
        }
        .fm_centered { text-align: center; }
        #${scriptTag}_textarea { width: 100%; box-sizing: border-box; resize: vertical; }
        #${scriptTag}_scan, #${scriptTag}_copy { margin-top: 6px; }
    </style>`;

    $("body").append(html);
    $(`#${scriptTag}_popup_container`).draggable();
    $(`#${scriptTag}_popup_cross`).click(()=> $(`#${scriptTag}_popup_container`).remove());

    $(`#${scriptTag}_mode`).val(fmBarbSettings.mode);
    $(`#${scriptTag}_format`).val(fmBarbSettings.format);
    $(`#${scriptTag}_radiusRow`).toggle(fmBarbSettings.mode==="radius");

    $(`#${scriptTag}_mode`).on("change", function(){
        fmBarbSettings.mode = this.value;
        setCache();
        $(`#${scriptTag}_radiusRow`).toggle(this.value==="radius");
    });

    $(`#${scriptTag}_radius`).click(function(){ this.focus(); this.select(); });
    $(`#${scriptTag}_radius`).on("change", function(){
        fmBarbSettings.radius = parseFloat(this.value) || fmBarbSettings.radius;
        setCache();
    });

    $(`#${scriptTag}_format`).on("change", function(){
        fmBarbSettings.format = this.value;
        setCache();
        renderList();
    });

    $(`#${scriptTag}_copy`).click(copyList);

    $(`#${scriptTag}_scan`).click(function(){
        if(fmBarbSettings.mode==="loaded")
            scanLoaded();
        else if(fmBarbSettings.mode==="radius")
            scanRadius(fmBarbSettings.radius);
    });

    if(fmBarbSettings.mode==="radius")
        scanRadius(fmBarbSettings.radius);
    else
        scanLoaded();
}

function scanLoaded(){
    let barbs = $.grep(Object.values(TWMap.villages), (obj)=>obj.owner=="0" && obj.points);
    let [x0, y0] = [game_data.village.x, game_data.village.y];
    barbs.forEach((v)=>{
        v.x = Math.floor(v.xy/1000);
        v.y = v.xy%1000;
        v.distance = Math.sqrt((v.x-x0)**2 + (v.y-y0)**2);
    });
    barbs.sort((a,b)=> a.distance - b.distance);
    setBarbList(barbs);
}

function scanRadius(radius){
    $(`#${scriptTag}_textarea`).val("Fetching live map data...");
    let diameter = Math.ceil(radius*2) + 2; // small buffer
    TWMap.resize(diameter);
    setTimeout(()=>{
        let [x0, y0] = [game_data.village.x, game_data.village.y];
        let barbs = $.grep(Object.values(TWMap.villages), (obj)=>obj.owner=="0" && obj.points);
        barbs.forEach((v)=>{
            v.x = Math.floor(v.xy/1000);
            v.y = v.xy%1000;
            v.distance = Math.sqrt((v.x-x0)**2 + (v.y-y0)**2);
        });
        barbs = barbs.filter((v)=> v.distance <= radius);
        barbs.sort((a,b)=> a.distance - b.distance);
        setBarbList(barbs);
    }, 1200);
}

    function setBarbList(barbs){
    barbList = barbs;
    $(`#${scriptTag}_count`).text(barbList.length);
    renderList();
}

function renderList(){
    let format = fmBarbSettings.format;
    let lines = barbList.map((v)=>{
        if(format=="coords_comma")
            return `${v.x}|${v.y},`;
        if(format=="link")
            return `[village]${v.x}|${v.y}[/village]`;
        return `${v.x}|${v.y}`;
    });
    $(`#${scriptTag}_textarea`).val(lines.join(" "));
}

function copyList(){
    let ta = document.getElementById(`${scriptTag}_textarea`);
    ta.select();
    ta.setSelectionRange(0, 999999);
    navigator.clipboard.writeText(ta.value).then(()=>{
        UI.SuccessMessage(`Copied ${barbList.length} coordinates to clipboard`);
    }).catch(()=>{
        document.execCommand("copy");
        UI.SuccessMessage(`Copied ${barbList.length} coordinates to clipboard`);
    });
}

main();

})();
