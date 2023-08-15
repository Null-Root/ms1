import { Request, Response } from "express";
import { ResponseModel } from "../models";

export default function is_valid_inputs(
        method: string,
        inputs: Array<[string, string]>,
        req: Request,
        res: Response){
    let paramsList: any;
    
    if (method == 'GET') paramsList = req.query;
    else paramsList = req.body;

    for(const input of inputs) {
        const [ input_str, input_type ] = input;

        const input_val = paramsList[input_str];

        // Check if input exists
        if (!input_val) {
            res.status(400).json(
                new ResponseModel(
                    'failed',
                    'incomplete inputs'
                )
            );
            return false;
        }

        // Check if input is correct type
        if (input_type == "number") {
            if(isNaN(Number(input_val))) {
                res.status(400).json(
                    new ResponseModel(
                        'failed',
                        `invalid input (type): ${input_str}`
                    )
                );
                return false;
            }
        }
        else if (input_type == "date") {
            // day-month-year
            if (!isValidDate(input_val)) {
                res.status(400).json(
                    new ResponseModel(
                        'failed',
                        `invalid input (type): ${input_str}`
                    )
                );
                return false;
            }
        }
    }

    return true;
}




function isValidDate(dateString: string): boolean {
    // Check new Date(date_of_birth)
    try {
        const d = new Date(dateString)
    }
    catch(ex) {
        return false;
    }

    // Parse the date parts from the date string
    const parts = dateString.split("-");
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
  
    // Check if the date is valid
    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() + 1 === month &&
      date.getDate() === day
    );
  }
  