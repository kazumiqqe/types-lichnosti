/* Тест на тип личности: определяет одну из четырёх групп.
   Логика: шкала N/S задаёт ветвь; при N группу решает T/F (Аналитики или Дипломаты),
   при S - J/P (Опекуны или Исследователи). */
(function () {
  "use strict";

  var QUESTIONS = [
    { ax: "SN", p1: "N", t1: "Мне интереснее обсуждать идеи и возможности, чем конкретные факты.", p2: "S", t2: "Мне важнее опираться на проверенные факты и личный опыт." },
    { ax: "SN", p1: "N", t1: "Я часто замечаю скрытые закономерности и связи между явлениями.", p2: "S", t2: "Я замечаю конкретные детали и то, что происходит прямо сейчас." },
    { ax: "SN", p1: "N", t1: "Новое и необычное привлекает меня больше привычного.", p2: "S", t2: "Я предпочитаю проверенные и понятные способы делать дела." },
    { ax: "SN", p1: "N", t1: "Я много думаю о будущем и о том, что могло бы быть.", p2: "S", t2: "Я живу настоящим и работаю с тем, что есть." },
    { ax: "SN", p1: "N", t1: "Без общей картины мне быстро становится скучно.", p2: "S", t2: "Пока я не увижу конкретные примеры, общая идея мне не ясна." },
    { ax: "TF", p1: "T", t1: "Решая, я опираюсь на логику и объективные критерии.", p2: "F", t2: "Решая, я опираюсь на ценности и на то, как это отразится на людях." },
    { ax: "TF", p1: "T", t1: "В споре для меня важнее правда, даже если она неприятна.", p2: "F", t2: "В споре для меня важнее сохранить хорошие отношения." },
    { ax: "TF", p1: "T", t1: "Меня ценят за точность и беспристрастность.", p2: "F", t2: "Меня ценят за чуткость и умение понять других." },
    { ax: "TF", p1: "T", t1: "Критику я воспринимаю как информацию для улучшения результата.", p2: "F", t2: "Критика задевает меня, если в ней нет уважения." },
    { ax: "TF", p1: "T", t1: "Мне легче разобрать проблему по частям, чем утешать человека.", p2: "F", t2: "Я лучше замечаю настроение людей, чем недостатки в системе." },
    { ax: "JP", p1: "J", t1: "Я люблю составлять план и придерживаться его.", p2: "P", t2: "Я предпочитаю действовать по обстоятельствам." },
    { ax: "JP", p1: "J", t1: "Мне спокойнее, когда дела завершены заранее.", p2: "P", t2: "Я люблю оставлять варианты открытыми до последнего." },
    { ax: "JP", p1: "J", t1: "Порядок и правила помогают мне чувствовать уверенность.", p2: "P", t2: "Правила должны быть гибкими, если ситуация меняется." },
    { ax: "JP", p1: "J", t1: "Я делаю дела по очереди, пока не закончу.", p2: "P", t2: "Мне нравится переключаться между несколькими делами." },
    { ax: "JP", p1: "J", t1: "Срыв плана сильно выводит меня из равновесия.", p2: "P", t2: "Неожиданные изменения планов меня скорее бодрят." }
  ];

  var GROUPS = {
    analyst: { name: "Аналитики", code: "NT", text: "Вы склонны искать закономерности, оценивать идеи по логике и строить стратегии. Вам важны компетентность и эффективность." },
    diplomat: { name: "Дипломаты", code: "NF", text: "Вы ищете смысл и ценности, чутко воспринимаете людей и умеете вдохновлять. Вам важны гармония и личное значение дел." },
    explorer: { name: "Исследователи", code: "SP", text: "Вы действуете «здесь и сейчас», быстро ориентируетесь в ситуации и учитесь на опыте. Вам важны свобода и живое действие." },
    guardian: { name: "Опекуны", code: "SJ", text: "Вы цените порядок, ответственность и проверенные правила и заботитесь о стабильности вокруг себя. Вам важны надёжность и долг." }
  };

  var AXES = [
    { key: "SN", title: "Восприятие", a: "N - интуиция", b: "S - ощущения", pa: "N", pb: "S" },
    { key: "TF", title: "Решения", a: "T - мышление", b: "F - чувства", pa: "T", pb: "F" },
    { key: "JP", title: "Образ жизни", a: "J - суждение", b: "P - восприятие", pa: "J", pb: "P" }
  ];

  var root = document.getElementById("quiz");
  if (!root) return;
  var el = {
    intro: document.getElementById("quiz-intro"),
    run: document.getElementById("quiz-run"),
    result: document.getElementById("quiz-result"),
    start: document.getElementById("quiz-start"),
    back: document.getElementById("quiz-back"),
    count: document.getElementById("quiz-count"),
    bar: document.getElementById("quiz-bar"),
    q: document.getElementById("quiz-q"),
    choices: document.getElementById("quiz-choices")
  };

  var order, answers, pos;

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function show(name) {
    el.intro.hidden = name !== "intro";
    el.run.hidden = name !== "run";
    el.result.hidden = name !== "result";
  }

  function start() {
    order = shuffle(QUESTIONS);
    answers = [];
    pos = 0;
    show("run");
    render();
  }

  function render() {
    var q = order[pos];
    var opts = shuffle([{ p: q.p1, t: q.t1 }, { p: q.p2, t: q.t2 }]);
    el.count.textContent = "Вопрос " + (pos + 1) + " из " + order.length;
    el.bar.style.width = (pos / order.length * 100) + "%";
    el.bar.parentNode.setAttribute("aria-valuenow", pos);
    el.choices.innerHTML = "";
    opts.forEach(function (o) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "choice";
      b.setAttribute("data-pole", o.p);
      b.textContent = o.t;
      b.addEventListener("click", function () { choose(o.p); });
      el.choices.appendChild(b);
    });
    el.back.disabled = pos === 0;
    el.q.focus();
  }

  function choose(pole) {
    answers[pos] = pole;
    if (pos < order.length - 1) { pos++; render(); } else { finish(); }
  }

  function back() {
    if (pos > 0) { pos--; answers.length = pos; render(); }
  }

  function count(pole) {
    return answers.filter(function (p) { return p === pole; }).length;
  }

  function groupKey(s) {
    if (s.N > s.S) return s.T > s.F ? "analyst" : "diplomat";
    return s.J > s.P ? "guardian" : "explorer";
  }

  function finish() {
    var s = {};
    "NSTFJP".split("").forEach(function (p) { s[p] = count(p); });
    var key = groupKey(s), g = GROUPS[key];
    var unused = s.N > s.S ? "JP" : "TF";
    var html = '<div class="result ' + key + '">' +
      '<p class="tag-list"><span class="tag">Ваш результат</span></p>' +
      '<h3 id="quiz-result-title" tabindex="-1">Ваша группа: ' + g.name + ' (' + g.code + ')</h3>' +
      '<p>' + g.text + '</p><div class="bars">';
    AXES.forEach(function (a) {
      var na = s[a.pa], nb = s[a.pb], total = na + nb;
      var pa = Math.round(na / total * 100), pb = 100 - pa;
      html += '<div class="bar-row"><div class="bar-label"><strong>' + a.title + '</strong>' +
        (a.key === unused ? ' <em>(на группу не влияет)</em>' : '') + '</div>' +
        '<div class="bar" role="img" aria-label="' + a.a + ' ' + pa + '%, ' + a.b + ' ' + pb + '%">' +
        '<span class="' + (pa >= pb ? 'dom' : 'sub') + '" style="width:' + pa + '%">' + (pa >= 25 ? pa + '%' : '') + '</span>' +
        '<span class="' + (pb > pa ? 'dom' : 'sub') + '" style="width:' + pb + '%">' + (pb >= 25 ? pb + '%' : '') + '</span></div>' +
        '<div class="bar-legend"><span>' + a.a + '</span><span>' + a.b + '</span></div></div>';
    });
    html += '</div><p class="note">Результат показывает предпочтения, а не способности, и не является диагнозом. ' +
      'Выраженность близка к 50% - значит, вы гибки в этой области.</p>' +
      '<p><a class="btn" href="types.html#' + key + '">Подробнее о группе</a> ' +
      '<button type="button" class="btn outline" id="quiz-again">Пройти заново</button></p></div>';
    el.result.innerHTML = html;
    show("result");
    document.getElementById("quiz-again").addEventListener("click", start);
    document.getElementById("quiz-result-title").focus();
  }

  el.start.addEventListener("click", start);
  el.back.addEventListener("click", back);
  el.q.setAttribute("tabindex", "-1");
})();
