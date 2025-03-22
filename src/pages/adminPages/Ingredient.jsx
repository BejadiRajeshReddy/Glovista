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
  getIngredients,
  createIngredients,
  updateIngredients,
  deleteIngredients,
} from "../../services/adminApiService";
import { Edit3, Loader, Trash2 } from "lucide-react";
import { showToast } from "../../components/utils/toast";

const validationSchema = Yup.object({
  ingredient_name: Yup.string()
    .min(2, "Ingredient name must be at least 2 characters")
    .required("Ingredient name is required"),
});

function Ingredient() {
  const [open, setOpen] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const [ingredientId, setIngredientId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: { ingredient_name: "" },
    validationSchema,
    onSubmit: handleSubmit,
  });

  async function fetchIngredients() {
    try {
      const response = await getIngredients();
      setIngredients(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error Fetching Ingredients: ", error);
      showToast("error", "Failed to fetch Ingredients");
    }
  }

  useEffect(() => {
    fetchIngredients();
  }, []);

  async function handleSubmit(values, { resetForm }) {
    setIsLoading(true);
    try {
      if (ingredientId) {
        await updateIngredients(ingredientId, values);
        showToast("success", "Ingredient Updated Successfully!");
      } else {
        await createIngredients(values);
        showToast("success", "Ingredient Added Successfully!");
      }

      setOpen(false);
      fetchIngredients();
      resetForm();
      setIngredientId(null);
    } catch (error) {
      showToast(
        "error",
        ingredientId ? "Error updating ingredient!" : "Error adding ingredient!"
      );
    } finally {
      setIsLoading(false);
    }
  }

  const handleClose = () => {
    setOpen(false);
    formik.setValues({ ingredient_name: "" });
  };

  async function handleEdit(ingredient) {
    try {
      setIngredientId(ingredient.id);
      formik.setValues({ ingredient_name: ingredient.ingredient_name });
      setOpen(true);
    } catch (error) {
      console.error("Error Editing Ingredient:", error);
      showToast("error", "Error Editing Ingredient");
    }
  }

  async function handleDelete(id) {
    try {
      await deleteIngredients(id);
      setIngredients((prev) =>
        prev.filter((ingredient) => ingredient.id !== id)
      );
      showToast("success", "Deleted Ingredient Successfully");
    } catch (error) {
      console.error("Error Deleting Ingredient:", error);
      showToast("error", "Error Deleting Ingredient");
    }
  }

  const rowsPerPage = 5;
  const filteredIngredients = ingredients.filter((ingredient) =>
    ingredient.ingredient_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedIngredients = filteredIngredients.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <>
      <div>
        <h1 className="text-5xl text-center mb-4 text-[#1da199] font-roboto-mono">
          Ingredient Management
        </h1>

        <div className="flex justify-between py-3 px-5">
          <div className="w-full"></div>
          <div className="w-full"></div>
          <div className="flex gap-4 w-full">
            <Button size="sm" className="w-2/5" onClick={() => setOpen(true)}>
              Add Ingredient
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
          {filteredIngredients.length > 0 ? (
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
                  {paginatedIngredients.map((ingredient) => (
                    <TableRow
                      key={ingredient.id}
                      className="hover:bg-[#c9f0e6]"
                    >
                      <TableCell>{ingredient.id}</TableCell>
                      <TableCell>{ingredient.ingredient_name}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => handleEdit(ingredient)}
                          className="mr-2 border border-gray-300"
                          color="white"
                        >
                          <Edit3 color="blue" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleDelete(ingredient.id)}
                          color="white"
                          className="border border-gray-300"
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
                  count={Math.ceil(filteredIngredients.length / rowsPerPage)}
                  page={currentPage}
                  onChange={(_, newPage) => setCurrentPage(newPage)}
                  className="mt-4"
                />
              </div>
            </TableContainer>
          ) : (
            <Typography className="text-center text-4xl text-red-500">
              Ingredient not found
            </Typography>
          )}
        </div>
      </div>

      <Dialog open={open} handler={() => setOpen(!open)} size="md">
        <DialogHeader>
          {ingredientId ? "Update Ingredient" : "Add Ingredient"}
        </DialogHeader>
        <form onSubmit={formik.handleSubmit}>
          <DialogBody className="px-3 flex flex-col gap-3">
            <Input
              type="text"
              label="Name for Ingredient"
              {...formik.getFieldProps("ingredient_name")}
              error={
                formik.touched.ingredient_name &&
                Boolean(formik.errors.ingredient_name)
              }
            />
          </DialogBody>
          <DialogFooter>
            <Button onClick={handleClose} className="mr-1 bg-red-500">
              Close
            </Button>
            <Button type="submit" disabled={isLoading} color="green">
              {isLoading ? <Loader /> : ingredientId ? "Update" : "Confirm"}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  );
}

export default Ingredient;
