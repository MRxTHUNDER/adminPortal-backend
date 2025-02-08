import { Request, Response } from "express";
import UserModel from "../models/UserModel";
import RecruiterEndToEndModel from "../models/RecruiterEndToEndModel";
import RecruiterOnDemandModel from "../models/RecruiterOnDemandModel";
import mongoose from "mongoose";
import { updateRecruitmentSchema } from "../zod/recruiter";

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
  
      const recruiter = await UserModel.findById(userId);

      if(!recruiter) {
        res.status(404).json({
          message:"No recruiter find by this recruiter id"
        })
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
          id:recruitment._id,
          jobDescription: recruitment.jobDescription || null,
          jobProfile: recruitment.jobProfile || null,
          lastDate: recruitment.lastDate || null,
          numberOfPositions: recruitment.numberOfPositions || null,
          jobLocation: recruitment.jobLocation || null,
          seniorityLevel: recruitment.seniorityLevel || null,
          feedback: recruitment.feedback || null,
          candidateName:recruitment.candidateName,
          submittedCandidates: null, // EndToEnd doesn't have candidates or submitted feedback
          progress:recruitment.progress,
          jobDescriptionFile:recruitment.jobDescriptionFILE,
          type:"end to end"
        })),
        ...onDemandRecruitments.map((recruitment) => ({
          id:recruitment._id,
          jobDescription: recruitment.jobDescription || null,
          jobProfile: recruitment.jobProfile || null,
          lastDate: recruitment.lastDate || null,
          numberOfPositions: recruitment.numberOfPositions || null,
          jobLocation: recruitment.jobLocation || null,
          seniorityLevel: recruitment.seniorityLevel || null,
          feedback: recruitment.feedback || null,
          candidateName:recruitment.candidateName,
          progress:recruitment.progress,
          jobDescriptionFile:recruitment.jobDescriptionFILE,
          type:"onDemand",
          submittedCandidates: recruitment.candidates.map((candidate) => ({
            id: candidate._id,
            name: candidate.candidateFullName,
            companyName: candidate.companyName,
            phoneNumber:candidate.phoneNumber,
            email:candidate.email,
            resume:candidate.resume
          })) || null,
        })),
      ];
  
      // Calculate total records and pages
      const totalRecords = endToEndCount + onDemandCount;
      const totalPages = Math.ceil(totalRecords / limitNum);
  
      // Return the response
    res.status(200).json({
        message: "Success",
        recruiter:{
        name:recruiter.name,
        email:recruiter.email,
        companyname:recruiter.companyname
        },
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
  



export const updateRecruitmentDetailsByInterviewId = async (req: Request, res: Response) => {
  try {
    const { interviewId } = req.params; // Extract the interviewId from the URL params
    const updates = req.body; // Extract the fields to update from the request body

    if (!interviewId) {
     res.status(400).json({ message: "Interview ID is required" });
     return
    }

    // Validate the input using the Zod schema
    const parsedUpdates = updateRecruitmentSchema.safeParse(updates);

    if (!parsedUpdates.success) {
       res.status(400).json({
        message: "Invalid input",
        errors: parsedUpdates.error.errors,
      });
      return;
    }

    // Define a helper function to find and update in a given model
    const findAndUpdate = async (Model: any, id: string, data: any) => {
      return await Model.findOneAndUpdate({ _id: id }, data, { new: true });
    };

    // Try updating in RecruiterOnDemandModel first
    let updatedRecord = await findAndUpdate(
      RecruiterOnDemandModel,
      interviewId,
      parsedUpdates.data
    );

    if (!updatedRecord) {
      // If not found in RecruiterOnDemandModel, try in RecruiterEndToEndModel
      updatedRecord = await findAndUpdate(
        RecruiterEndToEndModel,
        interviewId,
        parsedUpdates.data
      );
    }

    if (!updatedRecord) {
      // If not found in either model, return a 404
    res.status(404).json({ message: "Interview not found in any schema" });
    return
    }

    // If updated, return the updated record
     res.status(200).json({
      message: "Interview details updated successfully",
      data: updatedRecord,
    });
    return
  } catch (error: any) {
    console.error(error);
     res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
    return     
  }
};


export const getCandidatesByRecruitmentId = async (req: Request, res: Response) => {
  try {
    const { recruitmentId } = req.params;

    if (!recruitmentId) {
      res.status(400).json({ message: "Recruitment ID is required" });
      return;
    }

    // Query to fetch only the candidates field
    const recruitment = await RecruiterOnDemandModel.findOne(
      { _id: recruitmentId },
      { candidates: 1, _id: 0 } // Projection: Include only `candidates`, exclude `_id`
    );

    if (!recruitment) {
      res.status(404).json({ message: "Recruitment not found" });
      return;
    }

    res.status(200).json({
      message: "Candidates fetched successfully",
      candidates: recruitment.candidates,
    });
    return
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
    return
  }
};
