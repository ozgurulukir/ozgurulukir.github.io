/**
 * Shared copy-to-clipboard behavior for every copy button on the site.
 *
 * One state machine (copied class, label/tooltip/aria updates, 2s auto-reset,
 * Escape-to-clear) instead of one per button. Auto-initializes:
 *   - every <button data-copy="..."> (copies the attribute's value)
 *   - every <pre> inside .post-content (wraps it and injects a copy button)
 */
(function () {
  'use strict';

  var RESET_DELAY = 2000;
  var timeouts = new WeakMap(); // btn -> pending reset timeout id
  var strings = new WeakMap(); // btn -> label strings for reset
  var statusEls = new WeakMap(); // btn -> external live region (may be null)
  var active = new Set(); // buttons currently showing copied/failed state

  var COPY_ICON =
    '<svg class="copy-icon" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25v-7.5Z"/><path fill="currentColor" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25v-7.5Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0-.25-.25v-7.5a.25.25 0 0 0-.25-.25h-7.5Z"/></svg>';
  var CHECK_ICON =
    '<svg class="check-icon" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/></svg>';

  var CODE_STRINGS = {
    idleLabel: 'Copy',
    idleTooltip: 'Copy snippet',
    idleAria: 'Copy code snippet to clipboard',
    successLabel: 'Copied!',
    successTooltip: 'Copied! (Esc to clear)',
    successAria: 'Code snippet copied to clipboard (Press Escape to clear)',
    successStatus: 'Code snippet copied to clipboard. Press Escape to clear status.',
    failureLabel: 'Failed',
    failureTooltip: 'Failed (Esc to clear)',
    failureAria: 'Failed to copy code snippet (Press Escape to clear)',
    failureStatus: 'Failed to copy code snippet. Press Escape to clear status.'
  };

  var EMAIL_STRINGS = {
    idleLabel: null,
    idleTooltip: 'Copy email',
    idleAria: 'Copy email address',
    successLabel: null,
    successTooltip: 'Copied!',
    successAria: 'Email address copied to clipboard (Press Escape to clear)',
    successStatus: 'Email address copied to clipboard. Press Escape to clear status.',
    failureLabel: null,
    failureTooltip: 'Failed to copy',
    failureAria: 'Failed to copy email address (Press Escape to clear)',
    failureStatus: 'Failed to copy email address. Press Escape to clear status.'
  };

  function fallbackCopy(text, done) {
    try {
      var textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      var successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      done(successful);
    } catch (err) {
      done(false);
    }
  }

  function copy(text, done) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () { done(true); },
        function () { fallbackCopy(text, done); }
      );
    } else {
      fallbackCopy(text, done);
    }
  }

  function resetButton(btn) {
    var s = strings.get(btn);
    var statusEl = statusEls.get(btn);
    if (!s) return;
    btn.classList.remove('copied');
    var label = btn.querySelector('.code-copy-label');
    if (label && s.idleLabel !== null) label.textContent = s.idleLabel;
    var tooltip = btn.querySelector('.copy-feedback, .code-copy-tooltip');
    if (tooltip) tooltip.textContent = s.idleTooltip;
    btn.setAttribute('aria-label', s.idleAria);
    btn.setAttribute('title', s.idleAria);
    if (statusEl) statusEl.textContent = '';
    active.delete(btn);
  }

  function showResult(btn, s, statusEl, success) {
    var label = btn.querySelector('.code-copy-label');
    if (label && s.successLabel !== null) {
      label.textContent = success ? s.successLabel : s.failureLabel;
    }
    var tooltip = btn.querySelector('.copy-feedback, .code-copy-tooltip');
    if (tooltip) {
      tooltip.textContent = success ? s.successTooltip : s.failureTooltip;
    }
    btn.setAttribute('aria-label', success ? s.successAria : s.failureAria);
    btn.setAttribute('title', success ? s.successAria : s.failureAria);
    if (statusEl) {
      statusEl.textContent = success ? s.successStatus : s.failureStatus;
    }
    active.add(btn);
  }

  function initCopyButton(btn, getText, s, statusEl) {
    strings.set(btn, s);
    statusEls.set(btn, statusEl || null);
    btn.addEventListener('click', function () {
      copy(getText(), function (success) {
        btn.classList.add('copied');
        showResult(btn, s, statusEl, success);
        clearTimeout(timeouts.get(btn));
        var t = setTimeout(function () {
          timeouts.delete(btn);
          resetButton(btn);
        }, RESET_DELAY);
        timeouts.set(btn, t);
      });
    });
  }

  // Auto-init data-copy buttons (e.g. the contact email). An optional
  // data-copy-status attribute names the live region for announcements.
  document.querySelectorAll('button[data-copy]').forEach(function (btn) {
    initCopyButton(
      btn,
      function () { return btn.getAttribute('data-copy'); },
      EMAIL_STRINGS,
      document.getElementById(btn.getAttribute('data-copy-status') || '')
    );
  });

  // Wrap post code blocks and inject a copy button on each.
  function initCodeCopyButtons() {
    document.querySelectorAll('.post-content pre').forEach(function (pre, index) {
      pre.setAttribute('aria-label', 'Code snippet ' + (index + 1));
      var wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper';
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'code-copy-btn';
      btn.setAttribute('aria-label', CODE_STRINGS.idleAria);
      btn.setAttribute('aria-keyshortcuts', 'Escape');

      var statusId = 'code-copy-status-' + index;
      var tooltipId = 'tooltip-' + index;
      btn.setAttribute('aria-describedby', tooltipId + ' ' + statusId);
      btn.innerHTML =
        COPY_ICON +
        CHECK_ICON +
        '<span class="code-copy-label">Copy</span>' +
        '<span class="code-copy-tooltip" role="tooltip" id="' + tooltipId + '">Copy snippet</span>' +
        '<span class="sr-only" aria-live="polite" id="' + statusId + '"></span>';

      wrapper.appendChild(btn);
      initCopyButton(
        btn,
        function () {
          var code = pre.querySelector('code');
          return code ? code.innerText : pre.innerText;
        },
        CODE_STRINGS,
        btn.querySelector('[aria-live="polite"]')
      );
    });
  }

  // Escape clears every active copy button; only claim the key when there is
  // something to clear, so dialogs and browser Escape behavior keep working.
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || active.size === 0) return;
    e.preventDefault();
    active.forEach(function (btn) {
      var t = timeouts.get(btn);
      if (t) clearTimeout(t);
      timeouts.delete(btn);
      resetButton(btn);
    });
    active.clear();
  });

  function init() {
    initCodeCopyButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
