import { Request, Response } from "express";
import UserModel from "../models/UserModel";

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

export async function getCandidate(req:Request,res:Response) {
    try {
        const id = req.query;
        const candidate = await UserModel.findById(id);
        if(!candidate){
            res.status(404).json({
                message:"No candidate found"
            })
            return
        }

        res.status(200).json({
            message:"Successful",
            candidate
        })
    } catch (error:any) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
          });
          return
    }
}
