import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { adminSignin, adminSignup } from "../zod/admin";
import AdminModel from "../models/Admin";
import { ADMIN_PASSWORD } from "../config/config";


export const signup = async (req: Request, res: Response, next: NextFunction) :Promise<void>=>{
    const data = req.body;

    // Validate user input
    const result = adminSignup.safeParse(data);
    if (!result.success) {
        res.status(400).json({
            message: "Validation failed",
            errors: result.error.format(),
        });
        return
    }

    const newUser = result.data;

    try {
        // Check for existing user
        const existingUser = await AdminModel.findOne({
            $or: [
                { email: newUser.email },
            ],
        });

        if (existingUser) {
             res.status(400).json({
                message: `email already exists`,
            });
            return
        }

        if(!ADMIN_PASSWORD){
            res.status(404).json({
                msg:"No admin passwords found"
            })
            return;
        }
        if(newUser.adminPassword !== ADMIN_PASSWORD) {
            res.status(409).json({
                msg:"Admin password is wrong"
            })
            return;
        }
        // Hash the password
        newUser.password = await bcrypt.hash(newUser.password, 10);
         
        // Create the user
        const savedUser = await AdminModel.create(newUser);

        // Generate JWT token
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET!, {
            expiresIn: "24h",
        });

        // Exclude password from response
        const { password, ...userWithoutPassword } = savedUser.toObject();

        // Respond to client
         res.status(201).json({
            message: "User created successfully",
            data: userWithoutPassword,
            token,
        });
        return
    } catch (error) {
        console.error("Error during signup:", error);
        next(error); // Pass to error-handling middleware
    }
};



export async function signin(req: Request, res: Response): Promise<void> {
    const data = req.body;

    // Validate user input
    const result = adminSignin.safeParse(data);
    if (!result.success) {
        res.status(400).json({
            message: "Validation failed",
            errors: result.error.format(),
        });
        return
    }

    const existingUser = result.data;

  try {


    // Check if the user exists
    const user = await AdminModel.findOne({ email:existingUser.email });
    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    if(!ADMIN_PASSWORD){
        res.status(404).json({
            msg:"No admin passwords found"
        })
        return;
    }
    if(existingUser.adminPassword !== ADMIN_PASSWORD) {
        res.status(409).json({
            msg:"Admin password is wrong"
        })
        return;
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(existingUser.password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }


    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id}, // Include the role in the token payload
      process.env.JWT_SECRET!,
      { expiresIn: "30d" }
    );

    // Exclude password from the response
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(200).json({
      message: "Signin successful",
      user: userWithoutPassword,
      token,
    });
  } catch (error: any) {
    console.error("Error during signin:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}
