/*!
 * Coordinates Collector
 * Author: amc
 * Version: 1.0
 */

if (window.__twcc_loaded) {
    console.info('Coordinates Collector already loaded (v' + (window.__twcc_version || 'unknown') + ').');
} else {
    window.__twcc_loaded = true;
    window.__twcc_version = '1.0';

    (function () {
        'use strict';

        if (typeof game_data !== 'undefined' && game_data.player && game_data.player.premium == false) {
            alert("This script requires a Premium account.");
            return;
        }

        if (typeof bb === 'undefined') var bb = false;
        if (document.URL.indexOf('screen=info_player') == -1) {
            alert('You must run this script on a player profile page!');
            return;
        }

        const MATCH_SHOW_ALL_SELECTOR = 'a[onclick*="Player.getAllVillages"]';
        const VILLAGES_TABLE_SELECTOR = 'table#villages_list tbody';

        function countCoords() {
            const rows = document.querySelectorAll(`${VILLAGES_TABLE_SELECTOR} tr`);
            let count = 0;
            rows.forEach((row) => {
                const tdList = Array.from(row.querySelectorAll('td'));
                if (tdList.some(td => /^\d+\|\d+$/.test(td.textContent.trim()))) count++;
            });
            return count;
        }

        function ensureAllVillagesLoaded(onReady, timeoutMs = 30000) {
            const moreLink = document.querySelector(MATCH_SHOW_ALL_SELECTOR);
            if (!moreLink) {
                onReady();
                return;
            }

            try {
                moreLink.click();
            } catch (e) {
                try {
                    const onclickCode = moreLink.getAttribute('onclick');
                    if (onclickCode) {
                        const s = document.createElement('script');
                        s.textContent = `(function(){ ${onclickCode} })();`;
                        document.documentElement.appendChild(s);
                        s.remove();
                    }
                } catch (ee) { }
            }

            const desiredMatch = moreLink.textContent.match(/\d+/);
            const desiredTotal = desiredMatch ? parseInt(desiredMatch[0], 10) : null;
            const intervalMs = 200;
            let elapsed = 0;
            const poll = setInterval(() => {
                elapsed += intervalMs;
                const currentCount = countCoords();
                const linkStillPresent = document.body.contains(moreLink);

                if (desiredTotal !== null) {
                    if (currentCount >= desiredTotal) {
                        clearInterval(poll);
                        onReady();
                        return;
                    }
                } else {
                    if (!linkStillPresent && currentCount > 0) {
                        clearInterval(poll);
                        onReady();
                        return;
                    }
                    if (!linkStillPresent && currentCount >= 100) {
                        clearInterval(poll);
                        onReady();
                        return;
                    }
                }

                if (elapsed >= timeoutMs) {
                    clearInterval(poll);
                    onReady();
                    return;
                }
            }, intervalMs);
        }

        function removeAttackedVillages() {
            ensureAllVillagesLoaded(() => {
                const attackSelectors = [
                    'span.icon.command.command-attack-ally',
                    'span.icon.command.command-attack'
                ];

                attackSelectors.forEach(sel => {
                    document.querySelectorAll(sel).forEach(span => {
                        const row = span.closest('tr');
                        if (row) row.remove();
                    });
                });

                scanAndRender();
            });
        }

        function parseVillagesFromTable({ minPoints = null, maxPoints = null } = {}) {
            const rows = document.querySelectorAll(`${VILLAGES_TABLE_SELECTOR} tr`);
            const C = [];
            const K = Array.from({ length: 100 }, () => []);
            rows.forEach((row) => {
                const tds = Array.from(row.querySelectorAll('td'));
                const coordTd = tds.find(td => /^\d+\|\d+$/.test(td.textContent.trim()));
                if (!coordTd) return;

                const coord = coordTd.textContent.trim();
                const pointsTd = tds[tds.length - 1];
                let pointsText = pointsTd ? pointsTd.textContent.trim() : '';
                const pointsNum = parseInt(pointsText.replace(/[^\d]/g, ''), 10) || 0;

                if (minPoints !== null && pointsNum < minPoints) return;
                if (maxPoints !== null && pointsNum > maxPoints) return;

                C.push(coord);
                const [x, y] = coord.split('|').map(s => parseInt(s, 10));
                const idx = Math.floor(x / 100) + Math.floor(y / 100) * 10;
                if (Number.isFinite(idx) && idx >= 0 && idx < 100) {
                    K[idx].push(coord);
                }
            });

            return { C, K };
        }

        function parseVillagesFromTDs() {
            const tds = document.getElementsByTagName("TD");
            const C = [];
            const K = Array.from({ length: 100 }, () => []);
            for (let idx = 0; idx < tds.length; idx++) {
                const xy = tds[idx].innerText.trim();
                if (/^\d+\|\d+$/.test(xy)) {
                    C.push(xy);
                    const [xStr, yStr] = xy.split('|');
                    const x = parseInt(xStr, 10); const y = parseInt(yStr, 10);
                    const kidx = Math.floor(x / 100) + Math.floor(y / 100) * 10;
                    if (Number.isFinite(kidx) && kidx >= 0 && kidx < 100) K[kidx].push(xy);
                }
            }
            return { C, K };
        }

        let lastMin = null;
        let lastMax = null;

        function scanAndRender() {
            const tablePresent = document.querySelector(VILLAGES_TABLE_SELECTOR) !== null;
            let parsed;
            if (tablePresent) {
                parsed = parseVillagesFromTable({ minPoints: lastMin, maxPoints: lastMax });
            } else {
                parsed = parseVillagesFromTDs();
            }
            const C = parsed.C;
            const K = parsed.K;
            const allCount = C.length;
            const allCoordsString = (bb == true) ? "This village does not exist This village does not exist" : C.join(' ');

            const existing = document.getElementById('twcc-inpage-widget');
            if (existing) existing.remove();

            const widgetId = 'twcc-inpage-widget';
            const container = document.createElement('div');
            container.id = widgetId;
            container.className = 'twcc-widget';

            const header = document.createElement('div');
            header.className = 'twcc-header';
            const hStrong = document.createElement('strong');
            hStrong.textContent = 'Coordinates Collector';
            const closeSpan = document.createElement('span');
            closeSpan.className = 'twcc-close';
            closeSpan.title = 'Close';
            closeSpan.style.cursor = 'pointer';
            closeSpan.style.marginLeft = '10px';
            closeSpan.textContent = '✖';
            header.appendChild(hStrong);
            header.appendChild(closeSpan);

            const body = document.createElement('div');
            body.className = 'twcc-body';

            const controls = document.createElement('div');
            controls.className = 'twcc-controls ra-mb15';
            controls.style.display = 'flex';
            controls.style.flexWrap = 'wrap';
            controls.style.gap = '8px';
            controls.style.alignItems = 'center';

            const minInput = document.createElement('input');
            minInput.type = 'number';
            minInput.min = '0';
            minInput.placeholder = 'Min Points';
            minInput.value = (lastMin !== null) ? lastMin : '';
            minInput.style.width = '120px';
            minInput.id = 'twcc-min-points';

            const maxInput = document.createElement('input');
            maxInput.type = 'number';
            maxInput.min = '0';
            maxInput.placeholder = 'Max Points';
            maxInput.value = (lastMax !== null) ? lastMax : '';
            maxInput.style.width = '120px';
            maxInput.id = 'twcc-max-points';

            const applyBtn = document.createElement('button');
            applyBtn.className = 'btn';
            applyBtn.textContent = 'Apply';
            applyBtn.addEventListener('click', function () {
                const minVal = minInput.value.trim();
                const maxVal = maxInput.value.trim();
                lastMin = minVal.length ? parseInt(minVal, 10) : null;
                lastMax = maxVal.length ? parseInt(maxVal, 10) : null;
                scanAndRender();
            });

            const removeBtn = document.createElement('button');
            removeBtn.className = 'btn';
            removeBtn.textContent = 'Remove attacked villages';
            removeBtn.addEventListener('click', function () {
                removeAttackedVillages();
            });

            controls.appendChild(minInput);
            controls.appendChild(maxInput);
            controls.appendChild(applyBtn);
            controls.appendChild(removeBtn);

            const allBlock = document.createElement('div');
            allBlock.className = 'twcc-block';
            const allLabel = document.createElement('label');
            allLabel.textContent = 'All Villages: (' + allCount + ' village(s))';
            const allTA = document.createElement('textarea');
            allTA.cols = 80;
            allTA.rows = 4;
            allTA.value = allCoordsString;
            allTA.className = 'twcc-textarea';
            allBlock.appendChild(allLabel);
            allBlock.appendChild(allTA);

            body.appendChild(controls);
            body.appendChild(allBlock);

            for (let i = 0; i < 100; i++) {
                if (K[i].length > 0) {
                    const Kblock = document.createElement('div');
                    Kblock.className = 'twcc-block';
                    const Klabel = document.createElement('label');
                    const KsCount = K[i].length;
                    Klabel.textContent = 'Villages for Continent ' + i + ' (' + KsCount + ' village(s)):';
                    const KsTa = document.createElement('textarea');
                    KsTa.cols = 60;
                    KsTa.rows = 2;
                    KsTa.value = (bb == true) ? "This village does not exist This village does not exist" : K[i].join(' ');
                    KsTa.className = 'twcc-textarea';
                    Kblock.appendChild(Klabel);
                    Kblock.appendChild(KsTa);
                    body.appendChild(Kblock);
                }
            }

            container.appendChild(header);
            container.appendChild(body);

            const style = document.createElement('style');
            style.type = 'text/css';
            style.textContent = '\
                #twcc-inpage-widget.twcc-widget { background:#f7e9c6; border:1px solid #a96f2b; padding:10px; border-radius:6px; }\
                #twcc-inpage-widget .twcc-header { background:#c9a96a; padding:6px; border-radius:4px; margin-bottom:10px; }\
                #twcc-inpage-widget strong { color:#3b230f; }\
                #twcc-inpage-widget .twcc-block { background:#fff7e4; border:1px solid #e8d4a6; padding:8px; border-radius:4px; margin-bottom:10px; }\
                #twcc-inpage-widget .twcc-textarea { background:#fffaf0; border:1px solid #ece0c0; height:72px; width:100%; box-sizing:border-box; padding:6px; font-family:monospace; }\
                #twcc-inpage-widget label { display:block; font-weight:600; margin-bottom:4px; }\
                #twcc-inpage-widget .twcc-close { color:#333; }\
                #twcc-inpage-widget .twcc-controls input[type="number"] { padding:4px; }\
                #twcc-inpage-widget .btn { background:#8b5a2b; color:#fff; border:none; border-radius:4px; padding:6px 8px; margin-left:4px; cursor:pointer; }\
                #twcc-inpage-widget .btn:hover { background:#6f4215; }\
                #twcc-inpage-widget .twcc-controls { margin-bottom: 10px; }\
            ';

            const target = document.getElementById('contentContainer') || document.getElementById('content_value') || document.body;
            if (target.firstChild) target.insertBefore(container, target.firstChild);
            else target.appendChild(container);
            document.head.appendChild(style);

            closeSpan.addEventListener('click', function () {
                container.parentNode && container.parentNode.removeChild(container);
            });

            const minEl = document.getElementById('twcc-min-points');
            const maxEl = document.getElementById('twcc-max-points');
            if (minEl) minEl.value = (lastMin !== null) ? lastMin : '';
            if (maxEl) maxEl.value = (lastMax !== null) ? lastMax : '';
        }

        ensureAllVillagesLoaded(() => {
            scanAndRender();
        }, 30000);
    })();
}
