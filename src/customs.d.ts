declare module "inequality-grammar" {
  export const parseMathsExpression: (exp: string) => any[] | ParsingError;
  export const parseBooleanExpression: (exp: string) => any[] | ParsingError;
  export type ParsingError = {
    error: { offset: number; token: { value: string } };
    message: string;
    stack: string;
  };
}
