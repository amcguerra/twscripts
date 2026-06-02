(function () {
  'use strict';

  const DEBUG = true;
  const DEBUG_PREFIX = '[TW Report Notes]';

  function debugLog(label, data) {
    if (!DEBUG || typeof console === 'undefined') return;
    try {
      console.log(DEBUG_PREFIX + ' ' + label, data);
    } catch (e) {}
  }

  // ======= CLEARS SIMULATION CONFIG =======
  const sp = 0;
  const sw = 0;
  const ax = 6500;
  const arc = 0;
  const scout = 0;
  const lc = 2500;
  const harc = 0;
  const hv = 0;
  const cat = 50;
  const ram = 300;

  const setLuck = 0;       // 0 = luck 0%, 1 = luck -25%
  const forceWall20 = 1;   // 1 = wall 20, 0 = wall from report
  const targetWallCat = 1; // if catapults target the wall
  const MAX_CLEARS = 100;
  // =======================================

  const OFFENSE_THRESHOLD = 3000;
  const PROB_OFFENSE_THRESHOLD = 200;
  const DEFENSE_THRESHOLD = 1000;
  const PROB_DEFENSE_THRESHOLD = 200;
  const BUNK_DEF_POP_THRESHOLD = 25000;

  const FARM_SPACE_WITH_ARCHERS = [1,1,1,1,2,4,5,6,5,8];
  const FARM_SPACE_NO_ARCHERS = [1,1,1,2,4,6,5,8];

  const UNIT_COUNT_WITH_ARCHERS = 10;
  const UNIT_COUNT_NO_ARCHERS = 8;

  const UNIT_NAMES_WITH_ARCHERS = ['spear','sword','axe','archer','spy','light','marcher','heavy','ram','catapult'];
  const UNIT_NAMES_NO_ARCHERS = ['spear','sword','axe','spy','light','heavy','ram','catapult'];

  function parseIntOrZeroGlobal(s) {
    if (s === undefined || s === null) return 0;
    if (typeof s === 'number') return s | 0;
    const cleaned = String(s).replace(/\D/g, '');
    return parseInt(cleaned || '0', 10) || 0;
  }

  function getFarm(idx, archersEnabled) {
    const arr = archersEnabled ? FARM_SPACE_WITH_ARCHERS : FARM_SPACE_NO_ARCHERS;
    return arr[idx] || 0;
  }

  function getUnitNameByIndex(idx, archersEnabled) {
    const arr = archersEnabled ? UNIT_NAMES_WITH_ARCHERS : UNIT_NAMES_NO_ARCHERS;
    return arr[idx] || null;
  }

  function getCountFromCell(cell) {
    return parseIntOrZeroGlobal(cell.getAttribute('data-unit-count') || cell.textContent);
  }

  function addUnitPowerByOriginalIndex(target, idx, count, archersEnabled, context) {
    count = parseIntOrZeroGlobal(count);
    if (count <= 0) return;

    const farm = getFarm(idx, archersEnabled);
    if (!farm) return;

    let offensiveIndexes;
    let defensiveIndexes;

    if (archersEnabled) {
      offensiveIndexes = context === 'attacker' ? [2, 5, 6] : [2, 5, 6, 8];
      defensiveIndexes = [0, 1, 3, 7, 9];
    } else {
      offensiveIndexes = [2, 4, 6];
      defensiveIndexes = [0, 1, 5, 7];
    }

    if (offensiveIndexes.includes(idx)) {
      target.offensive += count * farm;
    } else if (defensiveIndexes.includes(idx)) {
      target.defensive += count * farm;
    }
  }

  function formatK(n) {
    n = Number(n) || 0;
    if (n >= 1000) return (Math.round((n / 1000) * 10) / 10).toFixed(1) + 'k';
    return String(n);
  }

  function hasMeaningfulTroopData(summary) {
    if (!summary) return false;
    return (summary.offCorePop + summary.defCorePop + summary.defSupportPop + summary.ramPop + summary.snobCount) > 0;
  }

  function summarizeTotals(totals, archersEnabled) {
    const get = (unit) => {
      const names = archersEnabled ? UNIT_NAMES_WITH_ARCHERS : UNIT_NAMES_NO_ARCHERS;
      const idx = names.indexOf(unit);
      return idx >= 0 ? parseIntOrZeroGlobal(totals[idx]) : 0;
    };

    const spear = get('spear');
    const sword = get('sword');
    const axe = get('axe');
    const archer = get('archer');
    const light = get('light');
    const marcher = get('marcher');
    const heavy = get('heavy');
    const ram = get('ram');
    const catapult = get('catapult');
    const snob = get('snob');

    return {
      spear, sword, axe, archer, light, marcher, heavy, ram, catapult, snob,
      offCorePop: axe * 1 + light * 4 + marcher * 5,
      defCorePop: sword * 1 + heavy * 6,
      defSupportPop: spear * 1 + sword * 1 + archer * 1 + heavy * 6,
      ramPop: ram * 5,
      snobCount: snob
    };
  }

  function classifyTroopSummary(summary) {
    if (!summary || !hasMeaningfulTroopData(summary)) return 'Unknown';

    const hasNoble = summary.snobCount > 0;
    const offCore = summary.offCorePop;
    const defCore = summary.defCorePop;
    const defSupport = summary.defSupportPop;

    if (hasNoble && offCore > 0) return 'Offensive';
    if (offCore >= OFFENSE_THRESHOLD) return 'Offensive';
    if (offCore >= PROB_OFFENSE_THRESHOLD) return 'Probably Offensive';

    if (hasNoble) return 'Probably Offensive';

    if (defCore >= DEFENSE_THRESHOLD) return 'Defensive';
    if (defCore >= PROB_DEFENSE_THRESHOLD) return 'Probably Defensive';
    if (defSupport >= PROB_DEFENSE_THRESHOLD) return 'Probably Defensive';

    if (summary.ramPop >= PROB_OFFENSE_THRESHOLD) return 'Probably Offensive';

    return 'Unknown';
  }

  function isOffensiveType(type) {
    return type === 'Offensive' || type === 'Probably Offensive';
  }

  function isDefensiveType(type) {
    return type === 'Defensive' || type === 'Probably Defensive';
  }

  function typeBBCode(type, hasNoble) {
    let out;
    if (type === 'Offensive') out = '[color=#ff0000][b]▶ Attack[/b][/color]';
    else if (type === 'Probably Offensive') out = '[color=#ff0000][b]▶ Probably Attack[/b][/color]';
    else if (type === 'Defensive') out = '[color=#0000cc][b]▶ Defense[/b][/color]';
    else if (type === 'Probably Defensive') out = '[color=#0000cc][b]▶ Probably Defense[/b][/color]';
    else out = '[color=#777777][b]? Unknown[/b][/color]';

    if (hasNoble) out += ' [unit]snob[/unit]';
    return out;
  }

  const Notes = {
    data: {
      player: {
        name: game_data.player.name,
        playerIsAttacking: false,
        playerIsDefending: false,
        playerWantsAttackerInfo: false,
        playerWantsDefenderInfo: false
      },
      village: {
        offensive: { id: '-1', type: 'Unknown', troops: { totals: [], offensive: 0, defensive: 0 } },
        defensive: {
          id: '-1', type: 'Unknown', source: 'inside', bunkDetected: false, bunkPop: 0,
          troops: {
            visible: false,
            totals: [],
            away: { visible: false, offensive: 0, defensive: 0, totals: [] },
            inside: { offensive: 0, defensive: 0, totals: [] },
            supports: 0
          },
          buildings: { visible: false, watchtower: [false, 0], firstChurch: [false, 0], church: [false, 0], wall: [false, 0] }
        }
      },
      world: { farmSpacePerUnit: [], archersEnabled: false }
    },

    resetRuntimeData: function () {
      this.data.player.playerIsAttacking = false;
      this.data.player.playerIsDefending = false;
      this.data.player.playerWantsAttackerInfo = false;
      this.data.player.playerWantsDefenderInfo = false;

      this.data.village.offensive = { id: '-1', type: 'Unknown', troops: { totals: [], offensive: 0, defensive: 0 } };
      this.data.village.defensive = {
        id: '-1', type: 'Unknown', source: 'inside', bunkDetected: false, bunkPop: 0,
        troops: {
          visible: false,
          totals: [],
          away: { visible: false, offensive: 0, defensive: 0, totals: [] },
          inside: { offensive: 0, defensive: 0, totals: [] },
          supports: 0
        },
        buildings: { visible: false, watchtower: [false, 0], firstChurch: [false, 0], church: [false, 0], wall: [false, 0] }
      };
      this.data.world.farmSpacePerUnit = [];
      this.data.world.archersEnabled = false;
    },

    verifyPage: function () {
      const match = window.location.href.match(/(screen\=report){1}|(view\=){1}\w+/g);
      if (match && match.length === 2) return true;
      UI.ErrorMessage('This script can only be run on a report screen.', 5000);
      return false;
    },

    initData: function () {
      this.initUnitArrays();
      this.readPlayerInfo();
      this.readTroopsAway();
      this.readTroopsInside();
      this.readTroopsAttacker();
      this.readBuildings();
    },

    initUnitArrays: function () {
      this.data.world.archersEnabled = game_data.units.includes('archer');
      if (this.data.world.archersEnabled) {
        this.data.village.offensive.troops.totals = new Array(UNIT_COUNT_WITH_ARCHERS).fill(0);
        this.data.village.defensive.troops.totals = new Array(UNIT_COUNT_WITH_ARCHERS).fill(0);
        this.data.village.defensive.troops.away.totals = new Array(UNIT_COUNT_WITH_ARCHERS).fill(0);
        this.data.village.defensive.troops.inside.totals = new Array(UNIT_COUNT_WITH_ARCHERS).fill(0);
        this.data.world.farmSpacePerUnit = FARM_SPACE_WITH_ARCHERS;
      } else {
        this.data.village.offensive.troops.totals = new Array(UNIT_COUNT_NO_ARCHERS).fill(0);
        this.data.village.defensive.troops.totals = new Array(UNIT_COUNT_NO_ARCHERS).fill(0);
        this.data.village.defensive.troops.away.totals = new Array(UNIT_COUNT_NO_ARCHERS).fill(0);
        this.data.village.defensive.troops.inside.totals = new Array(UNIT_COUNT_NO_ARCHERS).fill(0);
        this.data.world.farmSpacePerUnit = FARM_SPACE_NO_ARCHERS;
      }
    },

    readPlayerInfo: function () {
      const attackerName = $('#attack_info_att > tbody > tr:nth-child(1) > th:nth-child(2) > a').text();
      const defenderName = $('#attack_info_def > tbody > tr:nth-child(1) > th:nth-child(2) > a').text();

      const getVillageId = (selector) => {
        const a = document.querySelector(selector);
        if (!a) return '-1';
        try {
          const u = new URL(a.href, location.origin);
          return u.searchParams.get('id') || u.searchParams.get('village') || '-1';
        } catch (e) {
          return '-1';
        }
      };

      this.data.village.offensive.id = getVillageId('#attack_info_att > tbody > tr:nth-child(2) > td:nth-child(2) > span > a:nth-child(1)');
      this.data.village.defensive.id = getVillageId('#attack_info_def > tbody > tr:nth-child(2) > td:nth-child(2) > span > a:nth-child(1)');

      if (defenderName === this.data.player.name) {
        this.data.player.playerIsDefending = true;
      } else if (attackerName === this.data.player.name) {
        this.data.player.playerIsAttacking = true;
      }
    },

    readTroopsAway: function () {
      if (!$('#attack_spy_away > tbody > tr:nth-child(1) > th').length) return;
      this.data.village.defensive.troops.away.visible = true;

      const self = this;
      const selector = '#attack_spy_away > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) > td';
      $(selector).each(function (idx, cell) {
        const count = getCountFromCell(cell);
        if (idx < self.data.village.defensive.troops.away.totals.length) {
          self.data.village.defensive.troops.away.totals[idx] = count;
        }
        addUnitPowerByOriginalIndex(self.data.village.defensive.troops.away, idx, count, self.data.world.archersEnabled, 'defender');
      });
    },

    readTroopsInside: function () {
      if (!$('#attack_info_def_units > tbody > tr:nth-child(2) > td').length) return;
      this.data.village.defensive.troops.visible = true;

      const self = this;
      const selector = '#attack_info_def_units > tbody > tr:nth-child(2) > td.unit-item';
      $(selector).each(function (idx, cell) {
        const count = getCountFromCell(cell);
        if (idx < self.data.village.defensive.troops.inside.totals.length) {
          self.data.village.defensive.troops.inside.totals[idx] = count;
        }
        addUnitPowerByOriginalIndex(self.data.village.defensive.troops.inside, idx, count, self.data.world.archersEnabled, 'defender');
      });
    },

    readTroopsAttacker: function () {
      const self = this;
      const selector = '#attack_info_att_units > tbody > tr:nth-child(2) > td.unit-item';
      $(selector).each(function (idx, cell) {
        const count = getCountFromCell(cell);
        if (idx < self.data.village.offensive.troops.totals.length) {
          self.data.village.offensive.troops.totals[idx] = count;
        }
        addUnitPowerByOriginalIndex(self.data.village.offensive.troops, idx, count, self.data.world.archersEnabled, 'attacker');
      });
    },

    readBuildings: function () {
      if (!$('#attack_spy_buildings_left > tbody > tr:nth-child(1) > th:nth-child(1)').length) return;
      this.data.village.defensive.buildings.visible = true;

      const self = this;
      $('table[id^="attack_spy_buildings_"] > tbody > tr:gt(0) > td > img').each(function (idx, img) {
        let code = '';
        try {
          code = new URL(img.src, location.origin).pathname.split('/').pop().replace(/\.(png|webp)$/i, '');
        } catch (e) {
          code = (img.src || '').split('/').pop().replace(/\.(png|webp)$/i, '');
        }

        const level = parseIntOrZeroGlobal(img.parentNode.parentNode.childNodes[3].textContent);
        if (code === 'watchtower') self.data.village.defensive.buildings.watchtower = [true, level];
        else if (code === 'church_f') self.data.village.defensive.buildings.firstChurch = [true, level];
        else if (code === 'church') self.data.village.defensive.buildings.church = [true, level];
        else if (code === 'wall') self.data.village.defensive.buildings.wall = [true, level];
      });
    },

    getVillageType: function () {
      const archersEnabled = this.data.world.archersEnabled;
      const insideSummary = summarizeTotals(this.data.village.defensive.troops.inside.totals, archersEnabled);
      const awaySummary = summarizeTotals(this.data.village.defensive.troops.away.totals, archersEnabled);
      const attackerSummary = summarizeTotals(this.data.village.offensive.troops.totals, archersEnabled);

      this.data.village.defensive.insideSummary = insideSummary;
      this.data.village.defensive.awaySummary = awaySummary;
      this.data.village.offensive.summary = attackerSummary;

      this.data.village.defensive.bunkPop = insideSummary.defSupportPop;
      this.data.village.defensive.bunkDetected = this.data.village.defensive.troops.visible && insideSummary.defSupportPop >= BUNK_DEF_POP_THRESHOLD;

      let chosenSummary = insideSummary;
      let chosenType = 'Unknown';
      let source = 'inside';

      if (this.data.village.defensive.troops.away.visible && hasMeaningfulTroopData(awaySummary)) {
        const awayType = classifyTroopSummary(awaySummary);
        if (awayType !== 'Unknown') {
          chosenSummary = awaySummary;
          chosenType = awayType;
          source = 'away';
        }
      }

      if (chosenType === 'Unknown') {
        chosenSummary = insideSummary;
        chosenType = this.data.village.defensive.troops.visible ? classifyTroopSummary(insideSummary) : 'No troops survived';
        source = 'inside';
      }

      this.data.village.defensive.type = chosenType;
      this.data.village.defensive.source = source;
      this.data.village.defensive.chosenSummary = chosenSummary;

      if (attackerSummary.offCorePop > attackerSummary.defSupportPop) {
        this.data.village.offensive.type = 'Offensive';
      } else if (attackerSummary.offCorePop < attackerSummary.defSupportPop) {
        this.data.village.offensive.type = 'Defensive';
      } else if (attackerSummary.snobCount > 0) {
        this.data.village.offensive.type = 'Probably Offensive';
      } else {
        this.data.village.offensive.type = 'Unknown';
      }

      debugLog('Classification', {
        archersEnabled: archersEnabled,
        typeSource: this.data.village.defensive.source,
        defenderType: this.data.village.defensive.type,
        attackerType: this.data.village.offensive.type,
        bunkDetected: this.data.village.defensive.bunkDetected,
        bunkPop: this.data.village.defensive.bunkPop,
        inside: insideSummary,
        away: awaySummary,
        attacker: attackerSummary
      });
    },

    parseIntOrZero: parseIntOrZeroGlobal,

    formatClearsForDisplay: function (n) {
      if (typeof n !== 'number' || n <= 0) return String(n || 0);
      if (n > MAX_CLEARS) return `${MAX_CLEARS}+`;
      return String(n);
    },

    reportShowsAllDefendersDead: function () {
      try {
        const tbody = document.querySelector('#attack_info_def_units > tbody');
        if (!tbody) return false;

        const rows = Array.from(tbody.querySelectorAll('tr'));
        if (rows.length < 3) return false;

        const unitsRow = rows[1];
        const lossesRow = rows[2];
        if (!unitsRow || !lossesRow) return false;

        const unitTds = Array.from(unitsRow.querySelectorAll('td')).slice(1);
        const lossTds = Array.from(lossesRow.querySelectorAll('td')).slice(1);
        if (unitTds.length === 0 || unitTds.length !== lossTds.length) return false;

        for (let i = 0; i < unitTds.length; i++) {
          const u = this.parseIntOrZero(unitTds[i].getAttribute('data-unit-count') || unitTds[i].textContent);
          const l = this.parseIntOrZero(lossTds[i].getAttribute('data-unit-count') || lossTds[i].textContent);
          if (u !== l) return false;
        }
        return true;
      } catch (e) { return false; }
    },

    estimateClears: async function () {
      try {
        if (!document.querySelector('#attack_info_def_units')) return null;
        if (this.reportShowsAllDefendersDead()) return 0;

        let reportId = null;
        const simLinks = Array.from(document.querySelectorAll('a[href*="screen=place"][href*="mode=sim"]'));
        for (const a of simLinks) {
          try {
            if (a.href && a.href.indexOf('report_id=') !== -1) {
              const u = new URL(a.href);
              const rid = u.searchParams.get('report_id');
              if (rid) { reportId = rid; break; }
            }
          } catch (e) {}
        }
        if (!reportId) return null;

        const simGetUrl = new URL('/game.php', location.origin);
        try {
          const currentVillage = (typeof game_data !== 'undefined' && game_data.village && game_data.village.id) ? String(game_data.village.id) : null;
          if (currentVillage) simGetUrl.searchParams.set('village', currentVillage);
        } catch (e) {}
        simGetUrl.searchParams.set('screen', 'place');
        simGetUrl.searchParams.set('mode', 'sim');
        simGetUrl.searchParams.set('only_survive', '1');
        simGetUrl.searchParams.set('report_id', reportId);

        const getResp = await fetch(simGetUrl.toString(), { credentials: 'include' });
        if (!getResp.ok) return null;

        const simHtml = await getResp.text();
        const tmp = document.createElement('div');
        tmp.innerHTML = simHtml;

        const form = tmp.querySelector('form#simulator_form, form[name="simulator"]');
        if (!form) return null;

        const simToVar = {
          spear: 'sp', sword: 'sw', axe: 'ax', spy: 'scout',
          light: 'lc', heavy: 'hv', ram: 'ram', catapult: 'cat',
          snob: 'noble', archer: 'arc', harc: 'harc', marcher: 'harc', militia: 'militia'
        };

        const configured = { sp, sw, ax, arc, scout, lc, harc, hv, cat, ram, noble: 0, militia: 0 };

        const attInputs = Array.from(form.querySelectorAll('input[name^="att_"], select[name^="att_"], textarea[name^="att_"]'));
        attInputs.forEach(inp => {
          const name = inp.getAttribute('name');
          const unit = name.replace(/^att_/, '');
          const varName = simToVar[unit];
          const valueToSet = varName ? (configured[varName] || 0) : 0;
          try {
            inp.value = String(Number(valueToSet) || 0);
            inp.setAttribute('value', String(Number(valueToSet) || 0));
          } catch (e) {}
        });

        const luckInput = form.querySelector('input[name="luck"]');
        const luckValue = (setLuck === 0) ? 0 : -25;
        if (luckInput) {
          luckInput.value = String(luckValue);
          luckInput.setAttribute('value', String(luckValue));
        }

        const wallInput = form.querySelector('input[name="def_wall"], input#wall_id');
        if (forceWall20 && wallInput) {
          wallInput.value = '20';
          wallInput.setAttribute('value', '20');
        }

        const catCheckbox = form.querySelector('input#catapult_wall, input[name="building"][value="wall"]');
        if (catCheckbox) {
          if (targetWallCat) {
            catCheckbox.checked = true;
            catCheckbox.setAttribute('checked', 'checked');
          } else {
            catCheckbox.checked = false;
            catCheckbox.removeAttribute('checked');
          }
        }

        const simulateField = form.querySelector('input[name="simulate"]');
        if (!simulateField) {
          const hiddenSim = document.createElement('input');
          hiddenSim.type = 'hidden';
          hiddenSim.name = 'simulate';
          hiddenSim.value = '1';
          form.appendChild(hiddenSim);
        } else {
          simulateField.value = simulateField.value || '1';
          simulateField.setAttribute('value', simulateField.value || '1');
        }

        const formElements = Array.from(form.querySelectorAll('input[name], select[name], textarea[name]'));
        const payload = new URLSearchParams();
        formElements.forEach(el => {
          const name = el.getAttribute('name');
          if (!name) return;
          const type = el.type;
          if (type === 'checkbox') {
            if (el.checked) payload.append(name, el.value || 'on');
          } else if (type === 'radio') {
            if (el.checked) payload.append(name, el.value || '');
          } else {
            payload.append(name, el.value || '');
          }
        });

        if (!form.querySelector('input[name="luck"]')) payload.set('luck', String(luckValue));

        const action = form.getAttribute('action') || '/game.php';
        const actionUrl = new URL(action, location.origin).toString();

        const postResp = await fetch(actionUrl, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
          body: payload.toString()
        });
        if (!postResp.ok) return null;

        const postHtml = await postResp.text();
        const tmp2 = document.createElement('div');
        tmp2.innerHTML = postHtml;

        let foundAdditional = null;
        const pEls = Array.from(tmp2.querySelectorAll('p, div'));
        for (const p of pEls) {
          const text = (p.textContent || '').trim();
          if (/mais/i.test(text) && /necessari|ataque|ataques|attac|attack/i.test(text)) {
            const inner = p.innerHTML || '';
            let match = inner.match(/<b[^>]*>(\d+)<\/b>/i);
            if (!match) match = inner.match(/(\d+)/);
            if (match && match[1]) { foundAdditional = parseInt(match[1], 10); break; }
          }
        }

        if (foundAdditional === null) return null;
        return 1 + foundAdditional;
      } catch (e) {
        return null;
      }
    },

    getReportIdFromPage: function () {
      const link = document.querySelector('a[href*="mode=publish"][href*="report_id="]');
      if (link && link.href) {
        try {
          const u = new URL(link.href, location.origin);
          return u.searchParams.get('report_id');
        } catch (e) {}
      }
      const params = new URLSearchParams(location.search);
      return params.get('view') || params.get('id') || null;
    },

    publishReportAndGetLink: async function (caseType) {
      try {
        const reportId = this.getReportIdFromPage();
        if (!reportId) return null;

        const publishUrl = new URL('/game.php', location.origin);
        publishUrl.searchParams.set('screen', 'report');
        publishUrl.searchParams.set('mode', 'publish');
        publishUrl.searchParams.set('report_id', reportId);
        if (game_data && game_data.village && game_data.village.id) publishUrl.searchParams.set('village', game_data.village.id);

        const pageResp = await fetch(publishUrl.toString(), { credentials: 'include' });
        if (!pageResp.ok) return null;

        const html = await pageResp.text();
        const tmp = document.createElement('div');
        tmp.innerHTML = html;

        const form = tmp.querySelector('form[action*="mode=publish"][action*="action=publish"]');
        if (!form) return null;

        const hInput = form.querySelector('input[name="h"]');
        const reportInput = form.querySelector('input[name="report_id"]');
        const hVal = hInput ? hInput.value : null;
        const reportVal = reportInput ? reportInput.value : reportId;

        const show = (name, on) => on ? [`show[${name}]`, '1'] : null;
        const opts = caseType === 'A'
          ? [show('own_coords', true), show('own_units', false), show('own_losses', false), show('opp_coords', true), show('opp_units', true), show('opp_losses', true), show('buildings', true), show('carry', false)]
          : [show('own_coords', true), show('own_units', false), show('own_losses', false), show('opp_coords', true), show('opp_units', true), show('opp_losses', true), show('buildings', false), show('carry', false)];

        const payload = new URLSearchParams();
        payload.set('report_id', reportVal);
        if (hVal) payload.set('h', hVal);
        payload.set('publish', '1');
        opts.forEach(o => { if (o) payload.set(o[0], o[1]); });

        const action = form.getAttribute('action') || publishUrl.toString();
        const actionUrl = new URL(action, location.origin).toString();

        const postResp = await fetch(actionUrl, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
          body: payload.toString()
        });
        if (!postResp.ok) return null;

        const postHtml = await postResp.text();
        let match = postHtml.match(/https?:\/\/[^\s"'<>]*public_report\/[a-f0-9]+/i);
        if (match && match[0]) return match[0];

        match = postHtml.match(/\/public_report\/[a-f0-9]+/i);
        if (match && match[0]) return location.origin.replace(/\/game\.php.*/, '') + match[0];

        return null;
      } catch (e) {
        return null;
      }
    },

    buildBuildingParts: function () {
      const b = this.data.village.defensive.buildings;
      const parts = [];

      if (b.watchtower[0]) parts.push('[building]watchtower[/building] ' + b.watchtower[1]);
      if (b.firstChurch[0]) parts.push('[building]church_f[/building]');
      if (b.church[0]) parts.push('[building]church[/building] ' + b.church[1]);

      return parts;
    },

    getDefensiveUnitPartsForBunk: function () {
      const totals = this.data.village.defensive.troops.inside.totals || [];
      const archersEnabled = this.data.world.archersEnabled;
      const names = archersEnabled ? UNIT_NAMES_WITH_ARCHERS : UNIT_NAMES_NO_ARCHERS;
      const units = archersEnabled
        ? ['spear', 'sword', 'archer', 'heavy', 'catapult']
        : ['spear', 'sword', 'heavy', 'catapult'];

      const parts = [];
      units.forEach(unit => {
        const idx = names.indexOf(unit);
        const count = idx >= 0 ? parseIntOrZeroGlobal(totals[idx]) : 0;
        if (unit === 'catapult') {
          if (count >= 1000) parts.push('[unit]catapult[/unit] ' + formatK(count));
        } else if (count > 0) {
          parts.push('[unit]' + unit + '[/unit] ' + formatK(count));
        }
      });
      return parts;
    },

    createNoteText: async function () {
      let villageType = 'Unknown';
      let hasNoble = false;
      let note = '';
      const isDefenderSide = this.data.player.playerIsAttacking || this.data.player.playerWantsDefenderInfo;

      if (this.data.player.playerIsAttacking || this.data.player.playerWantsDefenderInfo) villageType = this.data.village.defensive.type;
      if (!this.data.player.playerIsAttacking || this.data.player.playerWantsAttackerInfo) villageType = this.data.village.offensive.type;
      if (!this.data.player.playerIsAttacking && this.data.player.playerWantsDefenderInfo) villageType = this.data.village.defensive.type;

      if (isDefenderSide) {
        const chosen = this.data.village.defensive.chosenSummary || this.data.village.defensive.insideSummary;
        hasNoble = !!(chosen && chosen.snobCount > 0);
      } else {
        hasNoble = !!(this.data.village.offensive.summary && this.data.village.offensive.summary.snobCount > 0);
      }

      const headerParts = [typeBBCode(villageType, hasNoble)];
      if (isDefenderSide) headerParts.push(...this.buildBuildingParts());
      note += headerParts.join(' | ');

      if (isDefenderSide && this.data.village.defensive.bunkDetected) {
        const bunkParts = ['[color=#d07000][b]Bunk (' + formatK(this.data.village.defensive.bunkPop) + ')[/b][/color]'];
        bunkParts.push(...this.getDefensiveUnitPartsForBunk());

        const clears = await this.estimateClears();
        if (typeof clears === 'number') {
          bunkParts.push('Clears: ' + this.formatClearsForDisplay(clears) + ' [img]https://dspt.innogamescdn.com/asset/af1188db/graphic/command/attack_large.webp[/img]');
        }

        note += '\n\n' + bunkParts.join(' | ');
      }

      note += '\n\n';

      const caseType = this.data.player.playerIsAttacking ? 'A' : 'B';
      const link = await this.publishReportAndGetLink(caseType);

      if (link) {
        note += '[spoiler=Spoiler][report_display]' + link + '[/report_display][/spoiler]';
      } else {
        const reportExport = $('#report_export_code').text().trim();
        if (reportExport) note += '[spoiler=Spoiler]' + reportExport + '[/spoiler]';
        else note += '[b]Public report not generated.[/b]';
      }

      debugLog('Note text generated', {
        isDefenderSide: isDefenderSide,
        villageType: villageType,
        hasNoble: hasNoble,
        bunkDetected: this.data.village.defensive.bunkDetected,
        note: note
      });

      return note;
    },

    writeNote: async function () {
      let noteText;
      let villageId;
      const url = '0' == game_data.player.sitter
        ? 'https://' + location.hostname + '/game.php?village=' + game_data.village.id + '&screen=api&ajaxaction=village_note_edit&h=' + game_data.csrf + '&client_time=' + Math.round(Timing.getCurrentServerTime() / 1e3)
        : 'https://' + location.hostname + '/game.php?village=' + game_data.village.id + '&screen=api&ajaxaction=village_note_edit&t=' + game_data.player.id;

      if (this.data.player.playerIsAttacking || this.data.player.playerIsDefending) {
        villageId = this.data.player.playerIsAttacking || this.data.player.playerWantsDefenderInfo
          ? parseInt(this.data.village.defensive.id)
          : parseInt(this.data.village.offensive.id);

        noteText = await this.createNoteText();
        $.post(url, { note: noteText, village_id: villageId, h: game_data.csrf }, function () {
          UI.SuccessMessage('Note created', 2000);
        });
      } else {
        const text = $('<div class="center"> Add report to which village: </div>');
        const buttons = $('<div class="center"><button class="btn btn-confirm-yes atk">Attacker</button><button class="btn btn-confirm-yes def">Defender</button></div>');
        const modal = text.add(buttons);
        Dialog.show('report_notes', modal);

        buttons.find('button.atk').click(async function () {
          Notes.data.player.playerWantsAttackerInfo = true;
          noteText = await Notes.createNoteText();
          $.post(url, { note: noteText, village_id: Notes.data.village.offensive.id, h: game_data.csrf }, function () {
            UI.SuccessMessage('Note created', 2000);
          });
          Dialog.close();
        });

        buttons.find('button.def').click(async function () {
          Notes.data.player.playerWantsDefenderInfo = true;
          noteText = await Notes.createNoteText();
          $.post(url, { note: noteText, village_id: Notes.data.village.defensive.id, h: game_data.csrf }, function () {
            UI.SuccessMessage('Note created', 2000);
          });
          Dialog.close();
        });
      }
    },

    start: async function () {
      if (!this.verifyPage()) return;
      this.resetRuntimeData();
      this.initData();
      this.getVillageType();
      await this.writeNote();
    }
  };

  function startWhenReady(attempts = 0) {
    const ready =
      document.querySelector('#attack_info_att') &&
      document.querySelector('#attack_info_def') &&
      document.querySelector('#attack_info_att_units') &&
      document.querySelector('#attack_info_def_units');

    if (ready) {
      Notes.start();
      return;
    }

    if (attempts < 50) {
      setTimeout(() => startWhenReady(attempts + 1), 200);
    } else {
      Notes.start();
    }
  }

  startWhenReady();
})();
