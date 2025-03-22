import { Button, Typography } from "@material-tailwind/react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";

function SalesReport() {
  return (
    <div>
      <Typography className="text-5xl  text-center mb-4 text-[#1da199] font-roboto-mono">
        Sales Report
      </Typography>
      <div className=" flex flex-wrap gap-5 justify-center mb-3">
        <label>From</label>
        <input
          type="text"
          placeholder="YYYY-MM-DD"
          className="border-[1px] w-40 h-12 text-start p-2 text-black border-[#c3c3c4] rounded-md font-prompt-normal"
        />
        <label>To</label>
        <input
          type="text"
          placeholder="YYYY-MM-DD"
          className="border-[1px] w-40 h-12 text-start p-2 text-black border-[#c3c3c4] rounded-md font-prompt-normal"
        />
        <Button className="mb-3 bg-[#1f2861]">Filter Report</Button>
        <select className="w-36 h-12 font-prompt-normal pl-2 capitalize border-[1px] rounded-md border-[#b6b3b3]">
          <option value="all">all</option>
          <option value="pending">pending</option>
          <option value="Packed">Packed</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Returned">Returned</option>
        </select>
        <Button className="mb-3 bg-[#37c48e]">Generate PDF</Button>
      </div>
      <div className="px-3 pr-3">
        <TableContainer className="border-[1px] border-[#565454] ">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="text-left">Id</TableCell>
                <TableCell className="text-left">Username</TableCell>
                <TableCell className="text-left">Email</TableCell>
                <TableCell className="text-left">Phone</TableCell>
                <TableCell className="text-left">Booking Date </TableCell>
                <TableCell className="text-left">Price</TableCell>
                <TableCell className="text-left">Stauts</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {enquiry.map((row) => ( */}
              <TableRow className="hover:bg-[#c9f0e6]">
                <TableCell>12</TableCell>
                <TableCell>sahal </TableCell>
                <TableCell>sahal@gmail.com</TableCell>
                <TableCell>+91 6262354121</TableCell>
                <TableCell>10-10-2024</TableCell>
                <TableCell>₹799</TableCell>
                <TableCell>Delivered</TableCell>
              </TableRow>
              {/* ))} */}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="h-12 -w-40 rounded-3xl flex justify-end items-end px-4  mt-2 mb-2 text-center ">
          <Typography className="text-2xl font-normal">Total:</Typography>
          <Typography className="text-2xl font-normal">₹ 1733</Typography>
        </div>
        {/* <div className='flex justify-between text-2xl  mt-3 mb-3'>
                        <Typography className='ml-5 font-normal'>
                            Total Amount
                        </Typography>
                        <Typography className='mr-10 font-normal'>
                            ₹ 55555
                        </Typography>
                    </div> */}
      </div>
    </div>
  );
}

export default SalesReport;
