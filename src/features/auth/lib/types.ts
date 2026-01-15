export type FormValues = {
  email: string;
  password: string;
};

export type Feedback = { type: "error" | "success"; message: string } | null;
