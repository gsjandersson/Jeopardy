Data.prototype.autoGenerateQuiz = async function (pollId, lang, numberOfQuestions, numberOfCategories, topic) { 
    let poll = {};
    poll.lang = lang;

    let numberOfCategories = 5;
    let numberOfQuestions = 5;
  
    poll.questions = Array.from({ length: numberOfQuestions }, () => Array.from({ length: numberOfCategories }, () => ({
      question: '',
      answer: '',
      completed: false,
      numberAnswers: 0
    })));
  
    poll.categories = Array.from({ length: numberOfCategories }, () => "");
    poll.isJoinable = false;
    poll.isActive = false;
    this.polls[pollId] = poll;
  
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  
    // Define the JSON structure''
  
    const jsonStructure = {
        "questions": [],
        "categories": []
      };
      
      for (let i = 0; i < numberOfCategories; i++) {
        jsonStructure.categories.push("");
        const questionArray = [];
        for (let j = 0; j < numberOfQuestions; j++) {
          questionArray.push({ "question": "", "answer": "" });
        }
        jsonStructure.questions.push(questionArray);
      }
  
    // Convert the JSON structure to a string
    const jsonString = JSON.stringify(jsonStructure);
  
    // Define the prompt with the JSON structure
    const prompt = `Fill this with questions, answers and categories: ${jsonString}`;
  
    // Generate quiz questions and answers
    try {
      console.log("1");
      const response = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant designed to output JSON.  The answers to the questions should be short and simple to answer",
          },
          { role: "user", content: prompt },
        ],
        model: "gpt-3.5-turbo-1106",
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