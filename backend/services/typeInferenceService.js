const { LocalInference } = require('./inference/LocalInference');

/**
 * Single swap point for inference implementation.
 * Controllers/routes depend only on the provider contract shape (inferType).
 */
function getInferenceProvider() {
  return new LocalInference();
}

module.exports = { getInferenceProvider };


