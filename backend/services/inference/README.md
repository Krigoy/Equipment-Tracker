The backend type inference is implemented behind an `InferenceProvider` contract.

To swap in an LLM-based classifier in the future, create a new provider that implements `inferType(name)` and update `services/typeInferenceService.js` to export that provider.


