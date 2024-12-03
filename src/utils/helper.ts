import { showErrorToast } from "../components/Toaster";

export const catchBlockError = (err: any) => {
  if (err instanceof Error) {
    showErrorToast(err.message);
    console.error("Catch Block Error", err.message);
  } else {
    showErrorToast(err.error);
    console.error("Unknown error:", err.error);
  }
};
