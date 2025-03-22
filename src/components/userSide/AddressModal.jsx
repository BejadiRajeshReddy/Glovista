import { FilePenLine, Trash } from "lucide-react";
import { useEffect } from "react";

const AddressModal = ({ onClose, address, handleDelete, handleEdit }) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="fixed top-32 inset-0 flex items-center justify-center bg-black bg-opacity-25 z-50 ">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4 relative hidescroll border-gray-300 overflow-y-auto">
        <label
          key={address.id}
          className="relative border min-w-[280px] sm:min-w-[384px] border-gray-300 p-3 sm:p-4 rounded-md  block cursor-pointer h-[65vh]"
        >
          <div className="pl-7">
            <div className="mb-2 flex gap-2">
              <p className="text-gray-600 font-semibold text-sm sm:text-base">
                Name:
              </p>
              <p className="text-sm sm:text-base">{address.name}</p>
            </div>
            <div className="mb-2 flex gap-2">
              <p className="text-gray-600 font-semibold text-sm sm:text-base">
                Email:
              </p>
              <p className="text-sm sm:text-base">{address.email}</p>
            </div>
            <div className="mb-2 flex gap-2">
              <p className="text-gray-600 font-semibold text-sm sm:text-base">
                House Number:
              </p>
              <p className="text-sm sm:text-base">{address.house_number}</p>
            </div>
            <div className="mb-2 flex gap-2">
              <p className="text-gray-600 font-semibold text-sm sm:text-base">
                Address:
              </p>
              <p className="text-sm sm:text-base">{address.area_address}</p>
            </div>
            <div className="mb-2 flex gap-2">
              <p className="text-gray-600 font-semibold text-sm sm:text-base">
                City:
              </p>
              <p className="text-sm sm:text-base">{address.city}</p>
            </div>
            <div className="mb-2 flex gap-2">
              <p className="text-gray-600 font-semibold text-sm sm:text-base">
                State:
              </p>
              <p className="text-sm sm:text-base">{address.state}</p>
            </div>
            <div className="mb-2 flex gap-2">
              <p className="text-gray-600 font-semibold text-sm sm:text-base">
                Zip Code:
              </p>
              <p className="text-sm sm:text-base">{address.zip_code}</p>
            </div>
            <div className="mb-2 flex gap-2">
              <p className="text-gray-600 font-semibold text-sm sm:text-base">
                Primary Number:
              </p>
              <p className="text-sm sm:text-base">{address.primary_number}</p>
            </div>
            {address.secondary_number && (
              <div className="flex gap-2">
                <p className="text-gray-600 font-semibold text-sm sm:text-base">
                  Secondary Number:
                </p>
                <p className="text-sm sm:text-base">
                  {address.secondary_number}
                </p>
              </div>
            )}
            <div className="absolute top-0 right-3 flex gap-2 mt-3">
              <FilePenLine
                onClick={(e) => handleEdit(e, address)}
                color="blue"
              />
              <Trash onClick={(e) => handleDelete(e, address.id)} color="red" />
              <button
                onClick={onClose}
                className=" top-3 right-3 text-gray-500 hover:text-gray-800"
              >
                ❌
              </button>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default AddressModal;
