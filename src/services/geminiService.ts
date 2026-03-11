import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface Idea {
  title: string;
  summary: string;
}

export const CRIME_TEMPLATES = {
  ar: {
    unsolved: 'ألغاز لم تُحل',
    historical: 'قضايا تاريخية',
    serialKiller: 'سفاحون متسلسلون',
  },
  en: {
    unsolved: 'Unsolved Mysteries',
    historical: 'Historical Cases',
    serialKiller: 'Serial Killer Profiles',
  }
};

export async function generateIdeas(topic?: string, lang: 'ar' | 'en' = 'ar', template?: string): Promise<Idea[]> {
  const templateDescAr = template ? ` (نوع القصة: ${CRIME_TEMPLATES.ar[template as keyof typeof CRIME_TEMPLATES.ar]})` : '';
  const templateDescEn = template ? ` (Story type: ${CRIME_TEMPLATES.en[template as keyof typeof CRIME_TEMPLATES.en]})` : '';

  const promptAr = topic
    ? `اقترح 3 أفكار لقصص جرائم حقيقية (True Crime) لقناة يوتيوب حول موضوع: "${topic}"${templateDescAr}.`
    : `اقترح 3 أفكار لقصص جرائم حقيقية (True Crime) غامضة ومثيرة لقناة يوتيوب${templateDescAr}.`;

  const promptEn = topic
    ? `Suggest 3 true crime story ideas for a YouTube channel about: "${topic}"${templateDescEn}.`
    : `Suggest 3 mysterious and exciting true crime story ideas for a YouTube channel${templateDescEn}.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: lang === 'ar' ? promptAr : promptEn,
    config: {
      systemInstruction: lang === 'ar' 
        ? "أنت خبير في إنشاء محتوى يوتيوب لقصص الجرائم الحقيقية. قدم الأفكار باللغة العربية."
        : "You are an expert in creating true crime YouTube content. Provide ideas in English.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: lang === 'ar' ? "عنوان جذاب للفيديو" : "Catchy video title",
            },
            summary: {
              type: Type.STRING,
              description: lang === 'ar' ? "ملخص القصة في سطرين أو ثلاثة" : "2-3 sentences story summary",
            },
          },
          required: ["title", "summary"],
        },
      },
    },
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse ideas", e);
    return [];
  }
}

export async function generateScript(ideaTitle: string, ideaSummary: string, lang: 'ar' | 'en' = 'ar'): Promise<string> {
  const promptAr = `أنت مساعد محترف لكتابة سيناريوهات محتوى قصص الجرائم.
اكتب سيناريو فيديو يوتيوب طويل جداً ومفصل لقصة جريمة حقيقية بناءً على الفكرة التالية:
العنوان: ${ideaTitle}
الملخص: ${ideaSummary}

يجب أن يتضمن السيناريو وتلتزم بالآتي:
1. الطول والتفاصيل: يجب أن يكون الاسكريبت طويلاً جداً (يكفي لفيديو مدته 10-15 دقيقة). استخدم أسلوب "السيناريو التشريحي" (Surgical/Anatomical Scenario) حيث تقوم بتشريح الجريمة، مسرح الحادث، الأدلة، ونفسية المجرم والضحية بتفصيل دقيق جداً وعميق.
2. الغموض والفضول: ابنِ القصة بحيث تزرع الفضول في كل دقيقة. استخدم نهايات مفتوحة للفقرات (Cliffhangers) لتجبر المشاهد على الاستمرار في المشاهدة. لا تكشف القاتل أو الحل إلا في النهاية.
3. التعليق الصوتي (Voiceover): مكتوب بالعامية المصرية البسيطة والمشوقة (أسلوب حكاوي الجرائم).
4. جاهز للتسجيل: مقسم إلى جمل قصيرة مع تحديد أماكن السكتات بوضوح (مثل: ... أو [سكتة قصيرة] أو [سكتة درامية طويلة]) ليتمكن المعلق من أخذ نفسه وضبط الإيقاع.
5. توجيهات المونتاج: توضع بين قوسين (مثل: [لقطة مقربة على مسرح الجريمة]، [صوت دقات قلب]، [موسيقى تشويق تتصاعد]).
6. الهيكل:
   - مقدمة خطافية (Hook) مرعبة أو غامضة جداً.
   - استعراض الضحية والمكان.
   - يوم الحادث بالتفصيل الممل (السيناريو التشريحي).
   - التحقيقات والشكوك (Red Herrings).
   - الاكتشاف الصادم (Plot Twist).
   - الخاتمة والدروس المستفادة مع طلب الاشتراك.

تذكر: اجعل أسلوب السرد يشبه قنوات الجرائم المصرية المشهورة، وركز على نبرة الصوت والوقفات الدرامية، واجعله مليئاً بالتشويق والغموض.`;

  const promptEn = `You are a professional true crime scriptwriter.
Write a very long, detailed, and anatomical YouTube video script for a true crime story based on:
Title: ${ideaTitle}
Summary: ${ideaSummary}

Requirements:
1. Length & Detail: Very long (10-15 minutes video). Use an "Anatomical Scenario" style, dissecting the crime, scene, evidence, and psychology in deep detail.
2. Mystery & Curiosity: Build the story to plant curiosity every minute. Use cliffhangers. Do not reveal the killer until the end.
3. Voiceover: Written in engaging, conversational English (true crime storytelling style).
4. Ready to Record: Divided into short sentences with clear pause markers (e.g., ... or [short pause] or [dramatic pause]) for the voice actor.
5. Editing Cues: Placed in brackets (e.g., [close-up on crime scene], [heartbeat sound], [suspense music rising]).
6. Structure: Hook, Victim/Scene intro, The Day of the Crime (detailed), Investigations & Red Herrings, Plot Twist, Conclusion & Subscribe CTA.`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: lang === 'ar' ? promptAr : promptEn,
    config: {
      systemInstruction: lang === 'ar' 
        ? "أنت كاتب سيناريو محترف لقنوات الجرائم الحقيقية على يوتيوب."
        : "You are a professional scriptwriter for true crime YouTube channels.",
    },
  });

  return response.text || "";
}

export async function generateThumbnail(ideaTitle: string, ideaSummary: string): Promise<string | null> {
  const promptResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Write a highly detailed image generation prompt in English for a YouTube thumbnail about a true crime story.
Title: ${ideaTitle}
Summary: ${ideaSummary}
The prompt should describe a dark, mysterious, and cinematic scene suitable for a true crime thumbnail. No text in the image.`,
  });

  const imagePrompt = promptResponse.text || "A dark and mysterious true crime scene, cinematic lighting, highly detailed.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: {
        parts: [
          {
            text: imagePrompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: "1K"
        }
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (e) {
    console.error("Failed to generate thumbnail", e);
  }
  return null;
}

