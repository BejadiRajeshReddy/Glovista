import { FilePenLine, FileX } from "lucide-react";

const AddressSelector = ({
  userAddress,
  handleEdit,
  handleDelete,
  selectedAddress,
  setSelectedAddress,
}) => {
  return (
    <div>
      {userAddress.map((address) => (
        <label
          key={address.id}
          className="relative border min-w-[280px] sm:min-w-[384px] border-gray-300 p-3 sm:p-4 rounded-md mb-3 sm:mb-4 block cursor-pointer"
        >
          <input
            type="radio"
            name="selectedAddress"
            value={address.id}
            className="absolute top-3 left-3"
            onChange={() => setSelectedAddress(address)}
            checked={selectedAddress?.id === address.id}
          />
          <div className="pl-7">
            <div className="mb-2 flex gap-2">
              <p className="text-gray-600 font-semibold text-sm sm:text-base">
                Name:
              </p>
              <p className="text-sm sm:text-base">{address.name}</p>
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
              <div className="mb-2 flex gap-2">
                <p className="text-gray-600 font-semibold text-sm sm:text-base">
                  Secondary Number:
                </p>
                <p className="text-sm sm:text-base">
                  {address.secondary_number}
                </p>
              </div>
            )}
            <div className="absolute top-0 right-3 flex gap-2 mt-3">
              <FilePenLine onClick={() => handleEdit(address)} color="blue" />
              <FileX onClick={() => handleDelete(address.id)} color="red" />
            </div>
          </div>
        </label>
      ))}
    </div>
  );
};

export default AddressSelector;
