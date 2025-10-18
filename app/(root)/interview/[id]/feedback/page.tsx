import { notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const FeedbackPage = async ({ params }: PageProps) => {
  const user = await getCurrentUser();
  const { id: interviewId } = await params;
  
  if (!user) {
    return notFound();
  }

  const feedback: Feedback | null = await getFeedbackByInterviewId({
    interviewId,
    userId: user.id,
  });

  if (!feedback) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-fadeIn">
        <div className="w-24 h-24 bg-gradient-to-br from-accent-100/20 to-primary-100/20 rounded-full flex items-center justify-center">
          <span className="text-5xl">🔍</span>
        </div>
        <h2 className="text-3xl font-bold text-text-primary">Feedback Not Found</h2>
        <p className="text-text-secondary text-center max-w-md">
          We couldn't find feedback for this interview yet. It may still be processing.
        </p>
        <p className="text-sm text-text-muted">
          Please wait a moment and refresh the page.
        </p>
        <div className="flex gap-4 max-sm:flex-col">
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            🔄 Refresh Page
          </button>
          <Link href="/" className="btn-secondary">
            🏠 Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="mb-12 text-center animate-fadeIn">
        <div className="inline-block mb-4">
          <span className="px-4 py-2 bg-success-100/10 text-success-100 rounded-full text-sm font-semibold border border-success-100/30">
            ✓ Interview Complete
          </span>
        </div>
        <h1 className="text-4xl font-bold mb-3">Your Interview Feedback</h1>
        <p className="text-text-secondary text-lg">
          Here's your comprehensive AI-generated performance analysis
        </p>
      </div>

      {/* Overall Score Card */}
      <div className="feedback-card mb-8 animate-fadeIn text-center" style={{ animationDelay: '0.1s' }}>
        <div className="inline-block mb-4">
          <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center shadow-lg animate-pulse-glow">
            <div className="text-5xl font-bold text-white">
              {feedback.totalScore}
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Overall Performance Score</h2>
        <p className="text-text-secondary">Out of 100 points</p>
        
        {/* Score Indicator */}
        <div className="mt-6 max-w-md mx-auto">
          <div className="w-full bg-bg-secondary rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-100 to-accent-100 rounded-full transition-all duration-1000"
              style={{ width: `${feedback.totalScore}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-text-muted mt-2">
            <span>0</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>
      </div>

      {/* Category Scores */}
      {feedback.categoryScores && feedback.categoryScores.length > 0 && (
        <div className="feedback-card mb-8 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span>📊</span> Category Breakdown
          </h2>
          <div className="space-y-4">
            {feedback.categoryScores.map((category, index) => (
              <div key={index} className="category-item">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-text-primary text-lg">{category.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-primary-200">
                      {category.score}
                    </span>
                    <span className="text-text-muted">/10</span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-white rounded-full h-2 mb-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-100 to-primary-200 rounded-full transition-all duration-1000"
                    style={{ width: `${(category.score / 10) * 100}%` }}
                  ></div>
                </div>
                
                <p className="text-text-secondary">{category.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two Column Layout for Strengths and Improvements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Strengths */}
        {feedback.strengths && feedback.strengths.length > 0 && (
          <div className="feedback-card animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-2xl font-bold mb-6 text-success-100 flex items-center gap-2">
              <span>💪</span> Strengths
            </h2>
            <ul className="space-y-3 list-none">
              {feedback.strengths.map((strength, index) => (
                <li key={index} className="strength-item">
                  <div className="flex items-start gap-3">
                    <span className="text-success-100 text-xl font-bold mt-0.5">✓</span>
                    <span className="text-text-secondary flex-1">{strength}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Areas for Improvement */}
        {feedback.areasForImprovement && feedback.areasForImprovement.length > 0 && (
          <div className="feedback-card animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-2xl font-bold mb-6 text-orange-500 flex items-center gap-2">
              <span>📈</span> Areas for Improvement
            </h2>
            <ul className="space-y-3 list-none">
              {feedback.areasForImprovement.map((improvement, index) => (
                <li key={index} className="improvement-item">
                  <div className="flex items-start gap-3">
                    <span className="text-orange-500 text-xl font-bold mt-0.5">→</span>
                    <span className="text-text-secondary flex-1">{improvement}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Final Assessment */}
      {feedback.finalAssessment && (
        <div className="feedback-card animate-fadeIn" style={{ animationDelay: '0.5s' }}>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span>📝</span> Final Assessment
          </h2>
          <div className="bg-gradient-to-r from-bg-secondary to-white p-6 rounded-xl border-l-4 border-accent-100">
            <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
              {feedback.finalAssessment}
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center mt-12 max-sm:flex-col animate-fadeIn" style={{ animationDelay: '0.6s' }}>
        <Link href="/interview" className="btn-primary text-lg px-8 py-4">
          <span className="mr-2">🚀</span> Start New Interview
        </Link>
        <Link href="/" className="btn-secondary text-lg px-8 py-4">
          <span className="mr-2">🏠</span> Back to Dashboard
        </Link>
      </div>

      {/* Motivational Card */}
      <div className="mt-12 card-gradient text-center p-8 animate-fadeIn" style={{ animationDelay: '0.7s' }}>
        <div className="text-4xl mb-4">🎯</div>
        <h3 className="text-xl font-bold mb-2">Keep Practicing!</h3>
        <p className="text-text-secondary max-w-2xl mx-auto">
          Regular practice is the key to success. Each interview session helps you improve and build confidence.
        </p>
      </div>
    </div>
  );
};

export default FeedbackPage;