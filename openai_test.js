const { create, Configuration, Completion } = require('openai');
const fs = require('fs');
const apiKey = process.env.API_KEY;

// Set your OpenAI API key
const configuration = new Configuration({
  apiKey: apiKey,
});

// Initialize the OpenAI client
const openai = create(configuration);

// Define a prompt for generating quiz questions and answers
const prompt = "Generate a quiz on the topic of...";

// Generate quiz questions and answers
openai.completions.create(
  {
    engine: 'text-davinci-003',  // Use the appropriate engine
    prompt: prompt,
    max_tokens: 800,  // Adjust as needed based on expected length of questions and answers
  },
  (error, response) => {
    if (error) throw error;

    // Extract and print the generated content
    const generatedContent = response.choices[0].text;
    console.log(generatedContent);

    // Save the generated content to a JSON file
    fs.writeFileSync('quiz.json', JSON.stringify({ content: generatedContent }, null, 2));
  }
);
