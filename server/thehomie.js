Data.prototype.autoGenerateQuiz = async function (pollId, lang) {
  let poll = {};
  poll.lang = lang;
  let questionNo = 2;
  let categoryNo = 2;

  poll.isJoinable = false;
  poll.isActive = false;
  this.polls[pollId] = poll;

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const jsonStructure = Array.from({ length: categoryNo }, () => ({
    category: "",
    questions: Array.from({ length: questionNo }, () => ({
      question: "",
      answer: ""
    }))
  }));


  // Convert the JSON structure to a string
  const jsonString = JSON.stringify(jsonStructure);

  // Define the prompt with the JSON structure
  const prompt = `FIll this with categories and questions and answers related to the respective category. The answers to the questions should be short and simple to answer: ${jsonString}`;

  // Generate quiz questions and answers
  try {
    console.log("1");
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You output JSON.",
        },
        { role: "user", content: prompt },
      ],
      model: "gpt-4-1106-preview",
      response_format: { type: "json_object" },
    });
    console.log("2");

    // Extract the assistant's response from the API response
    const assistantResponse = response.choices[0].message.content;

    // Log assistantResponse to the console
    console.log('assistantResponse:', assistantResponse);

    // Parse the assistant's response as JSON
    const assistantData = JSON.parse(assistantResponse);

    // Now you can use assistantData as needed
    console.log(assistantData);

    if ('questions' in assistantData) {
      poll.questions = assistantData.questions;

      // Iterate over the outer array
      for (const innerArray of poll.questions) {
        // Iterate over the inner array
        for (const questionObject of innerArray) {
          console.log(`Question: ${questionObject.question}`);
          console.log(`Answer: ${questionObject.answer}`);
        }
      }
    }
    if ('categories' in assistantData) {
      poll.categories = assistantData.categories;
    }
  } catch (error) {
    console.error('Error: AI querying unsuccessful', error);
  }

  let participantData = {};
  participantData.cashTotal = {};
  participantData.allParticipants = [];
  participantData.turnIndex = 0;
  participantData.turn = "";
  this.participants[pollId] = participantData;

  console.log("poll created", pollId, poll);

  return this.polls[pollId];
}