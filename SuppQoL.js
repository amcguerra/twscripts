(function () {
  'use strict';

  const SCREEN = new URLSearchParams(location.search).get('screen');
  if (SCREEN !== 'overview' && SCREEN !== 'info_village') return;

  const CONFIG = {
    units: ['spear', 'sword', 'axe', 'spy', 'light', 'heavy', 'ram', 'catapult', 'knight', 'snob'],
    landingBufferMs: 2500,
    reapplyDebounceMs: 300,
    statusResetMs: 4000,
    supportIcon: 'https://dspt.innogamescdn.com/asset/6ce2ab95/graphic/command/support.webp',
    supportIconParts: ['/graphic/command/support.webp', '/graphic/command/back.webp']
  };

  const SELECTORS = {
    content: '#content_value',
    unitsWidget: '#show_units',
    unitsHead: '#show_units h4.head',
    unitRows: 'tr.all_unit strong[data-count]',
    supportSum: '#support_sum',
    commandRows: 'tr.command-row',
    supportCommand: '.command_hover_details[data-command-type="support"]',
    injected: '.support-incoming',
    counterButton: '#si-support-btn',
    incomingWidget: '#show_incoming_units',
    incomingContainer: '#commands_incomings, .commands-container'
  };

  const CSS = {
    tooltipWrap: 'tw-hide-support-tooltip-wrap',
    infoHideBtn: 'tw-hide-support-commands-btn',
    overviewHideBtn: 'tw-hide-support-overview-btn'
  };

  const STATUS = {
    idle: 'Show incoming support',
    loading: 'Loading...',
    updated: 'Support updated',
    empty: 'No incoming support',
    noVillage: 'Village not found',
    error: 'Failed to load'
  };

  function injectStyles() {
    if (document.getElementById('tw-support-tools-styles')) return;
    const style = document.createElement('style');
    style.id = 'tw-support-tools-styles';
    style.textContent = `
      .support-incoming { color: green; font-weight: bold; margin-left: 3px; }
      #si-support-btn { margin-left: 6px; padding: 0 3px; cursor: pointer; vertical-align: middle; line-height: 1; }
      #si-support-btn img { width: 15px; height: 15px; vertical-align: middle; }
      #si-support-btn[data-busy="1"] { opacity: 0.5; }
      .${CSS.infoHideBtn}, #${CSS.overviewHideBtn} { margin-left: 6px; padding: 0 3px; cursor: pointer; vertical-align: middle; line-height: 1; }
      .${CSS.infoHideBtn} img, #${CSS.overviewHideBtn} img { width: 15px; height: 15px; vertical-align: middle; }
    `;
    document.head.appendChild(style);
  }

  function isSupportCommandRow(row) {
    return (
      row.querySelector(SELECTORS.supportCommand) ||
      [...row.querySelectorAll('img')].some(img =>
        CONFIG.supportIconParts.some(part => img.src.includes(part))
      )
    );
  }

  function makeIconButton() {
    const btn = document.createElement('button');
    btn.type = 'button';
    const icon = document.createElement('img');
    icon.src = CONFIG.supportIcon;
    icon.alt = 'Support';
    btn.appendChild(icon);
    return btn;
  }

  function initTooltip(wrapper) {
    wrapper.classList.add('tooltip');
    wrapper.removeAttribute('title');
    if (window.UI && UI.ToolTip) {
      UI.ToolTip($(wrapper));
    } else if (window.$ && $.fn && $.fn.tooltip) {
      $(wrapper).tooltip({ showURL: false, track: true, fade: 0, delay: 0, showBody: ' :: ', extraClass: 'tooltip-style' });
    }
    wrapper.tooltipText = wrapper.getAttribute('data-title');
  }

  function wrapWithTooltip(btn, title) {
    const wrapper = document.createElement('span');
    wrapper.className = CSS.tooltipWrap;
    wrapper.setAttribute('data-title', title);
    wrapper.style.display = 'inline-block';
    wrapper.style.verticalAlign = 'middle';
    wrapper.appendChild(btn);
    initTooltip(wrapper);
    return wrapper;
  }

  function updateTooltip(btn, text) {
    const wrapper = btn.closest(`.${CSS.tooltipWrap}`);
    if (!wrapper) return;
    wrapper.setAttribute('data-title', text);
    wrapper.tooltipText = text;
    if (window.$) {
      const $wrapper = $(wrapper);
      $wrapper[0].tooltipText = text;
      $wrapper.trigger('tooltip_content_change');
    }
  }

  let lastTotals = null;
  let unitMeta = {};
  let supportSignature = '';
  let refetchPending = false;
  let refetchTimer = null;
  let landingTimer = null;

  function getVillageId() {
    if (window.game_data && game_data.village && game_data.village.id) {
      return game_data.village.id;
    }
    const match = location.search.match(/[?&]village=(\d+)/);
    return match ? match[1] : null;
  }

  function extractSupportSumFragment(html) {
    const marker = html.indexOf('id="support_sum"');
    if (marker === -1) return null;
    const start = html.lastIndexOf('<table', marker);
    const end = html.indexOf('</table>', marker);
    if (start === -1 || end === -1) return null;
    return html.slice(start, end + '</table>'.length);
  }

  async function fetchSupportTotals(villageId) {
    const url = `/game.php?village=${villageId}&screen=info_village&id=${villageId}&_=${Date.now()}`;
    const res = await fetch(url, { credentials: 'same-origin', cache: 'no-store' });
    const html = await res.text();

    const totals = {};
    const meta = {};
    CONFIG.units.forEach(unit => (totals[unit] = 0));

    const fragment = extractSupportSumFragment(html);
    if (!fragment) return { totals, meta, hasTable: false };

    const doc = new DOMParser().parseFromString(fragment, 'text/html');
    const table = doc.querySelector(SELECTORS.supportSum);
    if (!table) return { totals, meta, hasTable: false };

    CONFIG.units.forEach(unit => {
      const cell = table.querySelector(`td[data-unit="${unit}"]`);
      if (cell) totals[unit] = parseInt(cell.textContent.trim(), 10) || 0;

      const img = table.querySelector(`th a[data-unit="${unit}"] img`);
      if (img) {
        meta[unit] = {
          name: img.getAttribute('title') || unit,
          image: img.getAttribute('src') || ''
        };
      }
    });
    return { totals, meta, hasTable: true };
  }

  function injectTotals(totals) {
    document.querySelectorAll(SELECTORS.injected).forEach(el => el.remove());
    document.querySelectorAll('.si-added-row').forEach(el => el.remove());

    const widget = document.querySelector(SELECTORS.unitsWidget);
    if (!widget) return;

    const rowByUnit = {};
    widget.querySelectorAll('tr.all_unit').forEach(tr => {
      const strong = tr.querySelector('strong[data-count]');
      if (strong) rowByUnit[strong.getAttribute('data-count')] = tr;
    });

    const tbody = widget.querySelector('#unit_overview_table tbody') || widget.querySelector('tbody');
    const order = CONFIG.units;

    order.forEach((unit, index) => {
      const incoming = totals[unit] || 0;
      if (incoming <= 0) return;

      const existingRow = rowByUnit[unit];
      if (existingRow) {
        const strong = existingRow.querySelector('strong[data-count]');
        const span = document.createElement('span');
        span.className = 'support-incoming';
        span.textContent = `(+${incoming})`;
        strong.insertAdjacentElement('afterend', span);
        return;
      }

      const meta = unitMeta[unit] || { name: unit, image: '' };
      const tr = document.createElement('tr');
      tr.className = 'all_unit si-added-row';
      tr.innerHTML =
        `<td><a href="#" class="unit_link" data-unit="${unit}">` +
        `<img src="${meta.image}"> </a> ` +
        `<strong data-count="${unit}">0</strong> ` +
        `<span class="support-incoming">(+${incoming})</span> ` +
        `${meta.name}</td>`;

      const laterUnit = order.slice(index + 1).find(u => rowByUnit[u]);
      if (laterUnit) {
        rowByUnit[laterUnit].insertAdjacentElement('beforebegin', tr);
      } else {
        const rows = [...widget.querySelectorAll('tr.all_unit')];
        const last = rows[rows.length - 1];
        if (last && last.parentNode) last.insertAdjacentElement('afterend', tr);
        else if (tbody) tbody.appendChild(tr);
      }
      rowByUnit[unit] = tr;
    });
  }

  function incomingSupportRows() {
    return [...document.querySelectorAll(SELECTORS.commandRows)]
      .filter(row => row.querySelector(SELECTORS.supportCommand));
  }

  function incomingSupportSignature() {
    return incomingSupportRows()
      .map(row => row.querySelector(SELECTORS.supportCommand).getAttribute('data-command-id'))
      .sort()
      .join(',');
  }

  function futureSupportArrivals() {
    const now = Date.now();
    return incomingSupportRows()
      .map(row => row.querySelector('[data-endtime]'))
      .filter(Boolean)
      .map(el => parseInt(el.getAttribute('data-endtime'), 10) * 1000)
      .filter(time => time > now)
      .sort((a, b) => a - b);
  }

  function triggerRefetch(delay) {
    clearTimeout(refetchTimer);
    refetchPending = true;
    document.querySelectorAll(SELECTORS.injected).forEach(el => el.remove());
    document.querySelectorAll('.si-added-row').forEach(el => el.remove());
    refetchTimer = setTimeout(() => {
      refresh()
        .catch(err => console.error('[Support tools] auto-refetch failed', err))
        .finally(() => { refetchPending = false; });
    }, delay);
  }

  function armLandingTimer() {
    clearTimeout(landingTimer);
    const arrivals = futureSupportArrivals();
    if (!arrivals.length) return;
    const delay = Math.max(0, arrivals[0] - Date.now()) + CONFIG.landingBufferMs;
    landingTimer = setTimeout(() => triggerRefetch(0), delay);
  }

  async function refresh() {
    const villageId = getVillageId();
    if (!villageId) throw new Error(STATUS.noVillage);

    const { totals, meta, hasTable } = await fetchSupportTotals(villageId);
    lastTotals = totals;
    unitMeta = meta;
    refetchPending = false;
    injectTotals(totals);
    supportSignature = incomingSupportSignature();
    armLandingTimer();
    return { totals, hasTable };
  }

  function addCounterButton() {
    const head = document.querySelector(SELECTORS.unitsHead);
    if (!head || document.querySelector(SELECTORS.counterButton)) return;

    const btn = makeIconButton();
    btn.id = 'si-support-btn';

    btn.addEventListener('click', async event => {
      event.preventDefault();
      event.stopPropagation();
      if (btn.dataset.busy === '1') return;

      btn.dataset.busy = '1';
      updateTooltip(btn, STATUS.loading);

      try {
        const { totals, hasTable } = await refresh();
        const sum = Object.values(totals).reduce((a, b) => a + b, 0);
        updateTooltip(btn, hasTable && sum > 0 ? STATUS.updated : STATUS.empty);
      } catch (err) {
        console.error('[Support tools]', err);
        updateTooltip(btn, err.message === STATUS.noVillage ? STATUS.noVillage : STATUS.error);
      } finally {
        btn.dataset.busy = '0';
        setTimeout(() => updateTooltip(btn, STATUS.idle), CONFIG.statusResetMs);
      }
    });

    head.appendChild(wrapWithTooltip(btn, STATUS.idle));
  }

  function reapplyCounter() {
    addCounterButton();
    if (!lastTotals) return;

    const widget = document.querySelector(SELECTORS.unitsWidget);
    const hasIncoming = Object.values(lastTotals).some(v => v > 0);
    const needsReinjection = !refetchPending && widget && hasIncoming &&
      !widget.querySelector(SELECTORS.injected);

    if (needsReinjection) injectTotals(lastTotals);

    const signature = incomingSupportSignature();
    if (signature !== supportSignature) {
      supportSignature = signature;
      triggerRefetch(CONFIG.landingBufferMs);
    }
  }

  const hideState = new WeakMap();

  function applyHiddenState(container, hidden) {
    [...container.querySelectorAll('tr')].forEach(row => {
      if (row.querySelector('th')) return;
      if (isSupportCommandRow(row)) row.style.display = hidden ? 'none' : '';
    });
  }

  function makeHideButton(container) {
    const btn = makeIconButton();

    const sync = () => {
      const hidden = hideState.get(container) === true;
      btn.style.opacity = hidden ? '0.45' : '1';
      updateTooltip(btn, hidden ? 'Show support commands' : 'Hide support commands');
    };

    btn.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      const hidden = !(hideState.get(container) === true);
      hideState.set(container, hidden);
      applyHiddenState(container, hidden);
      sync();
    });

    btn._syncHideButton = sync;
    return btn;
  }

  function commandHeaders() {
    return [...document.querySelectorAll('th')]
      .filter(th => th.querySelector('.commands-command-count'));
  }

  function addInfoVillageButtons() {
    commandHeaders().forEach(header => {
      const table = header.closest('table');
      if (!table) return;

      let btn = header.querySelector(`.${CSS.infoHideBtn}`);
      if (!btn) {
        btn = makeHideButton(table);
        btn.className = CSS.infoHideBtn;
        const wrapper = wrapWithTooltip(btn, 'Hide support commands');
        const countSpan = header.querySelector('.commands-command-count');
        countSpan.insertAdjacentElement('afterend', wrapper);
      }
      applyHiddenState(table, hideState.get(table) === true);
      btn._syncHideButton();
    });
  }

  function addOverviewHideButton() {
    const widget = document.querySelector(SELECTORS.incomingWidget);
    if (!widget) return;

    const header = widget.querySelector('h4.head');
    const container = widget.querySelector(SELECTORS.incomingContainer);
    if (!header || !container) return;

    let btn = document.getElementById(CSS.overviewHideBtn);
    if (!btn) {
      btn = makeHideButton(container);
      btn.id = CSS.overviewHideBtn;
      header.appendChild(wrapWithTooltip(btn, 'Hide support commands'));
    }
    applyHiddenState(container, hideState.get(container) === true);
    btn._syncHideButton();
  }

  function applyAll() {
    if (SCREEN === 'overview') {
      reapplyCounter();
      addOverviewHideButton();
    }
    if (SCREEN === 'info_village') {
      addInfoVillageButtons();
    }
  }

  let applyTimer = null;
  function watch() {
    const container = document.querySelector(SELECTORS.content) || document.body;
    const observer = new MutationObserver(() => {
      if (document.hidden) return;
      clearTimeout(applyTimer);
      applyTimer = setTimeout(applyAll, CONFIG.reapplyDebounceMs);
    });
    observer.observe(container, { childList: true, subtree: true });
  }

  injectStyles();
  applyAll();
  watch();
})();
