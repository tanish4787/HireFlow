export const renderTemplate = (template, variables = {}) => {
  let output = template;

  for (const key in variables) {
    const regex = new RegExp(`{{${key}}}`, "g");
    output = output.replace(regex, variables[key] ?? "");
  }

  return output;
};
