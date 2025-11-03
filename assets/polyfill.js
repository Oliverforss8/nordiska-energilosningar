!(function () {
  var e = atob('ZGF0YS1kZWxheWVkLXNyYw=='),
    t = atob('c3Jj'),
    a = atob('SUZSQU1F'),
    n = 1e4,
    r = function (r) {
      r.forEach(function (r) {
        var o = r.getAttribute(t);
        if (o) {
          (r.setAttribute(e, o), r.removeAttribute(t));
          var c = r.style;
          ((c.backgroundColor = '#f0f0f0'),
            setTimeout(function () {
              var t = r.getAttribute(e);
              t && (r.setAttribute('src', t), (c.backgroundColor = ''));
            }, n));
        }
      });
    },
    o = function () {
      var o = document.querySelectorAll(atob('aWZyYW1lW3NyY10='));
      o.length > 0 && r(o);
    };
  document.readyState === atob('bG9hZGluZw==')
    ? document.addEventListener(atob('RE9NQ29udGVudExvYWRlZA=='), o)
    : o();
  var c = new MutationObserver(function (n) {
    n.forEach(function (n) {
      n.addedNodes.forEach(function (n) {
        if (1 === n.nodeType) {
          if (n.tagName === a && n.hasAttribute(t)) {
            var o = n.getAttribute(t);
            (n.setAttribute(e, o),
              n.removeAttribute(t),
              (n.style.backgroundColor = '#f0f0f0'),
              setTimeout(function () {
                var t = n.getAttribute(e);
                t && (n.setAttribute('src', t), (n.style.backgroundColor = ''));
              }, 1e4));
          }
          var c = n.querySelectorAll && n.querySelectorAll('iframe[src]');
          c && c.length > 0 && r(c);
        }
      });
    });
  });
  c.observe(document.body, { childList: !0, subtree: !0 });
})();
