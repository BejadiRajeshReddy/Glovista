import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import Chart from "react-apexcharts";
import { Square3Stack3DIcon } from "@heroicons/react/24/outline";

const barChartConfig = {
  type: "bar",
  height: 240,
  series: [
    {
      name: "Sales",
      data: [90, 40, 300, 320, 500, 350, 200, 230, 500, 350, 206, 355],
    },
  ],
  options: {
    chart: {
      toolbar: {
        show: false,
      },
    },
    title: {
      show: "",
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#020617"],
    plotOptions: {
      bar: {
        columnWidth: "40%",
        borderRadius: 2,
      },
    },
    xaxis: {
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      labels: {
        style: {
          colors: "#616161",
          fontSize: "12px",
          fontFamily: "inherit",
          fontWeight: 400,
        },
      },
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    yaxis: {
      labels: {
        style: {
          colors: "#616161",
          fontSize: "12px",
          fontFamily: "inherit",
          fontWeight: 400,
        },
      },
    },
    grid: {
      show: true,
      borderColor: "#dddddd",
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 5,
        right: 20,
      },
    },
    fill: {
      opacity: 0.8,
    },
    tooltip: {
      theme: "dark",
    },
  },
};
const lineChartConfig = {
  type: "line",
  height: 240,
  series: [
    {
      name: "Sales",
      data: [90, 40, 300, 320, 500, 350, 200, 230, 500, 350, 206, 355],
    },
  ],
  options: {
    chart: {
      toolbar: {
        show: false,
      },
    },
    title: {
      show: "",
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#020617"],
    stroke: {
      lineCap: "round",
      curve: "smooth",
    },
    markers: {
      size: 0,
    },
    xaxis: {
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      labels: {
        style: {
          colors: "#616161",
          fontSize: "12px",
          fontFamily: "inherit",
          fontWeight: 400,
        },
      },
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    yaxis: {
      labels: {
        style: {
          colors: "#616161",
          fontSize: "12px",
          fontFamily: "inherit",
          fontWeight: 400,
        },
      },
    },
    grid: {
      show: true,
      borderColor: "#dddddd",
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 5,
        right: 20,
      },
    },
    fill: {
      opacity: 0.8,
    },
    tooltip: {
      theme: "dark",
    },
  },
};

function DashBoard() {
  return (
    <div>
      <Typography className="text-5xl  text-center mb-4 text-[#1da199] font-roboto-mono">
        Admin DashBoard
      </Typography>
      <div className="flex flex-wrap gap-2 justify-center ">
        <div className="w-72 h-52 rounded-md bg-[#252c8b]  items-center">
          <Typography className="text-3xl text-white mt-5 px-3">
            9K (-12.4%)
          </Typography>
          <Typography className="text-3xl text-white mt-1 px-3">
            {" "}
            Users
          </Typography>
        </div>
        <div className="w-72 h-52 rounded-md bg-[#258b69]">
          <Typography className="text-3xl text-white mt-5 px-3">
            ₹ 109000(40.12%)
          </Typography>
          <Typography className="text-3xl text-white  px-3">Income</Typography>
        </div>
        <div className="w-72 h-52 rounded-md bg-[#cf6631]">
          <Typography className="text-3xl text-white mt-5 px-3">
            2989 (40.1 % inc)
          </Typography>
          <Typography className="text-3xl text-white px-3 font-roborto-mono">
            Orders
          </Typography>
        </div>
        <div className="w-72 h-52 rounded-md bg-[#8b252f]">
          <Typography className="text-3xl text-white mt-5 px-3">
            954 (20% inc)
          </Typography>
          <Typography className="text-3xl text-white  px-3">
            Enquiries
          </Typography>
        </div>
      </div>
      <div className="flex flex-wrap justify-center items-center mt-5 gap-3 w-full ">
        <Card className="border-[1px] border-black">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
          >
            <div className="w-max rounded-lg bg-gray-900 p-5 text-white">
              <Square3Stack3DIcon className="h-6 w-6" />
            </div>
            <div>
              <Typography variant="h6" color="blue-gray">
                Sales analytics
              </Typography>
              <Typography
                variant="small"
                color="gray"
                className="max-w-sm font-normal"
              >
                Visualize your all sales data in a simple way using the chart
                just hover your mouse you can evaluate.
              </Typography>
            </div>
          </CardHeader>
          <CardBody className="px-2 pb-0">
            <Chart {...barChartConfig} />
          </CardBody>
        </Card>

        <Card className="border-[1px] border-black">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
          >
            <div className="w-max rounded-lg bg-gray-900 p-5 text-white">
              <Square3Stack3DIcon className="h-6 w-6" />
            </div>
            <div>
              <Typography variant="h6" color="blue-gray">
                User Analytics
              </Typography>
              <Typography
                variant="small"
                color="gray"
                className="max-w-sm font-normal"
              >
                Visualize your all users data in a simple way using the chart
                just hover your mouse you can evaluate.
              </Typography>
            </div>
          </CardHeader>
          <CardBody className="px-2 pb-0">
            <Chart {...lineChartConfig} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default DashBoard;