export async function generateEditingAssets(script: string, lang: 'ar' | 'en' = 'ar'): Promise<string> {
  const promptAr = `أنت منظم محترف لملحقات المونتاج لفيديوهات قصص الجرائم.
بناءً على السيناريو التالي، اقترح قائمة بملحقات المونتاج (Editing Assets) المطلوبة للفيديو بناءً على الحالة المزاجية المطلوبة (مثل موسيقى تشويق، مؤثرات صوتية مخيفة، انتقالات درامية).

يجب أن تتضمن القائمة:
1. المؤثرات الصوتية (Sound Effects)
2. الموسيقى الخلفية (Background Music)
3. اللقطات المساعدة (B-roll footage)
4. الانتقالات والمؤثرات البصرية (Transitions & VFX)

لكل عنصر، قدم وصفاً دقيقاً لكيفية العثور عليه أو كلمات بحث مقترحة (Search terms) باللغة الإنجليزية للبحث عنها في مواقع مثل Epidemic Sound أو Envato Elements أو YouTube Audio Library.

السيناريو:
${script.substring(0, 2000)}...

قدم الاقتراحات باللغة العربية بشكل منظم ومفصل.`;

  const promptEn = `You are a professional video editing asset organizer for true crime videos.
Based on the following script, suggest a list of editing assets needed for the video based on the required mood.

Include:
1. Sound Effects
2. Background Music
3. B-roll footage
4. Transitions & VFX

For each item, provide a detailed description and English search terms for sites like Epidemic Sound or Envato Elements.
Provide the suggestions in English in a detailed and organized manner.

Script:
${script.substring(0, 2000)}...`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: lang === 'ar' ? promptAr : promptEn,
  });

  return response.text || "";
}

