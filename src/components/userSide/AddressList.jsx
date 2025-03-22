import { useState } from "react";
import AddressModal from "./AddressModal";
import {
  deleteAddressById,
  PostAddress,
  updateAddressById,
} from "../../services/userApiServices";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
  Textarea,
} from "@material-tailwind/react";
import { showToast } from "../utils/toast";

const AddressList = ({
  userData,
  userAddress,
  setUserAddress,
  selectedAddress,
  setSelectedAddress,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [editAddress, setEditAddress] = useState(null);

  const initialValues = {
    name: editAddress?.name || "",
    email: editAddress?.email || "",
    house_number: editAddress?.house_number || "",
    area_address: editAddress?.area_address || "",
    city: editAddress?.city || "",
    state: editAddress?.state || "",
    zip_code: editAddress?.zip_code || "",
    primary_number: editAddress?.primary_number || "",
    secondary_number: editAddress?.secondary_number || "",
  };

  const handleOpen = () => {
    setOpen(!open);
    if (!open) {
      setEditAddress(null);
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Full name is required"),
    email: Yup.string().required("Full name is required"),
    house_number: Yup.string().required("House number is required"),
    area_address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    zip_code: Yup.string()
      .matches(/^[0-9]{6}$/, "Zip code must be 6 digits")
      .required("Zip code is required"),
    primary_number: Yup.string()
      .matches(/^\d{10}$/, "Primary number must be 10 digits")
      .required("Primary number is required"),
    secondary_number: Yup.string()
      .matches(/^\d{10}$/, "Secondary number must be 10 digits")
      .required("Primary number is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    const payload = {
      user: userData.user_id,
      ...values,
    };

    try {
      if (editAddress) {
        const res = await updateAddressById(editAddress.id, payload);
        setUserAddress((prev) =>
          prev.map((address) => (address.id === editAddress.id ? res : address))
        );

        showToast("success", "Address Updated Successfully");
      } else {
        const res = await PostAddress(payload);
        if (userAddress.length > 0) {
          setUserAddress((prev) => [...prev, res]);
        } else {
          setUserAddress([res]);
        }
        showToast("success", "Address Created Successfully");
      }

      resetForm();
      setOpen(false);
      setEditAddress(null);
    } catch (error) {
      console.log(error);
      showToast("error", "An error occurred while uploading the address");
    }
  };

  const handleDelete = async (addressId) => {
    e.stopPropagation();
    const confirmDelete = toast(
      <div className="">
        <p>Are you sure you want to delete this address?</p>
        <div className="flex space-x-2">
          <button
            className="bg-green-500 text-white p-2 rounded"
            onClick={async () => {
              toast.dismiss(confirmDelete);
              try {
                await deleteAddressById(addressId);
                setUserAddress((prev) =>
                  prev.filter((address) => address.id !== addressId)
                );
                showToast("success", "Address Deleted Successfully");
              } catch (error) {
                showToast(
                  "error",
                  "An error occurred while deleting the address"
                );
              }
            }}
          >
            Yes
          </button>
          <button
            className="bg-red-500 text-white p-2 rounded"
            onClick={() => toast.dismiss(confirmDelete)}
          >
            No
          </button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false }
    );
  };

  const onClose = () => {
    setIsModalOpen(false);
  };

  const handleEdit = (address) => {
    e.stopPropagation();
    setEditAddress(address);
    setOpen(true);
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-medium mb-6">Shipping Information</h2>
        <div className="flex gap-3 sm:gap-4 pb-3 sm:pb-4 items-center">
          <p className="text-base sm:text-lg font-semibold">Address</p>
          <div
            onClick={handleOpen}
            className="text-blue-800 font-medium text-sm sm:text-base cursor-pointer hover:text-blue-900"
          >
            + Add
          </div>
        </div>
        {userAddress.length > 0 ? (
          <>
            <div className="flex gap-2 h-fit w-full">
              {userAddress.map((address, i) => (
                <div key={i}>
                  {isModalOpen && (
                    <AddressModal
                      onClose={onClose}
                      address={address}
                      handleDelete={handleDelete}
                      handleEdit={handleEdit}
                      key={i}
                    />
                  )}

                  <label
                    key={address.id}
                    className="relative h-fit border min-w-[280px] sm:min-w-[384px] border-gray-300 p-3 sm:p-4 rounded-md mb-3 sm:mb-4 block cursor-pointer"
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
                          Email:
                        </p>
                        <p className="text-sm sm:text-base">{address.email}</p>
                      </div>
                      <div className="mb-2 flex gap-2">
                        <p className="text-gray-600 font-semibold text-sm sm:text-base">
                          House Number:
                        </p>
                        <p className="text-sm sm:text-base">
                          {address.house_number}
                        </p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsModalOpen(true);
                        }}
                        className="text-blue-600 hover:underline text-sm mt-2"
                      >
                        Show More
                      </button>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="border border-gray-400 bg-gray-200 rounded-md px-4 sm:px-6 py-3 gap-2 flex items-center">
              <p className="text-2xl text-gray-500">&#x1F6C8;</p>
              <p className="text-sm sm:text-base">No Address Found</p>
            </div>
          </>
        )}
      </div>
      <Dialog
        size="lg"
        className="overflow-y-auto h-[75vh]"
        open={open}
        handler={handleOpen}
      >
        <DialogHeader>
          {editAddress ? "Edit Address" : "Add Address"}
        </DialogHeader>
        <DialogBody>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="col-span-1">
                    <Field
                      name="name"
                      as={Input}
                      label="Full Name"
                      error={touched.name && !!errors.name}
                    />
                    {touched.name && errors.name && (
                      <div className="text-red-500 text-sm">{errors.name}</div>
                    )}
                  </div>
                  <div className="col-span-1">
                    <Field
                      name="email"
                      as={Input}
                      label="Email"
                      error={touched.email && !!errors.email}
                    />
                    {touched.email && errors.email && (
                      <div className="text-red-500 text-sm">{errors.email}</div>
                    )}
                  </div>
                  <div className="col-span-1">
                    <Field
                      name="house_number"
                      as={Input}
                      label="House Number"
                      error={touched.house_number && !!errors.house_number}
                    />
                    {touched.house_number && errors.house_number && (
                      <div className="text-red-500 text-sm">
                        {errors.house_number}
                      </div>
                    )}
                  </div>
                  <div className="col-span-1">
                    <Field
                      name="zip_code"
                      as={Input}
                      label="Zip Code"
                      error={touched.zip_code && !!errors.zip_code}
                    />
                    {touched.zip_code && errors.zip_code && (
                      <div className="text-red-500 text-sm">
                        {errors.zip_code}
                      </div>
                    )}
                  </div>
                  <div className="col-span-2">
                    <Field
                      name="area_address"
                      as={Textarea}
                      label="Address"
                      error={touched.area_address && !!errors.area_address}
                    />
                    {touched.area_address && errors.area_address && (
                      <div className="text-red-500 text-sm">
                        {errors.area_address}
                      </div>
                    )}
                  </div>
                  <div>
                    <Field
                      name="city"
                      as={Input}
                      label="City"
                      error={touched.city && !!errors.city}
                    />
                    {touched.city && errors.city && (
                      <div className="text-red-500 text-sm">{errors.city}</div>
                    )}
                  </div>
                  <div>
                    <Field
                      name="state"
                      as={Input}
                      label="State"
                      error={touched.state && !!errors.state}
                    />
                    {touched.state && errors.state && (
                      <div className="text-red-500 text-sm">{errors.state}</div>
                    )}
                  </div>

                  <div>
                    <Field
                      name="primary_number"
                      as={Input}
                      label="Primary Number"
                      error={touched.primary_number && !!errors.primary_number}
                    />
                    {touched.primary_number && errors.primary_number && (
                      <div className="text-red-500 text-sm">
                        {errors.primary_number}
                      </div>
                    )}
                  </div>
                  <div>
                    <Field
                      name="secondary_number"
                      as={Input}
                      label="Secondary Number"
                      error={
                        touched.secondary_number && !!errors.secondary_number
                      }
                    />
                    {touched.secondary_number && errors.secondary_number && (
                      <div className="text-red-500 text-sm">
                        {errors.secondary_number}
                      </div>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="gradient" color="blue" type="submit">
                    {editAddress ? "Update Address" : "Add Address"}
                  </Button>
                </DialogFooter>
              </Form>
            )}
          </Formik>
        </DialogBody>
      </Dialog>
    </>
  );
};

export default AddressList;
