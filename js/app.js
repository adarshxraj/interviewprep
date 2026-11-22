/* InterviewPrep - app.js (one file for all pages)
   "Database" = localStorage (a small JSON object). Each page has data-page on <body>
   and a function with the same name in "pages" below. */
const KEY = 'ip_db', SESSION = 'ip_user';
const $ = s => document.querySelector(s);
const ymd = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const today = () => ymd(new Date());
const esc = s => String(s).replace(/[&<>"']/g, c => '&#' + c.charCodeAt(0) + ';');

// ---------- 1. DATABASE ----------
const R = (c, d, t, o, a, e) => ({ type: 'reasoning', category: c, difficulty: d, text: t, options: o, answer: a, explain: e });
const C = (co, d, t, h) => ({ type: 'coding', company: co, difficulty: d, text: t, explain: h });
function seed() {
  const qs = [
    R('Aptitude', 'Easy', 'A train 120 m long passes a pole in 6 seconds. What is its speed?', ['10 m/s', '20 m/s', '30 m/s', '15 m/s'], 1, 'Speed = distance / time = 120 / 6 = 20 m/s.'),
    R('Aptitude', 'Easy', 'What is 15% of 200?', ['25', '30', '35', '20'], 1, '15/100 x 200 = 30.'),
    R('Aptitude', 'Easy', 'Simple interest on Rs 1000 at 10% per year for 2 years?', ['100', '200', '210', '220'], 1, 'SI = P x R x T / 100 = 1000 x 10 x 2 / 100 = 200.'),
    R('Aptitude', 'Medium', 'A can finish a work in 10 days and B in 15 days. Working together, how many days will they take?', ['5', '6', '8', '12'], 1, '1/10 + 1/15 = 1/6, so 6 days.'),
    R('Aptitude', 'Medium', 'The average of 5 numbers is 20. If the number 10 is removed, what is the average of the remaining 4?', ['22.5', '20', '25', '21'], 0, 'Total = 100. After removing 10, total = 90. 90 / 4 = 22.5.'),
    R('Aptitude', 'Hard', 'A price is increased by 20% and then decreased by 20%. What is the net change?', ['No change', '4% decrease', '4% increase', '2% decrease'], 1, '1.2 x 0.8 = 0.96, so the price is 4% lower.'),
    R('Logical', 'Easy', 'Find the next number: 2, 4, 8, 16, ?', ['24', '32', '30', '64'], 1, 'Each number is double the previous one.'),
    R('Logical', 'Easy', 'Which one is the odd one out? Apple, Mango, Potato, Banana', ['Apple', 'Mango', 'Potato', 'Banana'], 2, 'Potato is a vegetable, the others are fruits.'),
    R('Logical', 'Medium', 'Find the next number: 1, 4, 9, 16, 25, ?', ['30', '36', '49', '35'], 1, 'These are squares: 1, 2, 3, 4, 5, so next is 6 x 6 = 36.'),
    R('Logical', 'Medium', 'A is the brother of B, and B is the sister of C. How is A related to C?', ['Brother', 'Sister', 'Father', 'Cousin'], 0, 'A is a male sibling of B, and B and C are siblings, so A is the brother of C.'),
    R('Logical', 'Hard', 'In a code, CAT is written as DBU. How is DOG written?', ['EPH', 'DPH', 'EOH', 'FPI'], 0, 'Each letter moves one step forward: D->E, O->P, G->H.'),
    R('Logical', 'Hard', 'Pointing at a man, Riya says "He is the son of my mother\'s only son". How is the man related to Riya?', ['Brother', 'Nephew', 'Cousin', 'Uncle'], 1, 'Mother\'s only son is Riya\'s brother, so his son is Riya\'s nephew.'),
    C('Microsoft', 'Easy', 'Reverse a linked list', 'Use three pointers: prev, current and next, and flip the links one by one.'),
    C('Microsoft', 'Medium', 'Detect a cycle in a linked list', "Floyd's algorithm: move a slow pointer by 1 and a fast pointer by 2. If they meet, there is a cycle."),
    C('Microsoft', 'Easy', 'Merge two sorted arrays', 'Use two pointers, always copy the smaller element into the result array.'),
    C('Google', 'Easy', 'Two Sum', 'Store each number in a HashMap and check whether (target - number) is already there.'),
    C('Google', 'Medium', 'Longest substring without repeating characters', 'Sliding window with a set. Move the left side when a repeat appears.'),
    C('Google', 'Easy', 'Valid parentheses', 'Push opening brackets on a stack and pop when a closing bracket arrives.'),
    C('Amazon', 'Medium', 'Maximum subarray sum', "Kadane's algorithm: keep a running sum and reset it to 0 when it becomes negative."),
    C('Amazon', 'Medium', 'Level order traversal of a binary tree', 'Use a queue (BFS). Process one level at a time.'),
    C('Amazon', 'Medium', 'Rotate an array by k positions', 'Reverse the whole array, then reverse the first k and the remaining n-k elements.'),
    C('TCS', 'Easy', 'Check if a string is a palindrome', 'Compare characters from both ends moving towards the middle.'),
    C('TCS', 'Easy', 'Print the Fibonacci series', 'Keep the last two numbers and add them to get the next one.'),
    C('TCS', 'Easy', 'Find the second largest element in an array', 'Keep two variables: largest and second largest, and update them in one loop.')
  ].map((q, i) => ({ id: i + 1, ...q }));
  return {
    users: [
      { id: 1, name: 'Admin', email: 'admin@interviewprep.com', password: 'admin123', role: 'admin', joined: today() },
      { id: 2, name: 'Adarsh Raj', email: 'adarsh@example.com', password: '123456', role: 'user', joined: today() }
    ],
    questions: qs, messages: [], attempts: [], solved: [],
    activity: [{ text: 'Website created', date: today() }]
  };
}
function load() {
  let d = localStorage.getItem(KEY);
  if (!d) { d = seed(); localStorage.setItem(KEY, JSON.stringify(d)); return d; }
  return JSON.parse(d);
}
let db = load();
const save = () => localStorage.setItem(KEY, JSON.stringify(db));
const nextId = list => list.reduce((m, x) => Math.max(m, x.id), 0) + 1;
const logActivity = t => { db.activity.unshift({ text: t, date: today() }); db.activity = db.activity.slice(0, 8); };
const user = db.users.find(u => u.id == localStorage.getItem(SESSION));
const logout = () => { localStorage.removeItem(SESSION); location.href = 'login.html'; };
function msg(t, type = 'success') { $('#msg').innerHTML = `<div class="alert alert-${type} py-2">${t}</div>`; }

// stats for one user (used by dashboard and admin "View")
function stats(u) {
  const rq = db.questions.filter(q => q.type === 'reasoning'), cq = db.questions.filter(q => q.type === 'coding');
  const a = db.attempts.filter(x => x.uid == u.id), s = db.solved.filter(x => x.uid == u.id && cq.some(q => q.id == x.qid));
  const ok = a.filter(x => x.correct).length, dates = new Set([...a, ...s].map(x => x.date));
  let streak = 0, d = new Date();
  if (!dates.has(ymd(d))) d.setDate(d.getDate() - 1);
  while (dates.has(ymd(d))) { streak++; d.setDate(d.getDate() - 1); }
  const rDone = new Set(a.filter(x => rq.some(q => q.id == x.qid)).map(x => x.qid)).size;
  return {
    attempts: a.length, accuracy: a.length ? Math.round(ok / a.length * 100) : 0, solved: s.length, streak,
    rPct: rq.length ? Math.round(rDone / rq.length * 100) : 0, cPct: cq.length ? Math.round(s.length / cq.length * 100) : 0
  };
}

// ---------- 2. NAVBAR / SIDEBAR / FOOTER (built by JS so every page stays short) ----------
function buildChrome(page, simple) {
  if (page.startsWith('admin-')) {
    $('#nav').innerHTML = '<div class="container-fluid d-flex justify-content-between align-items-center"><span class="text-white fw-semibold">INTERVIEW PREP ADMIN</span><button class="btn btn-accent btn-sm" onclick="logout()">Logout</button></div>';
    const items = [['admin-dashboard', 'Dashboard'], ['admin-questions', 'Questions'], ['admin-users', 'Users'], ['admin-messages', 'Messages']];
    $('#side').innerHTML = '<div class="list-group">' + items.map(i => `<a class="list-group-item list-group-item-action ${page === i[0] ? 'active' : ''}" href="${i[0]}.html">${i[1]}</a>`).join('') + '</div>';
    return;
  }
  const brand = '<i class="bi bi-briefcase"></i> InterviewPrep';
  if (simple) $('#nav').innerHTML = `<header class="bg-dark-green py-3"><div class="container"><a class="navbar-brand text-white fs-4" href="index.html">${brand}</a></div></header>`;
  else {
    const links = [['index', 'Home'], ['dashboard', 'Dashboard'], ['about', 'About'], ['contact', 'Contact']];
    const end = user ? `<li class="nav-item"><span class="nav-link">Hi, ${esc(user.name.split(' ')[0])}</span></li><li class="nav-item"><button class="btn btn-accent btn-sm ms-lg-2" onclick="logout()">Log out</button></li>`
      : '<li class="nav-item"><a class="btn btn-accent btn-sm ms-lg-2" href="login.html">Login</a></li>';
    $('#nav').innerHTML = `<nav class="navbar navbar-expand-lg navbar-dark bg-dark-green"><div class="container"><a class="navbar-brand" href="index.html">${brand}</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"><span class="navbar-toggler-icon"></span></button>
      <div class="collapse navbar-collapse" id="menu"><ul class="navbar-nav ms-auto">${links.map(l => `<li class="nav-item"><a class="nav-link ${page === l[0] ? 'active' : ''}" href="${l[0]}.html">${l[1]}</a></li>`).join('')}${end}</ul></div></div></nav>`;
  }
  $('#foot').innerHTML = '&copy; 2026 InterviewPrep | Practice, Learn, Succeed';
}

// ---------- 3. PAGES ----------
const pages = {
  index() {
    $('#counts').textContent = db.questions.length + ' practice questions | ' + db.users.filter(u => u.role === 'user').length + ' students';
  },

  login() {
    $('#f').onsubmit = e => {
      e.preventDefault();
      const u = db.users.find(x => x.email === $('#email').value.trim().toLowerCase() && x.password === $('#pw').value);
      if (!u) return msg('Wrong email or password.', 'danger');
      localStorage.setItem(SESSION, u.id);
      location.href = u.role === 'admin' ? 'admin-dashboard.html' : 'dashboard.html';
    };
  },

  signup() {
    $('#f').onsubmit = e => {
      e.preventDefault();
      const email = $('#email').value.trim().toLowerCase();
      if ($('#pw').value !== $('#pw2').value) return msg('Passwords do not match.', 'danger');
      if (db.users.some(u => u.email === email)) return msg('This email is already registered.', 'danger');
      db.users.push({ id: nextId(db.users), name: $('#name').value.trim(), email, password: $('#pw').value, role: 'user', joined: today() });
      logActivity('New user registered: ' + $('#name').value.trim());
      save(); msg('Account created! Taking you to login...');
      setTimeout(() => location.href = 'login.html', 1000);
    };
  },

  forgot() {
    $('#f').onsubmit = e => {
      e.preventDefault();
      const u = db.users.find(x => x.email === $('#email').value.trim().toLowerCase());
      if (!u) return msg('No account found with this email.', 'danger');
      u.password = $('#pw').value; save(); msg('Password changed. You can login now.');
    };
  },

  dashboard() {
    const s = stats(user);
    $('#welcome').textContent = 'Welcome back, ' + user.name.split(' ')[0] + '!';
    $('#s1').textContent = s.solved; $('#s2').textContent = s.accuracy + '%'; $('#s3').textContent = s.streak + (s.streak === 1 ? ' day' : ' days');
    $('#p1').style.width = s.rPct + '%'; $('#p1').textContent = s.rPct + '%';
    $('#p2').style.width = s.cPct + '%'; $('#p2').textContent = s.cPct + '%';
  },

  reasoning() {
    let list = [], i = 0, score = 0, tried = 0;
    const draw = () => {
      if (!list.length) { $('#card').innerHTML = '<p class="mb-0">No questions match your search. Try other filters.</p>'; return; }
      const q = list[i];
      $('#card').innerHTML = `<h2 class="h5">Q${i + 1}. ${esc(q.text)}</h2><small class="text-secondary">${q.category} | ${q.difficulty} | Question ${i + 1} of ${list.length}</small>`
        + q.options.map((o, k) => `<div class="form-check my-2"><input class="form-check-input" type="radio" name="answer" id="o${k}" value="${k}"><label class="form-check-label" for="o${k}">${esc(o)}</label></div>`).join('')
        + `<button class="btn btn-accent mt-3" id="sub">Submit answer</button><div id="fb" class="mt-3"></div>
        <div class="d-flex justify-content-between mt-4"><button class="btn btn-outline-success" id="prev" ${i === 0 ? 'disabled' : ''}>Previous</button><button class="btn btn-main" id="next" ${i === list.length - 1 ? 'disabled' : ''}>Next</button></div>`;
      $('#sub').onclick = submit; $('#prev').onclick = () => { i--; draw(); }; $('#next').onclick = () => { i++; draw(); };
    };
    const submit = () => {
      const c = document.querySelector('input[name=answer]:checked');
      if (!c) return $('#fb').innerHTML = '<div class="alert alert-warning py-2">Please pick an option first.</div>';
      const q = list[i], ok = +c.value === q.answer;
      db.attempts.push({ uid: user.id, qid: q.id, correct: ok, date: today() }); save();
      tried++; if (ok) score++;
      $('#score').textContent = `Score this session: ${score}/${tried}`;
      document.querySelectorAll('input[name=answer]').forEach(x => x.disabled = true); $('#sub').disabled = true;
      $('#fb').innerHTML = `<div class="alert alert-${ok ? 'success' : 'danger'} py-2">${ok ? 'Correct!' : 'Wrong. Correct answer: ' + esc(q.options[q.answer])}<br><small>${esc(q.explain)}</small></div>`;
    };
    const apply = () => {
      const t = $('#search').value.toLowerCase(), c = $('#cat').value, d = $('#diff').value;
      list = db.questions.filter(q => q.type === 'reasoning' && q.text.toLowerCase().includes(t) && (c === 'All' || q.category === c) && (d === 'All' || q.difficulty === d));
      i = 0; draw();
    };
    $('#filters').onsubmit = e => { e.preventDefault(); apply(); };
    $('#search').oninput = $('#cat').onchange = $('#diff').onchange = apply;
    apply();
  },

  coding() {
    let current = '';
    const drawCompanies = () => {
      const t = $('#search').value.toLowerCase(), all = db.questions.filter(q => q.type === 'coding');
      const cos = [...new Set(all.map(q => q.company))].filter(c => c.toLowerCase().includes(t));
      $('#grid').innerHTML = cos.length ? cos.map(c => `<div class="col"><div class="card card-soft h-100 p-4"><div class="logo-circle mx-auto mb-3">${esc(c[0])}</div><h2 class="h5">${esc(c)}</h2><p>${all.filter(q => q.company === c).length} Questions</p><button class="btn btn-main mt-auto" data-co="${esc(c)}">Explore <i class="bi bi-arrow-right"></i></button></div></div>`).join('') : '<p class="text-center">No company found.</p>';
    };
    const drawList = () => {
      const qs = db.questions.filter(q => q.type === 'coding' && q.company === current), badge = { Easy: 'success', Medium: 'warning', Hard: 'danger' };
      $('#list').innerHTML = `<h2 class="h4 mt-5">${esc(current)} questions</h2><ul class="list-group">` + qs.map(q => `<li class="list-group-item">
        <div class="d-flex justify-content-between align-items-center"><label><input type="checkbox" class="form-check-input me-2" data-q="${q.id}" ${db.solved.some(s => s.uid == user.id && s.qid == q.id) ? 'checked' : ''}>${esc(q.text)}</label><span class="badge text-bg-${badge[q.difficulty]}">${q.difficulty}</span></div>
        <details class="mt-1"><summary>Hint</summary><small>${esc(q.explain)}</small></details></li>`).join('') + '</ul>';
    };
    $('#grid').onclick = e => { const b = e.target.closest('[data-co]'); if (b) { current = b.dataset.co; drawList(); $('#list').scrollIntoView(); } };
    $('#list').onchange = e => {
      const id = +e.target.dataset.q; if (!id) return;
      db.solved = db.solved.filter(s => !(s.uid == user.id && s.qid == id));
      if (e.target.checked) db.solved.push({ uid: user.id, qid: id, date: today() });
      save();
    };
    $('#search').oninput = drawCompanies; $('#filters').onsubmit = e => e.preventDefault();
    drawCompanies();
  },

  resume() {
    let fmt = 1; const val = k => $('#r_' + k).value;
    $('#r_name').value = user.name; $('#r_email').value = user.email;
    const lines = k => val(k).split('\n').filter(x => x.trim()).map(x => `<li>${esc(x)}</li>`).join('');
    const draw = () => {
      $('#preview').className = 'resume res-' + fmt;
      $('#preview').innerHTML = `<h2>${esc(val('name') || 'Your Name')}</h2><p>${esc(val('email'))}${val('phone') ? ' | ' + esc(val('phone')) : ''}</p>
        <h3>Objective</h3><p>${esc(val('objective'))}</p><h3>Education</h3><ul>${lines('education')}</ul>
        <h3>Skills</h3><p>${esc(val('skills'))}</p><h3>Projects</h3><ul>${lines('projects')}</ul>`;
    };
    document.querySelectorAll('input,textarea').forEach(el => el.oninput = draw);
    document.querySelectorAll('input[name=fmt]').forEach(r => r.onchange = () => { fmt = r.value; draw(); });
    $('#print').onclick = () => window.print();
    draw();
  },

  contact() {
    if (user) { $('#name').value = user.name; $('#email').value = user.email; }
    $('#f').onsubmit = e => {
      e.preventDefault();
      db.messages.unshift({ id: nextId(db.messages), name: $('#name').value.trim(), email: $('#email').value.trim(), text: $('#text').value.trim(), date: today(), read: false });
      logActivity('New contact message from ' + $('#name').value.trim()); save();
      $('#text').value = ''; msg('Thank you! Your message has been sent.');
    };
  },

  'admin-dashboard'() {
    $('#c1').textContent = db.users.filter(u => u.role === 'user').length;
    $('#c2').textContent = db.questions.length;
    $('#c3').textContent = db.messages.filter(m => !m.read).length;
    $('#activity').innerHTML = db.activity.map(a => `<li class="list-group-item">${esc(a.text)} <span class="text-secondary">| ${a.date === today() ? 'Today' : a.date}</span></li>`).join('');
  },

  'admin-questions'() {
    let editId = null;
    const f = id => $('#' + id), toggle = () => { const c = f('qtype').value === 'coding'; f('rBox').hidden = c; f('rBox2').hidden = c; f('cBox').hidden = !c; };
    const draw = () => {
      const t = f('qfilter').value;
      f('rows').innerHTML = db.questions.filter(q => t === 'all' || q.type === t).map(q => `<tr><td>${q.id}</td><td>${q.type}</td><td>${esc(q.text)}</td><td>${esc(q.company || q.category)}</td><td>${q.difficulty}</td>
        <td><button class="btn btn-sm btn-outline-success" data-edit="${q.id}">Edit</button> <button class="btn btn-sm btn-outline-danger" data-del="${q.id}">Delete</button></td></tr>`).join('');
    };
    const reset = () => { editId = null; f('f').reset(); toggle(); f('formTitle').textContent = 'Add question'; };
    f('qtype').onchange = toggle; f('qfilter').onchange = draw; f('cancel').onclick = reset;
    f('f').onsubmit = e => {
      e.preventDefault();
      const code = f('qtype').value === 'coding';
      const q = code ? { type: 'coding', company: f('qco').value.trim(), difficulty: f('qdiff').value, text: f('qtext').value.trim(), explain: f('qexp').value.trim() }
        : { type: 'reasoning', category: f('qcat').value, difficulty: f('qdiff').value, text: f('qtext').value.trim(), options: [0, 1, 2, 3].map(k => f('o' + k).value.trim()), answer: +f('qans').value, explain: f('qexp').value.trim() };
      if (!code && q.options.some(x => !x)) return msg('Please fill all four options.', 'danger');
      if (editId) db.questions = db.questions.map(x => x.id === editId ? { id: editId, ...q } : x);
      else { db.questions.push({ id: nextId(db.questions), ...q }); logActivity('Question added'); }
      save(); msg(editId ? 'Question updated.' : 'Question added.'); reset(); draw();
    };
    f('rows').onclick = e => {
      const ed = e.target.dataset.edit, del = e.target.dataset.del;
      if (del && confirm('Delete this question?')) { db.questions = db.questions.filter(q => q.id != del); save(); draw(); }
      if (ed) {
        const q = db.questions.find(x => x.id == ed); editId = q.id;
        f('qtype').value = q.type; toggle(); f('qdiff').value = q.difficulty; f('qtext').value = q.text; f('qexp').value = q.explain;
        if (q.type === 'coding') f('qco').value = q.company; else { f('qcat').value = q.category; q.options.forEach((o, k) => f('o' + k).value = o); f('qans').value = q.answer; }
        f('formTitle').textContent = 'Edit question #' + q.id; scrollTo(0, 0);
      }
    };
    toggle(); draw();
  },

  'admin-users'() {
    const draw = () => {
      const t = $('#search').value.toLowerCase();
      $('#rows').innerHTML = db.users.filter(u => u.role === 'user' && (u.name + u.email).toLowerCase().includes(t)).map((u, i) => `<tr><td>${i + 1}</td><td>${esc(u.name)}</td><td>${esc(u.email)}</td><td>${u.joined}</td>
        <td><button class="btn btn-sm btn-outline-success" data-view="${u.id}">View</button> <button class="btn btn-sm btn-outline-danger" data-del="${u.id}">Delete</button></td></tr>`).join('') || '<tr><td colspan="5">No users found.</td></tr>';
    };
    $('#search').oninput = draw;
    $('#rows').onclick = e => {
      const v = e.target.dataset.view, d = e.target.dataset.del;
      if (v) {
        const u = db.users.find(x => x.id == v), s = stats(u);
        $('#mBody').innerHTML = `<p><b>${esc(u.name)}</b><br>${esc(u.email)}<br>Joined: ${u.joined}</p><p class="mb-0">Questions attempted: ${s.attempts}<br>Accuracy: ${s.accuracy}%<br>Coding solved: ${s.solved}<br>Streak: ${s.streak} days</p>`;
        new bootstrap.Modal($('#modal')).show();
      }
      if (d && confirm('Delete this user and all their progress?')) {
        db.users = db.users.filter(u => u.id != d); db.attempts = db.attempts.filter(a => a.uid != d); db.solved = db.solved.filter(s => s.uid != d); save(); draw();
      }
    };
    draw();
  },

  'admin-messages'() {
    const draw = () => {
      $('#rows').innerHTML = db.messages.map(m => `<tr class="${m.read ? '' : 'fw-bold'}"><td>${m.date}</td><td>${esc(m.name)}<br><small>${esc(m.email)}</small></td><td>${esc(m.text)}</td>
        <td>${m.read ? '' : `<button class="btn btn-sm btn-outline-success" data-read="${m.id}">Mark read</button> `}<button class="btn btn-sm btn-outline-danger" data-del="${m.id}">Delete</button></td></tr>`).join('') || '<tr><td colspan="4">No messages yet.</td></tr>';
    };
    $('#rows').onclick = e => {
      if (e.target.dataset.read) { db.messages.find(m => m.id == e.target.dataset.read).read = true; save(); draw(); }
      if (e.target.dataset.del && confirm('Delete this message?')) { db.messages = db.messages.filter(m => m.id != e.target.dataset.del); save(); draw(); }
    };
    draw();
  }
};

// ---------- 4. START: check login, build navbar, run this page's function ----------
(function main() {
  const b = document.body.dataset, auth = b.auth;
  if (auth && (!user || (auth === 'admin' && user.role !== 'admin'))) { location.href = 'login.html'; return; }
  if (auth === 'user' && user.role === 'admin') { location.href = 'admin-dashboard.html'; return; }
  buildChrome(b.page, b.simple);
  if (pages[b.page]) pages[b.page]();
})();
