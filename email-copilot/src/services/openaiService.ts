import OpenAI from 'openai';

export interface LLMConfig {
  apiKey: string;
  model: string;
  temperature: number;
}

export class OpenAIService {
  private openai: OpenAI | null = null;
  private config: LLMConfig | null = null;

  configure(config: LLMConfig) {
    this.config = config;
    this.openai = new OpenAI({
      apiKey: config.apiKey,
      dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
    });
  }

  async generateResponse(userMessage: string, emailContent?: string): Promise<string> {
    if (!this.openai || !this.config) {
      throw new Error('OpenAI service not configured. Please set your API key in settings.');
    }

    let systemPrompt = `You are an AI email assistant. Help the user with email-related tasks like drafting replies, summarizing emails, and providing suggestions. Be professional, concise, and helpful.`;

    let userPrompt = userMessage;

    // Add email context if provided
    if (emailContent) {
      systemPrompt += `\n\nHere's the email you're helping with:\n\n${emailContent}`;
    }

    // Customize prompts based on the user's request
    if (userMessage.toLowerCase().includes('summarize')) {
      systemPrompt += `\n\nProvide a clear, structured summary with bullet points highlighting key information, action items, and important details.`;
    } else if (userMessage.toLowerCase().includes('draft') || userMessage.toLowerCase().includes('reply')) {
      systemPrompt += `\n\nDraft a professional email response that addresses the key points. Use appropriate tone and formatting.`;
    }

    try {
      const completion = await this.openai.chat.completions.create({
        model: this.config.model,
        temperature: this.config.temperature,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        stream: false
      });

      return completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    } catch (error: any) {
      console.error('OpenAI API Error:', error);

      if (error.code === 'invalid_api_key') {
        throw new Error('Invalid API key. Please check your OpenAI API key in settings.');
      } else if (error.code === 'insufficient_quota') {
        throw new Error('Insufficient OpenAI credits. Please check your OpenAI account.');
      } else if (error.code === 'rate_limit_exceeded') {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      } else {
        throw new Error(`Error generating response: ${error.message || 'Unknown error'}`);
      }
    }
  }

  async generateStreamingResponse(
    userMessage: string,
    emailContent?: string,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    if (!this.openai || !this.config) {
      throw new Error('OpenAI service not configured. Please set your API key in settings.');
    }

    let systemPrompt = `You are an AI email assistant. Help the user with email-related tasks like drafting replies, summarizing emails, and providing suggestions. Be professional, concise, and helpful.`;

    let userPrompt = userMessage;

    // Add email context if provided
    if (emailContent) {
      systemPrompt += `\n\nHere's the email you're helping with:\n\n${emailContent}`;
    }

    // Customize prompts based on the user's request
    if (userMessage.toLowerCase().includes('summarize')) {
      systemPrompt += `\n\nProvide a clear, structured summary with bullet points highlighting key information, action items, and important details.`;
    } else if (userMessage.toLowerCase().includes('draft') || userMessage.toLowerCase().includes('reply')) {
      systemPrompt += `\n\nDraft a professional email response that addresses the key points. Use appropriate tone and formatting.`;
    }

    try {
      const stream = await this.openai.chat.completions.create({
        model: this.config.model,
        temperature: this.config.temperature,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        stream: true
      });

      let fullResponse = '';

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          fullResponse += content;
          onChunk?.(content);
        }
      }

      return fullResponse;
    } catch (error: any) {
      console.error('OpenAI Streaming API Error:', error);

      if (error.code === 'invalid_api_key') {
        throw new Error('Invalid API key. Please check your OpenAI API key in settings.');
      } else if (error.code === 'insufficient_quota') {
        throw new Error('Insufficient OpenAI credits. Please check your OpenAI account.');
      } else if (error.code === 'rate_limit_exceeded') {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      } else {
        throw new Error(`Error generating response: ${error.message || 'Unknown error'}`);
      }
    }
  }

  isConfigured(): boolean {
    return this.openai !== null && this.config !== null;
  }
}

// Create a singleton instance
export const openaiService = new OpenAIService();