import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateLegalSummary(text: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are a legal expert specializing in Kenyan law. Provide clear, concise summaries of legal documents and constitutional provisions."
        },
        {
          role: "user",
          content: `Please provide a clear summary of this legal text for someone without legal training: ${text}`
        }
      ],
      max_tokens: 300,
      temperature: 0.3,
    });

    return response.choices[0].message.content || "Unable to generate summary.";
  } catch (error) {
    console.error('Error generating legal summary:', error);
    throw new Error('Unable to generate summary at this time.');
  }
}

export async function analyzeLegalQuestion(question: string): Promise<{
  category: string;
  complexity: number;
  suggestedResources: string[];
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are a legal AI assistant for Kenya. Analyze legal questions and categorize them. Respond with JSON in this format: { 'category': 'constitutional|civil|criminal|family|property|business|employment|human_rights', 'complexity': 1-5, 'suggestedResources': ['resource1', 'resource2'] }"
        },
        {
          role: "user",
          content: question
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      category: result.category || 'civil',
      complexity: result.complexity || 3,
      suggestedResources: result.suggestedResources || ['Kenya Law Database', 'Constitution of Kenya 2010']
    };
  } catch (error) {
    console.error('Error analyzing legal question:', error);
    return {
      category: 'civil',
      complexity: 3,
      suggestedResources: ['Kenya Law Database', 'Constitution of Kenya 2010']
    };
  }
}

export async function generateDocumentContent(templateType: string, formData: any): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are a legal document generator for Kenya. Create properly formatted legal documents based on the template type and form data provided. Ensure compliance with Kenyan law."
        },
        {
          role: "user",
          content: `Generate a ${templateType} document using this form data: ${JSON.stringify(formData)}`
        }
      ],
      max_tokens: 2000,
      temperature: 0.1,
    });

    return response.choices[0].message.content || "Error generating document content.";
  } catch (error) {
    console.error('Error generating document content:', error);
    throw new Error('Error generating document content.');
  }
}