import { Request, Response } from "express";
import UserModel from "../models/UserModel";
import InterviewModel from "../models/InterviewModel";
import InterviewModelNo from "../models/InterviewModelNo";

export async function getCandidates(req: Request, res: Response) {
  try {
    // Extract page and limit from query parameters, with defaults
    const page = parseInt(req.query.page as string) || 1; // Default to page 1
    const limit = parseInt(req.query.limit as string) || 10; // Default to 10 items per page

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Fetch candidates with pagination
    const candidates = await UserModel.find({ role: "candidate" })
      .skip(skip)
      .limit(limit);

    // Count total candidates for pagination metadata
    const totalCandidates = await UserModel.countDocuments({ role: "candidate" });

    if (!candidates || candidates.length === 0) {
     res.status(404).json({
        message: "No candidates found",
      });
      return
    }

    // Send paginated results along with metadata
     res.status(200).json({
      candidates,
      totalCandidates,
      currentPage: page,
      totalPages: Math.ceil(totalCandidates / limit),
    });
    return
  } catch (error: any) {
     res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
    return
  }
}

export async function getCandidateInterviews(req: Request, res: Response) {
  try {
    // Extract user ID, page, and limit from the request
    const { id } = req.params;
    const page = parseInt(req.query.page as string) || 1; // Default to page 1
    const limit = parseInt(req.query.limit as string) || 10; // Default to 10 items per page

    // Validate the user ID
    if (!id) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }

    // Calculate the number of records to skip
    const skip = (page - 1) * limit;

    // Fetch data with pagination from both Interview collections
    const interviews = await InterviewModel.find({ userId: id })
      .skip(skip)
      .limit(limit);

    const interviewsNo = await InterviewModelNo.find({ userId: id })
      .skip(skip)
      .limit(limit);

    // If no records are found
    if (!interviews.length && !interviewsNo.length) {
      res.status(404).json({ message: "No more interviews found" });
      return;
    }

    // Combine data from both collections
    const mergedInterviews = [
      ...interviews.map((interview) => ({
        organization: interview.organization,
        jobProfile: interview.jobProfile,
        date: interview.date,
        timeSlots: interview.timeSlots,
        pricingPlans: interview.pricingPlans,
        meetLink: interview.meetLink,
        feedbackReport: interview.feedbackReport,
        resume: interview.resume,
        isVerified: interview.isVerified,
      })),
      ...interviewsNo.map((interviewNo) => ({
        organization: interviewNo.organization,
        jobProfile: interviewNo.jobProfile,
        date: interviewNo.date,
        timeSlots: interviewNo.timeSlots,
        pricingPlans: interviewNo.pricingPlans,
        meetLink: interviewNo.meetLink,
        feedbackReport: interviewNo.feedbackReport,
        resume: interviewNo.resume,
        isVerified: interviewNo.isVerified,
      })),
    ];

    // Send response
    res.status(200).json({
      message: "Success",
      data: mergedInterviews,
      pagination: {
        page,
        limit,
        hasMore: interviews.length + interviewsNo.length === limit, // Check if there are more records
      },
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}
