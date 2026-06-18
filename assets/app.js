/* The SLG Team — SOP Library app
 * Hash-routed single-page app. No build step.
 *   #/            → library (list + search + filter)
 *   #/sop/<slug>  → SOP detail
 *   #/new         → AI SOP generator
 */
(function () {
  "use strict";

  var SEED = window.SLG_SOPS || [];     // bundled fallback + first-run seed
  var SOPS = SEED.slice();              // live cache (replaced by the database)
  var CATEGORY_ORDER = ["Team Operations", "Market Reports", "Marketing & Content", "Admin & Systems"];
  var CATEGORY_OPTIONS = ["Team Operations", "Marketing & Content", "Market Reports", "Admin & Systems", "Other"];
  var FREQ_OPTIONS = ["", "Daily", "Weekly", "Monthly", "As needed", "Per transaction", "Per listing", "Per report", "Ongoing"];
  var app = document.getElementById("app");
  var state = { query: "", category: "All" };

  /* ── data layer (talks to /api/sops) ─────────────── */
  function api(path, opts) {
    return fetch(path, opts).then(function (r) {
      return r.json().then(function (d) { return { ok: r.ok, data: d }; });
    });
  }
  function loadSops() {
    return api("/api/sops").then(function (res) {
      if (res.ok && res.data.sops && res.data.sops.length) { SOPS = res.data.sops; return; }
      if (res.ok && res.data.sops && !res.data.sops.length && SEED.length) {
        // empty store → seed it from the bundled data
        return api("/api/sops", post({ action: "seed", sops: SEED })).then(function (s) {
          SOPS = (s.ok && s.data.sops && s.data.sops.length) ? s.data.sops : SEED.slice();
        });
      }
      SOPS = SEED.slice();
    }).catch(function () { SOPS = SEED.slice(); });
  }
  function post(body) {
    return { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
  }
  function applyAdd(sop) { SOPS.push(sop); }
  function applyUpdate(sop) {
    for (var i = 0; i < SOPS.length; i++) { if (SOPS[i].slug === sop.slug) { SOPS[i] = sop; return; } }
    SOPS.push(sop);
  }
  function applyDelete(slug) { SOPS = SOPS.filter(function (s) { return s.slug !== slug; }); }

  /* ── helpers ─────────────────────────────────────── */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function initials(name) {
    if (!name) return "?";
    var parts = String(name).trim().split(/[\s/]+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  function bySlug(slug) {
    for (var i = 0; i < SOPS.length; i++) if (SOPS[i].slug === slug) return SOPS[i];
    return null;
  }
  function categories() {
    var counts = {};
    SOPS.forEach(function (s) { counts[s.category] = (counts[s.category] || 0) + 1; });
    var ordered = CATEGORY_ORDER.filter(function (c) { return counts[c]; });
    Object.keys(counts).forEach(function (c) { if (ordered.indexOf(c) === -1) ordered.push(c); });
    return ordered.map(function (c) { return { name: c, count: counts[c] }; });
  }
  function matches(sop) {
    if (state.category !== "All" && sop.category !== state.category) return false;
    var q = state.query.trim().toLowerCase();
    if (!q) return true;
    var hay = [sop.title, sop.code, sop.category, sop.owner, sop.purpose,
      (sop.tools || []).map(function (t) { return t.label; }).join(" ")].join(" ").toLowerCase();
    return hay.indexOf(q) !== -1;
  }
  function toast(msg) {
    var t = document.getElementById("toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(t._timer);
    t._timer = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }

  /* ── icons ───────────────────────────────────────── */
  var ICON = {
    search: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"></circle><path d="m21 21-4.3-4.3"></path></svg>',
    arrow: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>',
    back: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 18l-6-6 6-6"></path></svg>',
    plus: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"></path></svg>',
    spark: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 5.2L19 10l-5.1 1.8L12 17l-1.9-5.2L5 10l5.1-1.8z"></path></svg>',
    doc: '<svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6M9 13h6M9 17h6"></path></svg>',
    info: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4M12 8h.01"></path></svg>',
    copy: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>',
    download: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"></path></svg>',
    edit: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"></path></svg>',
    trash: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path></svg>',
    save: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><path d="M17 21v-8H7v8M7 3v5h8"></path></svg>',
    plusLib: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"></path></svg>',
  };

  /* ── render: library ─────────────────────────────── */
  function renderLibrary() {
    var cats = categories();
    var filterChips = [{ name: "All", count: SOPS.length }].concat(cats);

    var html = '' +
      '<section class="hero"><div class="wrap">' +
        '<span class="eyebrow">' + ICON.spark + ' Standard Operating Procedures</span>' +
        '<h1>The SLG Team <span class="accent">playbook.</span></h1>' +
        '<p class="lede">Every process the team runs — documented, simplified, and in one place. ' +
          'Find a procedure, follow the steps, or generate a brand-new SOP with AI.</p>' +
        '<div class="hero-actions">' +
          '<a class="btn btn-primary btn-lg" href="#/new">' + ICON.plus + ' Create a new SOP</a>' +
          '<a class="btn btn-lg" href="#library">Browse the library</a>' +
        '</div>' +
        '<div class="toolbar" id="toolbar">' +
          '<div class="search">' + ICON.search +
            '<input id="searchInput" type="search" placeholder="Search SOPs, tools, owners…" value="' + esc(state.query) + '" autocomplete="off">' +
          '</div>' +
          '<div class="filters">' +
            filterChips.map(function (c) {
              return '<button class="chip' + (state.category === c.name ? ' active' : '') + '" data-cat="' + esc(c.name) + '">' +
                esc(c.name) + '<span class="count">' + c.count + '</span></button>';
            }).join('') +
          '</div>' +
        '</div>' +
      '</div></section>' +
      '<main><div class="wrap" id="results"></div></main>';

    app.innerHTML = html;
    renderResults();

    var input = document.getElementById("searchInput");
    input.addEventListener("input", function () { state.query = input.value; renderResults(); });
    document.querySelectorAll(".chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        state.category = chip.getAttribute("data-cat");
        document.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("active"); });
        chip.classList.add("active");
        renderResults();
      });
    });
  }

  function cardHTML(sop) {
    return '<article class="sop-card" data-slug="' + esc(sop.slug) + '">' +
      '<div class="card-top">' +
        '<span class="code-badge">' + esc(sop.code) + '</span>' +
        '<span class="freq-badge">' + esc(sop.frequency || '') + '</span>' +
      '</div>' +
      '<h3>' + esc(sop.title) + '</h3>' +
      '<p>' + esc((sop.purpose || '').slice(0, 130)) + ((sop.purpose || '').length > 130 ? '…' : '') + '</p>' +
      '<div class="card-foot">' +
        '<span class="owner"><span class="avatar">' + esc(initials(sop.owner)) + '</span>' + esc(sop.owner || '') + '</span>' +
        '<span class="open-link">Open ' + ICON.arrow + '</span>' +
      '</div>' +
    '</article>';
  }

  function renderResults() {
    var box = document.getElementById("results");
    if (!box) return;
    var list = SOPS.filter(matches);

    if (!list.length) {
      box.innerHTML = '<div class="empty">' + ICON.doc +
        '<h3 style="margin:0 0 4px;color:var(--ink-soft)">No SOPs found</h3>' +
        '<p style="margin:0">Try a different search or clear the filters.</p></div>';
      return;
    }

    // group by category, preserving order
    var groups = {};
    list.forEach(function (s) { (groups[s.category] = groups[s.category] || []).push(s); });
    var order = categories().map(function (c) { return c.name; }).filter(function (c) { return groups[c]; });

    box.innerHTML = order.map(function (cat) {
      return '<div class="section-head" id="library">' +
          '<h2>' + esc(cat) + '</h2><span class="rule"></span>' +
          '<span class="tag">' + groups[cat].length + ' SOP' + (groups[cat].length > 1 ? 's' : '') + '</span>' +
        '</div>' +
        '<div class="grid">' + groups[cat].map(cardHTML).join('') + '</div>';
    }).join('');

    box.querySelectorAll(".sop-card").forEach(function (card) {
      card.addEventListener("click", function () {
        location.hash = "#/sop/" + card.getAttribute("data-slug");
      });
    });
  }

  /* ── render: detail ──────────────────────────────── */
  function stepsHTML(sop) {
    var flat = sop.steps && sop.steps.length === 1 && !sop.steps[0].title;
    return '<div class="' + (flat ? 'flat-list' : '') + '">' + sop.steps.map(function (step, i) {
      var title = step.title
        ? '<div class="step-title"><span class="num">' + (i + 1) + '</span>' + esc(step.title) + '</div>'
        : '';
      var items = (step.actions || []).map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('');
      return '<div class="step-group">' + title + '<ul class="actions-list">' + items + '</ul></div>';
    }).join('') + '</div>';
  }

  function renderDetail(slug) {
    var sop = bySlug(slug);
    if (!sop) { location.hash = "#/"; return; }

    var infoCards = [];
    if (sop.estimatedTime) {
      infoCards.push('<div class="panel"><h4>Estimated Time</h4><p class="dod-text">' + esc(sop.estimatedTime) + '</p></div>');
    }
    if (sop.definitionOfDone) {
      infoCards.push('<div class="panel"><h4>Definition of Done</h4><p class="dod-text">' + esc(sop.definitionOfDone) + '</p></div>');
    }
    if (sop.qualityStandards) {
      infoCards.push('<div class="panel"><h4>Quality Standards</h4><p class="quality-text">' + esc(sop.qualityStandards) + '</p></div>');
    }
    if (sop.tools && sop.tools.length) {
      infoCards.push('<div class="panel"><h4>Tools</h4><div class="tools-tags">' +
        sop.tools.map(function (t) { return '<span class="tool-tag">' + esc(t.label) + '</span>'; }).join('') + '</div></div>');
    }
    if (sop.resources && sop.resources.length) {
      infoCards.push('<div class="panel"><h4>Resources</h4><ul class="resources-list">' +
        sop.resources.map(function (r) {
          return '<li>' + (r.url ? '<a href="' + esc(r.url) + '" target="_blank" rel="noopener">' + esc(r.label) + ' ↗</a>' : esc(r.label)) + '</li>';
        }).join('') + '</ul></div>');
    }

    var infoGrid = infoCards.length
      ? '<div class="info-grid">' + infoCards.join('') + '</div>'
      : '';

    app.innerHTML = '' +
      '<main><div class="wrap"><div class="detail">' +
        '<div class="detail-topbar">' +
          '<a class="back-link" href="#/">' + ICON.back + ' Back to library</a>' +
          '<div class="detail-actions">' +
            '<button class="btn btn-sm" id="editBtn">' + ICON.edit + ' Edit</button>' +
            '<button class="btn btn-sm btn-danger" id="delBtn">' + ICON.trash + ' Delete</button>' +
          '</div>' +
        '</div>' +
        '<div class="detail-head">' +
          '<span class="code-badge">' + esc(sop.code) + '</span>' +
          '<span class="freq-badge">' + esc(sop.frequency || '') + '</span>' +
          '<span class="freq-badge">' + esc(sop.category) + '</span>' +
          (sop.status ? '<span class="status-pill"><span class="dot"></span>' + esc(sop.status) + '</span>' : '') +
        '</div>' +
        '<h1>' + esc(sop.title) + '</h1>' +
        '<div class="meta-row">' +
          '<span><b>Owner:</b> ' + esc(sop.owner || '—') + '</span>' +
          (sop.reviewedBy ? '<span><b>Reviewed by:</b> ' + esc(sop.reviewedBy) + '</span>' : '') +
          (sop.lastUpdated ? '<span><b>Last updated:</b> ' + esc(sop.lastUpdated) + '</span>' : '') +
        '</div>' +
        '<div class="panel"><h4>Purpose</h4><p class="purpose-text">' + esc(sop.purpose) + '</p></div>' +
        '<div class="panel"><h4>Procedure</h4>' + stepsHTML(sop) + '</div>' +
        infoGrid +
        '<div class="meta-foot">' +
          (sop.createdBy ? '<span>Created by ' + esc(sop.createdBy) + '</span>' : '') +
          '<span>SOP ' + esc(sop.code) + ' · The SLG Team</span>' +
        '</div>' +
      '</div></div></main>';

    document.getElementById("editBtn").addEventListener("click", function () {
      renderEditForm(sop);
    });
    document.getElementById("delBtn").addEventListener("click", function () {
      if (!confirm('Delete "' + sop.title + '"? This removes it from the library for everyone.')) return;
      var btn = document.getElementById("delBtn");
      btn.disabled = true;
      api("/api/sops", post({ action: "delete", slug: sop.slug })).then(function (res) {
        if (!res.ok || (res.data && res.data.error)) { btn.disabled = false; toast("Couldn't delete — try again."); return; }
        applyDelete(sop.slug); toast("Deleted"); location.hash = "#/";
      }).catch(function () { btn.disabled = false; toast("Couldn't delete — check your connection."); });
    });
    window.scrollTo(0, 0);
  }

  /* ── render: edit / update form ──────────────────── */
  function renderEditForm(sop) {
    var cats = CATEGORY_OPTIONS.slice();
    if (sop.category && cats.indexOf(sop.category) === -1) cats.unshift(sop.category);

    app.innerHTML = '' +
      '<main><div class="wrap"><div class="detail">' +
        '<a class="back-link" id="cancelEdit">' + ICON.back + ' Cancel</a>' +
        '<div class="gen-head" style="text-align:left;margin-bottom:20px">' +
          '<span class="eyebrow">' + ICON.edit + ' Editing SOP</span>' +
          '<h1 style="font-size:30px;margin:10px 0 0">' + esc(sop.title) + '</h1>' +
        '</div>' +
        '<form id="editForm" class="panel edit-form">' +
          row2(
            ef("e-title", "Title", "input", sop.title, true),
            efSelect("e-category", "Category", cats, sop.category)
          ) +
          row2(
            ef("e-owner", "Owner", "input", sop.owner || ""),
            efSelect("e-frequency", "Frequency", FREQ_OPTIONS, sop.frequency || "")
          ) +
          row2(
            ef("e-code", "Code (e.g. MJ-11)", "input", sop.code || ""),
            ef("e-time", "Estimated time", "input", sop.estimatedTime || "")
          ) +
          ef("e-purpose", "Purpose", "textarea", sop.purpose || "") +
          '<div class="field"><label for="e-steps">Procedure</label>' +
            '<p class="hint">One step per block. A line with no dash is a step heading; lines starting with “-” are the actions under it.</p>' +
            '<textarea id="e-steps" class="tall">' + esc(stepsToText(normalizeSteps(sop).steps)) + '</textarea></div>' +
          ef("e-tools", "Tools (comma-separated)", "input", toolsToText(sop.tools)) +
          ef("e-dod", "Definition of Done", "textarea", sop.definitionOfDone || "") +
          ef("e-quality", "Quality Standards", "textarea", sop.qualityStandards || "") +
          '<div class="field"><label for="e-resources">Resources</label>' +
            '<p class="hint">One per line, as “Label | https://link” (the link is optional).</p>' +
            '<textarea id="e-resources">' + esc(resourcesToText(sop.resources)) + '</textarea></div>' +
          '<div class="result-actions" style="margin-top:6px">' +
            '<button type="submit" class="btn btn-primary" id="saveBtn">' + ICON.save + ' Save changes</button>' +
            '<button type="button" class="btn btn-ghost" id="cancelEdit2">Cancel</button>' +
          '</div>' +
        '</form>' +
      '</div></div></main>';

    function back() { location.hash = "#/sop/" + sop.slug; }
    document.getElementById("cancelEdit").addEventListener("click", back);
    document.getElementById("cancelEdit2").addEventListener("click", back);
    document.getElementById("editForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var updated = {
        slug: sop.slug,
        title: val("e-title").trim(),
        category: val("e-category"),
        owner: val("e-owner").trim(),
        frequency: val("e-frequency"),
        code: val("e-code").trim() || sop.code,
        estimatedTime: val("e-time").trim(),
        purpose: val("e-purpose").trim(),
        steps: parseProcedure(val("e-steps")),
        tools: textToTools(val("e-tools")),
        definitionOfDone: val("e-dod").trim(),
        qualityStandards: val("e-quality").trim(),
        resources: textToResources(val("e-resources")),
        status: sop.status || "Live",
        reviewedBy: sop.reviewedBy,
        createdBy: sop.createdBy,
        lastUpdated: todayLabel(),
      };
      if (!updated.title) { toast("A title is required."); return; }
      var btn = document.getElementById("saveBtn");
      btn.disabled = true; btn.innerHTML = "Saving…";
      api("/api/sops", post({ action: "update", sop: updated })).then(function (res) {
        if (!res.ok || res.data.error) { btn.disabled = false; btn.innerHTML = ICON.save + " Save changes"; toast(res.data.error || "Save failed."); return; }
        applyUpdate(res.data.sop); toast("Saved"); location.hash = "#/sop/" + res.data.sop.slug;
      }).catch(function () { btn.disabled = false; btn.innerHTML = ICON.save + " Save changes"; toast("Save failed — check your connection."); });
    });
    window.scrollTo(0, 0);
  }

  /* form helpers */
  function ef(id, label, tag, value, required) {
    var req = required ? ' <span class="req">*</span>' : '';
    if (tag === "textarea") {
      return '<div class="field"><label for="' + id + '">' + esc(label) + req + '</label>' +
        '<textarea id="' + id + '">' + esc(value || "") + '</textarea></div>';
    }
    return '<div class="field"><label for="' + id + '">' + esc(label) + req + '</label>' +
      '<input id="' + id + '" type="text" value="' + esc(value || "") + '"></div>';
  }
  function efSelect(id, label, options, selected) {
    return '<div class="field"><label for="' + id + '">' + esc(label) + '</label><select id="' + id + '">' +
      options.map(function (o) {
        return '<option value="' + esc(o) + '"' + (o === selected ? ' selected' : '') + '>' + esc(o || "—") + '</option>';
      }).join('') + '</select></div>';
  }
  function row2(a, b) { return '<div class="field-row">' + a + b + '</div>'; }

  function stepsToText(steps) {
    return (steps || []).map(function (s) {
      var head = s.title ? s.title + "\n" : "";
      return head + (s.actions || []).map(function (a) { return "- " + a; }).join("\n");
    }).join("\n\n");
  }
  function parseProcedure(text) {
    var groups = [], cur = null;
    String(text || "").split(/\r?\n/).forEach(function (line) {
      var t = line.trim();
      if (!t) return;
      var m = t.match(/^[-•*]\s+(.*)/);
      if (m) {
        if (!cur) { cur = { actions: [] }; groups.push(cur); }
        cur.actions.push(m[1].trim());
      } else {
        cur = { title: t, actions: [] }; groups.push(cur);
      }
    });
    return groups.length ? groups : [{ actions: [] }];
  }
  function toolsToText(tools) {
    return (tools || []).map(function (t) { return typeof t === "string" ? t : t.label; }).join(", ");
  }
  function textToTools(text) {
    return String(text || "").split(",").map(function (s) { return s.trim(); })
      .filter(Boolean).map(function (l) { return { label: l }; });
  }
  function resourcesToText(res) {
    return (res || []).map(function (r) { return r.url ? r.label + " | " + r.url : r.label; }).join("\n");
  }
  function textToResources(text) {
    return String(text || "").split(/\r?\n/).map(function (line) {
      var t = line.trim(); if (!t) return null;
      var parts = t.split("|");
      var label = parts[0].trim();
      var url = parts.length > 1 ? parts.slice(1).join("|").trim() : "";
      return url ? { label: label, url: url } : { label: label };
    }).filter(Boolean);
  }
  function todayLabel() {
    var d = new Date();
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  /* ── render: generator ───────────────────────────── */
  function renderGenerator() {
    app.innerHTML = '' +
      '<main><div class="wrap">' +
        '<a class="back-link" href="#/">' + ICON.back + ' Back to library</a>' +
        '<div class="gen-head">' +
          '<span class="eyebrow">' + ICON.spark + ' AI SOP Builder</span>' +
          '<h1>Create a new SOP</h1>' +
          '<p>Answer a few quick questions and Claude will write a clean, on-brand SOP ' +
            'in the same format as the rest of the library.</p>' +
        '</div>' +
        '<div class="gen-layout">' +
          '<div class="form-panel"><div class="panel">' +
            '<form id="genForm">' +
              field("title", "What's the task or process?", "e.g. Posting a new listing to Instagram", true, "input") +
              '<div class="field"><label for="f-category">Category</label>' +
                '<select id="f-category">' +
                  ['Team Operations', 'Marketing & Content', 'Market Reports', 'Admin & Systems', 'Other']
                    .map(function (c) { return '<option>' + c + '</option>'; }).join('') +
                '</select></div>' +
              field("owner", "Who does this? (optional)", "e.g. MJ, Eunice, Marketing", false, "input") +
              '<div class="field"><label for="f-frequency">How often? (optional)</label>' +
                '<select id="f-frequency">' +
                  ['', 'Daily', 'Weekly', 'Monthly', 'As needed', 'Per transaction', 'Per listing', 'Per report', 'Ongoing']
                    .map(function (c) { return '<option value="' + c + '">' + (c || '—') + '</option>'; }).join('') +
                '</select></div>' +
              '<div class="field"><label for="f-details">Describe the steps or details <span class="req">*</span></label>' +
                '<p class="hint">A few rough notes are enough — bullet points, tools used, the order things happen. Claude fills in the rest.</p>' +
                '<textarea id="f-details" placeholder="e.g. Export the photos from the shoot, pick the best 5, write a caption with the address and an open-house date, schedule it in Meta Business Suite, tag Seth…"></textarea>' +
              '</div>' +
              '<button type="submit" class="btn btn-primary btn-lg gen-submit" id="genBtn">' + ICON.spark + ' Generate SOP</button>' +
            '</form>' +
          '</div></div>' +
          '<div class="result-panel" id="genResult">' +
            '<div class="result-empty">' + ICON.doc +
              '<h3>Your SOP will appear here</h3>' +
              '<p>Fill in the form and hit Generate. You can copy or download the result.</p>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div></main>';

    document.getElementById("genForm").addEventListener("submit", onGenerate);
    window.scrollTo(0, 0);
  }

  function field(id, label, placeholder, required, tag) {
    return '<div class="field"><label for="f-' + id + '">' + esc(label) +
      (required ? ' <span class="req">*</span>' : '') + '</label>' +
      '<' + tag + ' id="f-' + id + '" type="text" placeholder="' + esc(placeholder) + '"></' + tag + '></div>';
  }

  function onGenerate(e) {
    e.preventDefault();
    var payload = {
      title: val("f-title"),
      category: val("f-category"),
      owner: val("f-owner"),
      frequency: val("f-frequency"),
      details: val("f-details"),
    };
    if (!payload.title.trim() || !payload.details.trim()) {
      toast("Please add a title and some details.");
      return;
    }

    var btn = document.getElementById("genBtn");
    btn.disabled = true;
    var result = document.getElementById("genResult");
    result.innerHTML = '<div class="panel"><div class="loading">' +
      '<div class="spinner"></div>' +
      '<div style="font-weight:600">Writing your SOP…</div>' +
      '<div class="steps-note">Claude is drafting the purpose, steps, tools and standards.</div>' +
    '</div></div>';

    fetch("/api/generate-sop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
      .then(function (res) {
        btn.disabled = false;
        if (!res.ok || res.data.error) {
          result.innerHTML = '<div class="panel"><div class="error-banner">' +
            esc((res.data && res.data.error) || "Something went wrong generating the SOP.") +
            '</div><button class="btn" onclick="location.reload()">Try again</button></div>';
          return;
        }
        renderGeneratedSOP(res.data.sop, res.data.demo);
      })
      .catch(function () {
        btn.disabled = false;
        result.innerHTML = '<div class="panel"><div class="error-banner">' +
          'Could not reach the SOP generator. Check your connection and try again.</div></div>';
      });
  }

  function renderGeneratedSOP(sop, demo) {
    var result = document.getElementById("genResult");
    var md = sopToMarkdown(sop);

    var infoCards = [];
    if (sop.estimatedTime) infoCards.push('<div class="panel"><h4>Estimated Time</h4><p class="dod-text">' + esc(sop.estimatedTime) + '</p></div>');
    if (sop.definitionOfDone) infoCards.push('<div class="panel"><h4>Definition of Done</h4><p class="dod-text">' + esc(sop.definitionOfDone) + '</p></div>');
    if (sop.qualityStandards) infoCards.push('<div class="panel"><h4>Quality Standards</h4><p class="quality-text">' + esc(sop.qualityStandards) + '</p></div>');
    if (sop.tools && sop.tools.length) infoCards.push('<div class="panel"><h4>Tools</h4><div class="tools-tags">' +
      sop.tools.map(function (t) { return '<span class="tool-tag">' + esc(typeof t === "string" ? t : t.label) + '</span>'; }).join('') + '</div></div>');

    result.innerHTML =
      '<div class="result-actions">' +
        '<button class="btn btn-primary" id="addLibBtn">' + ICON.plusLib + ' Add to Library</button>' +
        '<button class="btn" id="copyBtn">' + ICON.copy + ' Copy</button>' +
        '<button class="btn" id="dlBtn">' + ICON.download + ' Download .md</button>' +
        '<button class="btn btn-ghost" id="regenBtn">Start over</button>' +
      '</div>' +
      (demo ? '<div class="demo-banner">' + ICON.info +
        '<div><b>Preview / demo mode.</b> This is a sample so you can see the format. ' +
        'Add your Anthropic API key (locally or in Vercel) to generate real SOPs with Claude.</div></div>' : '') +
      '<div class="detail">' +
        '<div class="detail-head">' +
          (sop.code ? '<span class="code-badge">' + esc(sop.code) + '</span>' : '') +
          (sop.frequency ? '<span class="freq-badge">' + esc(sop.frequency) + '</span>' : '') +
          (sop.category ? '<span class="freq-badge">' + esc(sop.category) + '</span>' : '') +
        '</div>' +
        '<h1 style="font-size:28px">' + esc(sop.title) + '</h1>' +
        (sop.owner ? '<div class="meta-row"><span><b>Owner:</b> ' + esc(sop.owner) + '</span></div>' : '') +
        '<div class="panel"><h4>Purpose</h4><p class="purpose-text">' + esc(sop.purpose) + '</p></div>' +
        '<div class="panel"><h4>Procedure</h4>' + stepsHTML(normalizeSteps(sop)) + '</div>' +
        (infoCards.length ? '<div class="info-grid">' + infoCards.join('') + '</div>' : '') +
      '</div>';

    document.getElementById("copyBtn").addEventListener("click", function () {
      copyText(md); toast("Copied to clipboard");
    });
    document.getElementById("dlBtn").addEventListener("click", function () {
      downloadText((sop.code ? sop.code + "-" : "") + slugify(sop.title) + ".md", md);
    });
    document.getElementById("regenBtn").addEventListener("click", renderGenerator);
    document.getElementById("addLibBtn").addEventListener("click", function () {
      var btn = document.getElementById("addLibBtn");
      btn.disabled = true; btn.innerHTML = "Adding…";
      var toSave = JSON.parse(JSON.stringify(sop));
      if (!toSave.code || toSave.code === "DRAFT") toSave.code = "NEW";
      toSave.createdBy = "AI SOP Builder";
      toSave.reviewedBy = "Pending review";
      toSave.lastUpdated = todayLabel();
      api("/api/sops", post({ action: "add", sop: toSave })).then(function (res) {
        if (!res.ok || res.data.error) {
          btn.disabled = false; btn.innerHTML = ICON.plusLib + " Add to Library";
          toast(res.data.error || "Couldn't add — try again."); return;
        }
        applyAdd(res.data.sop);
        btn.disabled = false;
        btn.classList.remove("btn-primary"); btn.classList.add("btn-added");
        btn.innerHTML = "✓ Added — view it";
        btn.onclick = function () { location.hash = "#/sop/" + res.data.sop.slug; };
        toast("Added to the library");
      }).catch(function () {
        btn.disabled = false; btn.innerHTML = ICON.plusLib + " Add to Library";
        toast("Couldn't add — check your connection.");
      });
    });
    window.scrollTo({ top: result.getBoundingClientRect().top + window.scrollY - 90, behavior: "smooth" });
  }

  // tolerate either {steps:[{title,actions}]} or {steps:[...strings]}
  function normalizeSteps(sop) {
    if (!sop.steps || !sop.steps.length) return { steps: [{ actions: [] }] };
    if (typeof sop.steps[0] === "string") return { steps: [{ actions: sop.steps }] };
    return { steps: sop.steps.map(function (s) {
      return { title: s.title, actions: s.actions || s.items || [] };
    }) };
  }

  function sopToMarkdown(sop) {
    var s = normalizeSteps(sop);
    var out = [];
    out.push("# " + sop.title);
    out.push("");
    var meta = [];
    if (sop.code) meta.push("**Code:** " + sop.code);
    if (sop.category) meta.push("**Category:** " + sop.category);
    if (sop.owner) meta.push("**Owner:** " + sop.owner);
    if (sop.frequency) meta.push("**Frequency:** " + sop.frequency);
    if (meta.length) { out.push(meta.join("  •  ")); out.push(""); }
    out.push("## Purpose");
    out.push(sop.purpose || "");
    out.push("");
    out.push("## Procedure");
    s.steps.forEach(function (step, i) {
      if (step.title) out.push("### " + step.title);
      (step.actions || []).forEach(function (a, j) { out.push((j + 1) + ". " + a); });
      out.push("");
    });
    if (sop.tools && sop.tools.length) {
      out.push("## Tools");
      sop.tools.forEach(function (t) { out.push("- " + (typeof t === "string" ? t : t.label)); });
      out.push("");
    }
    if (sop.estimatedTime) { out.push("## Estimated Time"); out.push(sop.estimatedTime); out.push(""); }
    if (sop.definitionOfDone) { out.push("## Definition of Done"); out.push(sop.definitionOfDone); out.push(""); }
    if (sop.qualityStandards) { out.push("## Quality Standards"); out.push(sop.qualityStandards); out.push(""); }
    return out.join("\n").trim() + "\n";
  }

  /* ── utils ───────────────────────────────────────── */
  function val(id) { var el = document.getElementById(id); return el ? el.value : ""; }
  function slugify(s) { return String(s || "sop").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60); }
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text); return; }
    var ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta);
    ta.select(); try { document.execCommand("copy"); } catch (e) {} document.body.removeChild(ta);
  }
  function downloadText(name, text) {
    var blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a"); a.href = url; a.download = name; document.body.appendChild(a);
    a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  }

  /* ── router ──────────────────────────────────────── */
  function route() {
    var hash = location.hash || "#/";
    if (hash.indexOf("#/sop/") === 0) { renderDetail(hash.slice(6)); return; }
    if (hash === "#/new") { renderGenerator(); return; }
    renderLibrary();
    if (hash === "#library") {
      var el = document.getElementById("library");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }

  function boot() {
    app.innerHTML = '<main><div class="wrap"><div class="loading" style="padding:120px 20px">' +
      '<div class="spinner"></div><div style="color:var(--muted)">Loading the SOP library…</div></div></div></main>';
    loadSops().then(route);
  }

  window.addEventListener("hashchange", route);
  document.addEventListener("DOMContentLoaded", boot);
  // header brand click → home
  document.addEventListener("click", function (e) {
    var brand = e.target.closest && e.target.closest(".brand");
    if (brand) { location.hash = "#/"; }
  });
})();
