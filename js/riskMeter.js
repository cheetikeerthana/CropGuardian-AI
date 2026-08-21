/**
 * CropGuardian AI - Crop Risk Meter Module (WOW Feature)
 * Calculates indicative decision-support risk scores (0-100) combining
 * detection confidence and estimated disease severity.
 * Renders smooth animated semicircular SVG gauge.
 */

const RiskMeterModule = (function() {
  /**
   * Transparent prototype formula combining severity and confidence
   * @param {number} confidence - 0 to 100
   * @param {string} severity - "High" | "Medium" | "Low" | "Healthy"
   * @returns {number} 0-100 Risk Score
   */
  function calculateRiskScore(confidence, severity) {
    const sev = (severity || '').toLowerCase();
    let baseSeverityScore = 50;

    if (sev === 'healthy') {
      baseSeverityScore = 8;
    } else if (sev === 'low') {
      baseSeverityScore = 28;
    } else if (sev === 'medium') {
      baseSeverityScore = 54;
    } else if (sev === 'high') {
      baseSeverityScore = 82;
    }

    const confFactor = Math.min(100, Math.max(50, confidence || 90)) / 100;
    
    // Weighted formula: 70% baseline severity + 30% confidence modulation
    let score = Math.round((baseSeverityScore * 0.7) + (baseSeverityScore * 0.3 * confFactor));

    if (sev === 'healthy') {
      score = Math.min(15, Math.max(5, score));
    } else if (sev === 'high' && confidence >= 90) {
      score = Math.max(75, Math.min(96, score));
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Retrieves risk classification details
   * @param {number} score 
   * @returns {Object}
   */
  function getRiskLevel(score) {
    if (score <= 30) {
      return {
        level: 'Healthy',
        badgeClass: 'status-healthy',
        label: 'Healthy / Low Risk',
        color: '#22c55e',
        explanation: 'Foliage demonstrates healthy chlorophyll pigmentation with minimal or negligible disease risk.',
        actionWindow: 'Routine Schedule',
        recoveryOutlook: 'Optimal (No active disease threat)'
      };
    } else if (score <= 60) {
      return {
        level: 'Monitor',
        badgeClass: 'status-monitor',
        label: 'Moderate Risk (Monitor)',
        color: '#f59e0b',
        explanation: 'Localized symptoms identified. Regular scouting and preventive cultural practices are advised.',
        actionWindow: 'Within 3 to 5 days',
        recoveryOutlook: 'Good if monitored and managed before canopy spread'
      };
    } else {
      return {
        level: 'Immediate Action',
        badgeClass: 'status-action',
        label: 'High Risk (Immediate Action)',
        color: '#ef4444',
        explanation: 'High confidence combined with higher disease severity indicates the crop should be inspected and addressed promptly.',
        actionWindow: 'Within 24-48 hours',
        recoveryOutlook: 'Prompt agronomic intervention needed to protect yield'
      };
    }
  }

  /**
   * Animates the semicircular gauge needle and arc
   * @param {number} targetScore - 0 to 100
   */
  function animateGauge(targetScore) {
    const fillArc = document.getElementById('gaugeFillArc');
    const needle = document.getElementById('gaugeNeedle');
    const scoreNum = document.getElementById('gaugeScoreNum');
    const statusBadge = document.getElementById('riskStatusBadge');
    const explanationText = document.getElementById('riskExplanationText');

    const riskInfo = getRiskLevel(targetScore);

    if (statusBadge) {
      statusBadge.className = 'risk-status-badge ' + riskInfo.badgeClass;
      statusBadge.textContent = riskInfo.label;
    }

    if (explanationText) {
      explanationText.textContent = riskInfo.explanation;
    }

    // Semicircle arc radius is 90, total half-circle circumference is Pi * 90 ˜ 282.74
    const totalCircumference = Math.PI * 90;
    
    if (fillArc) {
      fillArc.style.strokeDasharray = totalCircumference;
      // 0 score => offset 283 (empty), 100 score => offset 0 (full)
      const targetOffset = totalCircumference - (totalCircumference * (targetScore / 100));
      fillArc.style.strokeDashoffset = targetOffset;
      fillArc.style.stroke = riskInfo.color;
    }

    // Needle rotation: 0 score = -90deg (pointing left), 100 score = +90deg (pointing right)
    const targetAngle = -90 + (targetScore / 100) * 180;
    if (needle) {
      needle.style.transform = `rotate(${targetAngle}deg)`;
    }

    // Number roll-up counter animation
    if (scoreNum) {
      let currentVal = 0;
      const duration = 1400;
      const startTime = performance.now();

      function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutQuad easing
        const ease = 1 - (1 - progress) * (1 - progress);
        currentVal = Math.round(ease * targetScore);
        scoreNum.textContent = currentVal;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          scoreNum.textContent = targetScore;
        }
      }
      requestAnimationFrame(step);
    }
  }

  return {
    calculateRiskScore,
    getRiskLevel,
    animateGauge
  };
})();
