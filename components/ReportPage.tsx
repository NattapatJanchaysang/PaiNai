import { db } from "../config/db"; // เปลี่ยน path ให้ตรงกับที่ตั้งค่า drizzle db ของคุณ
import { travelReports } from "../config/schema"; // เปลี่ยน path ให้ตรงกับ schema
import { eq, desc } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { MapPin, Calendar, Navigation, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// ฟังก์ชันสำหรับจัดรูปแบบวันที่ให้เป็นภาษาไทยแบบอ่านง่าย
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export default async function ReportPage() {
  // 1. ตรวจสอบผู้ใช้งาน
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const email = user.emailAddresses[0]?.emailAddress;

  // 2. ดึงข้อมูลประวัติการเดินทางของ User คนนี้ จากใหม่ไปเก่า
  const reports = await db
    .select()
    .from(travelReports)
    .where(eq(travelReports.createdBy, email as string))
    .orderBy(desc(travelReports.createdOn));

  return (
    <div className="max-w-3xl mx-auto p-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <MapPin className="w-8 h-8 text-green-500" />
            ประวัติการสอบถามเส้นทาง
          </h1>
          <p className="text-muted-foreground mt-2 px-10">
            สรุปวิธีการเดินทางทั้งหมดที่คุณเคยคุยกับ PaiNai AI
          </p>
        </div>
        <Link href="/talkingpage">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> ย้อนกลับ
          </Button>
        </Link>
      </div>

      {/* ถ้าไม่มีข้อมูล */}
      {reports.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-2xl bg-muted/20">
          <Navigation className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-medium text-muted-foreground">
            ยังไม่มีประวัติการสอบถามการเดินทาง
          </h3>
        </div>
      ) : (
        /* แสดงรายการแบบ Card */
        <div className="space-y-6">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-card text-card-foreground border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 pb-4 border-b">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(report.createdOn)}</span>
              </div>

              <div className="flex gap-4">
                <div className="hidden sm:flex flex-col items-center mt-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="w-0.5 h-full bg-border my-1"></div>
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-primary" />
                    สรุปวิธีการเดินทาง
                  </h3>
                  {/* whitespace-pre-wrap สำคัญมาก: ช่วยให้ข้อความที่ AI gen มามีการขึ้นบรรทัดใหม่ตรงตามต้นฉบับ */}
                  <div className="text-sm leading-relaxed whitespace-pre-wrap bg-muted/30 p-4 rounded-xl">
                    {report.report}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}