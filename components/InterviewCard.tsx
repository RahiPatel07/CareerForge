import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";

import { Button } from "./ui/button";
import DisplayTechIcons from "./DisplayTechIcons";

import { cn } from "@/lib/utils";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";

const InterviewCard = async ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  const feedback =
    userId && interviewId
      ? await getFeedbackByInterviewId({
          interviewId,
          userId,
        })
      : null;

  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  const badgeColors = {
    Behavioral: "from-purple-500 to-purple-600",
    Mixed: "from-blue-500 to-indigo-600",
    Technical: "from-cyan-500 to-blue-600",
  };

  const badgeColor = badgeColors[normalizedType as keyof typeof badgeColors] || badgeColors.Mixed;

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  const scoreColor = 
    !feedback?.totalScore ? "text-text-muted" :
    feedback.totalScore >= 80 ? "text-success-100" :
    feedback.totalScore >= 60 ? "text-primary-200" :
    "text-orange-500";

  return (
    <div className="card-interview group">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-100/5 via-transparent to-accent-100/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative z-10">
        {/* Type Badge */}
        <div className="absolute -top-6 -right-6">
          <div className={cn(
            "bg-gradient-to-r px-4 py-2 rounded-xl shadow-lg text-white font-bold text-sm",
            `bg-gradient-to-r ${badgeColor}`
          )}>
            {normalizedType}
          </div>
        </div>

        {/* AI Avatar with Glow Effect */}
        <div className="relative w-20 h-20 mb-4">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-100/30 to-accent-100/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
          <div className="relative w-full h-full bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Image
              src="/ai-avatar.png"
              alt="AI Interview"
              width={60}
              height={60}
              className="object-contain"
            />
          </div>
        </div>

        {/* Interview Title */}
        <h3 className="text-xl font-bold capitalize mb-3 group-hover:text-primary-200 transition-colors">
          {role} Interview
        </h3>

        {/* Date & Score */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-text-muted">📅</span>
            <span className="text-text-secondary font-medium">{formattedDate}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-text-muted">⭐</span>
            <span className={cn("font-bold text-lg", scoreColor)}>
              {feedback?.totalScore || "—"}/100
            </span>
          </div>
        </div>

        {/* Score Progress Bar */}
        {feedback?.totalScore && (
          <div className="mb-4">
            <div className="w-full bg-bg-secondary rounded-full h-2 overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full transition-all duration-1000",
                  feedback.totalScore >= 80 ? "bg-gradient-to-r from-success-100 to-success-200" :
                  feedback.totalScore >= 60 ? "bg-gradient-to-r from-primary-100 to-primary-200" :
                  "bg-gradient-to-r from-orange-400 to-orange-500"
                )}
                style={{ width: `${feedback.totalScore}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-text-secondary line-clamp-3 mb-6 leading-relaxed">
          {feedback?.finalAssessment ||
            "Ready to test your skills? Take this interview to get personalized AI feedback and improve your performance."}
        </p>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex items-center justify-between pt-4 border-t border-border-light">
        <DisplayTechIcons techStack={techstack} />

        {feedback && interviewId ? (
          <Button asChild className="btn-primary text-sm px-4 py-2">
            <Link href={`/interview/${interviewId}/feedback`}>
              <span className="mr-1">📊</span> View Feedback
            </Link>
          </Button>
        ) : (
          <Button asChild className="btn-secondary text-sm px-4 py-2">
            <Link href="/interview">
              <span className="mr-1">🚀</span> Start Now
            </Link>
          </Button>
        )}
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary-200/30 transition-all duration-300 pointer-events-none"></div>
    </div>
  );
};

export default InterviewCard;