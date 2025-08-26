// Client-side wrapper functions that call server-side OpenAI endpoints

export async function generateLegalSummary(text: string): Promise<string> {
  try {
    const response = await fetch('/api/ai/legal-summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.summary;
  } catch (error) {
    console.error('Error generating legal summary:', error);
    return 'Unable to generate summary at this time. Please try again later.';
  }
}

export async function analyzeLegalQuestion(question: string): Promise<{
  category: string;
  complexity: number;
  suggestedResources: string[];
}> {
  try {
    const response = await fetch('/api/ai/analyze-question', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.analysis;
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
    const response = await fetch('/api/ai/generate-document', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ templateType, formData }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('Error generating document content:', error);
    return 'Error generating document content. Please try again.';
  }
}
