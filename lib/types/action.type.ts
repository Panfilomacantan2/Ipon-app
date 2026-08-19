export type AccountActionState = {
  success: boolean;
  error: string;
  data?: {
    id: string;
    name: string;
  };
};