  import { Request, Response} from "express";
  import dotenv from "dotenv";
  import { getObjectURL } from "../services/getObject";
  import { putObject } from "../services/putObject";
  dotenv.config();
  

export const generatePutURLController = async (req: Request, res: Response): Promise<any> => {
    const { contentType, fileData } = req.body;
    const fileName = `${Date.now()}_${fileData}`;

    if (!fileName || !contentType) {
        return res.status(400).json({
            message: "fileName and contentType are required",
        });
    }

    try {
        const { url, key } = await putObject(fileName, contentType);
        return res.status(200).json({
            status: "Success",
            message: "Use this URL to upload your file, upload url within 180 seconds",
            url,
            key,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            error,
        });
    }
};

export const getObjectController = async (req: Request, res: Response): Promise<any> => {
    const { objectName } = req.body;

    if (!objectName) {
        return res.status(400).json({
            message: "objectName is required",
        });
    }

    try {
        const url = await getObjectURL(objectName);

        return res.status(200).json({
            status: "Success",
            message: "URL will be expired after 180 seconds",
            url,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            error,
        });
    }
};
