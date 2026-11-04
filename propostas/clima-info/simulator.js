/* INDICA × ClimaInfo — valores ilustrativos de distribuição, sem envio de dados. */
(function (global) {
  'use strict';

  var BUDGETS = [40000, 50000, 60000];
  var MIN = 2000, MAX = 8000, STEP = 500;
  var FLEX = {
    40000: [8000, 8000, 4000, 4000, 2000, 2000, 2000, 2000],
    50000: [8000, 8000, 4000, 4000, 4000, 2000, 2000, 2000, 2000, 2000, 2000],
    60000: [8000, 8000, 8000, 4000, 4000, 4000, 2000, 2000, 2000, 2000, 2000, 2000]
  };
  var STRATEGIES = {
    large: { title: 'Projetos maiores', description: 'Financiamentos de R$ 8.000 por projeto.' },
    many: { title: 'Mais projetos', description: 'Financiamentos de R$ 4.000 por projeto.' },
    flex: { title: 'Financiamento flexível', description: 'Financiamentos individuais entre R$ 2.000 e R$ 8.000.' }
  };

  function assertBudget(budget) {
    if (BUDGETS.indexOf(budget) === -1) throw new RangeError('Escolha um dos três cenários de investimento.');
  }
  function assertStrategy(strategy) {
    if (!Object.prototype.hasOwnProperty.call(STRATEGIES, strategy)) throw new RangeError('Escolha uma estratégia de financiamento.');
  }
  function assertAmount(amount) {
    if (!Number.isInteger(amount) || amount < MIN || amount > MAX || amount % STEP !== 0) {
      throw new RangeError('Use valores entre R$ 2.000 e R$ 8.000, em intervalos de R$ 500.');
    }
  }
  function suggestion(budget, strategy) {
    assertBudget(budget);
    assertStrategy(strategy);
    if (strategy === 'flex') return FLEX[budget].slice();
    var unit = strategy === 'large' ? 8000 : 4000;
    return Array(budget * .8 / unit).fill(unit);
  }
  function createState(budget, strategy) {
    budget = budget === undefined ? 50000 : budget;
    strategy = strategy === undefined ? 'flex' : strategy;
    var amounts = suggestion(budget, strategy);
    return {
      budget: budget,
      strategy: strategy,
      customized: false,
      nextId: amounts.length + 1,
      projects: amounts.map(function (amount, index) { return { id: index + 1, amount: amount }; })
    };
  }
  function summarize(state) {
    var distributed = state.projects.reduce(function (sum, project) { return sum + project.amount; }, 0);
    var management = state.budget / 5;
    var fund = state.budget - management;
    return {
      total: state.budget,
      management: management,
      fund: fund,
      distributed: distributed,
      balance: fund - distributed,
      count: state.projects.length,
      utilization: fund ? distributed / fund : 0
    };
  }
  function validateState(state) {
    assertBudget(state.budget);
    assertStrategy(state.strategy);
    var ids = [];
    state.projects.forEach(function (project) {
      assertAmount(project.amount);
      if (!Number.isInteger(project.id) || ids.indexOf(project.id) !== -1) throw new RangeError('Identificador de projeto inválido.');
      ids.push(project.id);
    });
    if (summarize(state).balance < 0) throw new RangeError('A distribuição ultrapassa os recursos disponíveis para projetos.');
    return true;
  }
  function changeBudget(state, budget) { return createState(budget, state.strategy); }
  function changeStrategy(state, strategy) { return createState(state.budget, strategy); }
  function resetDistribution(state) { return createState(state.budget, state.strategy); }
  function updateProject(state, id, amount) {
    assertAmount(amount);
    var existing = state.projects.find(function (project) { return project.id === id; });
    if (!existing) throw new RangeError('Projeto não encontrado.');
    if (amount - existing.amount > summarize(state).balance) throw new RangeError('Esse valor ultrapassa o saldo disponível. Reduza outro projeto ou libere recursos antes de aumentar este valor.');
    if (amount === existing.amount) return state;
    return Object.assign({}, state, {
      customized: true,
      projects: state.projects.map(function (project) { return project.id === id ? { id: id, amount: amount } : project; })
    });
  }
  function addProject(state) {
    if (summarize(state).balance < MIN) throw new RangeError('Libere ao menos R$ 2.000 para adicionar um projeto.');
    return Object.assign({}, state, {
      customized: true,
      nextId: state.nextId + 1,
      projects: state.projects.concat({ id: state.nextId, amount: MIN })
    });
  }
  function removeProject(state, id) {
    if (!state.projects.some(function (project) { return project.id === id; })) throw new RangeError('Projeto não encontrado.');
    return Object.assign({}, state, {
      customized: true,
      projects: state.projects.filter(function (project) { return project.id !== id; })
    });
  }

  var api = {
    BUDGETS: BUDGETS.slice(), MIN: MIN, MAX: MAX, STEP: STEP,
    suggestion: suggestion, createState: createState, summarize: summarize, validateState: validateState,
    changeBudget: changeBudget, changeStrategy: changeStrategy, resetDistribution: resetDistribution,
    updateProject: updateProject, addProject: addProject, removeProject: removeProject
  };
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (!global || !global.document) return;

  function initialize() {
    var root = document.getElementById('investment-simulator');
    if (!root || root.getAttribute('data-simulator-ready') === 'true') return;
    var rows = root.querySelector('#sim-projects');
    if (!rows) return;
    var state = createState();
    var formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
    function money(value) { return formatter.format(value); }
    function text(id, value) { var element = root.querySelector('#' + id); if (element) element.textContent = value; }
    function announce(message, error) {
      var status = root.querySelector('#sim-status');
      if (status) {
        status.textContent = message;
        status.setAttribute('data-error', error ? 'true' : 'false');
      }
    }
    function projectLabel(index) { return 'Projeto ' + String(index + 1).padStart(2, '0'); }
    function updateSummary() {
      var summary = summarize(state);
      text('sim-total', money(summary.total));
      text('sim-management', money(summary.management));
      text('sim-fund', money(summary.fund));
      text('sim-distributed', money(summary.distributed));
      text('sim-balance', money(summary.balance));
      text('sim-count', String(summary.count));
      text('sim-customized', state.customized ? 'Distribuição personalizada' : 'Distribuição sugerida');
      var customized = root.querySelector('#sim-customized');
      if (customized) customized.hidden = !state.customized;
      text('sim-strategy-summary', STRATEGIES[state.strategy].description);
      text('sim-utilization-label', Math.round(summary.utilization * 100) + '% do fundo distribuído');
      text('sim-fund-description', state.budget === 50000 ? 'Os R$ 40.000 inicialmente previstos ficam integralmente disponíveis para financiar os projetos.' : '80% do investimento total ficam disponíveis para financiar os projetos.');
      root.setAttribute('data-customized', state.customized ? 'true' : 'false');
      root.setAttribute('data-strategy', state.strategy);
      root.querySelectorAll('[data-budget]').forEach(function (button) {
        var active = Number(button.getAttribute('data-budget')) === state.budget;
        button.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      root.querySelectorAll('[data-strategy]').forEach(function (button) {
        if (button === root) return;
        var active = button.getAttribute('data-strategy') === state.strategy;
        button.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      var add = root.querySelector('#sim-add');
      if (add) add.disabled = summary.balance < MIN;
      text('sim-add-hint', summary.balance < MIN ? 'Para adicionar um projeto, libere ao menos R$ 2.000 reduzindo um valor ou removendo uma linha.' : 'Você pode adicionar um projeto de R$ 2.000 e ajustar seu valor com o saldo disponível.');
      var progress = root.querySelector('#sim-utilization');
      if (progress) {
        progress.max = summary.fund;
        progress.value = summary.distributed;
        progress.setAttribute('aria-valuetext', money(summary.distributed) + ' de ' + money(summary.fund) + ' distribuídos');
      }
      var allocation = root.querySelector('#sim-allocation');
      if (allocation) allocation.style.width = (summary.utilization * 100).toFixed(2) + '%';
      state.projects.forEach(function (project, index) {
        var row = rows.querySelector('[data-project-id="' + project.id + '"]');
        if (!row) return;
        var minus = row.querySelector('[data-action="decrease"]');
        var plus = row.querySelector('[data-action="increase"]');
        minus.disabled = project.amount <= MIN;
        plus.disabled = project.amount >= MAX || summary.balance < STEP;
        minus.setAttribute('aria-label', 'Diminuir o valor do ' + projectLabel(index) + ' em R$ 500');
        plus.setAttribute('aria-label', 'Aumentar o valor do ' + projectLabel(index) + ' em R$ 500');
        var input = row.querySelector('input');
        input.value = String(project.amount);
        input.setAttribute('aria-valuetext', money(project.amount));
        var value = row.querySelector('.sim-project__value');
        if (value) value.textContent = money(project.amount);
      });
    }
    function button(action, label, content) {
      var element = document.createElement('button');
      element.type = 'button';
      element.className = action === 'remove' ? 'sim-project__remove' : 'sim-step';
      element.setAttribute('data-action', action);
      element.setAttribute('aria-label', label);
      element.textContent = content;
      return element;
    }
    function renderRows() {
      rows.textContent = '';
      if (!state.projects.length) {
        var empty = document.createElement('p');
        empty.className = 'sim-empty';
        empty.textContent = 'Nenhum projeto na simulação. Adicione um projeto para começar a distribuir os recursos.';
        rows.appendChild(empty);
      }
      state.projects.forEach(function (project, index) {
        var labelText = projectLabel(index);
        var row = document.createElement('div');
        row.className = 'sim-project';
        row.setAttribute('data-project-id', String(project.id));
        var label = document.createElement('label');
        label.className = 'sim-project__label';
        label.htmlFor = 'sim-amount-' + project.id;
        label.textContent = labelText;
        var controls = document.createElement('div');
        controls.className = 'sim-project__controls';
        controls.appendChild(button('decrease', 'Diminuir valor', '−'));
        var amount = document.createElement('div');
        amount.className = 'sim-project__amount';
        var prefix = document.createElement('span');
        prefix.className = 'sim-project__currency';
        prefix.textContent = 'R$';
        prefix.setAttribute('aria-hidden', 'true');
        var input = document.createElement('input');
        input.className = 'sim-project__input';
        input.id = 'sim-amount-' + project.id;
        input.type = 'number';
        input.min = String(MIN);
        input.max = String(MAX);
        input.step = String(STEP);
        input.inputMode = 'numeric';
        input.value = String(project.amount);
        input.setAttribute('aria-label', 'Valor do ' + labelText + ', em reais');
        amount.appendChild(prefix);
        amount.appendChild(input);
        controls.appendChild(amount);
        controls.appendChild(button('increase', 'Aumentar valor', '+'));
        row.appendChild(label);
        row.appendChild(controls);
        row.appendChild(button('remove', 'Remover ' + labelText, 'Remover'));
        rows.appendChild(row);
      });
      updateSummary();
    }
    function run(operation, message, rebuild) {
      try {
        state = operation();
        if (rebuild) renderRows();
        else updateSummary();
        announce(message + ' Saldo disponível: ' + money(summarize(state).balance) + '.', false);
        return true;
      } catch (error) {
        updateSummary();
        announce(error.message, true);
        return false;
      }
    }
    root.addEventListener('click', function (event) {
      var target = event.target.closest('button');
      if (!target || !root.contains(target) || target.disabled) return;
      if (target.hasAttribute('data-budget')) {
        var budget = Number(target.getAttribute('data-budget'));
        if (budget === state.budget) return;
        run(function () { return changeBudget(state, budget); }, 'Investimento atualizado para ' + money(budget) + '. A distribuição sugerida foi restaurada para o novo fundo.', true);
      } else if (target.hasAttribute('data-strategy')) {
        var strategy = target.getAttribute('data-strategy');
        run(function () { return changeStrategy(state, strategy); }, 'Estratégia ' + STRATEGIES[strategy].title.toLowerCase() + ' selecionada. Distribuição sugerida restaurada.', true);
      } else if (target.id === 'sim-reset') {
        run(function () { return resetDistribution(state); }, 'Distribuição sugerida restaurada.', true);
      } else if (target.id === 'sim-add') {
        if (run(function () { return addProject(state); }, 'Projeto adicionado por R$ 2.000.', true)) {
          var added = rows.querySelector('#sim-amount-' + (state.nextId - 1));
          if (added) added.focus();
        }
      } else if (target.hasAttribute('data-action')) {
        var row = target.closest('[data-project-id]');
        if (!row) return;
        var id = Number(row.getAttribute('data-project-id'));
        var index = state.projects.findIndex(function (project) { return project.id === id; });
        var project = state.projects[index];
        if (!project) return;
        var action = target.getAttribute('data-action');
        if (action === 'remove') {
          if (run(function () { return removeProject(state, id); }, projectLabel(index) + ' removido.', true)) {
            var next = state.projects[Math.min(index, state.projects.length - 1)];
            var focus = next ? rows.querySelector('#sim-amount-' + next.id) : root.querySelector('#sim-add');
            if (focus) focus.focus({ preventScroll: true });
          }
        } else if (action === 'decrease' || action === 'increase') {
          var value = project.amount + (action === 'increase' ? STEP : -STEP);
          run(function () { return updateProject(state, id, value); }, projectLabel(index) + ' atualizado para ' + money(value) + '.', false);
          if (target.disabled) {
            var amountInput = row.querySelector('input');
            if (amountInput) amountInput.focus({ preventScroll: true });
          }
        }
      }
    });
    function commitInput(input) {
      var row = input.closest('[data-project-id]');
      if (!row) return;
      var id = Number(row.getAttribute('data-project-id'));
      var value = input.value === '' ? NaN : Number(input.value);
      var index = state.projects.findIndex(function (project) { return project.id === id; });
      if (index < 0 || state.projects[index].amount === value) return;
      run(function () { return updateProject(state, id, value); }, projectLabel(index) + ' atualizado para ' + money(value) + '.', false);
    }
    rows.addEventListener('input', function (event) {
      if (!event.target.matches('.sim-project__input')) return;
      var value = event.target.value === '' ? NaN : Number(event.target.value);
      if (Number.isInteger(value) && value >= MIN && value <= MAX && value % STEP === 0) commitInput(event.target);
    });
    rows.addEventListener('focusout', function (event) {
      if (event.target.matches('.sim-project__input')) commitInput(event.target);
    });
    rows.addEventListener('change', function (event) {
      if (event.target.matches('.sim-project__input')) commitInput(event.target);
    });
    rows.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' && event.target.matches('.sim-project__input')) {
        event.preventDefault();
        commitInput(event.target);
      }
    });
    renderRows();
    root.setAttribute('data-simulator-ready', 'true');
    var fallback = root.querySelector('#sim-fallback');
    if (fallback) fallback.hidden = true;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})(typeof window === 'object' ? window : null);
