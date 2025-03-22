import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
} from "@mui/material";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
  Input,
} from "@material-tailwind/react";
import {
  getConcerns,
  createConcern,
  updateConcern,
  deleteConcern,
} from "../../services/adminApiService";
import { Edit3, Trash2 } from "lucide-react";
import { showToast } from "../../components/utils/toast";

const validationSchema = Yup.object({
  concern_name: Yup.string()
    .min(2, "Concern name must be at least 2 characters")
    .required("Concern name is required"),
});

function Concern() {
  const [open, setOpen] = useState(false);
  const [concerns, setConcerns] = useState([]);
  const [concernId, setConcernId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const formik = useFormik({
    initialValues: { concern_name: "" },
    validationSchema,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    fetchConcerns();
  }, []);

  async function fetchConcerns() {
    try {
      const response = await getConcerns();
      setConcerns(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error Fetching Concerns: ", error);
      showToast("error", "Failed to fetch concerns");
    }
  }

  async function handleSubmit(values, { resetForm }) {
    try {
      const concernData = { concern_name: values.concern_name };

      if (concernId) {
        await updateConcern(concernId, concernData);
        showToast("success", "Concern Updated Successfully!");
      } else {
        await createConcern(concernData);
        showToast("success", "Concern Added Successfully!");
      }

      setOpen(false);
      fetchConcerns();
      resetForm();
      setConcernId(null);
    } catch (error) {
      showToast(
        "error",
        concernId ? "Error updating concern!" : "Error adding concern!"
      );
    }
  }

  const handleClose = () => {
    setOpen(false);
    formik.setValues({ concern_name: "" });
  };

  async function handleEdit(concern) {
    try {
      setConcernId(concern.id);
      formik.setValues({ concern_name: concern.concern_name });
      setOpen(true);
    } catch (error) {
      console.error("Error Editing concern:", error);
      showToast("error", "Error Editing concern");
    }
  }

  async function handleDelete(id) {
    try {
      await deleteConcern(id);
      setConcerns((prev) => prev.filter((concern) => concern.id !== id));
      showToast("success", "Deleted concern Successfully");
    } catch (error) {
      console.error("Error Deleting concern:", error);
      showToast("error", "Error Deleting concern");
    }
  }

  const rowsPerPage = 5;
  const filteredConcerns = concerns.filter((concern) =>
    concern.concern_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const paginatedConcerns = filteredConcerns.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <>
      <div>
        <h1 className="text-5xl text-center mb-4 text-[#1da199] font-roboto-mono">
          Concern Management
        </h1>

        <div className="flex justify-between py-3 px-5">
          <div className="flex gap-4 w-full">
            <Button
              size="sm"
              className="lg:w-1/6 md:w-3/6 w-5/6"
              onClick={() => setOpen(true)}
            >
              Add Concern
            </Button>
            <Input
              type="search"
              label="Search Here"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-2/3 md:w-1/3"
            />
          </div>
        </div>

        <div className="px-3 pr-3">
          {filteredConcerns.length > 0 ? (
            <TableContainer className="border-[1px] py-2 px-10 border-[#565454] rounded-3xl">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedConcerns.map((concern) => (
                    <TableRow key={concern.id} className="hover:bg-[#c9f0e6]">
                      <TableCell>{concern.id}</TableCell>
                      <TableCell>{concern.concern_name}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => handleEdit(concern)}
                          className="mr-2 border border-gray-300"
                          color="white"
                        >
                          <Edit3 color="blue" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleDelete(concern.id)}
                          color="white"
                          className=" border border-gray-300"
                        >
                          <Trash2 color="red" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-center items-center">
                <Pagination
                  count={Math.ceil(filteredConcerns.length / rowsPerPage)}
                  page={currentPage}
                  onChange={(_, newPage) => setCurrentPage(newPage)}
                  className="mt-4"
                />
              </div>
            </TableContainer>
          ) : (
            <Typography className="text-center text-4xl text-red-500">
              Concerns not found
            </Typography>
          )}
        </div>
      </div>

      <Dialog open={open} handler={() => setOpen(!open)} size="md">
        <DialogHeader>
          {concernId ? "Update Concern" : "Add Concern"}
        </DialogHeader>
        <form onSubmit={formik.handleSubmit}>
          <DialogBody className="px-3 flex flex-col gap-3">
            <Input
              type="text"
              label="Name for concern"
              {...formik.getFieldProps("concern_name")}
              error={
                formik.touched.concern_name &&
                Boolean(formik.errors.concern_name)
              }
            />
          </DialogBody>
          <DialogFooter className="flex">
            <Button onClick={handleClose} className="mr-1 bg-red-500">
              Close
            </Button>
            <Button type="submit" color="green">
              {concernId ? "Update" : "Confirm"}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  );
}

export default Concern;
