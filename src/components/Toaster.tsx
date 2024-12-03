import { Toaster, Position, Intent } from "@blueprintjs/core";

const AppToaster = Toaster.create({
  className: "my-toaster",
  position: Position.TOP,
});
export const showSuccessToast = (message: string) => {
  AppToaster.show({
    message,
    intent: Intent.SUCCESS,
    icon: "tick",
  });
};

export const showErrorToast = (message: string) => {
  AppToaster.show({
    message,
    intent: Intent.DANGER,
    icon: "error",
  });
};