export async function generateSEO(script: string, lang: 'ar' | 'en' = 'ar'): Promise<{ title: string; description: string; tags: string[]; hashtags: string[] }> {
  const promptAr = `أنت خبير SEO ومولد أوصاف فيديوهات يوتيوب مخصص لقصص الجرائم.
بناءً على السيناريو التالي، قم بإنشاء بيانات الـ SEO لفيديو يوتيوب:
1. عنوان جذاب جداً (Clickbait but true).
2. وصف الفيديو (Description) جذاب يتضمن:
   - مقدمة مشوقة.
   - تفاصيل موجزة عن القصة.
   - دعوة للمشاهدة (Call to Action).
3. قائمة بـ 10 إلى 15 كلمة مفتاحية (Tags) ذات صلة لتعزيز SEO.
4. قائمة بـ 5 إلى 10 هاشتاجات (Hashtags).

السيناريو:
${script.substring(0, 2000)}...`;

  const promptEn = `You are an SEO expert and YouTube video description generator for true crime.
Based on the following script, generate YouTube SEO data in English:
1. A highly catchy title (Clickbait but true).
2. An engaging video description including: a suspenseful intro, brief story details, and a Call to Action.
3. A list of 10-15 relevant tags for SEO.
4. A list of 5-10 hashtags.

Script:
${script.substring(0, 2000)}...`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: lang === 'ar' ? promptAr : promptEn,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["title", "description", "tags", "hashtags"],
      },
    },
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse SEO", e);
    return { title: "", description: "", tags: [], hashtags: [] };
  }
}

export async function generateCompetitorAnalysis(ideaTitle: string, ideaSummary: string, lang: 'ar' | 'en' = 'ar'): Promise<{ text: string, links: { uri: string, title: string }[] }> {
  const promptAr = `أنت خبير في تحليل محتوى يوتيوب واستراتيجيات قنوات الجرائم.
ابحث في جوجل ويوتيوب عن فيديوهات تتحدث عن قصة الجريمة التالية:
العنوان: ${ideaTitle}
الملخص: ${ideaSummary}

قدم تقريراً مفصلاً باللغة العربية يتضمن:
1. الفيديوهات المنافسة: أشهر الفيديوهات التي تناولت هذه القصة على يوتيوب (مع ذكر أسماء القنوات وإحصائيات تقريبية للمشاهدات إن أمكن).
2. إحصائيات المنافسين: تحليل لنقاط قوة وضعف المحتوى المنافس.
3. فكرة المحتوى الخاص بنا: إحصائيات وفرص نجاح فكرتنا، وكيف يمكننا التميز عنهم (الزاوية المفقودة التي يجب أن نركز عليها في الفيديو الخاص بنا).

اكتب التقرير بتنسيق Markdown منظم وجذاب.`;

  const promptEn = `You are an expert in YouTube content analysis and true crime channel strategies.
Search Google and YouTube for videos discussing the following crime story:
Title: ${ideaTitle}
Summary: ${ideaSummary}

Provide a detailed report in English including:
1. Competitor Videos: Popular videos covering this story (with channel names and approximate views if possible).
2. Competitor Stats: Analysis of strengths and weaknesses of competitor content.
3. Our Content Idea: Stats and success opportunities for our idea, and how we can stand out (the missing angle we should focus on).

Write the report in an organized and engaging Markdown format.`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: lang === 'ar' ? promptAr : promptEn,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const text = response.text || "";
  const links: { uri: string, title: string }[] = [];
  
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (chunks) {
    for (const chunk of chunks) {
      if (chunk.web?.uri && chunk.web?.title) {
        links.push({ uri: chunk.web.uri, title: chunk.web.title });
      }
    }
  }

  return { text, links };
}
