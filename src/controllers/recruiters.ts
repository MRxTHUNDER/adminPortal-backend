import { Request, Response } from "express";
import UserModel from "../models/UserModel";
import RecruiterEndToEndModel from "../models/RecruiterEndToEndModel";
import RecruiterOnDemandModel from "../models/RecruiterOnDemandModel";
import mongoose from "mongoose";

export async function getRecruiters(req: Request, res: Response) {
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
    const recruiters = await UserModel.find({role:"recruiter"})
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limitNum);

    // Get the total count of recruiters
    const totalRecruiters = await UserModel.countDocuments({role:"recruiter"});

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalRecruiters/ limitNum);

    // Send the response
    res.status(200).json({
      message: "Success",
      data: {
        recruiters,
        pagination: {
          totalRecruiters,
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

export const getRecruitmentsByUserId = async (req: Request, res: Response) => {
    try {
      // Extract page and limit from query parameters, with defaults
      const pageNum = parseInt(req.query.page as string) || 1; // Default to page 1
      const limitNum = parseInt(req.query.limit as string) || 10; // Default to 10 items per page
  
      if (isNaN(pageNum) || pageNum <= 0) {
     res.status(400).json({ message: "Invalid page number. Must be a positive integer." });
     return
      }
  
      if (isNaN(limitNum) || limitNum <= 0) {
         res.status(400).json({ message: "Invalid limit. Must be a positive integer." });
         return
      }
  
      // Extract userId from query parameters
      const { userId } = req.params;
  
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({
            message:"Invalid or missing userId"
          });
          return
      }
  
      // Fetch data from both models and calculate total counts
      const [endToEndRecruitments, onDemandRecruitments, endToEndCount, onDemandCount] = await Promise.all([
        RecruiterEndToEndModel.find({ userId })
          .sort({ _id: -1 })
          .skip((pageNum - 1) * limitNum)
          .limit(limitNum),
        RecruiterOnDemandModel.find({ userId })
          .sort({ _id: -1 })
          .skip((pageNum - 1) * limitNum)
          .limit(limitNum),
        RecruiterEndToEndModel.countDocuments({ userId }),
        RecruiterOnDemandModel.countDocuments({ userId }),
      ]);
  
      // Merge data into the required structure
      const combinedRecruitments = [
        ...endToEndRecruitments.map((recruitment) => ({
          jobDescription: recruitment.jobDescription || null,
          jobProfile: recruitment.jobProfile || null,
          lastDate: recruitment.lastDate || null,
          numberOfPositions: recruitment.numberOfPositions || null,
          jobLocation: recruitment.jobLocation || null,
          seniorityLevel: recruitment.seniorityLevel || null,
          feedback: recruitment.feedback || null,
          candidateName:recruitment.candidateName,
          submittedCandidates: null, // EndToEnd doesn't have candidates or submitted feedback
        })),
        ...onDemandRecruitments.map((recruitment) => ({
          jobDescription: recruitment.jobDescription || null,
          jobProfile: recruitment.jobProfile || null,
          lastDate: recruitment.lastDate || null,
          numberOfPositions: recruitment.numberOfPositions || null,
          jobLocation: recruitment.jobLocation || null,
          seniorityLevel: recruitment.seniorityLevel || null,
          feedback: recruitment.feedback || null,
          candidateName:recruitment.candidateName,
          submittedCandidates: recruitment.candidates.map((candidate) => ({
            name: candidate.candidateFullName,
            companyName: candidate.companyName,
          })) || null,
        })),
      ];
  
      // Calculate total records and pages
      const totalRecords = endToEndCount + onDemandCount;
      const totalPages = Math.ceil(totalRecords / limitNum);
  
      // Return the response
    res.status(200).json({
        message: "Success",
        data: combinedRecruitments,
        pagination: {
          totalRecords,
          totalPages,
          currentPage: pageNum,
          pageSize: limitNum,
        },
      });
      return
    } catch (error: any) {
      console.error("Error fetching recruitments:", error.message);
     res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
      return
    }
  };
  