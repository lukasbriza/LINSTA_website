import { joiResolver } from "@hookform/resolvers/joi";
import { TFunction } from "next-i18next";
import Joi from "joi";

const requiredStringValidation = (property: string, maxLength: number) => {
  return Joi.string()
    .ruleset.max(maxLength)
    .rule({ message: "Exceeded maximum number of characters." })
    .required()
    .messages({ "string.empty": `${property} property is required.` });
};

const schema = (t: TFunction) => {
  return Joi.object({
    name: requiredStringValidation("Name", 50),
    place: requiredStringValidation("Place", 50),
    detail: requiredStringValidation("Place", 500),
    realization: requiredStringValidation("Realization", 30),
  });
};

export const formValidationSchema = (t: TFunction) => {
  return joiResolver(schema(t));
};
