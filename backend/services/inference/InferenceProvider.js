/**
 * InferenceProvider contract
 *
 * Implementations must provide:
 *   inferType(name: string) => {
 *     type: 'Machine' | 'Vessel' | 'Tank' | 'Mixer' | null,
 *     confidence: 'high' | 'medium' | 'low',
 *     reason: string
 *   }
 */

class InferenceProvider {
  // eslint-disable-next-line no-unused-vars
  inferType(name) {
    throw new Error('inferType(name) not implemented');
  }
}

module.exports = { InferenceProvider };


