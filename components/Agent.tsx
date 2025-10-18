"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";
import { finalizeInterview, createInterview } from "@/lib/actions/interview.action";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
  role,
  level,
  techstack,
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");
  const [currentInterviewId, setCurrentInterviewId] = useState<string | null>(
    interviewId || null
  );

  const generateInterviewId = () => {
    return `interview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  useEffect(() => {
    const onCallStart = async () => {
      setCallStatus(CallStatus.ACTIVE);
      if (!currentInterviewId && type === "generate") {
        const newId = generateInterviewId();
        setCurrentInterviewId(newId);
        
        try {
          await createInterview({
            interviewId: newId,
            userId: userId!,
            role: "General",
            level: "Intermediate",
            type: "generate",
            techstack: [],
          });
          console.log("Interview document created:", newId);
        } catch (error) {
          console.error("Error creating interview document:", error);
        }
      }
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.error("Vapi Error:", error);
      
      if (error.message && error.message.includes("ejection")) {
        console.log("Meeting was ejected, treating as call end");
        setCallStatus(CallStatus.FINISHED);
      } else {
        setCallStatus(CallStatus.INACTIVE);
      }
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, [currentInterviewId, type, userId]);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }
  }, [messages]);

  useEffect(() => {
    const handleGenerateFeedback = async () => {
      console.log("Generating feedback...");

      if (messages.length === 0) {
        console.log("No messages to save");
        alert("No interview data to generate feedback. Please try again.");
        router.push("/");
        return;
      }

      if (!currentInterviewId) {
        console.log("No interview ID available");
        alert("Interview ID not found. Please try again.");
        router.push("/");
        return;
      }

      try {
        const { success, feedbackId: id } = await createFeedback({
          interviewId: currentInterviewId,
          userId: userId!,
          transcript: messages,
          feedbackId: feedbackId || undefined,
        });

        if (success && id) {
          console.log("Feedback saved successfully");
          
          const { success: finalizeSuccess } = await finalizeInterview(currentInterviewId);
          
          if (finalizeSuccess) {
            console.log("Interview finalized successfully, redirecting...");
            setTimeout(() => {
              router.push(`/interview/${currentInterviewId}/feedback`);
            }, 1000);
          } else {
            console.log("Error finalizing interview");
            alert("Interview saved but couldn't finalize. Please contact support.");
            router.push("/");
          }
        } else {
          console.log("Error saving feedback");
          alert("Failed to generate feedback. Please try again.");
          router.push("/");
        }
      } catch (error) {
        console.error("Error in handleGenerateFeedback:", error);
        alert("An error occurred while generating feedback.");
        router.push("/");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      handleGenerateFeedback();
    }
  }, [callStatus, currentInterviewId, messages, userId, feedbackId, router]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);
    try {
      if (type === "generate") {
        await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
          variableValues: {
            username: userName,
            userid: userId,
          },
        });
      } else {
        let formattedQuestions = "";
        if (questions) {
          formattedQuestions = questions
            .map((question) => `- ${question}`)
            .join("\n");
        }

        await vapi.start(interviewer, {
          variableValues: {
            questions: formattedQuestions,
          },
        });
      }
    } catch (error) {
      console.error("Error starting Vapi call:", error);
      setCallStatus(CallStatus.INACTIVE);
      alert("Failed to start call. Check console for details.");
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  return (
    <>
      <div className="call-view">
        {/* AI Robot Card with Speaking Animation */}
        <div className="card-interviewer relative overflow-hidden">
          {/* Animated Background Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent-100/20 to-primary/20 animate-gradient-shift"></div>
          
          {/* Floating Particles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="particle particle-1"></div>
            <div className="particle particle-2"></div>
            <div className="particle particle-3"></div>
          </div>

          {/* AI Robot Avatar with Mouth Animation */}
          <div className="avatar-robot relative z-10">
            {/* Glow Effect */}
            {isSpeaking && (
              <>
                <div className="absolute inset-0 animate-pulse-glow"></div>
                <div className="absolute inset-0 animate-ping-slow opacity-30 bg-primary"></div>
              </>
            )}
            
            {/* Robot Face Container */}
            <div className="relative robot-face">
              {/* Robot Head - Futuristic Design */}
              <div className="robot-head">
                {/* Eyes */}
                <div className="robot-eyes">
                  <div className={cn("robot-eye robot-eye-left", isSpeaking && "animate-eye-glow")}>
                    <div className="eye-pupil"></div>
                  </div>
                  <div className={cn("robot-eye robot-eye-right", isSpeaking && "animate-eye-glow")}>
                    <div className="eye-pupil"></div>
                  </div>
                </div>

                {/* Mouth with Speaking Animation */}
                <div className="robot-mouth-container">
                  <div className={cn("robot-mouth", isSpeaking && "robot-mouth-speaking")}>
                    <div className="mouth-wave mouth-wave-1"></div>
                    <div className="mouth-wave mouth-wave-2"></div>
                    <div className="mouth-wave mouth-wave-3"></div>
                  </div>
                </div>

                {/* Side Panels */}
                <div className="robot-panel robot-panel-left"></div>
                <div className="robot-panel robot-panel-right"></div>
              </div>

              {/* Status Indicator */}
              <div className={cn("status-indicator", isSpeaking && "status-active")}></div>
            </div>

            {/* Pulse Rings when Speaking */}
            {isSpeaking && (
              <>
                <div className="pulse-ring pulse-ring-1"></div>
                <div className="pulse-ring pulse-ring-2"></div>
                <div className="pulse-ring pulse-ring-3"></div>
              </>
            )}
          </div>

          <h3 className="relative z-10 text-primary font-bold mt-6 animate-fade-in">AI Interviewer</h3>
        </div>

        {/* User Card */}
        <div className="card-border animate-slide-in-right">
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt="profile-image"
              width={539}
              height={539}
              className="object-cover size-[120px] shadow-xl border-4 border-primary/30"
              style={{ borderRadius: '0.5rem' }}
            />
            <h3 className="text-primary font-bold">{userName}</h3>
          </div>
        </div>
      </div>

      {/* Transcript with Typing Animation */}
      {messages.length > 0 && (
        <div className="transcript-border animate-fade-in">
          <div className="transcript">
            <p
              key={lastMessage}
              className="transition-opacity duration-500 opacity-0 animate-fadeIn opacity-100 animate-typing"
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      {/* Call Controls */}
      <div className="w-full flex justify-center">
        {callStatus !== "ACTIVE" ? (
          <button className="relative btn-call animate-bounce-subtle" onClick={() => handleCall()}>
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden"
              )}
              style={{ borderRadius: '0.375rem' }}
            />

            <span className="relative">
              {callStatus === "INACTIVE" || callStatus === "FINISHED"
                ? "Start Call"
                : "Connecting..."}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect animate-pulse-subtle" onClick={() => handleDisconnect()}>
            End Interview
          </button>
        )}
      </div>

      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(37, 99, 235, 0.6);
          border-radius: 50%;
          animation: float-particle 8s infinite;
        }

        .particle-1 {
          top: 20%;
          left: 20%;
          animation-delay: 0s;
          animation-duration: 6s;
        }

        .particle-2 {
          top: 60%;
          left: 70%;
          animation-delay: 2s;
          animation-duration: 7s;
        }

        .particle-3 {
          top: 40%;
          left: 50%;
          animation-delay: 4s;
          animation-duration: 8s;
        }

        @keyframes float-particle {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) translateX(50px);
            opacity: 0;
          }
        }

        .avatar-robot {
          position: relative;
          width: 160px;
          height: 160px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .robot-face {
          width: 140px;
          height: 140px;
          position: relative;
        }

        .robot-head {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%);
          border-radius: 0.75rem;
          position: relative;
          box-shadow: 0 10px 40px rgba(37, 99, 235, 0.4);
          border: 3px solid rgba(255, 255, 255, 0.3);
        }

        .robot-eyes {
          position: absolute;
          top: 35%;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 25px;
        }

        .robot-eye {
          width: 24px;
          height: 24px;
          background: #ffffff;
          border-radius: 50%;
          position: relative;
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.8);
        }

        .eye-pupil {
          width: 12px;
          height: 12px;
          background: #06b6d4;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: eye-look 4s infinite;
        }

        @keyframes eye-look {
          0%, 100% { transform: translate(-50%, -50%); }
          25% { transform: translate(-30%, -50%); }
          75% { transform: translate(-70%, -50%); }
        }

        .animate-eye-glow {
          animation: eye-glow 0.5s ease-in-out infinite;
        }

        @keyframes eye-glow {
          0%, 100% { box-shadow: 0 0 10px rgba(6, 182, 212, 0.8); }
          50% { box-shadow: 0 0 20px rgba(6, 182, 212, 1), 0 0 30px rgba(6, 182, 212, 0.5); }
        }

        .robot-mouth-container {
          position: absolute;
          bottom: 30%;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 30px;
        }

        .robot-mouth {
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 0 0 30px 30px;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .robot-mouth-speaking {
          animation: mouth-talk 0.3s ease-in-out infinite;
        }

        @keyframes mouth-talk {
          0%, 100% {
            height: 30px;
            border-radius: 0 0 30px 30px;
          }
          50% {
            height: 20px;
            border-radius: 0 0 20px 20px;
          }
        }

        .mouth-wave {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, #06b6d4, #2563eb);
          opacity: 0;
        }

        .robot-mouth-speaking .mouth-wave {
          animation: wave-move 0.6s ease-in-out infinite;
        }

        .mouth-wave-1 {
          animation-delay: 0s;
        }

        .mouth-wave-2 {
          animation-delay: 0.2s;
        }

        .mouth-wave-3 {
          animation-delay: 0.4s;
        }

        @keyframes wave-move {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(-20px);
            opacity: 0;
          }
        }

        .robot-panel {
          position: absolute;
          width: 8px;
          height: 40px;
          background: linear-gradient(180deg, #06b6d4, #0891b2);
          top: 50%;
          transform: translateY(-50%);
          border-radius: 2px;
        }

        .robot-panel-left {
          left: -10px;
        }

        .robot-panel-right {
          right: -10px;
        }

        .status-indicator {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 10px;
          height: 10px;
          background: #10b981;
          border-radius: 50%;
          box-shadow: 0 0 10px #10b981;
        }

        .status-active {
          animation: status-blink 1s ease-in-out infinite;
        }

        @keyframes status-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .pulse-ring {
          position: absolute;
          border: 2px solid #2563eb;
          border-radius: 0.75rem;
          animation: pulse-ring-animation 2s ease-out infinite;
        }

        .pulse-ring-1 {
          animation-delay: 0s;
        }

        .pulse-ring-2 {
          animation-delay: 0.5s;
        }

        .pulse-ring-3 {
          animation-delay: 1s;
        }

        @keyframes pulse-ring-animation {
          0% {
            width: 140px;
            height: 140px;
            opacity: 1;
          }
          100% {
            width: 200px;
            height: 200px;
            opacity: 0;
          }
        }

        .animate-pulse-glow {
          background: radial-gradient(circle, rgba(37, 99, 235, 0.4) 0%, transparent 70%);
          border-radius: 0.75rem;
          animation: pulse-glow 1.5s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }

        .animate-ping-slow {
          border-radius: 0.75rem;
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        @keyframes ping-slow {
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out;
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-typing {
          animation: typing 1s steps(40, end);
        }

        @keyframes typing {
          from { width: 0; }
          to { width: 100%; }
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }

        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }

        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </>
  );
};

export default Agent;