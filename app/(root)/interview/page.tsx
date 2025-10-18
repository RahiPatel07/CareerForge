import { getCurrentUser } from "@/lib/actions/auth.action";
import InterviewContainer from "@/components/InterviewContainer";

export default async function Page() {
  const user = await getCurrentUser();

  return (
    <>
      <h3>Interview generation</h3>
      <InterviewContainer user={user} />
    </>
  );
}