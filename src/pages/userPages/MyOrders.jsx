import { Button } from "@material-tailwind/react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import demo from "../../assets/products/demo1.avif";
import { Link } from "react-router-dom";

const Products = [
  {
    id: 1,
    image: demo,
    offer: "-18%",
    title: "Alovera Sun Cream",
    price: 899,
    count: 1,
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
  },
  {
    id: 2,
    image: demo,
    offer: "-19%",
    title: "Alovera Face Cream",
    count: 2,
    price: 899,
  },
];

const totalPrice = Products.reduce(
  (sum, row) => sum + row.count * row.price,
  0
);

function MyOrders() {
  return (
    <div>
      <div className="container mx-auto p-8">
        <h1 className="text-center text-4xl font-semibold mb-5 bg-pink-500 bg-clip-text text-transparent">
          My Orders
        </h1>
        <TableContainer className="border-[1px] border-[#565454] rounded-3xl">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="text-left">Image</TableCell>
                <TableCell className="text-left">Name</TableCell>
                <TableCell className="text-left">Offer</TableCell>
                <TableCell className="text-left">Price</TableCell>
                <TableCell className="text-left">Order Date</TableCell>
                <TableCell className="text-left">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Products.map((row) => (
                <Link to={`order_details/${row.id}`} className="cursor-pointer">
                  <TableRow key={row.id} className="hover:bg-[#c9f0e6]">
                    <TableCell>
                      {" "}
                      <img
                        src={row.image}
                        alt="img_row"
                        className="w-16 h-16"
                      />{" "}
                    </TableCell>
                    <TableCell>{row.title}</TableCell>
                    <TableCell>{row.offer}</TableCell>
                    <TableCell>₹ {row.price}</TableCell>
                    <TableCell>01-10-2024</TableCell>
                    <TableCell>
                      <div className="w-20 h-8 bg-pink-300 rounded-3xl flex justify-center items-center">
                        <span>Pending</span>
                      </div>
                    </TableCell>
                  </TableRow>
                </Link>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className="flex flex-col md:flex-row justify-center items-center flex-wrap gap-5 pb-4 ">
        <Button className="w-80 md:w-1/4 bg-pink-500">Continue Shopping</Button>
      </div>
    </div>
  );
}
export default MyOrders;
