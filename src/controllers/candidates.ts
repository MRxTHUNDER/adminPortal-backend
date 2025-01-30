import { Request, Response } from "express";
import UserModel from "../models/UserModel";
import InterviewModel from "../models/InterviewModel";
import InterviewModelNo from "../models/InterviewModelNo";
import { editInterviewSchema } from "../zod/candidates";
import mongoose from "mongoose";

export async function getCandidates(req: Request, res: Response) {
  try {
    // Extract page and limit from query parameters, with defaults
    const page = parseInt(req.query.page as string) || 1; // Default to page 1
    const limit = parseInt(req.query.limit as string) || 10; // Default to 10 items per page

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Fetch candidates with pagination
    const candidates = await UserModel.find({ role: "candidate" })
      .sort({ _id: -1 })
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

// Define a common type for interviews
interface Interview {
  _id: mongoose.Types.ObjectId;
  organization: string[];
  jobProfile: string;
  date: string;
  timeSlots: string;
  pricingPlans: string;
  meetLink: string;
  feedbackReport: string;
  resume: string;
  seniorityLevel: string;
  isVerified: boolean;
}

export async function getCandidateInterviews(req: Request, res: Response) {
  try {
    // Extract user ID, page, and limit from request
    const { id } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10; // Total number of records per page

    // Validate user ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
       res.status(400).json({ message: "Invalid or missing User ID" });
       return
    }

    // Fetch user details
    const user = await UserModel.findById(id);
    if (!user) {
       res.status(404).json({ message: "No user found with this ID" });
       return
    }

    // Fetch all interviews from both collections (without skip/limit)
    const [allInterviews, allInterviewsNo] = await Promise.all([
      InterviewModel.find({ userId: id }).sort({ _id: -1 }).lean<Interview[]>(),
      InterviewModelNo.find({ userId: id }).sort({ _id: -1 }).lean<Interview[]>(),
    ]);
    // Merge and sort interviews based on `_id` timestamp (latest first)
    const mergedInterviews: Interview[] = [...allInterviews, ...allInterviewsNo].sort(
      (a, b) => b._id.getTimestamp().getTime() - a._id.getTimestamp().getTime()
    );

    // Calculate total records after merging
    const totalRecords = mergedInterviews.length;
    const totalPages = Math.ceil(totalRecords / limit);

    // Apply pagination to merged data
    const paginatedInterviews = mergedInterviews.slice((page - 1) * limit, page * limit);

    // Check if there's a next page
    const hasMore = page < totalPages;

     res.status(200).json({
      message: "Success",
      email: user.email,
      name: user.name,
      data: paginatedInterviews,
      pagination: {
        totalRecords,
        totalPages,
        currentPage: page,
        pageSize: limit,
        hasMore,
      },
    });
    return
  } catch (error: any) {
    console.error("Error fetching candidate interviews:", error.message);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
    return
  }
}


export async function editCandidateInterview(req: Request, res: Response) {
  try {
    const { id } = req.params; // Extract interview ID from params

    // Validate the ID
    if (!id) {
      res.status(400).json({ message: "Interview ID is required" });
      return;
    }

      // Validate input using Zod schema
      const validation = editInterviewSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          message: "Validation error",
          errors: validation.error.format(), // Send detailed error messages
        });
        return;
      }
  
      const updatedData = validation.data; 

    // Attempt to find and update in the first table
    let updatedInterview = await InterviewModel.findByIdAndUpdate(id, updatedData, {
      new: true, // Return the updated document
    });

    // If not found, attempt in the second table
    if (!updatedInterview) {
      updatedInterview = await InterviewModelNo.findByIdAndUpdate(id, updatedData, {
        new: true, // Return the updated document
      });
    }

    // If still not found, return 404
    if (!updatedInterview) {
      res.status(404).json({ message: "No interview found with the specified ID" });
      return;
    }

    // Send the updated data in response
    res.status(200).json({
      message: "Interview details updated successfully",
      data: updatedInterview,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}