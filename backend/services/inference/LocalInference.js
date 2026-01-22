const { InferenceProvider } = require('./InferenceProvider');

class LocalInference extends InferenceProvider {
  inferType(name) {
    if (typeof name !== 'string') {
      return { type: null, reason: 'Invalid input', confidence: 'low' };
    }

    const n = name.trim().toLowerCase();
    if (!n) {
      return { type: null, reason: 'Empty equipment name', confidence: 'low' };
    }

    // Stage 1: Explicit heuristic (runs first, returns immediately if matched)
    if (n.includes('press')) {
      return { type: 'Machine', reason: "Detected equipment term 'press'", confidence: 'medium' };
    }

    // Stage 2: Existing inference logic (unchanged)
    // Rule 1: Exact keyword matches = high confidence
    if (n.includes('machine')) {
      return { type: 'Machine', reason: 'Exact type keyword detected', confidence: 'high' };
    }
    if (n.includes('vessel')) {
      return { type: 'Vessel', reason: 'Exact type keyword detected', confidence: 'high' };
    }
    if (n.includes('tank')) {
      return { type: 'Tank', reason: 'Exact type keyword detected', confidence: 'high' };
    }
    if (n.includes('mixer')) {
      return { type: 'Mixer', reason: 'Exact type keyword detected', confidence: 'high' };
    }

    // Rule 2: Clear equipment references but no exact keywords = medium confidence
    if (n.includes('agitator') || n.includes('stirrer') || n.includes('blender')) {
      return { type: 'Mixer', reason: 'Contains mixing-related terms indicating mixing equipment', confidence: 'medium' };
    }
    if (n.includes('reactor') || n.includes('kettle') || n.includes('boiler')) {
      return { type: 'Vessel', reason: 'Contains vessel-related processing terms', confidence: 'medium' };
    }
    if (n.includes('pump') || n.includes('compressor') || n.includes('motor')) {
      return { type: 'Machine', reason: 'Contains mechanical equipment terms', confidence: 'medium' };
    }
    if (n.includes('storage') || n.includes('container') || n.includes('reservoir')) {
      return { type: 'Tank', reason: 'Contains storage-related terms indicating tank equipment', confidence: 'medium' };
    }

    // Multi-category rule: if item could belong to multiple categories, choose primary
    if (n.includes('chamber') || n.includes('autoclave')) {
      return { type: 'Vessel', reason: 'Primary classification as vessel for enclosed processing equipment', confidence: 'medium' };
    }

    // Rule 3: Generic, ambiguous, or insufficient information = low confidence
    return { type: null, reason: 'Insufficient information to infer equipment type', confidence: 'low' };
  }
}

module.exports = { LocalInference };


