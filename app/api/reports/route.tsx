// app/api/report/route.ts
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import OpenAI from "openai";
import { db } from '../../../config/db'; // เปลี่ยนให้ตรงกับ path ที่คุณ export Drizzle db instance
import { travelReports } from '../../../config/schema'; // เปลี่ยนให้ตรงกับ path schema ของคุณ

// ตั้งค่า OpenAI client เพื่อชี้ไปที่ OpenRouter
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY, // ใส่ KEY ของ OpenRouter ใน .env
});

export async function POST(req: Request) {
  try {
    // 1. ตรวจสอบ User จาก Clerk
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // ดึงอีเมลของ User
    const email = user.emailAddresses[0]?.emailAddress;

    // 2. รับข้อมูลจาก Frontend
    const body = await req.json();
    const { messages, sessionId } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "ไม่พบบทสนทนา" }, { status: 400 });
    }

    // 3. เตรียม Prompt สั่งให้ OpenRouter สรุปเส้นทาง
    // รวมบทสนทนาเป็น Text เพื่อประหยัด Token และให้ AI เข้าใจง่าย
    const conversationText = messages
      .map((m: any) => `${m.role === "user" ? "ลูกค้า" : "AI"}: ${m.text}`)
      .join("\n");

    const prompt = `
      คุณเป็นผู้เชี่ยวชาญด้านการเดินทาง โปรดอ่านบทสนทนาต่อไปนี้ระหว่างลูกค้ากับ AI แนะนำเส้นทาง:
      
      ${conversationText}
      
      หน้าที่ของคุณ: 
      สรุป "วิธีการเดินทางจากจุดเริ่มต้นไปยังจุดหมายปลายทาง" ออกมาเป็นข้อๆ หรือย่อหน้าที่อ่านเข้าใจง่าย สั้นกระชับ และใช้งานได้จริง (ไม่ต้องเกริ่นนำใดๆ ให้สรุปมาเลย)
    `;

    // 4. เรียกใช้ OpenRouter AI
    const completion = await openai.chat.completions.create({
      // เลือก Model ของ OpenRouter ที่ต้องการ เช่น anthropic/claude-3-haiku, google/gemini-flash-1.5, หรือ model ฟรี
      model: "nvidia/nemotron-3-nano-30b-a3b:free", 
      messages: [{ role: "user", content: prompt }],
    });

    const generatedReport = completion.choices[0]?.message?.content || "ไม่สามารถสรุปเส้นทางได้";

    // 5. บันทึกข้อมูลลง Neon Database ด้วย Drizzle ORM
    const [insertedData] = await db.insert(travelReports).values({
      sessionId: sessionId || `session_${Date.now()}`,
      report: generatedReport,
      createdBy: email,
    }).returning(); // ใช้ .returning() เพื่อรับข้อมูลที่เพิ่ง insert กลับมา

    // 6. ส่งผลลัพธ์กลับไปที่ Frontend
    return NextResponse.json({ 
      success: true, 
      data: insertedData 
    }, { status: 200 });

  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการสร้างรายงานการเดินทาง" }, 
      { status: 500 }
    );
  }
}