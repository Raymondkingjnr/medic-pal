import OpenAi from "openai";

const openai = new OpenAi({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const { query } = await request.json();

  if (!query) {
    return Response.json({ error: "query not found" }, { status: 404 });
  }

  const prompt = `
     You are a licensed medical doctor. Your role is to provide medical assistance based on the user's query: ${query}

     Analyze the user's symptoms or question and give a clear, medically-informed explanation.
     If appropriate, recommend safe, over-the-counter medications or prescription drugs (mention if a doctor's visit is necessary for a prescription).
     If self-care or home remedies are suitable, clearly recommend them with dosage/frequency (if applicable).
     if the symptoms suggest something serious, advise immediate consultation with a medical professional or emergency care.
     Always prioritize clarity, safety, and medical accuracy.

      use markdown formatting.

     use the following formart:

      ###Analyzing the symptoms.

      ###Recommending appropriate medications 

      ###Recommending self-care treatments

      keep spacing between the heading and content
     
     Always use headings and subheadings  
    `;

  try {
    const res = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1-0528:free",
      messages: [{ role: "user", content: prompt }],
    });

    console.log(res);

    return Response.json({ message: res.choices[0].message.content });
  } catch (error) {
    console.error("Error fetching AI guidance", error);
    return Response.json(
      { error: "Error fetching AI guidance" },
      { status: 500 }
    );
  }
}
