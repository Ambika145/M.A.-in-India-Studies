$(document).ready(function () {

  /* ── PROGRAMME HIGHLIGHTS SLIDER ── */
  const track = $('.slider-track');
  const items = $('.slider-item');
  let current = 0;

  function getVisible() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }

  function updateSlider() {
    const visibleCount = getVisible();
    const wrapperWidth = $('.slider-wrapper').width() || ($(window).width() - 80);
    const itemWidth = Math.floor(wrapperWidth / visibleCount);
    items.css({ 'min-width': itemWidth + 'px', 'max-width': itemWidth + 'px', 'width': itemWidth + 'px' });
    track.css('transform', 'translateX(-' + (current * itemWidth) + 'px)');
  }

  $('.right-btn').on('click', function () {
    const visibleCount = getVisible();
    if (current < items.length - visibleCount) { current++; updateSlider(); }
  });

  $('.left-btn').on('click', function () {
    if (current > 0) { current--; updateSlider(); }
  });

  $(window).on('resize', function () { current = 0; tIdx = 0; updateSlider(); updateFaculty(); updateTest(); updateRecognitions(); });
  updateSlider();
  /* Re-run after images load so widths are final */
  $(window).on('load', function () { current = 0; updateSlider(); updateTest(); });

  /* ── RECOGNITIONS CAROUSEL FOR MOBILE ── */
  const $reconBadge = $('.recognitions-badges');
  function updateRecognitions() {
    if (window.innerWidth <= 768) {
      if (!$reconBadge.hasClass('owl-carousel')) {
        $reconBadge.addClass('owl-carousel owl-theme').owlCarousel({
          items: 1,
          margin: 20,
          loop: true,
          nav: false,
          dots: true,
          autoplay: true,
          autoplayTimeout: 3500
        });
      }
    } else {
      if ($reconBadge.hasClass('owl-carousel')) {
        $reconBadge.trigger('destroy.owl.carousel').removeClass('owl-carousel owl-theme');
      }
    }
  }
  updateRecognitions();

  /* ── FACULTY CAROUSEL ── */
  const facultyGrid = document.querySelector('.faculty-grid');
  const facultyCards = document.querySelectorAll('.faculty-card');
  const prevBtn = document.querySelector('.faculty-prev-btn');
  const nextBtn = document.querySelector('.faculty-next-btn');
  let fIdx = 0;

  function updateFaculty() {
    if (!facultyGrid || !facultyCards.length) return;
    const gap = parseFloat(window.getComputedStyle(facultyGrid).gap) || 0;
    const w = facultyCards[0].offsetWidth + gap;
    // Clamp the shift so the grid never scrolls past its last card
    // (otherwise the final step overshoots and shows an empty gap on the right)
    const maxShift = Math.max(0, facultyGrid.scrollWidth - facultyGrid.parentElement.clientWidth);
    const shift = Math.min(fIdx * w, maxShift);
    facultyGrid.style.transform = 'translateX(-' + shift + 'px)';
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => { if (fIdx > 0) { fIdx--; updateFaculty(); } });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (!facultyGrid) return;
      const gap = parseFloat(window.getComputedStyle(facultyGrid).gap) || 0;
      const w = facultyCards[0].offsetWidth + gap;
      const visible = Math.floor(facultyGrid.parentElement.offsetWidth / w) || 1;
      const maxIdx = Math.max(0, facultyCards.length - visible);
      if (fIdx < maxIdx) { fIdx++; updateFaculty(); }
    });
  }
  updateFaculty();

  /* ── TESTIMONIALS SLIDER ── */
  const testGrid = document.querySelector('.test-grid');
  const testCards = document.querySelectorAll('.test-card');
  let tIdx = 0;

  function testMetrics() {
    if (!testGrid || !testCards.length) return null;
    const wrap = testGrid.parentElement;
    const wrapStyles = window.getComputedStyle(wrap);
    const pad = parseFloat(wrapStyles.paddingLeft) + parseFloat(wrapStyles.paddingRight);
    const visibleWidth = wrap.clientWidth - pad;
    const gap = parseFloat(window.getComputedStyle(testGrid).gap) || 20;
    const w = testCards[0].offsetWidth + gap;
    const visible = Math.max(1, Math.round((visibleWidth + gap) / w));
    const maxIdx = Math.max(0, testCards.length - visible);
    const maxShift = Math.max(0, testGrid.scrollWidth - visibleWidth);
    return { w, visible, maxIdx, maxShift };
  }

  function updateTest() {
    const m = testMetrics();
    if (!m) return;
    if (tIdx > m.maxIdx) tIdx = m.maxIdx;
    const shift = Math.min(tIdx * m.w, m.maxShift);
    testGrid.style.transform = 'translateX(-' + shift + 'px)';
  }

  document.getElementById('testPrev')?.addEventListener('click', () => {
    if (tIdx > 0) { tIdx--; updateTest(); }
  });

  document.getElementById('testNext')?.addEventListener('click', () => {
    const m = testMetrics();
    if (!m) return;
    if (tIdx < m.maxIdx) { tIdx++; updateTest(); }
  });

  updateTest();

  /* ── VIDEO BOX ── */
  const videoBox = document.querySelector('.video-box[data-youtube]');
  if (videoBox) {
    videoBox.addEventListener('click', function () {
      const url = this.getAttribute('data-youtube');
      if (url && url.indexOf('REPLACE_VIDEO_ID') === -1) {
        window.open(url, '_blank');
      }
    });
  }

  /* ── DYNAMIC BACKGROUND SWAP FOR ELIGIBILITY SECTION ── */
  $('#eligTabs button').on('shown.bs.tab', function (e) {
    const targetId = $(e.target).attr('data-bs-target');
    const $sec = $('.eligibility-section');
    $sec.removeClass('bg-eligibility bg-fees bg-payment');
    if (targetId === '#tab-elig') {
      $sec.addClass('bg-eligibility');
    } else if (targetId === '#tab-fees') {
      $sec.addClass('bg-fees');
    } else if (targetId === '#tab-payment') {
      $sec.addClass('bg-payment');
    }
  });

});
