import { Request, Response } from "express";
import InterviewerModel from "../models/InterviewerModel";

export async function getInterviewers(req: Request, res: Response) {
  try {
    // Extract page and limit from query parameters, with defaults
    const pageNum = parseInt(req.query.page as string) || 1; // Default to page 1
    const limitNum = parseInt(req.query.limit as string) || 10; // Default to 10 items per page

    if (isNaN(pageNum) || pageNum <= 0) {
      res.status(400).json({ message: "Invalid page number. Must be a positive integer." });
      return;
    }

    if (isNaN(limitNum) || limitNum <= 0) {
      res.status(400).json({ message: "Invalid limit. Must be a positive integer." });
      return;
    }

    // Calculate the number of documents to skip
    const skip = (pageNum - 1) * limitNum;

    // Fetch data from the database
    const interviewers = await InterviewerModel.find()
      .skip(skip)
      .limit(limitNum);

    // Get the total count of interviewers
    const totalInterviewers = await InterviewerModel.countDocuments();

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalInterviewers / limitNum);

    // Send the response
    res.status(200).json({
      message: "Success",
      data: {
        interviewers,
        pagination: {
          totalInterviewers,
          totalPages,
          currentPage: pageNum,
          limit: limitNum,
        },
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
