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

  const [userInterviews, allInterview] = await Promise.all([
    getInterviewsByUserId(user?.id!),
    getLatestInterviews({ userId: user?.id! }),
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
            Practice with realistic AI interviews, get instant feedback, and boost your confidence before the big day.
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
                <strong className="text-text-primary">1000+</strong> Interviews Conducted
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

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 animate-fadeIn">
        <div className="card-modern group hover:border-primary-200/50">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="text-2xl">🎯</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Realistic Practice</h3>
          <p className="text-text-secondary">
            Experience real interview scenarios with our advanced AI interviewer
          </p>
        </div>

        <div className="card-modern group hover:border-accent-100/50">
          <div className="w-12 h-12 bg-gradient-to-br from-accent-100 to-accent-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Instant Feedback</h3>
          <p className="text-text-secondary">
            Get detailed analysis and actionable insights immediately after each session
          </p>
        </div>

        <div className="card-modern group hover:border-success-100/50">
          <div className="w-12 h-12 bg-gradient-to-br from-success-100 to-success-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="text-2xl">🚀</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Track Progress</h3>
          <p className="text-text-secondary">
            Monitor your improvement over time with comprehensive analytics
          </p>
        </div>
      </section>

      {/* Your Interviews Section */}
      <section className="flex flex-col gap-6 mt-16" id="interviews">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Your Interviews</h2>
            <p className="text-text-secondary mt-2">Review your past practice sessions and track your progress</p>
          </div>
          
          {hasPastInterviews && (
            <Button asChild className="btn-secondary max-sm:hidden">
              <Link href="/interview">+ New Interview</Link>
            </Button>
          )}
        </div>

        <div className="interviews-section">
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <div className="col-span-full">
              <div className="card-gradient text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-100/20 to-accent-100/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">📝</span>
                </div>
                <h3 className="text-xl font-bold mb-2">No interviews yet</h3>
                <p className="text-text-secondary mb-6">Start your first practice interview to improve your skills</p>
                <Button asChild className="btn-primary">
                  <Link href="/interview">Start Your First Interview</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Available Practice Tests */}
      <section className="flex flex-col gap-6 mt-16">
        <div>
          <h2 className="text-3xl font-bold">Available Practice Tests</h2>
          <p className="text-text-secondary mt-2">Choose from our curated collection of interview scenarios</p>
        </div>

        <div className="interviews-section">
          {hasUpcomingInterviews ? (
            allInterview?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <div className="col-span-full">
              <div className="card-gradient text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-accent-100/20 to-primary-100/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🔍</span>
                </div>
                <h3 className="text-xl font-bold mb-2">No practice tests available</h3>
                <p className="text-text-secondary">Check back soon for new interview scenarios</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mt-16 card-gradient text-center py-12">
        <h2 className="text-3xl font-bold mb-4">Ready to Ace Your Interview?</h2>
        <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
          Join thousands of candidates who have improved their interview skills with CareerForge
        </p>
        <Button asChild className="btn-primary text-lg px-8 py-4">
          <Link href="/interview">
            <span className="mr-2">🎯</span> Start Practicing Now
          </Link>
        </Button>
      </section>
    </>
  );
}

export default Home;