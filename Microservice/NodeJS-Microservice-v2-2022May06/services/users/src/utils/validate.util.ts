const Joi = require("joi");

type IValidateResult = {
  status: boolean;
  message: string;
};

export const createUser = (data: object): Promise<IValidateResult> => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
  });

  return validate(schema, data);
};

const validate = async (
  rules: typeof Joi.object,
  data: object
): Promise<IValidateResult> => {
  try {
    await rules.validateAsync(data);
    return {
      status: true,
      message: "",
    };
  } catch (e: any) {
    return {
      status: false,
      message: e?.message,
    };
  }
};
