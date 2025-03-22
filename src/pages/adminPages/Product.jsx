import React, { useEffect, useState, useMemo } from "react";
import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Button, Typography, Input } from "@material-tailwind/react";
import { getAdminProducts } from "../../services/adminApiService";
import { useNavigate } from "react-router-dom";

function Product() {
  const [productList, setProductList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const rowsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await getAdminProducts();

        setProductList(products);
      } catch (error) {
        console.error("An error occurred while fetching data", error);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    return productList.filter((product) =>
      product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [productList, searchQuery]);

  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );
  }, [filteredProducts, currentPage]);

  const handlePageChange = (event, newPage) => setCurrentPage(newPage);
  const handleSearch = (event) => setSearchQuery(event.target.value);

  return (
    <>
      <Typography className="text-center text-3xl font-semibold mt-5 mb-3 bg-[#1da199] bg-clip-text text-transparent">
        Product Management
      </Typography>
      <div className="w-full flex justify-between">
        <div className="flex justify-center items-center py-3">
          <Button onClick={() => navigate("/admin/addProducts")}>
            Add Product
          </Button>
        </div>
        <div className="flex items-end justify-start w-96 mb-3">
          <Input
            type="search"
            label="Search Here"
            value={searchQuery}
            onChange={handleSearch}
            className="w-96"
          />
        </div>
      </div>
      <TableContainer className="border-[1px] border-[#565454] w-screen rounded-3xl px-3 pr-3 ">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProducts.map((product) => (
              <TableRow key={product.id} className="hover:bg-[#c9f0e6]">
                <TableCell>{product.id}</TableCell>
                <TableCell>
                  <img
                    src={product.images[0].image}
                    alt="Product"
                    className="w-16 h-16"
                  />
                </TableCell>
                <TableCell>{product.product_name}</TableCell>
                <TableCell>{product.product_count}</TableCell>
                <TableCell>₹ {product.product_price}</TableCell>
                <TableCell>
                  <Button
                    onClick={() =>
                      navigate("/admin/addProducts", { state: product.id })
                    }
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-center items-center mt-4">
          <Pagination
            count={Math.ceil(filteredProducts.length / rowsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
          />
        </div>
      </TableContainer>
    </>
  );
}

export default Product;
