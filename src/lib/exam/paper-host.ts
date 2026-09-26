/** Injected into every TCS-style paper so Submit works inside nested iframes. */
export function wirePaperGlobals(html: string): string {
  return html
    .replace(/\bconst\s+examData\s*=/, "var examData = window.examData =")
    .replace(/\blet\s+userAnswers\s*=/, "var userAnswers = window.userAnswers =")
    .replace(/\blet\s+markedForReview\s*=/, "var markedForReview = window.markedForReview =")
    .replace(/\blet\s+visited\s*=/, "var visited = window.visited =")
    .replace(/\blet\s+currentSection\s*=/, "var currentSection =")
    .replace(/\blet\s+currentQuestion\s*=/, "var currentQuestion =");
}

export const PAPER_HOST_SCRIPT = `<script>
(function () {
  if (window.__setpaperHost) return;
  window.__setpaperHost = true;

  function notifyHost(type, payload) {
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ source: "setpaper-exam", type: type, payload: payload }, "*");
      }
    } catch (err) {}
  }
  window.notifyHost = notifyHost;

  function asList(value) {
    if (Array.isArray(value)) return value.slice().map(Number).filter(function (n) { return Number.isFinite(n); }).sort(function (a, b) { return a - b; });
    if (typeof value === "number" && Number.isFinite(value)) return [value];
    return [];
  }

  function isCorrect(q, userAns) {
    if (!q || userAns === undefined || userAns === null || userAns === "") return false;
    if (q.type === "mcq") return userAns === q.correct;
    if (q.type === "msq") return JSON.stringify(asList(userAns)) === JSON.stringify(asList(q.correct));
    if (q.type === "numerical") return String(userAns).trim() === String(q.correct).trim();
    return false;
  }

  function collectFromEmt() {
    var qs = (window.questions_data && window.questions_data.length) ? window.questions_data : window.raw_questions_data;
    var ans = window.answers;
    if (!Array.isArray(qs) || !qs.length) return null;
    var data = window.examData;
    var bankByText = {};
    if (data && data.sections) {
      data.sections.forEach(function (section) {
        (section.questions || []).forEach(function (q) {
          var key = String(q.question || "").replace(/\\s+/g, " ").trim();
          if (key) bankByText[key] = q.bankId || q.id;
        });
      });
    }
    var items = [];
    var correct = 0, wrong = 0, attempted = 0, marked = 0, total = 0;
    for (var i = 0; i < qs.length; i++) {
      var q = qs[i] || {};
      total += 1;
      var userAns = Array.isArray(ans) ? ans[i] : null;
      var isAttempted = userAns !== undefined && userAns !== null && userAns !== "";
      var ok = isAttempted && userAns === q.answerIndex;
      if (isAttempted) {
        attempted += 1;
        if (ok) correct += 1;
        else wrong += 1;
      }
      var isMarked = !!(window.marked && window.marked[i]);
      if (isMarked) marked += 1;
      var text = String(q.question_en || q.question || "").replace(/\\s+/g, " ").trim();
      items.push({
        bankId: q.bankId || bankByText[text] || q.id,
        id: q.id,
        type: "mcq",
        userAns: isAttempted ? userAns : null,
        isAttempted: isAttempted,
        isCorrect: !!ok,
        isMarked: isMarked,
        sectionIdx: 0,
        qIdx: i
      });
    }
    return {
      attempted: attempted,
      correct: correct,
      wrong: wrong,
      notAttempted: Math.max(0, total - attempted),
      marked: marked,
      score: correct,
      total: total,
      items: items
    };
  }

  function collectResults() {
    var emt = collectFromEmt();
    if (emt && emt.total) return emt;
    var data = window.examData || { sections: [] };
    var answers = window.userAnswers || {};
    var marks = window.markedForReview || {};
    var items = [];
    var correct = 0, wrong = 0, attempted = 0, marked = 0, total = 0;
    (data.sections || []).forEach(function (section, sIdx) {
      (section.questions || []).forEach(function (q, qIdx) {
        total += 1;
        var userAns = answers[sIdx] ? answers[sIdx][qIdx] : undefined;
        var isAttempted = false;
        var ok = false;
        if (userAns !== undefined && userAns !== null && !(Array.isArray(userAns) && userAns.length === 0) && userAns !== "") {
          isAttempted = true;
          attempted += 1;
          ok = isCorrect(q, userAns);
          if (ok) correct += 1;
          else wrong += 1;
        }
        var isMarked = !!(marks[sIdx] && marks[sIdx][qIdx]);
        if (isMarked) marked += 1;
        items.push({
          bankId: q.bankId || q.id,
          id: q.id,
          type: q.type,
          userAns: userAns === undefined ? null : userAns,
          isAttempted: isAttempted,
          isCorrect: ok,
          isMarked: isMarked,
          sectionIdx: sIdx,
          qIdx: qIdx
        });
      });
    });
    return {
      attempted: attempted,
      correct: correct,
      wrong: wrong,
      notAttempted: Math.max(0, total - attempted),
      marked: marked,
      score: correct,
      total: total,
      items: items
    };
  }
  window.collectExamResults = collectResults;

  function saveOpenAnswer() {
    try {
      if (typeof saveNumericalAnswer === "function") saveNumericalAnswer();
      if (typeof saveCurrentAnswer === "function") saveCurrentAnswer();
    } catch (err) {}
  }

  function submitPaper() {
    saveOpenAnswer();
    if (locked()) {
      showLockNote();
      return;
    }
    if (typeof showFinalSummary === "function") showFinalSummary();
    else notifyHost("exam-complete", collectResults());
  }
  window.submitPaper = submitPaper;

  window.confirm = function () { return true; };

  function locked() {
    var until = Number(window.__setpaperLockUntil || 0);
    return until > 0 && Date.now() < until;
  }

  function showLockNote() {
    var el = document.getElementById("setpaper-lock-note");
    if (!el) {
      el = document.createElement("div");
      el.id = "setpaper-lock-note";
      el.style.cssText = "position:sticky;top:0;z-index:50;margin:8px 0;padding:10px 12px;border-radius:12px;background:#003366;color:#fff;font:600 13px/1.4 Inter,system-ui,sans-serif;text-align:center;";
      var exam = document.getElementById("exam-interface") || document.body;
      exam.insertBefore(el, exam.firstChild);
    }
    var until = Number(window.__setpaperLockUntil || 0);
    var left = Math.max(0, Math.ceil((until - Date.now()) / 1000));
    var m = Math.floor(left / 60);
    var s = left % 60;
    el.textContent = "Time still running · " + m + ":" + (s < 10 ? "0" : "") + s + " — the paper submits when time ends.";
    el.style.display = locked() ? "block" : "none";
  }

  var origShow = window.showFinalSummary;
  window.showFinalSummary = function () {
    saveOpenAnswer();
    if (locked()) {
      showLockNote();
      return;
    }
    try {
      if (typeof origShow === "function") origShow.apply(this, arguments);
    } catch (err) {}
  };

  var origSubmit = window.submitCurrentSection;
  window.submitCurrentSection = function (auto) {
    saveOpenAnswer();
    var data = window.examData || { sections: [] };
    var sections = data.sections || [];
    var idx = typeof window.currentSection === "number" ? window.currentSection : 0;
    if (!sections[idx] || idx >= sections.length - 1) {
      submitPaper();
      return;
    }
    try {
      if (typeof origSubmit === "function") origSubmit.call(this, auto === undefined ? true : auto);
    } catch (err) {
      submitPaper();
    }
  };

  var origNext = window.nextQuestion;
  window.nextQuestion = function () {
    saveOpenAnswer();
    var data = window.examData || { sections: [] };
    var idx = typeof window.currentSection === "number" ? window.currentSection : 0;
    var qIdx = typeof window.currentQuestion === "number" ? window.currentQuestion : 0;
    var section = (data.sections || [])[idx];
    if (section && qIdx >= (section.questions || []).length - 1) {
      window.submitCurrentSection(true);
      return;
    }
    if (typeof origNext === "function") origNext.apply(this, arguments);
  };

  function labelSubmit() {
    var data = window.examData || { sections: [] };
    var idx = typeof window.currentSection === "number" ? window.currentSection : 0;
    var last = idx >= (data.sections || []).length - 1;
    var btn = document.getElementById("submit-section-btn");
    if (btn) {
      var span = btn.querySelector("span");
      if (span) span.textContent = last ? "SUBMIT PAPER" : "SUBMIT SECTION";
      btn.setAttribute("onclick", last ? "submitPaper()" : "submitCurrentSection(true)");
    }
    var next = document.getElementById("next-btn");
    if (next && last) {
      var section = (data.sections || [])[idx];
      var qIdx = typeof window.currentQuestion === "number" ? window.currentQuestion : 0;
      if (section && qIdx >= (section.questions || []).length - 1) {
        next.innerHTML = 'Submit paper <i class="fa-solid fa-check ml-2"></i>';
      }
    }
  }

  function addSubmitBar() {
    if (document.getElementById("setpaper-submit-bar")) return;
    var exam = document.getElementById("exam-interface") || document.getElementById("test-ui");
    if (!exam) return;
    var bar = document.createElement("div");
    bar.id = "setpaper-submit-bar";
    bar.style.cssText = "position:sticky;bottom:0;z-index:40;margin-top:12px;padding:10px 12px;background:#fff;border:1px solid #e2e8f0;border-radius:16px;display:flex;gap:8px;";
    bar.innerHTML = '<button type="button" id="setpaper-submit-paper" style="flex:1;min-height:44px;border:0;border-radius:14px;background:#003366;color:#fff;font-weight:700;font-size:13px;">Submit paper</button><button type="button" id="setpaper-submit-section" style="flex:1;min-height:44px;border:1px solid #e2e8f0;border-radius:14px;background:#fff;color:#003366;font-weight:700;font-size:13px;">Submit section</button>';
    exam.appendChild(bar);
    document.getElementById("setpaper-submit-paper").onclick = function () { submitPaper(); };
    document.getElementById("setpaper-submit-section").onclick = function () { window.submitCurrentSection(true); };
  }

  var autoSent = false;
  function tickLock() {
    var bar = document.getElementById("setpaper-submit-bar");
    if (locked()) {
      if (bar) bar.style.display = "none";
      showLockNote();
      return;
    }
    if (bar) bar.style.display = "flex";
    var note = document.getElementById("setpaper-lock-note");
    if (note) note.style.display = "none";
    if (Number(window.__setpaperLockUntil || 0) > 0 && !autoSent) {
      autoSent = true;
      window.__setpaperLockUntil = 0;
      submitPaper();
    }
  }

  function holdSummary(payload) {
    window.__setpaperResult = payload || collectResults();
    var existing = document.getElementById("setpaper-hold-summary");
    if (existing) return;
    var data = window.__setpaperResult || {};
    var root = document.createElement("div");
    root.id = "setpaper-hold-summary";
    root.style.cssText = "position:fixed;inset:0;z-index:80;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:16px;";
    var cards = [
      ["Attempted", data.attempted || 0],
      ["Correct", data.correct || 0],
      ["Wrong", data.wrong || 0],
      ["Not attempted", data.notAttempted || 0],
      ["Marked", data.marked || 0],
      ["Total", data.total || 0]
    ];
    root.innerHTML = '<div style="width:min(640px,100%);background:#fff;border-radius:24px;overflow:hidden;font-family:Inter,system-ui,sans-serif;color:#0f172a;">' +
      '<div style="padding:20px 24px;background:#003366;color:#fff;"><div style="font-size:22px;font-weight:700;">Test summary</div><div style="font-size:12px;opacity:.8;margin-top:4px;">Columns stay here until you save.</div></div>' +
      '<div style="padding:20px 24px;">' +
      '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;">' +
      cards.map(function (row) {
        return '<div style="border:1px solid #e2e8f0;border-radius:16px;padding:12px;"><div style="font-size:11px;font-weight:700;letter-spacing:.04em;color:#64748b;">' + row[0] + '</div><div style="font-size:28px;font-weight:800;">' + row[1] + '</div></div>';
      }).join("") +
      '</div>' +
      '<button type="button" id="setpaper-hold-save" style="margin-top:16px;width:100%;min-height:48px;border:0;border-radius:16px;background:#003366;color:#fff;font-weight:700;">SAVE</button>' +
      '</div></div>';
    document.body.appendChild(root);
    document.getElementById("setpaper-hold-save").onclick = function () {
      if (window.__setpaperSaved) return;
      window.__setpaperSaved = true;
      notifyHost("exam-complete", window.__setpaperResult || collectResults());
    };
  }
  window.holdExamComplete = function (payload) { holdSummary(payload); };

  function bootLayout() {
    var timeEl = document.getElementById("setting-time");
    if (timeEl && window.examData) {
      var mins = 0;
      (window.examData.sections || []).forEach(function (s) { mins += Number(s.timeMinutes) || 0; });
      if (mins > 0) timeEl.value = String(Math.max(1, Math.round(mins)));
    }
    if (!window.__setpaperBooted && typeof window.startExam === "function" && document.getElementById("landing-page")) {
      window.__setpaperBooted = true;
      try { window.startExam(); } catch (err) {}
    }
    if (!window.__setpaperEmtWrap && typeof window.forceSubmit === "function") {
      window.__setpaperEmtWrap = true;
      var origForce = window.forceSubmit;
      window.forceSubmit = function () {
        if (locked()) {
          showLockNote();
          return;
        }
        try { origForce.apply(this, arguments); } catch (err) {}
        holdSummary(collectResults());
      };
    }
  }

  function install() {
    bootLayout();
    addSubmitBar();
    labelSubmit();
    tickLock();
    var tabs = document.getElementById("section-tabs");
    if (tabs && !tabs.__setpaperLabeled) {
      tabs.__setpaperLabeled = true;
      tabs.addEventListener("click", function () { setTimeout(labelSubmit, 0); });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install);
  else install();
  setTimeout(install, 400);
  setInterval(tickLock, 400);
})();
<\/script>`;

export function withPaperHost(html: string): string {
  let wired = wirePaperGlobals(html);
  if (!wired.includes('id="summary-save"') && !wired.includes("id='summary-save'")) {
    wired = wired.replace(/notifyHost\(\s*(["'])exam-complete\1/g, "holdExamComplete(");
  }
  if (wired.includes("window.__setpaperHost")) return wired;
  if (/<\/body>/i.test(wired)) return wired.replace(/<\/body>/i, PAPER_HOST_SCRIPT + "\n</body>");
  return wired + PAPER_HOST_SCRIPT;
}
