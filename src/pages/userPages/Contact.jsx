import { Facebook, Instagram, Pinterest, YouTube } from "@mui/icons-material";
import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { submitEnquiry } from "../../services/userApiServices";
import { showToast } from "../../components/utils/toast";

const validationSchema = Yup.object({
  first_name: Yup.string().required("Full Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  mobile_number: Yup.string()
    .matches(/^\+?\d{10,15}$/, "Invalid mobile_number number")
    .required("mobile_number number is required"),
  country: Yup.string().required("Country/Region is required"),
  query_type: Yup.string().required("Query Type is required"),
  message: Yup.string()
    .required("Message is required")
    .min(10, "Message must be at least 10 characters"),
});

export default function Contact() {
  const handleSubmit = async (values) => {
    try {
      await submitEnquiry(values);
      showToast("success", "Message submitted successfully");
    } catch (error) {
      console.log("Error submitting Response: ", error);
    }
  };

  return (
    <div className="container mx-auto lg:px-20 px-4 pt-6 pb-12 max-w-7xl">
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-gray-700">
          Home
        </Link>
        <span>/</span> &#160; Contact
      </nav>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-8 py-10 lg:px-10 ">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Contact Details</h2>
            <p className="text-gray-900 text-sm">
              Find Our Contact Number, Email Id and Office Address.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Phone />
              <span>+91 9909000760</span>
            </div>

            <div className="flex items-center gap-3">
              <Mail />
              <span>customercare@glovista.com</span>
            </div>

            <div className="flex items-start gap-3">
              <MapPin />
              <p>
                First Floor, SM Tower, Glovista House: 480/7,
                <br />
                45th Cross Rd, 8th Block, Jayanagar,
                <br />
                Bengaluru, Karnataka 560070.
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-10 pt-8">
            <Link to="#" className="text-gray-600 hover:text-gray-900">
              <Facebook />
            </Link>
            <Link to="#" className="text-gray-600 hover:text-gray-900">
              <Instagram />
            </Link>
            <Link to="#" className="text-gray-600 hover:text-gray-900">
              <Pinterest />
            </Link>
            <Link to="#" className="text-gray-600 hover:text-gray-900">
              <YouTube />
            </Link>
          </div>
        </div>

        <div className="space-y-6 border p-10 rounded-lg">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Send us a message</h2>
            <p className="text-gray-600">
              Working Hours: Monday to Friday 10.00 am to 7.00 pm
            </p>
            <p className="text-gray-600">
              Please enter the details to hear back from us!
            </p>
          </div>

          <Formik
            initialValues={{
              first_name: "",
              email: "",
              mobile_number: "",
              country: "",
              query_type: "",
              message: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue }) => (
              <Form className="space-y-4">
                <div>
                  <Field
                    name="first_name"
                    placeholder="Full Name"
                    className="w-full border hover:border-gray-500 border-gray-300 px-4 py-2 rounded-md"
                  />
                  <ErrorMessage
                    name="first_name"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Field
                      name="email"
                      type="email"
                      placeholder="Email ID"
                      className="w-full border hover:border-gray-500 border-gray-300 px-4 py-2 rounded-md"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <div>
                    <Field
                      name="mobile_number"
                      type="tel"
                      placeholder="Mobile number"
                      className="w-full border hover:border-gray-500 border-gray-300 px-4 py-2 rounded-md"
                    />
                    <ErrorMessage
                      name="mobile_number"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Field
                      as="select"
                      name="country"
                      className="w-full border hover:border-gray-500 border-gray-300 px-4 py-2 rounded-md"
                    >
                      <option value="">Country/Region</option>
                      <option value="india">India</option>
                    </Field>
                    <ErrorMessage
                      name="country"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <Field
                      name="query_type"
                      type="text"
                      placeholder="Enter your Subject"
                      className="w-full border hover:border-gray-500 border-gray-300 px-4 py-2 rounded-md"
                    />
                    <ErrorMessage
                      name="query_type"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Field
                    as="textarea"
                    name="message"
                    placeholder="Write a message"
                    className="w-full border hover:border-gray-500 border-gray-300 px-4 py-2 rounded-md min-h-[150px]"
                  />
                  <ErrorMessage
                    name="message"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div className="w-full flex justify-center">
                  <button
                    type="submit"
                    className="w-1/3  bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-md"
                  >
                    SUBMIT
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
