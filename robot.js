(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Chế độ sáng/tối */
  try {
    var saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
  } catch (e) {}
  var btn = document.getElementById('theme-btn');
  function isDark() {
    var t = root.getAttribute('data-theme');
    if (t) return t === 'dark';
    return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }
  function sync() { btn.setAttribute('aria-pressed', String(isDark())); }
  btn.addEventListener('click', function () {
    var next = isDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    sync();
  });
  sync();

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* Mắt robot nhìn theo con trỏ */
  var robot = document.getElementById('robot');
  var eyes = document.getElementById('eyes');
  document.addEventListener('pointermove', function (e) {
    var r = robot.getBoundingClientRect();
    var cx = r.left + r.width / 2;
    var cy = r.top + r.height * 0.35;
    var dx = e.clientX - cx, dy = e.clientY - cy;
    var d = Math.sqrt(dx * dx + dy * dy) || 1;
    var k = Math.min(1, d / 200);
    eyes.style.transform = 'translate(' + (dx / d * 7 * k).toFixed(2) + 'px,' + (dy / d * 5 * k).toFixed(2) + 'px)';
  });

  /* Trợ lý hỏi đáp: câu trả lời soạn sẵn */
  var answers = {
    job: 'Tuấn là kỹ sư AI và robot. Anh xây các hệ thống giúp máy móc nhìn, hiểu và tự đưa ra quyết định.',
    work: 'Hiện Tuấn đang làm robot tự hành trong nhà và một trợ lý AI cho sinh viên. Chi tiết nằm ở mục Dự án.',
    contact: 'Gửi email tới email@example.com. Tuấn thường trả lời trong vòng một ngày.'
  };
  var out = document.getElementById('answer');
  var sr = document.getElementById('answer-sr');
  var timer = null;
  function say(text) {
    clearInterval(timer);
    sr.textContent = text;
    if (reduce) { out.textContent = text; return; }
    out.textContent = '';
    var i = 0;
    timer = setInterval(function () {
      i++;
      out.textContent = text.slice(0, i);
      if (i >= text.length) clearInterval(timer);
    }, 18);
  }
  var buttons = document.querySelectorAll('.ask button');
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function () {
      say(answers[this.getAttribute('data-key')]);
    });
  }
})();
