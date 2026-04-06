(function () {
  'use strict';

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

  const setLuck = 1;       // 0 = luck 0%, 1 = luck -25%
  const forceWall20 = 1;   // 1 = wall 20, 0 = wall from report
  const targetWallCat = 1; // if catapults target the wall
  const MAX_CLEARS = 100;
  // =======================================

  // Thresholds / constants
  const OFFENSE_THRESHOLD = 3000;
  const PROB_OFFENSE_THRESHOLD = 500;
  const DEFENSE_THRESHOLD = 1000;
  const PROB_DEFENSE_THRESHOLD = 500;

  const FARM_SPACE_WITH_ARCHERS = [1,1,1,1,2,4,5,6,5,8];
  const FARM_SPACE_NO_ARCHERS = [1,1,1,2,4,6,5,8];

  const UNIT_COUNT_WITH_ARCHERS = 10;
  const UNIT_COUNT_NO_ARCHERS = 8;

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
        offensive: { id: "-1", type: "Unknown", troops: { totals: [], offensive: 0, defensive: 0 } },
        defensive: {
          id: "-1", type: "Unknown",
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

    verifyPage: function () {
      const match = window.location.href.match(/(screen\=report){1}|(view\=){1}\w+/g);
      if (match && match.length === 2) return true;
      UI.ErrorMessage("This script can only be run on a report screen.", 5000);
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
      this.data.world.archersEnabled = game_data.units.includes("archer");
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
      const attackerName = $("#attack_info_att > tbody > tr:nth-child(1) > th:nth-child(2) > a").text();
      const defenderName = $("#attack_info_def > tbody > tr:nth-child(1) > th:nth-child(2) > a").text();
      let idx = 3;
      if ("0" != game_data.player.sitter) idx = 4;

      this.data.village.offensive.id = $("#attack_info_att > tbody > tr:nth-child(2) > td:nth-child(2) > span > a:nth-child(1)").url().split("=")[idx];
      this.data.village.defensive.id = $("#attack_info_def > tbody > tr:nth-child(2) > td:nth-child(2) > span > a:nth-child(1)").url().split("=")[idx];

      if (defenderName == this.data.player.name) {
        this.data.player.playerIsDefending = true;
      } else if (attackerName == this.data.player.name) {
        this.data.player.playerIsAttacking = true;
      }
    },

    readTroopsAway: function () {
      if (!$("#attack_spy_away > tbody > tr:nth-child(1) > th").length) return;

      this.data.village.defensive.troops.away.visible = true;

      const self = this;
      const selector = "#attack_spy_away > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) > td";
      $(selector).each(function (idx, cell) {
        const count = parseInt(cell.textContent);
        if (idx < self.data.village.defensive.troops.totals.length) {
          self.data.village.defensive.troops.away.totals[idx] = count;
        }

        if (self.data.world.archersEnabled) {
          if (idx == 2 || idx == 5 || idx == 6 || idx == 8) {
            self.data.village.defensive.troops.away.offensive += count * self.data.world.farmSpacePerUnit[idx];
          } else if (idx == 0 || idx == 1 || idx == 3 || idx == 7 || idx == 9) {
            self.data.village.defensive.troops.away.defensive += count * self.data.world.farmSpacePerUnit[idx];
          }
        } else {
          if (idx == 2 || idx == 4 || idx == 6) {
            self.data.village.defensive.troops.away.offensive += count * self.data.world.farmSpacePerUnit[idx];
          } else if (idx == 0 || idx == 1 || idx == 5 || idx == 7) {
            self.data.village.defensive.troops.away.defensive += count * self.data.world.farmSpacePerUnit[idx];
          }
        }
      });
    },

    readTroopsInside: function () {
      if (!$("#attack_info_def_units > tbody > tr:nth-child(2) > td").length) return;
      this.data.village.defensive.troops.visible = true;

      const self = this;
      const selector = "#attack_info_def_units > tbody > tr:nth-child(2) > td.unit-item";
      $(selector).each(function (idx, cell) {
        const count = parseInt(cell.textContent);
        if (idx < self.data.village.defensive.troops.totals.length) {
          self.data.village.defensive.troops.inside.totals[idx] = count;
        }

        if (self.data.world.archersEnabled) {
          if (idx == 2 || idx == 5 || idx == 6 || idx == 8) {
            self.data.village.defensive.troops.inside.offensive += count * self.data.world.farmSpacePerUnit[idx];
          } else if (idx == 0 || idx == 1 || idx == 3 || idx == 7 || idx == 9) {
            self.data.village.defensive.troops.inside.defensive += count * self.data.world.farmSpacePerUnit[idx];
          }
        } else {
          if (idx == 2 || idx == 4 || idx == 6) {
            self.data.village.defensive.troops.inside.offensive += count * self.data.world.farmSpacePerUnit[idx];
          } else if (idx == 0 || idx == 1 || idx == 5 || idx == 7) {
            self.data.village.defensive.troops.inside.defensive += count * self.data.world.farmSpacePerUnit[idx];
          }
        }
      });
    },

    readTroopsAttacker: function () {
      const self = this;
      const selector = "#attack_info_att_units > tbody > tr:nth-child(2) > td.unit-item";
      $(selector).each(function (idx, cell) {
        const count = parseInt(cell.textContent);
        if (idx < self.data.village.offensive.troops.totals.length) {
          self.data.village.offensive.troops.totals[idx] = count;
        }

        if (self.data.world.archersEnabled) {
          if (idx == 2 || idx == 5 || idx == 6) {
            self.data.village.offensive.troops.offensive += count * self.data.world.farmSpacePerUnit[idx];
          } else if (idx == 0 || idx == 1 || idx == 3 || idx == 7 || idx == 9) {
            self.data.village.offensive.troops.defensive += count * self.data.world.farmSpacePerUnit[idx];
          }
        } else {
          if (idx == 2 || idx == 4 || idx == 6) {
            self.data.village.offensive.troops.offensive += count * self.data.world.farmSpacePerUnit[idx];
          } else if (idx == 0 || idx == 1 || idx == 5 || idx == 7) {
            self.data.village.offensive.troops.defensive += count * self.data.world.farmSpacePerUnit[idx];
          }
        }
      });
    },

    readBuildings: function () {
      if (!$("#attack_spy_buildings_left > tbody > tr:nth-child(1) > th:nth-child(1)").length) return;
      this.data.village.defensive.buildings.visible = true;

      const self = this;
      $("table[id^='attack_spy_buildings_'] > tbody > tr:gt(0) > td > img").each(function (idx, img) {
        const code = img.src.split("/")[7].replace(".png", "");
        const level = parseInt(img.parentNode.parentNode.childNodes[3].textContent);

        if (code == "watchtower") self.data.village.defensive.buildings.watchtower = [true, level];
        else if (code == "church_f") self.data.village.defensive.buildings.firstChurch = [true, level];
        else if (code == "church") self.data.village.defensive.buildings.church = [true, level];
        else if (code == "wall") self.data.village.defensive.buildings.wall = [true, level];
      });
    },

    getVillageType: function () {
      if (this.data.village.defensive.troops.visible) {
        if (this.data.village.defensive.troops.inside.offensive > OFFENSE_THRESHOLD) {
          this.data.village.defensive.type = "Offensive";
        } else if (this.data.village.defensive.troops.inside.offensive > PROB_OFFENSE_THRESHOLD) {
          this.data.village.defensive.type = "Probably Offensive";
        } else if (this.data.village.defensive.troops.inside.defensive > DEFENSE_THRESHOLD) {
          this.data.village.defensive.type = "Defensive";
        } else if (this.data.village.defensive.troops.inside.defensive > PROB_DEFENSE_THRESHOLD) {
          this.data.village.defensive.type = "Probably Defensive";
        }
      } else {
        this.data.village.defensive.type = "No troops survived";
      }

      if (this.data.village.defensive.troops.away.visible) {
        if (this.data.village.defensive.troops.away.offensive > OFFENSE_THRESHOLD) {
          this.data.village.defensive.type = "Offensive";
        } else if (this.data.village.defensive.troops.away.offensive > 1000) {
          this.data.village.defensive.type = "Probably Offensive";
        } else if (this.data.village.defensive.troops.away.defensive > DEFENSE_THRESHOLD) {
          this.data.village.defensive.type = "Defensive";
        } else if (this.data.village.defensive.troops.away.defensive > PROB_DEFENSE_THRESHOLD) {
          this.data.village.defensive.type = "Probably Defensive";
        } else if (this.data.village.defensive.troops.away.defensive + this.data.village.defensive.troops.away.offensive > 1000) {
          if (this.data.village.defensive.troops.away.offensive > this.data.village.defensive.troops.away.defensive) {
            this.data.village.defensive.type = "Probably Offensive";
          } else if (this.data.village.defensive.troops.away.defensive >= this.data.village.defensive.troops.away.offensive) {
            this.data.village.defensive.type = "Probably Defensive";
          }
        }
      }

      if (this.data.village.offensive.troops.offensive > this.data.village.offensive.troops.defensive) {
        this.data.village.offensive.type = "Offensive";
      } else if (this.data.village.offensive.troops.offensive < this.data.village.offensive.troops.defensive) {
        this.data.village.offensive.type = "Defensive";
      }
    },

    parseIntOrZero: function (s) {
      if (s === undefined || s === null) return 0;
      if (typeof s === 'number') return s | 0;
      const cleaned = String(s).replace(/\D/g, '');
      return parseInt(cleaned || '0', 10) || 0;
    },

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
        if (this.reportShowsAllDefendersDead()) return 1;

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
          snob: 'noble', archer: 'arc', harc: 'harc', militia: 'militia'
        };

        const attInputs = Array.from(form.querySelectorAll('input[name^="att_"], select[name^="att_"], textarea[name^="att_"]'));
        attInputs.forEach(inp => {
          const name = inp.getAttribute('name');
          const unit = name.replace(/^att_/, '');
          const varName = simToVar[unit];
          let valueToSet = 0;
          if (varName && typeof window[varName] !== 'undefined') {
            valueToSet = window[varName] || 0;
          } else {
            if (unit === 'spear') valueToSet = sp;
            else if (unit === 'sword') valueToSet = sw;
            else if (unit === 'axe') valueToSet = ax;
            else if (unit === 'light') valueToSet = lc;
            else if (unit === 'ram') valueToSet = ram;
            else if (unit === 'catapult') valueToSet = cat;
          }
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

        if (!form.querySelector('input[name="luck"]')) {
          payload.set('luck', String(luckValue));
        }

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

        if (foundAdditional === null) return 1;
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
        if (game_data && game_data.village && game_data.village.id) {
          publishUrl.searchParams.set('village', game_data.village.id);
        }

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

        const opts =
          caseType === "A"
            ? [
                show('own_coords', true),
                show('own_units', false),
                show('own_losses', false),
                show('opp_coords', true),
                show('opp_units', true),
                show('opp_losses', true),
                show('buildings', true),
                show('carry', false)
              ]
            : [
                show('own_coords', true),
                show('own_units', false),
                show('own_losses', false),
                show('opp_coords', true),
                show('opp_units', true),
                show('opp_losses', true),
                show('buildings', false),
                show('carry', false)
              ];

        const payload = new URLSearchParams();
        payload.set('report_id', reportVal);
        if (hVal) payload.set('h', hVal);
        payload.set('publish', '1');

        opts.forEach(o => {
          if (o) payload.set(o[0], o[1]);
        });

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

    createNoteText: async function () {
      let villageType;
      const titleText = $("#content_value > table > tbody > tr > td:nth-child(2) > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(2)")
        .text().replace(/\s+/g, " ").replace(/.{5}$/g, "");
      let note = "";

      if (this.data.player.playerIsAttacking || this.data.player.playerWantsDefenderInfo) {
        villageType = this.data.village.defensive.type;
      }
      if (this.data.player.playerIsAttacking && !this.data.player.playerWantsAttackerInfo) {
        villageType = this.data.village.offensive.type;
      }
      if (!this.data.player.playerIsAttacking && this.data.player.playerWantsDefenderInfo) {
        villageType = this.data.village.defensive.type;
      }

      const isOffense = (villageType === "Offensive" || villageType === "Probably Offensive");
      const color = isOffense ? "ff0000" : "0000ff";
      const typeIcon = isOffense ? "[unit]axe[/unit]" : "[unit]sword[/unit]";
      note += "[color=#" + color + "][b][size=12]" + villageType + "[/size][/b][/color] " + typeIcon + " ";

      if (this.data.player.playerIsAttacking || this.data.player.playerWantsDefenderInfo) {
        if (this.data.village.defensive.buildings.watchtower[0]) note += "[building]watchtower[/building] Watchtower [building]watchtower[/building] " + this.data.village.defensive.buildings.watchtower[1] + " | ";
        if (this.data.village.defensive.buildings.wall[0]) note += "[building]wall[/building][color=#5c3600][b] Wall " + this.data.village.defensive.buildings.wall[1] + "[/b][/color] | ";
        if (this.data.village.defensive.buildings.firstChurch[0]) note += "[building]church_f[/building] First church [building]church[/building] | ";
        if (this.data.village.defensive.buildings.church[0]) note += "[building]church_f[/building] Church [building]church[/building] " + this.data.village.defensive.buildings.church[1] + " | ";
      }

      if (this.data.player.playerIsAttacking) {
        const clears = await this.estimateClears();
        if (typeof clears === "number") {
          note += "Clears needed: " + this.formatClearsForDisplay(clears) + " [img]https://dspt.innogamescdn.com/asset/af1188db/graphic/command/attack_large.webp[/img] ";
        }
      }

      note += "\n\n[b]" + titleText + "[/b]\n\n";

      const caseType = this.data.player.playerIsAttacking ? "A" : "B";
      const link = await this.publishReportAndGetLink(caseType);

      if (link) {
        note += "[spoiler=Spoiler][report_display]" + link + "[/report_display][/spoiler]";
      } else {
        const reportExport = $("#report_export_code").text().trim();
        if (reportExport) {
          note += "[spoiler=Spoiler]" + reportExport + "[/spoiler]";
        } else {
          note += "[b]Public report not generated.[/b]";
        }
      }

      return note;
    },

    writeNote: async function () {
      let noteText;
      let villageId;
      const url = "0" == game_data.player.sitter
        ? "https://" + location.hostname + "/game.php?village=" + game_data.village.id + "&screen=api&ajaxaction=village_note_edit&h=" + game_data.csrf + "&client_time=" + Math.round(Timing.getCurrentServerTime() / 1e3)
        : "https://" + location.hostname + "/game.php?village=" + game_data.village.id + "&screen=api&ajaxaction=village_note_edit&t=" + game_data.player.id;

      if (this.data.player.playerIsAttacking || this.data.player.playerIsDefending) {
        villageId = this.data.player.playerIsAttacking || this.data.player.playerWantsDefenderInfo
          ? parseInt(this.data.village.defensive.id)
          : parseInt(this.data.village.offensive.id);

        noteText = await this.createNoteText();
        $.post(url, { note: noteText, village_id: villageId, h: game_data.csrf }, function () {
          UI.SuccessMessage("Note created", 2000);
        });
      } else {
        const text = $('<div class="center"> Add report to which village: </div>');
        const buttons = $('<div class="center"><button class="btn btn-confirm-yes atk">Attacker</button><button class="btn btn-confirm-yes def">Defender</button></div>');
        const modal = text.add(buttons);
        Dialog.show("report_notes", modal);

        buttons.find("button.atk").click(async function () {
          Notes.data.player.playerWantsAttackerInfo = true;
          noteText = await Notes.createNoteText();
          $.post(url, { note: noteText, village_id: Notes.data.village.offensive.id, h: game_data.csrf }, function () {
            UI.SuccessMessage("Note created", 2000);
          });
          Dialog.close();
        });

        buttons.find("button.def").click(async function () {
          Notes.data.player.playerWantsDefenderInfo = true;
          noteText = await Notes.createNoteText();
          $.post(url, { note: noteText, village_id: Notes.data.village.defensive.id, h: game_data.csrf }, function () {
            UI.SuccessMessage("Note created", 2000);
          });
          Dialog.close();
        });
      }
    },

    start: async function () {
      if (!this.verifyPage()) return;
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
