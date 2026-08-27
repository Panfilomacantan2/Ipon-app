export type ActionState<T = null> = {
  success: boolean;
  error: string | null;
  message?: string;
  data?: T;
};

export type GoalActionState = ActionState<null>;


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
