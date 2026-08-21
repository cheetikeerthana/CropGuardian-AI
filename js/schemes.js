/**
 * CropGuardian AI - Farmer Support Schemes Module
 * Loads and dynamically renders verified government support schemes
 * with interactive category filtering.
 */

const SchemesModule = (function() {
  let allSchemes = [];

  async function init() {
    try {
      const response = await fetch('data/schemes.json');
      if (response.ok) {
        const data = await response.json();
        allSchemes = data.schemes || [];
      } else {
        allSchemes = getFallbackSchemes();
      }
    } catch (e) {
      console.warn('Using local fallback schemes:', e);
      allSchemes = getFallbackSchemes();
    }

    renderSchemes(allSchemes);
    initFilterTabs();
  }

  function renderSchemes(schemesToRender) {
    const container = document.getElementById('schemesGrid');
    if (!container) return;

    if (!schemesToRender || schemesToRender.length === 0) {
      container.innerHTML = '<p class="text-muted" style="grid-column: 1/-1; text-align: center;">No schemes found in this category.</p>';
      return;
    }

    container.innerHTML = schemesToRender.map(scheme => `
      <div class="scheme-card glass-card">
        <div>
          <div class="scheme-top-row">
            <span class="scheme-category-badge">${scheme.category}</span>
            <span class="scheme-icon-circle">${scheme.icon || '??'}</span>
          </div>
          <h4 class="scheme-title" style="margin-top: 0.8rem;">${scheme.name}</h4>
          <div class="scheme-badge-subtitle">${scheme.badge}</div>
          <p class="scheme-description">${scheme.description}</p>
        </div>
        <div class="scheme-footer">
          <a href="${scheme.link}" target="_blank" rel="noopener noreferrer" class="scheme-link">
            <span>Learn More</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <span class="portal-verify-text">${scheme.portalName}</span>
        </div>
      </div>
    `).join('');
  }

  function initFilterTabs() {
    const filterButtons = document.querySelectorAll('.filter-pill');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-filter');
        if (category === 'all') {
          renderSchemes(allSchemes);
        } else {
          const filtered = allSchemes.filter(s => s.category.toLowerCase().includes(category.toLowerCase()));
          renderSchemes(filtered);
        }
      });
    });
  }

  function getFallbackSchemes() {
    return [
      {
        id: 'pm-kisan',
        name: 'PM-KISAN',
        category: 'Income Support',
        badge: 'Direct Benefit Transfer',
        description: 'Provides ?6,000 per year direct income support in three equal installments to eligible landholding farmer families across India.',
        link: 'https://pmkisan.gov.in/',
        portalName: 'Official PM-KISAN Portal',
        icon: '??'
      },
      {
        id: 'pmfby',
        name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
        category: 'Crop Insurance',
        badge: 'Comprehensive Risk Cover',
        description: 'Comprehensive yield insurance coverage against non-preventable natural risks, pest infestations, and localized disease damage.',
        link: 'https://pmfby.gov.in/',
        portalName: 'Official PMFBY Portal',
        icon: '???'
      },
      {
        id: 'soil-health-card',
        name: 'Soil Health Card Scheme',
        category: 'Soil Management',
        badge: 'Nutrient Optimization',
        description: 'Provides personalized soil nutrient reports and customized fertilizer guidance to optimize soil health and reduce excessive input costs.',
        link: 'https://soilhealth.dac.gov.in/',
        portalName: 'Official Soil Health Portal',
        icon: '??'
      },
      {
        id: 'kvk',
        name: 'Krishi Vigyan Kendra (KVK)',
        category: 'Agronomic Advisory',
        badge: 'Expert Science Advisory',
        description: 'District-level agricultural science centers providing field testing, diagnostic clinics, disease identification, and farmer advisories.',
        link: 'https://kvk.icar.gov.in/',
        portalName: 'Official ICAR KVK Portal',
        icon: '??'
      }
    ];
  }

  return {
    init,
    renderSchemes
  };
})();
