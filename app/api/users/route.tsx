import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    const user = await currentUser();

    const email = user?.primaryEmailAddress?.emailAddress;
    const name = user?.fullName ?? "New User"; // จัดการค่า undefined/null สำหรับ name
    const defaultCredits = 10; // กำหนดค่าเริ่มต้น

    // ปัญหา 1: ต้องมั่นใจว่า email มีค่าก่อนใช้ eq()
    if (!email) {
        return NextResponse.json({ error: "Email is required and not found in Clerk user data" }, { status: 400 });
    }

    try {
        // Check if User Already Exist
        const users = await db.select().from(usersTable)
            .where(eq(usersTable.email, email)); // Fix 1: ใช้ email ที่การันตีว่าเป็น string

        // If not Create New User
        if(users?.length === 0) {
            const result = await db.insert(usersTable).values({
                name: name, // Fix 2A: เปลี่ยนจาก user เป็น name
                email: email, // Fix 2B: ใช้ email ที่การันตีว่าเป็น string
                credits: defaultCredits 
            }).returning(); // Fix 3: แก้ไข .returning()

            // result จะเป็น array ที่มี object ของ user ที่ถูกสร้างใหม่
            return NextResponse.json(result[0]); 
        }

        return NextResponse.json(users[0])
    } catch (err) {
        // ควรมีการตรวจสอบประเภทของ error ก่อนที่จะส่งกลับไป
        console.error("Database operation failed:", err);
        return NextResponse.json({ error: "Internal Server Error", details: (err as Error).message }, { status: 500 });
    }
}