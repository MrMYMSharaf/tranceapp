import Image from "next/image";
import CustomerDetailsForm from "./components/formcus"

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-blue-300
    ">
     <CustomerDetailsForm/>
    </div>
  );
}
