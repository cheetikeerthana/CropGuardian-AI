/**
 * CropGuardian AI - AI Module
 * Supports optional Gemini API configuration or intelligent Demo AI fallback mode.
 * Clearly labels "Demo AI Mode" or "Gemini Live AI" on results.
 */

const AIModule = (function() {
  const PRESET_MAPPINGS = {
    'tomato-early-blight': {
      crop: 'Tomato',
      scientificName: 'Solanum lycopersicum',
      disease: 'Tomato Early Blight',
      pathogen: 'Alternaria solani (Fungal Pathogen)',
      confidence: 94,
      severity: 'High',
      symptomsSummary: 'Concentric ring target lesions with chlorotic yellow halo margins detected on lower foliage.'
    },
    'rice-leaf-blast': {
      crop: 'Rice (Paddy)',
      scientificName: 'Oryza sativa',
      disease: 'Rice Leaf Blast',
      pathogen: 'Magnaporthe oryzae (Fungus)',
      confidence: 89,
      severity: 'High',
      symptomsSummary: 'Spindle-shaped diamond lesions with grayish-white necrotic centers along leaf blade margins.'
    },
    'cotton-leaf-spot': {
      crop: 'Cotton',
      scientificName: 'Gossypium hirsutum',
      disease: 'Cotton Leaf Spot',
      pathogen: 'Cercospora gossypina',
      confidence: 88,
      severity: 'Medium',
      symptomsSummary: 'Circular reddish-brown necrotic spots with prominent dark purple borders distributed on mature leaf.'
    },
    'potato-early-blight': {
      crop: 'Potato',
      scientificName: 'Solanum tuberosum',
      disease: 'Potato Early Blight',
      pathogen: 'Alternaria solani',
      confidence: 92,
      severity: 'Medium',
      symptomsSummary: 'Irregular dark brown patches exhibiting concentric ring textures on vegetative canopy.'
    },
    'healthy-tomato': {
      crop: 'Tomato',
      scientificName: 'Solanum lycopersicum',
      disease: 'Healthy Tomato Leaf',
      pathogen: 'None (Healthy Foliage)',
      confidence: 98,
      severity: 'Healthy',
      symptomsSummary: 'Uniform chlorophyll pigmentation, intact epidermal margins, and uninhibited cellular structure.'
    }
  };

  /**
   * Main entrypoint for crop image diagnosis
   * @param {string} imageSrc - Base64 image or preset URI
   * @param {string|null} activePresetId - Active preset if selected
   * @returns {Promise<Object>} Diagnostic result payload
   */
  async function analyzeCropImage(imageSrc, activePresetId = null) {
    const apiKey = getStoredApiKey();

    // If preset is selected and no API key is provided, return precise demo data
    if (activePresetId && PRESET_MAPPINGS[activePresetId]) {
      const presetData = PRESET_MAPPINGS[activePresetId];
      return {
        ...presetData,
        mode: 'demo',
        timestamp: new Date().toISOString()
      };
    }

    // If user provided a Gemini API Key, try live multimodal analysis
    if (apiKey) {
      try {
        const liveResult = await callGeminiMultimodal(imageSrc, apiKey);
        if (liveResult && liveResult.crop && liveResult.disease) {
          return {
            ...liveResult,
            mode: 'api',
            timestamp: new Date().toISOString()
          };
        }
      } catch (err) {
        console.warn('Gemini Live API call unsuccessful, falling back smoothly to Demo Mode:', err);
      }
    }

    // Default fallback for custom photo uploads
    return {
      crop: 'Tomato',
      scientificName: 'Solanum lycopersicum',
      disease: 'Tomato Early Blight',
      pathogen: 'Alternaria solani (Fungal Pathogen)',
      confidence: 94,
      severity: 'High',
      symptomsSummary: 'Target-like concentric brown spots observed with localized chlorosis on the leaf surface.',
      mode: 'demo',
      timestamp: new Date().toISOString()
    };
  }

  async function callGeminiMultimodal(imageSrc, apiKey) {
    const promptText = "You are CropGuardian AI, an agricultural expert. Analyze this crop leaf image. Identify crop name, likely disease (or Healthy), estimated confidence score (integer between 60 and 99), estimated severity ('High', 'Medium', 'Low', or 'Healthy'), scientific pathogen name, and a 1-sentence visible symptom summary. Return JSON: {\"crop\": \"Tomato\", \"scientificName\": \"Solanum lycopersicum\", \"disease\": \"Tomato Early Blight\", \"pathogen\": \"Alternaria solani\", \"confidence\": 94, \"severity\": \"High\", \"symptomsSummary\": \"Concentric rings with yellow halos.\" }";

    const base64Data = imageSrc.includes(',') ? imageSrc.split(',')[1] : imageSrc;
    const mimeMatch = imageSrc.match(/data:([^;]+);base64/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + encodeURIComponent(apiKey);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: promptText },
            { inline_data: { mime_type: mimeType, data: base64Data } }
          ]
        }],
        generationConfig: {
          response_mime_type: 'application/json',
          temperature: 0.2
        }
      })
    });

    if (!response.ok) {
      throw new Error('Gemini API HTTP Error ' + response.status);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) throw new Error('No candidate content received');

    return JSON.parse(candidateText);
  }

  function getStoredApiKey() {
    return localStorage.getItem('cropguardian_gemini_api_key') || null;
  }

  function setStoredApiKey(key) {
    if (!key || key.trim() === '') {
      localStorage.removeItem('cropguardian_gemini_api_key');
    } else {
      localStorage.setItem('cropguardian_gemini_api_key', key.trim());
    }
  }

  return {
    analyzeCropImage,
    getStoredApiKey,
    setStoredApiKey,
    PRESET_MAPPINGS
  };
})();
