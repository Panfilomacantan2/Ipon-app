export type AccountActionState = {
  success: boolean;
  error: string;
  data?: {
    id: string;
    name: string;
  };
};



export type CategoryActionState = {
  success: boolean;
  error: string;
  data?: {
    id: string;
    name: string;
    type: string;
    icon: string | null;
    color: string | null;
  };
};
