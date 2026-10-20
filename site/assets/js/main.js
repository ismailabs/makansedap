/* MakanSedap — vanilla JavaScript; progressive enhancement only. */
(() => {
  'use strict';
  document.documentElement.classList.add('js');

  // Mobile navigation is fully readable without JS; JS adds the collapse behavior.
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-nav');
  if (toggle && nav) {
    const close = () => {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation');
      nav.classList.remove('open');
    };
    toggle.addEventListener('click', () => {
      const shouldOpen = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(shouldOpen));
      toggle.setAttribute('aria-label', shouldOpen ? 'Close navigation' : 'Open navigation');
      nav.classList.toggle('open', shouldOpen);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && nav.classList.contains('open')) {
        close(); toggle.focus();
      }
    });
    document.addEventListener('click', event => {
      if (!nav.contains(event.target) && !toggle.contains(event.target)) close();
    });
    window.matchMedia('(min-width: 861px)').addEventListener('change', event => {
      if (event.matches) close();
    });
  }

  // Every menu dish is already present in HTML. Only hide sections on filtering.
  const filters = [...document.querySelectorAll('[data-filter]')];
  const groups = [...document.querySelectorAll('[data-menu-group]')];
  const filterStatus = document.getElementById('filter-status');
  if (filters.length && groups.length) {
    const applyFilter = (filter, { moveFocus = false } = {}) => {
      const active = filters.find(button => button.dataset.filter === filter) || filters[0];
      filters.forEach(button => {
        const selected = button === active;
        button.classList.toggle('is-selected', selected);
        button.setAttribute('aria-pressed', String(selected));
      });
      let count = 0;
      groups.forEach(group => {
        const show = filter === 'all' || group.dataset.menuGroup === filter;
        group.hidden = !show;
        if (show) count += group.querySelectorAll('[data-menu-item]').length;
      });
      if (filterStatus) {
        filterStatus.textContent = `Showing ${count} menu ${count === 1 ? 'item' : 'items'}${filter !== 'all' ? ' in ' + active.textContent.replace(/\d+/g, '').trim() : ' across all categories'}.`;
      }
      if (moveFocus) active.focus();
      const stage = document.querySelector('.menu-stage img');
      const stageLabel = document.getElementById('menu-stage-label');
      if (stage && stageLabel) {
        const source = groups.find(group => group.dataset.menuGroup === filter)?.querySelector('.category-feature img');
        if (source) { stage.src = source.src; stage.srcset = source.srcset; }
        else {
          stage.src = '/assets/images/v3/floating-aromatics-240.webp';
          stage.srcset = '/assets/images/v3/floating-aromatics-240.webp 240w, /assets/images/v3/floating-aromatics-480.webp 480w, /assets/images/v3/floating-aromatics-768.webp 768w';
        }
        stageLabel.textContent = filter === 'all' ? 'The whole table' : active.textContent.replace(/\d+/g, '').trim();
      }
      document.dispatchEvent(new CustomEvent('menu:change', { detail: { filter, label: active.textContent.replace(/\d+/g, '').trim() } }));
    };
    filters.forEach(button => button.addEventListener('click', () => {
      applyFilter(button.dataset.filter, { moveFocus: true });
      const hash = button.dataset.filter === 'all' ? '' : '#' + button.dataset.filter;
      if (window.location.hash !== hash) history.pushState(null, '', window.location.pathname + window.location.search + hash);
    }));
    const followHash = () => {
      const hash = window.location.hash.slice(1);
      // A dish link must also work after a visitor has selected another category.
      if (groups.some(group => group.id === hash)) applyFilter(hash);
      else if (hash.startsWith('item-') || !hash) applyFilter('all');
      if (hash) document.getElementById(hash)?.scrollIntoView({ block: 'start', behavior: 'instant' });
    };
    followHash();
    window.addEventListener('hashchange', followHash);
    window.addEventListener('popstate', followHash);
  }

  const galleryFilters = [...document.querySelectorAll('[data-gallery-filter]')];
  galleryFilters.forEach(button => button.addEventListener('click', () => {
    galleryFilters.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    let count = 0;
    document.querySelectorAll('[data-gallery-category]').forEach(tile => {
      tile.hidden = button.dataset.galleryFilter !== 'all' && tile.dataset.galleryCategory !== button.dataset.galleryFilter;
      if (!tile.hidden) count++;
    });
    document.getElementById('gallery-status').textContent = 'Showing ' + count + ' concept images.';
  }));

  // Accessible <dialog> image lightbox. With JS disabled, gallery images remain normal links.
  const dialog = document.getElementById('gallery-lightbox');
  const entries = [...document.querySelectorAll('[data-gallery-index]')];
  if (dialog && entries.length && typeof dialog.showModal === 'function') {
    const image = dialog.querySelector('.lightbox-image');
    const caption = document.getElementById('lightbox-title');
    const counter = document.getElementById('lightbox-counter');
    const prev = dialog.querySelector('.lightbox-prev');
    const next = dialog.querySelector('.lightbox-next');
    const closeButton = dialog.querySelector('.lightbox-close');
    const imageStatus = document.createElement('p');
    imageStatus.className = 'lightbox-caption';
    imageStatus.setAttribute('role', 'status');
    image.after(imageStatus);
    image.addEventListener('error', () => { if (dialog.open) imageStatus.textContent = 'This image could not be loaded. Use Previous or Next to keep exploring, or close the image.'; });
    image.addEventListener('load', () => { imageStatus.textContent = ''; });
    let index = 0;
    let opener = null;
    const update = number => {
      const step = number < index ? -1 : 1;
      index = (number + entries.length) % entries.length;
      while (entries[index].hidden) index = (index + step + entries.length) % entries.length;
      const entry = entries[index];
      imageStatus.textContent = '';
      image.src = entry.dataset.full;
      image.alt = entry.querySelector('img').alt;
      caption.textContent = entry.dataset.caption;
      counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(entries.length).padStart(2, '0')}`;
    };
    const close = () => dialog.close();
    entries.forEach((entry, i) => entry.addEventListener('click', event => {
      event.preventDefault();
      opener = entry;
      update(i);
      dialog.showModal();
      closeButton.focus();
    }));
    prev.addEventListener('click', () => update(index - 1));
    next.addEventListener('click', () => update(index + 1));
    closeButton.addEventListener('click', close);
    dialog.addEventListener('keydown', event => {
      if (event.key === 'Tab') {
        const controls = [closeButton, prev, next];
        const current = controls.indexOf(document.activeElement);
        if (event.shiftKey && current <= 0) { event.preventDefault(); next.focus(); }
        else if (!event.shiftKey && current === controls.length - 1) { event.preventDefault(); closeButton.focus(); }
      }
      if (event.key === 'ArrowLeft') { event.preventDefault(); update(index - 1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); update(index + 1); }
    });
    dialog.addEventListener('click', event => { if (event.target === dialog) close(); });
    dialog.addEventListener('close', () => {
      image.removeAttribute('src');
      if (opener && document.contains(opener)) opener.focus();
    });
  }

  // No network requests, browser storage, personal data, booking or real availability.
  const form = document.getElementById('reservation-form');
  if (form) {
    const fieldset = form.querySelector('.demo-fields');
    const party = document.getElementById('party');
    const date = document.getElementById('date');
    const time = document.getElementById('time');
    const error = document.getElementById('reservation-error');
    const result = document.getElementById('reservation-result');
    fieldset.disabled = false;
    const localDay = dateObj => {
      const y = dateObj.getFullYear();
      const m = String(dateObj.getMonth() + 1).padStart(2, '0');
      const d = String(dateObj.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };
    const refreshDates = () => {
      const tomorrow = new Date();
      tomorrow.setHours(12, 0, 0, 0);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const latest = new Date(tomorrow);
      latest.setDate(latest.getDate() + 179);
      date.min = localDay(tomorrow);
      date.max = localDay(latest);
    };
    refreshDates();
    const updateProgress = () => {
      const count = /^[1-8]$/.test(party.value) ? Number(party.value) : 0;
      document.querySelectorAll('[data-seat]').forEach(seat => seat.classList.toggle('is-occupied', Number(seat.dataset.seat) <= count));
      const tableCount = document.querySelector('.table-count');
      if (tableCount) tableCount.textContent = count || '?';
      const states = [count > 0, Boolean(date.value && date.value >= date.min && date.value <= date.max), ['17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00'].includes(time.value)];
      const values = [count ? `${count} ${count === 1 ? 'guest' : 'guests'}` : 'Not chosen', states[1] ? date.value : 'Not chosen', states[2] ? time.selectedOptions[0].textContent : 'Not chosen'];
      ['party','date','time'].forEach((name, index) => {
        const step = document.querySelector(`[data-step="${name}"]`);
        if (step) { step.dataset.complete = String(states[index]); step.querySelector('span').textContent = values[index]; }
      });
      const progress = document.getElementById('booking-progress-status');
      if (progress) progress.textContent = `${states.filter(Boolean).length} of 3 illustrative choices ready. Nothing is booked, sent or saved.`;
      document.dispatchEvent(new CustomEvent('booking:change'));
    };
    updateProgress();
    const fail = (message, field) => {
      result.hidden = true;
      error.textContent = message;
      error.hidden = false;
      if (field) { field.setAttribute('aria-invalid', 'true'); field.setAttribute('aria-describedby', 'reservation-error'); field.focus(); }
    };
    [party, date, time].forEach(field => field.addEventListener('change', () => {
      error.hidden = true;
      result.hidden = true;
      field.removeAttribute('aria-invalid');
      field.removeAttribute('aria-describedby');
      updateProgress();
    }));
    form.addEventListener('submit', event => {
      event.preventDefault();
      refreshDates();
      if (!/^[1-8]$/.test(party.value)) return fail('Please choose a party size to try the demo.', party);
      if (!date.value) return fail('Please choose a future date to try the demo.', date);
      if (date.value < date.min || date.value > date.max) return fail('Please choose a date between tomorrow and 180 days from now.', date);
      const slots = ['17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00'];
      if (!slots.includes(time.value)) return fail('Please choose an illustrative time slot.', time);
      error.hidden = true;
      const formatted = new Intl.DateTimeFormat('en-MY', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(date.value + 'T12:00:00Z'));
      const slot = time.selectedOptions[0].textContent;
      const count = Number(party.value);
      result.replaceChildren();
      const strong = document.createElement('strong');
      strong.textContent = 'This is a portfolio demonstration. No reservation has been created.';
      const detail = document.createElement('p');
      detail.textContent = `Demo preview: ${count} ${count === 1 ? 'guest' : 'guests'} · ${formatted} · ${slot}. All time slots are illustrative; nothing was submitted or stored.`;
      result.append(strong, detail);
      result.hidden = false;
      result.focus();
    });
  }
})();
