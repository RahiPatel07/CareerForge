import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";

async function Home() {
  const user = await getCurrentUser();

  // ✅ Prevent Firestore errors by skipping queries when user is missing
  if (!user?.id) {
    console.warn("⚠️ No logged-in user found — showing guest view.");
    return (
      <section className="text-center py-20">
        <h1 className="text-4xl font-bold mb-4">Welcome to CareerForge</h1>
        <p className="text-lg text-text-secondary mb-8">
          Please sign in to view your mock interviews and track your progress.
        </p>
        <Button asChild className="btn-primary">
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </section>
    );
  }

  // ✅ Only fetch once user is defined
  const [userInterviews, allInterview] = await Promise.all([
    getInterviewsByUserId(user.id),
    getLatestInterviews({ userId: user.id }),
  ]);

  const hasPastInterviews = userInterviews?.length! > 0;
  const hasUpcomingInterviews = allInterview?.length! > 0;

  return (
    <>
      {/* Hero CTA Section */}
      <section className="card-cta animate-fadeIn">
        <div className="flex flex-col gap-6 max-w-lg z-10">
          <div className="inline-block">
            <span className="px-4 py-2 bg-primary-100/10 text-primary-200 rounded-full text-sm font-semibold border border-primary-200/30">
              ✨ AI-Powered Interview Practice
            </span>
          </div>

          <h1 className="text-4xl font-bold leading-tight">
            Master Your Next Interview with{" "}
            <span className="text-gradient">AI Guidance</span>
          </h1>

          <p className="text-lg text-text-secondary">
            Practice with realistic AI interviews, get instant feedback, and
            boost your confidence before the big day.
          </p>

          <div className="flex gap-4 max-sm:flex-col">
            <Button asChild className="btn-primary">
              <Link href="/interview">
                <span className="mr-2">🚀</span> Start Interview
              </Link>
            </Button>

            <Button asChild className="btn-secondary">
              <Link href="#interviews">View Practice Tests</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-4 max-sm:flex-col">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success-100 rounded-full animate-pulse"></div>
              <span className="text-sm text-text-secondary">
                <strong className="text-text-primary">1000+</strong> Interviews
                Conducted
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent-100 rounded-full animate-pulse"></div>
              <span className="text-sm text-text-secondary">
                <strong className="text-text-primary">95%</strong> Success Rate
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 max-sm:hidden animate-float">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-100/20 to-accent-100/20 blur-3xl"></div>
          <Image
            src="/robot.png"
            alt="AI Robot"
            width={400}
            height={400}
            className="relative drop-shadow-2xl"
          />
        </div>
      </section>

      {/* ... the rest of your page remains unchanged ... */}
    </>
  );
}

export default Home;
