import { Request, Response } from "express";
import RegisteredCandidatesModel from "../models/Candidate";
import mongoose from "mongoose";

export const getRegisteredCandidates = async (req: Request, res: Response) => {
  try {
    // Extract page, limit, and skip from query parameters with defaults
    const page = parseInt(req.query.page as string) || 1; // Default page 1
    const limit = parseInt(req.query.limit as string) || 10; // Default 10 items per page

    if (isNaN(page) || page <= 0) {
     res.status(400).json({
        message: "Invalid page number. Must be a positive integer.",
      });
      return
    }

    if (isNaN(limit) || limit <= 0) {
     res.status(400).json({
        message: "Invalid limit. Must be a positive integer.",
      });
      return
    }

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Fetch candidates with sorting, pagination, and selecting specific fields
    const candidates = await RegisteredCandidatesModel.find({}, "_id name currentOrg")
      .sort({ _id: -1 }) // Sort by most recent (_id descending)
      .skip(skip)
      .limit(limit);

    // Get the total count of candidates
    const totalCandidates = await RegisteredCandidatesModel.countDocuments();

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalCandidates / limit);

    // Return the response
    res.status(200).json({
      message: "Success",
      data: {
        candidates,
        pagination: {
          totalCandidates,
          totalPages,
          currentPage: page,
          limit,
        },
      },
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

export const getCandidateById = async (req: Request, res: Response) => {
    try {
      // Extract candidate ID from request parameters
      const { id } = req.params;
  
      // Validate if the ID is a valid MongoDB ObjectId
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
       res.status(400).json({
          message: "Invalid candidate ID. Please provide a valid MongoDB ObjectId.",
        });
        return
      }
  
      // Find the candidate by ID
      const candidate = await RegisteredCandidatesModel.findById(id);
  
      // If candidate is not found, return a 404 error
      if (!candidate) {
      res.status(404).json({
          message: "Candidate not found.",
        });
        return
      }
  
      // Return the candidate details
      res.status(200).json({
        message: "Success",
        data: candidate,
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
  