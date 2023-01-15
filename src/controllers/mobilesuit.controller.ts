import { Request, Response } from "express";
import { getAllMobileSuits } from "../services/mobilesuits.service";

export const getAllMobileSuitsHandler = async (res: Response) => {
  const allMobileSuits = await getAllMobileSuits();

  if (!allMobileSuits) {
    return res.status(404).json({ message: "Error finding mobile suits" });
  }
  if (allMobileSuits.length === 0) {
    return res.status(200).json({ message: "No available mobile suits" });
  }
  return res.status(200).json(allMobileSuits);
};
