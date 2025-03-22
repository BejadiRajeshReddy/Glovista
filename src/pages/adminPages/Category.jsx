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
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/adminApiService";
import { uploadImage } from "../../components/utils/cloudinary";
import { Edit3, Loader, Trash2 } from "lucide-react";
import { showToast } from "../../components/utils/toast";

const validationSchema = Yup.object({
  category_name: Yup.string()
    .min(2, "Category name must be at least 2 characters")
    .required("Category name is required"),
  category_image: Yup.string().required("Category image is required"),
});

function Category() {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUpLoading] = useState(false);
  const formik = useFormik({
    initialValues: { category_name: "", category_image: "" },
    validationSchema,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const response = await getCategory();
      setCategories(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error Fetching Categories: ", error);
      showToast("error", "Failed to fetch categories");
    }
  }

  async function handleSubmit(values, { resetForm }) {
    try {
      const categoryData = {
        category_name: values.category_name,
        category_image: values.category_image,
      };

      if (categoryId) {
        await updateCategory(categoryId, categoryData);
        showToast("success", "Category Updated Successfully!");
      } else {
        await createCategory(categoryData);
        showToast("success", "Category Added Successfully!");
      }

      setOpen(false);
      fetchCategories();
      resetForm();
      setPreview(null);
      setCategoryId(null);
    } catch (error) {
      toast.error(
        categoryId ? "Error updating category!" : "Error adding category!"
      );
    }
  }

  const handleClose = () => {
    setOpen(false);
    formik.setValues({
      category_name: "",
      category_image: "",
    });
  };

  async function handleFileChange(e) {
    setIsUpLoading(true);
    try {
      const file = e.target.files[0];
      if (!file) {
        setIsUpLoading(false);
        return showToast("error", "Please upload an Image ");
      }

      const response = await uploadImage(file);
      setPreview(response);

      formik.setFieldValue("category_image", response);
    } catch (error) {
      showToast("error", "Error Uploading Image");
      console.log(error);
    } finally {
      setIsUpLoading(false);
    }
  }

  async function handleEdit(category) {
    try {
      setCategoryId(category.id);
      formik.setValues({
        category_name: category.category_name,
        category_image: category.category_image,
      });
      setPreview(category.category_image);
      setOpen(true);
    } catch (error) {
      console.error("Error Editing category:", error);
      showToast("error", "Error Editing category");
    }
  }

  async function handleDelete(id) {
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((category) => category.id !== id));
      showToast("success", "Deleted category Successfully");
    } catch (error) {
      console.error("Error Deleting category:", error);
      showToast("error", "Error Deleting category");
    }
  }

  const rowsPerPage = 5;
  const filteredCategories = categories.filter((category) =>
    category.category_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <>
      <div>
        <h1 className="text-5xl text-center mb-4 text-[#1da199] font-roboto-mono">
          Category Management
        </h1>

        <div className="flex justify-between py-3 px-5">
          <div className="w-full"></div>
          <div className="w-full"></div>
          <div className="flex gap-4 w-full">
            <Button size="sm" className="w-2/5" onClick={() => setOpen(true)}>
              Add Category
            </Button>
            <Input
              type="search"
              label="Search Here"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="px-3 pr-3">
          {filteredCategories.length > 0 ? (
            <TableContainer className="border-[1px] py-2 px-10 border-[#565454] rounded-3xl">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Image</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedCategories.map((category) => (
                    <TableRow key={category.id} className="hover:bg-[#c9f0e6]">
                      <TableCell>{category.id}</TableCell>
                      <TableCell>
                        <img
                          src={category.category_image || "/placeholder.svg"}
                          alt={category.category_name}
                          className="w-16 h-16 rounded-full"
                        />
                      </TableCell>
                      <TableCell>{category.category_name}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => handleEdit(category)}
                          className="mr-2 border border-gray-300"
                          color="white"
                        >
                          <Edit3 color="blue" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleDelete(category.id)}
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
                  count={Math.ceil(filteredCategories.length / rowsPerPage)}
                  page={currentPage}
                  onChange={(_, newPage) => setCurrentPage(newPage)}
                  className="mt-4"
                />
              </div>
            </TableContainer>
          ) : (
            <Typography className="text-center text-4xl text-red-500">
              Categories not found
            </Typography>
          )}
        </div>
      </div>

      <Dialog open={open} handler={() => setOpen(!open)} size="md">
        <DialogHeader>
          {categoryId ? "Update Category" : "Add Category"}
        </DialogHeader>
        <form onSubmit={formik.handleSubmit}>
          <DialogBody className="px-3 flex flex-col gap-3">
            <Input
              type="text"
              label="Name for category"
              {...formik.getFieldProps("category_name")}
              error={
                formik.touched.category_name &&
                Boolean(formik.errors.category_name)
              }
            />
            <Input
              type="file"
              label="Upload Image"
              onChange={handleFileChange}
              accept="image/*"
            />
          </DialogBody>
          <DialogFooter className="flex flex-col">
            {preview && (
              <img
                src={preview || "/placeholder.svg"}
                alt="Preview"
                className="w-full rounded-full h-48 object-cover"
              />
            )}
            <div className="flex mt-2">
              <Button onClick={handleClose} className="mr-1 bg-red-500">
                Close
              </Button>
              <Button type="submit" disabled={isUploading} color="green">
                {isUploading ? <Loader /> : categoryId ? "Update" : "Confirm"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  );
}

export default Category;
