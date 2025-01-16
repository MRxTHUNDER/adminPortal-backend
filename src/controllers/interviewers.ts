import { Request, Response } from "express";
import InterviewerModel from "../models/InterviewerModel";
import InterviewerSet from "../models/InterviewerSlot";
import mongoose from "mongoose";

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

export async function getInterviewerSlots (req:Request,res:Response) {
  try {
    const {userId} = req.params;

    if(!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({
        message:"Invalid or missing userId"
      });
      return
    }

     // Extract pagination parameters from query
     const page = parseInt(req.query.page as string) || 1; // Default to page 1
     const limit = parseInt(req.query.limit as string) || 10; // Default to 10 items per page
 
     if (page <= 0 || limit <= 0) {
        res.status(400).json({
         message: "Page and limit must be positive integers.",
       });
       return;
     }
 
     // Calculate skip value
     const skip = (page - 1) * limit;

    const slots = await InterviewerSet.find({userId}).skip(skip).limit(limit);

    const totalSlots = await InterviewerSet.countDocuments({userId});

    const totalPages = Math.ceil(totalSlots/limit);

    if(slots.length === 0) {
      res.status(404).json({
        message:"No interview slots found for the specified userId"
      })
      return
    }

  res.status(200).json({
      message: "Success",
      data: {
        slots,
        pagination: {
          totalSlots,
          totalPages,
          currentPage: page,
          limit,
        },
      },
    });

    return;
    
  } catch (error:any) {
    console.log('error: ',error);
    res.status(500).json({
      message:"Internal Server Error",
      error:error.message || "Unknown error"
    })
    return
  }
}