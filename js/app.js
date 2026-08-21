/**
 * CropGuardian AI - Main Controller
 * Orchestrates Upload, AI Analysis, Risk Meter, Treatments, Farmer Support,
 * Snapshot Persistence, and Hackathon Presentation Demo Flow.
 */

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Initialize Sub-modules
  UploadModule.init();
  await SchemesModule.init();

  let treatmentsData = {};
  try {
    const res = await fetch('data/treatments.json');
    if (res.ok) treatmentsData = await res.json();
  } catch (e) {
    console.warn('Using local fallback treatments:', e);
  }

  let currentAnalysisResult = null;

  // 2. DOM Elements
  const btnAnalyze = document.getElementById('btnAnalyze');
  const btnResetScan = document.getElementById('btnResetScan');
  const btnSaveSnapshot = document.getElementById('btnSaveSnapshot');
  const loadingCard = document.getElementById('analysisLoadingCard');
  const resultsSection = document.getElementById('resultsSection');
  const previewContainer = document.getElementById('previewContainer');

  // Navigation Links
  initNavigation();

  // Settings & History Modals
  initModals();

  // 3. Analyze Crop Click Handler
  if (btnAnalyze) {
    btnAnalyze.addEventListener('click', async () => {
      const selectedImg = UploadModule.getSelectedImage();
      const activePreset = UploadModule.getActivePreset();

      if (!selectedImg) {
        UploadModule.showToast('Please select or upload a crop leaf image first.', 'error');
        return;
      }

      // Start Analysis Experience
      startLoadingExperience();

      try {
        // Multi-stage timed animation (2.8 seconds total)
        await runStageAnimation();

        // Perform AI Analysis
        const aiResult = await AIModule.analyzeCropImage(selectedImg, activePreset);
        
        // Calculate Risk Score
        const riskScore = RiskMeterModule.calculateRiskScore(aiResult.confidence, aiResult.severity);
        const riskInfo = RiskMeterModule.getRiskLevel(riskScore);

        // Fetch treatments
        const treatmentInfo = treatmentsData[aiResult.disease] || getFallbackTreatment(aiResult.disease, aiResult.severity);

        currentAnalysisResult = {
          ...aiResult,
          riskScore,
          riskInfo,
          treatmentInfo,
          analyzedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        // Render Results
        renderFullResults(currentAnalysisResult);

        // Complete Loading and Reveal Results
        stopLoadingExperience();

        // Animate Risk Gauge
        setTimeout(() => {
          RiskMeterModule.animateGauge(riskScore);
        }, 150);

        // Smooth scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

      } catch (err) {
        console.error('Analysis failed:', err);
        stopLoadingExperience();
        UploadModule.showToast('Analysis error. Please try another sample or image.', 'error');
      }
    });
  }

  // 4. Save Crop Snapshot Handler
  if (btnSaveSnapshot) {
    btnSaveSnapshot.addEventListener('click', () => {
      if (!currentAnalysisResult) return;

      const snapshots = JSON.parse(localStorage.getItem('cropguardian_snapshots') || '[]');
      const newSnapshot = {
        id: Date.now(),
        crop: currentAnalysisResult.crop,
        disease: currentAnalysisResult.disease,
        confidence: currentAnalysisResult.confidence,
        riskScore: currentAnalysisResult.riskScore,
        riskLevel: currentAnalysisResult.riskInfo.level,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: currentAnalysisResult.analyzedAt
      };

      snapshots.unshift(newSnapshot);
      localStorage.setItem('cropguardian_snapshots', JSON.stringify(snapshots.slice(0, 15)));

      // Visual button feedback
      const originalText = btnSaveSnapshot.innerHTML;
      btnSaveSnapshot.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        <span>Saved ?</span>
      `;
      btnSaveSnapshot.style.background = 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)';
      btnSaveSnapshot.style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.6)';

      UploadModule.showToast('Crop Health Snapshot saved successfully!', 'success');

      setTimeout(() => {
        btnSaveSnapshot.innerHTML = originalText;
        btnSaveSnapshot.style.background = '';
        btnSaveSnapshot.style.boxShadow = '';
      }, 2500);
    });
  }

  // 5. Reset Scan Handler
  if (btnResetScan) {
    btnResetScan.addEventListener('click', () => {
      resultsSection.classList.remove('active');
      UploadModule.reset();
      currentAnalysisResult = null;
      document.getElementById('scanner').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // =========================================================================
  // Loading Stages Pipeline
  // =========================================================================
  function startLoadingExperience() {
    if (previewContainer) previewContainer.classList.add('scanning');
    if (resultsSection) resultsSection.classList.remove('active');
    if (loadingCard) {
      loadingCard.classList.add('active');
      loadingCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function stopLoadingExperience() {
    if (previewContainer) previewContainer.classList.remove('scanning');
    if (loadingCard) loadingCard.classList.remove('active');
    if (resultsSection) resultsSection.classList.add('active');
  }

  function runStageAnimation() {
    return new Promise((resolve) => {
      const progressBar = document.getElementById('loadingProgressFill');
      const stages = [
        document.getElementById('stage1'),
        document.getElementById('stage2'),
        document.getElementById('stage3'),
        document.getElementById('stage4')
      ];

      // Reset stages
      stages.forEach(s => {
        if (s) {
          s.classList.remove('completed', 'current');
        }
      });

      // Stage 1
      if (stages[0]) stages[0].classList.add('current');
      if (progressBar) progressBar.style.width = '25%';

      setTimeout(() => {
        // Stage 2
        if (stages[0]) { stages[0].classList.remove('current'); stages[0].classList.add('completed'); }
        if (stages[1]) stages[1].classList.add('current');
        if (progressBar) progressBar.style.width = '55%';
      }, 700);

      setTimeout(() => {
        // Stage 3
        if (stages[1]) { stages[1].classList.remove('current'); stages[1].classList.add('completed'); }
        if (stages[2]) stages[2].classList.add('current');
        if (progressBar) progressBar.style.width = '80%';
      }, 1400);

      setTimeout(() => {
        // Stage 4
        if (stages[2]) { stages[2].classList.remove('current'); stages[2].classList.add('completed'); }
        if (stages[3]) stages[3].classList.add('current');
        if (progressBar) progressBar.style.width = '100%';
      }, 2100);

      setTimeout(() => {
        if (stages[3]) { stages[3].classList.remove('current'); stages[3].classList.add('completed'); }
        resolve();
      }, 2700);
    });
  }

  // =========================================================================
  // Render Results Dashboard
  // =========================================================================
  function renderFullResults(res) {
    // Top Banner Badges
    const aiModeBadge = document.getElementById('aiModeBadge');
    if (aiModeBadge) {
      if (res.mode === 'api') {
        aiModeBadge.className = 'badge badge-live';
        aiModeBadge.innerHTML = '? Gemini Live AI Mode';
      } else {
        aiModeBadge.className = 'badge badge-demo';
        aiModeBadge.innerHTML = '? Demo AI Mode (Deterministic Prototype)';
      }
    }

    // Main Identification
    const cropNameEl = document.getElementById('resultCropName');
    const diseaseNameEl = document.getElementById('resultDiseaseName');
    const pathogenEl = document.getElementById('resultPathogen');
    const confidenceValEl = document.getElementById('resultConfidenceVal');
    const confidenceBarEl = document.getElementById('resultConfidenceBar');
    const severityValEl = document.getElementById('resultSeverityVal');
    const symptomsEl = document.getElementById('resultSymptomsSummary');

    if (cropNameEl) cropNameEl.textContent = res.crop;
    if (diseaseNameEl) diseaseNameEl.textContent = res.disease;
    if (pathogenEl) pathogenEl.textContent = res.pathogen || 'Pathogen Analysis Completed';
    if (confidenceValEl) confidenceValEl.textContent = res.confidence;
    if (confidenceBarEl) confidenceBarEl.style.width = res.confidence + '%';
    if (severityValEl) {
      severityValEl.textContent = res.severity;
      severityValEl.style.color = res.severity.toLowerCase() === 'high' ? '#ef4444' : (res.severity.toLowerCase() === 'healthy' ? '#22c55e' : '#f59e0b');
    }
    if (symptomsEl) symptomsEl.textContent = res.symptomsSummary || 'Characteristic foliar lesions identified upon pattern inspection.';

    // Snapshot Card Data
    const snapRiskEl = document.getElementById('snapRiskVal');
    const snapLevelEl = document.getElementById('snapLevelVal');
    const snapOutlookEl = document.getElementById('snapOutlookVal');
    const snapWindowEl = document.getElementById('snapWindowVal');

    if (snapRiskEl) snapRiskEl.textContent = res.riskScore + '/100';
    if (snapLevelEl) {
      snapLevelEl.textContent = res.riskInfo.level;
      snapLevelEl.style.color = res.riskInfo.color;
    }
    if (snapOutlookEl) snapOutlookEl.textContent = res.treatmentInfo?.recoveryOutlook || res.riskInfo.recoveryOutlook;
    if (snapWindowEl) snapWindowEl.textContent = res.treatmentInfo?.urgency?.actionWindow || res.riskInfo.actionWindow;

    // Treatments List
    const treatmentListEl = document.getElementById('treatmentList');
    if (treatmentListEl && res.treatmentInfo?.treatments) {
      treatmentListEl.innerHTML = res.treatmentInfo.treatments.map(t => `
        <li>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <span>${t}</span>
        </li>
      `).join('');
    }

    // Prevention List
    const preventionListEl = document.getElementById('preventionList');
    if (preventionListEl && res.treatmentInfo?.prevention) {
      preventionListEl.innerHTML = res.treatmentInfo.prevention.map(p => `
        <li>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span>${p}</span>
        </li>
      `).join('');
    }

    // Urgency Card
    const urgencyBox = document.getElementById('urgencyBadgeBox');
    const urgencyLevelEl = document.getElementById('urgencyLevelText');
    const urgencyWindowEl = document.getElementById('urgencyWindowText');
    const urgencyAdviceEl = document.getElementById('urgencyAdviceText');

    const uLevel = (res.treatmentInfo?.urgency?.level || (res.riskScore > 60 ? 'HIGH' : (res.riskScore > 30 ? 'MODERATE' : 'LOW'))).toUpperCase();
    
    if (urgencyBox) {
      urgencyBox.className = `urgency-badge-box urgency-${uLevel.toLowerCase()}`;
    }
    if (urgencyLevelEl) {
      urgencyLevelEl.textContent = uLevel + ' URGENCY';
      urgencyLevelEl.style.color = uLevel === 'HIGH' ? '#ef4444' : (uLevel === 'LOW' ? '#22c55e' : '#f59e0b');
    }
    if (urgencyWindowEl) {
      urgencyWindowEl.textContent = res.treatmentInfo?.urgency?.actionWindow || res.riskInfo.actionWindow;
    }
    if (urgencyAdviceEl) {
      urgencyAdviceEl.textContent = res.treatmentInfo?.urgency?.recommendation || res.riskInfo.explanation;
    }
  }

  // =========================================================================
  // Navigation & Modals
  // =========================================================================
  function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const navLinksList = document.getElementById('navLinksList');

    if (mobileToggle && navLinksList) {
      mobileToggle.addEventListener('click', () => {
        navLinksList.classList.toggle('mobile-active');
      });
    }

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
          e.preventDefault();
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
          if (navLinksList) navLinksList.classList.remove('mobile-active');
        }
      });
    });

    // Hero buttons scroll
    document.querySelectorAll('.btn-scroll-scanner').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('scanner').scrollIntoView({ behavior: 'smooth' });
      });
    });

    document.querySelectorAll('.btn-scroll-how').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  function initModals() {
    // API Key Modal
    const btnOpenApiModal = document.getElementById('btnOpenApiModal');
    const apiModal = document.getElementById('apiSettingsModal');
    const closeApiModal = document.getElementById('btnCloseApiModal');
    const btnSaveApiKey = document.getElementById('btnSaveApiKey');
    const apiKeyInput = document.getElementById('apiKeyInput');

    if (btnOpenApiModal && apiModal) {
      btnOpenApiModal.addEventListener('click', () => {
        if (apiKeyInput) apiKeyInput.value = AIModule.getStoredApiKey() || '';
        apiModal.classList.add('active');
      });
    }

    if (closeApiModal && apiModal) {
      closeApiModal.addEventListener('click', () => apiModal.classList.remove('active'));
    }

    if (btnSaveApiKey && apiKeyInput && apiModal) {
      btnSaveApiKey.addEventListener('click', () => {
        AIModule.setStoredApiKey(apiKeyInput.value);
        apiModal.classList.remove('active');
        UploadModule.showToast('API Key settings saved!', 'success');
      });
    }

    // History Modal
    const btnOpenHistoryModal = document.getElementById('btnOpenHistoryModal');
    const historyModal = document.getElementById('historyModal');
    const closeHistoryModal = document.getElementById('btnCloseHistoryModal');
    const historyListContainer = document.getElementById('historyListContainer');

    if (btnOpenHistoryModal && historyModal) {
      btnOpenHistoryModal.addEventListener('click', () => {
        renderHistoryList(historyListContainer);
        historyModal.classList.add('active');
      });
    }

    if (closeHistoryModal && historyModal) {
      closeHistoryModal.addEventListener('click', () => historyModal.classList.remove('active'));
    }

    // Close modals on backdrop click
    [apiModal, historyModal].forEach(modal => {
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) modal.classList.remove('active');
        });
      }
    });
  }

  function renderHistoryList(container) {
    if (!container) return;
    const snapshots = JSON.parse(localStorage.getItem('cropguardian_snapshots') || '[]');

    if (snapshots.length === 0) {
      container.innerHTML = '<p class="text-muted" style="text-align: center; padding: 2rem 0;">No crop snapshots saved yet. Complete an analysis and click "Save Crop Snapshot" to review past scans.</p>';
      return;
    }

    container.innerHTML = snapshots.map(s => `
      <div class="history-item-card">
        <div class="history-item-left">
          <h5>${s.crop}: ${s.disease}</h5>
          <p class="text-muted">Recorded: ${s.date} at ${s.time || ''} • Confidence: ${s.confidence}%</p>
        </div>
        <div class="history-item-right">
          <div class="history-score-tag">${s.riskScore}/100</div>
          <span style="font-size: 0.75rem; color: #94a3b8; font-weight: 600;">Risk Score</span>
        </div>
      </div>
    `).join('');
  }

  function getFallbackTreatment(disease, severity) {
    return {
      treatments: [
        'Inspect the crop canopy for localized lesion spreading.',
        'Remove severely affected leaves to reduce spore dissemination.',
        'Follow certified agrochemical product label recommendations.',
        'Consult local agricultural university extension services if symptoms advance.'
      ],
      prevention: [
        'Avoid overhead canopy irrigation to prevent leaf moisture.',
        'Ensure adequate plant spacing to facilitate rapid drying.',
        'Practice seasonal crop rotation with non-host varieties.',
        'Maintain balanced soil nutrition according to soil tests.'
      ],
      urgency: {
        level: severity === 'High' ? 'HIGH' : (severity === 'Healthy' ? 'LOW' : 'MODERATE'),
        actionWindow: severity === 'High' ? 'Within 48 hours' : 'Within 3-5 days',
        recommendation: 'Monitor crop status and apply appropriate cultural or protective measures.'
      },
      recoveryOutlook: 'Good if monitored and addressed promptly.'
    };
  }
});
