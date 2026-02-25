"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
// ตรวจสอบ path ให้ถูกต้องตามโครงสร้างโปรเจคของคุณ
import { Circle, Loader, PhoneCall, PhoneOff } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Vapi from "@vapi-ai/web";
import { toast } from "sonner";
import { Main } from "next/document";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

// --- Types ---
type docterAgent = {
  id: number;
  specialist: string;
  description: string;
  image: string;
  agentPrompt: string;
  voiceId?: string;
  subscriptionRequired: boolean;
};
export type SessionDetail = {
  id: number;
  notes: string;
  sessionId: string;
  report: Record<string, any>; // JSON ไม่ใช่ type ที่ถูกต้องใน TS
  selectedDocter: docterAgent;
  createdOn: string;
};

type MessageItem = {
  role: string; // 'user' | 'assistant' | ...
  text: string;
};

function Mainspace() {
  const [callStarted, setCallStarted] = useState(false);
  const [vapiInstance, setVapiInstance] = useState<any>(null);
  const [currentRole, setCurrentRole] = useState<string | null>(null); // แก้ currentRoll เป็น currentRole
  const [liveTranscript, setLiveTranscript] = useState<string>("");
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [callDuration, setCallDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  // Ref สำหรับเลื่อนหน้าจอแชท
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- Effects ---

  // 1. Fetch Session Data

  // 2. Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callStarted) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [callStarted]);

  // 3. Cleanup Vapi on Unmount (สำคัญมาก: ป้องกันเสียงค้างเมื่อเปลี่ยนหน้า)
  useEffect(() => {
    return () => {
      if (vapiInstance) {
        vapiInstance.stop();
        vapiInstance.removeAllListeners();
      }
    };
  }, [vapiInstance]);

  // 4. Auto Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, liveTranscript]);

  // --- Functions ---

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const StartCall = () => {
    setLoading(true);

    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
    setVapiInstance(vapi);
    const VapiAgentConfig = "3ca36aae-b112-480a-80d8-68a1100adcbe";

    console.log("Starting Vapi with Config:", VapiAgentConfig);

    try {
      //@ts-ignore
      vapi.start(VapiAgentConfig);
    } catch (err) {
      console.error("Vapi Start Error:", err);
    }

    // Event Listeners
    vapi.on("call-start", () => {
      console.log("Call started");
      setCallStarted(true);
      setLoading(false);
    });

    vapi.on("call-end", () => {
      console.log("Call ended");
      setCallStarted(false);
      setCurrentRole(null);
      setLiveTranscript("");
    });

    vapi.on("message", (message: any) => {
      if (message.type === "transcript") {
        const { role, transcriptType, transcript } = message;

        if (transcriptType === "partial") {
          setLiveTranscript(transcript);
          setCurrentRole(role);
        } else if (transcriptType === "final") {
          setMessages((prev) => [...prev, { role: role, text: transcript }]);
          setLiveTranscript("");
          setCurrentRole(null);
        }
      }
    });

    vapi.on("speech-start", () => {
      console.log("Assistant started speaking");
      setCurrentRole("assistant");
    });

    vapi.on("speech-end", () => {
      console.log("Assistant stopped speaking");
      setCurrentRole("user");
    });

    // Error handling
    vapi.on("error", (e: any) => {
      console.error("Vapi Error Details:", JSON.stringify(e, null, 2));
      setCallStarted(false);
    });
  };

const endCall = async () => {
    setLoading(true);
    if (vapiInstance) {
      vapiInstance.stop();
      setCallStarted(false);
    }

    // ส่งข้อความไป Gen Report และบันทึกลงฐานข้อมูล หากมีบทสนทนาเกิดขึ้น
    if (messages.length > 0) {
      try {
        toast.loading("กำลังสรุปเส้นทาง...");
        const response = await axios.post("/api/reports", {
          messages: messages,
          sessionId: vapiInstance?.callId || `local_session_${Date.now()}`, // ใช้ callId จาก Vapi ถ้ามี
        });

        if (response.data.success) {
          toast.dismiss();
          toast.success("บันทึกการสรุปเส้นทางสำเร็จ!");
          console.log("Report Saved:", response.data.data);
          // ทำการเคลียร์แชท หรือนำทางไปหน้า /report ต่อได้
        }
      } catch (error) {
        toast.dismiss();
        toast.error("เกิดข้อผิดพลาดในการบันทึกสรุปเส้นทาง");
        console.error("Report error:", error);
      }
    }

    setLoading(false);
  };

  return (
    <div className="p-4 border rounded-3xl h-screen min-h-[500px] flex flex-col ">
      {/* Header */}
      <div className="flex justify-between items-center p-3 rounded-xl">
        <div className="flex gap-2 items-center">
          <div
            className={`p-2 rounded-full transition-all ${callStarted ? "bg-green-100" : "bg-red-100"}`}
          >
            <Circle
              className={`w-4 h-4 fill-current ${callStarted ? "text-green-500 animate-pulse" : "text-red-500"}`}
            />
          </div>
          <span className="font-medium text-sm">
            {callStarted ? "กำลังเชื่อมต่อ..." : "ยังไม่ได้เชื่อมต่อ"}
          </span>
        </div>
        <h2 className="text-xl font-mono font-bold text-primary">
          {formatTime(callDuration)}
        </h2>
      </div>

      <div className="flex flex-col items-center mt-6 flex-grow">
        {/* Doctor Profile */}
        <div className="text-center mb-6">
          <Image
            src="/skyfrog.png"
            alt="Avatar"
            width={120}
            height={120}
            className="h-[100px] w-[100px] object-cover rounded-full border-4 border-white border-background shadow-md mx-auto"
          />
          <h2 className="text-sm text-muted-foreground mt-2">PaiNai AI</h2>
        </div>

        {/* Chat / Transcript Area */}
        <div className="w-full h-full max-h-[350px] overflow-y-auto p-4 bg-background rounded-xl border shadow-inner flex flex-col gap-3">
          {messages.length === 0 && !liveTranscript && (
            <p className="text-center text-muted-foreground text-sm italic py-10 flex items-center justify-center">
              กด "ถามเส้นทาง" เพื่อเริ่มต้นการสนทนา
            </p>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-muted text-foreground rounded-tl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Live Transcript Bubble */}
          {liveTranscript && (
            <div
              className={`flex ${currentRole === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-sm opacity-70 animate-pulse ${
                  currentRole === "user"
                    ? "bg-primary/50 text-primary-foreground rounded-tr-none"
                    : "bg-muted/50 text-foreground rounded-tl-none"
                }`}
              >
                {liveTranscript}...
              </div>
            </div>
          )}

          {/* Invisible div for auto-scrolling */}
          <div ref={messagesEndRef} />
        </div>

        {/* Controls */}
        <div className="mt-6 w-full flex justify-center">
          {user ? (
            !callStarted ? (
              <Button
                className="w-full max-w-xs h-12 text-lg shadow-lg"
                onClick={StartCall}
                disabled={loading}
              >
                {loading ? (
                  <Loader className="animate-spin" />
                ) : (
                  <PhoneCall className="mr-2 w-5 h-5" />
                )}
                ถามเส้นทาง
              </Button>
            ) : (
              <Button
                variant={"destructive"}
                className="w-full max-w-xs h-12 text-lg shadow-lg"
                onClick={endCall}
                disabled={loading}
              >
                {loading ? (
                  <Loader className="animate-spin" />
                ) : (
                  <PhoneOff className="mr-2 w-5 h-5" />
                )}
                วางสาย
              </Button>
            )
          ) : (
            <Link href="/sign-in">
              <Button className="w-full max-w-xs h-12 text-lg shadow-lg">
                <PhoneCall className="mr-2 w-5 h-5" />
                ถามเส้นทาง
              </Button>
            </Link>
          )}
          <Link href="/report">
            <Button className="w-full max-w-xs h-12 text-lg shadow-lg ml-4 text-black bg-white hover:bg-gray-200 scaled-110">
              ประวัติการสอบถามเส้นทาง
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Mainspace;
