/**
 * Simple utility to estimate token count from text
 * Note: This is a rough approximation. For more accurate counts, 
 * you would typically use a proper tokenizer library like GPT Tokenizer
 */

/**
 * Estimates the number of tokens in the given text
 * A very simple implementation that approximates tokens
 * In practice, most LLMs use more sophisticated tokenization
 * @param {string} text - The text to count tokens for
 * @returns {number} - Estimated token count
 */
export const estimateTokenCount = (text: string): number => {
  if (!text || text.trim() === '') return 0;
  
  // More sophisticated approximation considering:
  // - Words, punctuation, spaces
  // - Average of 4 characters per token for most models
  const charCount = text.length;
  const wordCount = text.trim().split(/\s+/).length;
  
  // Use a hybrid approach: character-based with word adjustment
  const estimatedTokens = Math.max(
    Math.ceil(charCount / 4), // Character-based estimation
    Math.ceil(wordCount * 1.3) // Word-based with multiplier for sub-word tokens
  );
  
  return estimatedTokens;
};

/**
 * Calculate the estimated cost for a given text and model pricing
 * @param {string} text - The input text
 * @param {number} inputPricePerK - Price per 1K input tokens
 * @param {number} outputPricePerK - Price per 1K output tokens (optional)
 * @returns {object} - Cost breakdown
 */
export const calculateTokenCost = (
  text: string, 
  inputPricePerK: number, 
  outputPricePerK?: number
) => {
  const tokenCount = estimateTokenCount(text);
  const inputCost = (tokenCount / 1000) * inputPricePerK;
  
  return {
    tokenCount,
    inputCost,
    outputCost: outputPricePerK ? (tokenCount / 1000) * outputPricePerK : 0,
    totalCost: inputCost + (outputPricePerK ? (tokenCount / 1000) * outputPricePerK : 0)
  };
};
