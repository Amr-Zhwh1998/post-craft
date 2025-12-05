"use client";

import { useState } from "react";

interface MarketingForm {
  businessName: string;
  niche: string;
  goals: string;
  contentIdeas: string;
}

interface DailyPost {
  day: string;
  time: string;
  content: string;
  groups: string[];
}

export default function FacebookMarketing() {
  const [form, setForm] = useState<MarketingForm>({
    businessName: "",
    niche: "",
    goals: "",
    contentIdeas: "",
  });

  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<DailyPost[] | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPlan(null);

    try {
      const prompt = `
אתה עוזר שיווקי חכם. צור תוכנית שבועית עבור עסק בשם "${form.businessName}" בתחום "${form.niche}".
המטרות הן: "${form.goals}".
רעיונות תוכן ראשוניים: "${form.contentIdeas}".
ספק ימים, שעות, פוסטים עם #Hashtags, וקבוצות פייסבוק מומלצות.
**חייב להחזיר JSON תקין בלבד**:
[
  {
    "day": "יום ראשון",
    "time": "10:00",
    "content": "פוסט לדוגמה #Hashtag",
    "groups": ["קבוצה א", "קבוצה ב"]
  }
]
`;

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 1000,
        }),
      });

      const data = await response.json();
      const aiText: string = data.choices?.[0]?.message?.content || "[]";

      // ניסיון מתקדם לפענח JSON גם אם יש Markdown או טקסט מסביב
      const jsonMatch = aiText.match(/\[.*\]/s);
      let parsedPlan: DailyPost[] = [];
      if (jsonMatch) {
        try {
          parsedPlan = JSON.parse(jsonMatch[0]);
        } catch {
          parsedPlan = [{ day: "שגיאה", time: "", content: "לא ניתן לקרוא את הנתונים", groups: [] }];
        }
      } else {
        parsedPlan = [{ day: "שגיאה", time: "", content: "לא התקבלה תוכנית תקינה מה-AI", groups: [] }];
      }

      setPlan(parsedPlan);
    } catch (error: any) {
      setPlan([{ day: "שגיאה", time: "", content: "אירעה שגיאה ביצירת התוכנית: " + error.message, groups: [] }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Facebook Marketing Plan</h1>

      {!plan ? (
        <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white dark:bg-gray-800 p-6 rounded shadow space-y-4">
          <input
            type="text"
            name="businessName"
            placeholder="שם העסק"
            value={form.businessName}
            onChange={handleChange}
            className="w-full p-3 border rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            required
          />
          <input
            type="text"
            name="niche"
            placeholder="תחום/נישה"
            value={form.niche}
            onChange={handleChange}
            className="w-full p-3 border rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            required
          />
          <textarea
            name="goals"
            placeholder="מטרות השיווק"
            value={form.goals}
            onChange={handleChange}
            className="w-full p-3 border rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            required
          />
          <textarea
            name="contentIdeas"
            placeholder="רעיונות תוכן ראשוניים"
            value={form.contentIdeas}
            onChange={handleChange}
            className="w-full p-3 border rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded font-semibold"
          >
            {loading ? "יוצר תוכנית..." : "צור תוכנית"}
          </button>
        </form>
      ) : (
        <div className="w-full max-w-4xl space-y-4">
          <h2 className="text-xl font-bold mb-4">תוכנית שבועית:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plan.map((post, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded shadow">
                <h3 className="font-bold text-lg mb-2">{post.day} - {post.time}</h3>
                <p className="mb-2">{post.content}</p>
                {post.groups.length > 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    קבוצות לפרסום: {post.groups.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={() => setPlan(null)}
            className="mt-6 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            חזור לטופס
          </button>
        </div>
      )}
    </div>
  );
}
