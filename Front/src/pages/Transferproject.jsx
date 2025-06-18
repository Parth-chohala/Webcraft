import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../contexts/ThemeContext";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

const TransferConfirmPage = () => {
  const { theme } = useTheme();
  const { token } = useParams();

  const [status, setStatus] = useState("ready"); // validating, ready, accepted, rejected, error
  const [transferData, setTransferData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const validateTransfer = async () => {

      try {
        const res = await axios.get(
          `http://localhost:9080/api/transferRequest/verify/${token}`
        );
        // console.log("Transfer validation :", res.data)

        if (res.status == 200 && res.data.result.status == null) {
          setTransferData(res.data.result);
          setStatus("ready");
        } else if (res.status == 200 && res.data.result.status == 1) {
          setStatus("accepted");
        } else if (res.status == 200 && res.data.result.status == 0) {
          setStatus("rejected");
        } else {
          setStatus("error");
          setError("This transfer request is invalid or has expired.");
        }
      } catch (err) {
        setStatus("error");
        setError("Unable to verify transfer. Please try again.");
      }
    };

    validateTransfer();
  }, [token]);

  const handleAction = async (accept) => {
    try {
      const responce = await axios.post(
        `http://localhost:9080/api/transferRequest/AcceptOrRejectTransfer/${accept ? 1 : 0}`,
        {
          id: transferData.id,
          token: token,
        }
      );
      // console.log("Responce of AcceptOrRejectTransfer :", responce)
      setStatus(accept ? "accepted" : "rejected");
    } catch (err) {
      setStatus("error");
      setError("Something went wrong. Please try again.");
    }
  };

  const isDark = theme === "dark";
  const bgColor = isDark ? "bg-[#121212]" : "bg-white";
  const textColor = isDark ? "text-white" : "text-black";
  const buttonBase = "px-4 py-2 rounded font-medium";
  const cardStyle =
    "max-w-lg mx-auto rounded-xl p-6 shadow-md border border-gray-600";

  return (
    <div className={`${bgColor} min-h-screen flex items-center justify-center p-4`}>
      <div className={`${cardStyle} ${bgColor} ${textColor}`}>
        {status === "validating" && (
          <div className="flex flex-col items-center space-y-3">
            <Loader2 className="animate-spin h-6 w-6" />
            <p>Validating transfer request...</p>
          </div>
        )}

        {status === "ready" && transferData && (
          <>
            <h1 className="text-2xl font-bold mb-2 text-center text-primary">
              Project Ownership Transfer
            </h1>
            <p className="mb-4 text-center">
              You’ve been invited to take ownership of the project
              <span className="font-semibold text-blue-400"> “{transferData.projectName}”</span>.
            </p>

            <ul className="text-sm mb-4 space-y-2 list-disc list-inside text-gray-400">
              <li>This action is permanent and cannot be undone.</li>
              <li>Only one user can own the project at a time.</li>
              <li>Once accepted, the project will appear in your dashboard.</li>
            </ul>

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => handleAction(true)}
                className={`${buttonBase} bg-green-600 hover:bg-green-500 text-white`}
              >
                ✅ Accept Transfer
              </button>
              <button
                onClick={() => handleAction(false)}
                className={`${buttonBase} bg-red-600 hover:bg-red-500 text-white`}
              >
                ❌ Reject Transfer
              </button>
            </div>
          </>
        )}

        {status === "accepted" && (
          <div className="text-center space-y-3">
            <CheckCircle2 className="text-green-500 w-8 h-8 mx-auto" />
            <h2 className="text-xl font-semibold">Transfer Accepted</h2>
            <p>You now own the project. Head to your dashboard to manage it.</p>
          </div>
        )}

        {status === "rejected" && (
          <div className="text-center space-y-3">
            <XCircle className="text-red-500 w-8 h-8 mx-auto" />
            <h2 className="text-xl font-semibold">Transfer Rejected</h2>
            <p>The transfer has been declined. No changes were made.</p>
          </div>
        )}

        {status === "error" && (
          <div className="text-center text-red-400">
            <XCircle className="w-6 h-6 mx-auto mb-2" />
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransferConfirmPage;
