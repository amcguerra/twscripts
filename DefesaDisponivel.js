// User Input
if (typeof DEBUG !== 'boolean') DEBUG = false;

// Script Config
var scriptConfig = {
  scriptData: {
    prefix: 'ownHomeTroopsCount',
    name:   'Own Home Troops Count',
    version:'v2',
    author: 'RedAlert',
    authorUrl: 'https://twscripts.dev/',
    helpLink:  'https://forum.tribalwars.net/index.php?threads/own-home-troops-count.286618/'
  },

  translations: {
    pt_PT: {
      'Own Home Troops Count':         'Contagem de Tropa em Casa',
      'Offensive Troops':              'Tropas de Ataque',
      'Defensive Troops':              'Tropas Defensivas',
      'Export Troop Counts':           'Exportar Contagem de Tropas',
      'There was an error!':           'Ocorreu um erro inesperado!',
      'Premium Account is required for this script to run!':
                                         'É necessário ter conta Premium para usar este script!',
      'Redirecting...':                'Redirecionando...',
      Help:                            'Ajuda'
    }
  },

  allowedMarkets:   [],
  allowedScreens:   ['overview_villages'],
  allowedModes:     ['combined'],
  isDebug:          DEBUG,
  enableCountApi:   true
};

$.getScript(
    `https://twscripts.dev/scripts/twSDK.js?url=${document.currentScript.src}`,
    async function () {
        // Initialize Library
        await twSDK.init(scriptConfig);
$('<style>').prop('type','text/css').html(`
  /* botão */
  #sendToDiscord.btn-discord {
    display: block;
    transition: transform 0.2s, box-shadow 0.2s;
    margin: 20px auto;
    padding: 8px 16px;
    background: linear-gradient(to bottom, #5865f2 0%, #4752c4 100%);
    border: 1px solid #3c45a5;
    border-radius: 6px;
    color: #fff;
    font-weight: bold;
    font-size: 14px;
    cursor: pointer;
  }
  #sendToDiscord.btn-discord:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
  #sendToDiscord.btn-discord:hover {
    background: linear-gradient(to bottom, #4752c4 0%, #3c45a5 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }
`).appendTo('head');
        const scriptInfo = twSDK.scriptInfo();
        const isValidScreen = twSDK.checkValidLocation('screen');
        const isValidMode = twSDK.checkValidLocation('mode');

        // Script business logic
        (function () {
            try {
                if (game_data.features.Premium.active) {
                    if (isValidScreen && isValidMode) {
                        buildUI();
                    } else {
                        UI.InfoMessage('Redirecionando...');
                        twSDK.redirectTo('overview_villages&mode=combined');
                    }
                } else {
                    UI.ErrorMessage('É necessário ter conta Premium para usar este script!');
                }
            } catch (error) {
                UI.ErrorMessage('Ocorreu um erro inesperado!');
                console.error(`${scriptInfo} Error:`, error);
            }
        })();

 // Render: Build the user interface
function buildUI() {
    const homeTroops = collectTroopsAtHome();
    const totalTroopsAtHome = getTotalHomeTroops(homeTroops);
    const bbCode = getTroopsBBCode(totalTroopsAtHome);
    const content = prepareContent(totalTroopsAtHome, bbCode);

    twSDK.renderBoxWidget(content, scriptConfig.scriptData.prefix, 'ra-own-home-troops-count');

    const discordButton = `
  <button id="sendToDiscord" class="btn-discord">
    Enviar defesa disponível para Discord
  </button>`;
    jQuery('#sendToDiscord').remove();               // avoid duplicates
    jQuery('.ra-own-home-troops-count').append(discordButton);
    jQuery('#sendToDiscord').on('click', () => sendDefensiveTroopsToDiscord(totalTroopsAtHome));

    setTimeout(() => {
        if (!game_data.units.includes('archer'))  jQuery('.archer-world').hide();
        if (!game_data.units.includes('knight'))  jQuery('.paladin-world').hide();
    }, 100);
}

// Envia apenas tropas defensivas
function sendDefensiveTroopsToDiscord(totalTroopsAtHome) {
    const playerName = game_data.player.name;
    const currentGroup = jQuery('strong.group-menu-item').text();

    if (typeof webhookURL !== 'string' || !webhookURL.trim().startsWith('https://discordapp.com/api/webhooks/')) {
        alert("❌ Webhook inválido ou não definido. Por favor insere o teu webhook no botão da quickbar.");
        return;
    }

    const embedData = {
        content: `**Tropa Defensiva (Atualizado em: ${getServerTime()})**\n**Jogador:** ${playerName}`,
        embeds: [{
            title: "**🛡️ TROPA DEFENSIVA**",
            fields: [
                { name: "🗂️ Grupo Atual",      value: currentGroup,                  inline: false },
                { name: "Lanceiros",           value: `${totalTroopsAtHome.spear}`,   inline: true },
                { name: "Espadachins",         value: `${totalTroopsAtHome.sword}`,   inline: true },
                { name: "Batedores",           value: `${totalTroopsAtHome.spy}`,     inline: true },
                { name: "Cavalaria Pesada",    value: `${totalTroopsAtHome.heavy}`,   inline: true },
                { name: "Catapultas",          value: `${totalTroopsAtHome.catapult}`,inline: true },
                { name: "Paladinos",           value: `${totalTroopsAtHome.knight}`,  inline: true }
            ]
        }]
    };

    $.ajax({
        url: webhookURL.trim(),
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(embedData),
        success: () => alert("Defesa compartilhada com a liderança!"),
        error:   () => alert("Houve um erro ao enviar os dados para o Discord.")
    });
}

        // Helper: Prepare UI
        function prepareContent(totalTroopsAtHome, bbCode) {
            const {
                spear, sword, axe, archer, spy, light, marcher, heavy, ram, catapult, knight, snob
            } = totalTroopsAtHome;

            return `
                <div class="ra-mb15">
                    <h4>Tropa de Ataque</h4>
                    <table width="100%" class="ra-table">
                        <thead>
                            <tr>
                                <th width="14.2%"><img src="/graphic/unit/unit_axe.webp"></th>
                                <th width="14.2%"><img src="/graphic/unit/unit_light.webp"></th>
                                <th width="14.2%" class="archer-world"><img src="/graphic/unit/unit_marcher.webp"></th>
                                <th width="14.2%"><img src="/graphic/unit/unit_ram.webp"></th>
                                <th width="14.2%"><img src="/graphic/unit/unit_catapult.webp"></th>
                                <th width="14.2%" class="paladin-world"><img src="/graphic/unit/unit_knight.webp"></th>
                                <th width="14.2%"><img src="/graphic/unit/unit_snob.webp"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${twSDK.formatAsNumber(axe)}</td>
                                <td>${twSDK.formatAsNumber(light)}</td>
                                <td class="archer-world">${twSDK.formatAsNumber(marcher)}</td>
                                <td>${twSDK.formatAsNumber(ram)}</td>
                                <td>${twSDK.formatAsNumber(catapult)}</td>
                                <td class="paladin-world">${twSDK.formatAsNumber(knight)}</td>
                                <td>${twSDK.formatAsNumber(snob)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="ra-mb15">
                    <h4>Tropas Defensivas</h4>
                    <table width="100%" class="ra-table">
                        <thead>
                            <tr>
                                <th width="14.2%"><img src="/graphic/unit/unit_spear.webp"></th>
                                <th width="14.2%"><img src="/graphic/unit/unit_sword.webp"></th>
                                <th width="14.2%" class="archer-world"><img src="/graphic/unit/unit_archer.webp"></th>
                                <th width="14.2%"><img src="/graphic/unit/unit_spy.webp"></th>
                                <th width="14.2%"><img src="/graphic/unit/unit_heavy.webp"></th>
                                <th width="14.2%"><img src="/graphic/unit/unit_catapult.webp"></th>
                                <th width="14.2%" class="paladin-world"><img src="/graphic/unit/unit_knight.webp"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${twSDK.formatAsNumber(spear)}</td>
                                <td>${twSDK.formatAsNumber(sword)}</td>
                                <td class="archer-world">${twSDK.formatAsNumber(archer)}</td>
                                <td>${twSDK.formatAsNumber(spy)}</td>
                                <td>${twSDK.formatAsNumber(heavy)}</td>
                                <td>${twSDK.formatAsNumber(catapult)}</td>
                                <td class="paladin-world">${twSDK.formatAsNumber(knight)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    <h4>Exportar Contagem de Tropas</h4>
                    <textarea readonly class="ra-textarea">${bbCode.trim()}</textarea>
                </div>
            `;
        }

        // Helper: Collect all own troops at home
        function collectTroopsAtHome() {
            const combinedTableRows = jQuery('#combined_table tr.nowrap');
            let homeTroops = [];
            let combinedTableHeader = [];

            jQuery('#combined_table tr:eq(0) th').each(function () {
                const thImage = jQuery(this).find('img').attr('src');
                if (thImage) {
                    let thImageFilename = thImage.split('/').pop();
                    thImageFilename = thImageFilename.replace('.webp', '');
                    combinedTableHeader.push(thImageFilename);
                } else {
                    combinedTableHeader.push(null);
                }
            });

            combinedTableRows.each(function () {
                let rowTroops = {};
                combinedTableHeader.forEach((tableHeader, index) => {
                    if (tableHeader && tableHeader.includes('unit_')) {
                        const unitType = tableHeader.replace('unit_', '');
                        rowTroops[unitType] = parseInt(jQuery(this).find(`td:eq(${index})`).text());
                    }
                });
                homeTroops.push(rowTroops);
            });

            return homeTroops;
        }

        // Helper: Get total home troops
        function getTotalHomeTroops(homeTroops) {
            let total = {
                spear: 0, sword: 0, axe: 0, archer: 0, spy: 0, light: 0,
                marcher: 0, heavy: 0, ram: 0, catapult: 0, knight: 0, snob: 0
            };
            homeTroops.forEach(v => {
                Object.keys(total).forEach(u => total[u] += v[u] || 0);
            });
            if (!game_data.units.includes('archer'))  { delete total.archer; delete total.marcher; }
            if (!game_data.units.includes('knight'))  delete total.knight;
            return total;
        }

        // Helper: Get Troops BB Code
        function getTroopsBBCode(totalTroopsAtHome) {
            const currentGroup = jQuery('strong.group-menu-item').text();
            let bbCode = `[b]Contagem de Tropas em Casa (${getServerTime()})[/b]\n`;
            bbCode += `[b]Grupo Atual:[/b] ${currentGroup}\n\n`;
            for (let [key, value] of Object.entries(totalTroopsAtHome)) {
                bbCode += `[unit]${key}[/unit] [b]${twSDK.formatAsNumber(value)}[/b] ${getUnitLabel(key)}\n`;
            }
            return bbCode;
        }

        // Helper: Get server time as a string
        function getServerTime() {
            const serverTime = jQuery('#serverTime').text();
            const serverDate = jQuery('#serverDate').text();
            return serverDate + ' ' + serverTime;
        }

        // Helper: Get unit label by unit key (PT-PT)
        function getUnitLabel(key) {
            const labels = {
                spear:'Lanceiros', sword:'Espadachins', axe:'Vikings', archer:'Arqueiros',
                spy:'Batedores', light:'Cavalaria Leve', marcher:'Arqueiros Montados',
                heavy:'Cavalaria Pesada', ram:'Aríetes', catapult:'Catapultas',
                knight:'Paladinos', snob:'Nobres'
            };
            return labels[key] || '';
        }
    }
);
