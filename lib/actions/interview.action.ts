"use server";

import { db } from "@/firebase/admin";

export async function createInterview(params: {
  interviewId: string;
  userId: string;
  role: string;
  level: string;
  type: string;
  techstack: string[];
  questions?: string[];
}) {
  const { interviewId, userId, role, level, type, techstack, questions } = params;

  try {
    await db.collection("interviews").doc(interviewId).set({
      userId,
      role,
      level,
      type,
      techstack,
      questions: questions || [],
      finalized: false,
      createdAt: new Date().toISOString(),
    });

    return { success: true, interviewId };
  } catch (error) {
    console.error("Error creating interview:", error);
    return { success: false };
  }
}

export async function finalizeInterview(interviewId: string) {
  try {
    // First check if interview exists
    const interviewDoc = await db.collection("interviews").doc(interviewId).get();
    
    if (!interviewDoc.exists) {
      console.error("Interview document does not exist:", interviewId);
      // Create it if it doesn't exist
      await db.collection("interviews").doc(interviewId).set({
        finalized: true,
        completedAt: new Date().toISOString(),
      });
      return { success: true };
    }

    // If it exists, update it
    await db.collection("interviews").doc(interviewId).update({
      finalized: true,
      completedAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error finalizing interview:", error);
    return { success: false };
  }
}