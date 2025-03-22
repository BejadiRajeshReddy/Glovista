import { toast } from "react-toastify";

const toastStyles = {
  success: {
    color: "#15c747eb",
    fontWeight: "bold",
    fontSize: "15px",
    width: "23rem",
    backgroundColor: "#f5f6f7",
  },
  error: {
    color: "red",
    fontWeight: "bold",
    fontSize: "15px",
    width: "23rem",
    backgroundColor: "#f5f6f7",
  },
};

export const showToast = (type, message) => {
  toast(message, {
    type,
    style: toastStyles[type],
  });
};
