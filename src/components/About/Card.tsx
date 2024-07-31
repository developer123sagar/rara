import { AboutData } from "@/data";
import { CustomIcon } from "@/common";

export default function Card() {
  return (
    <>
      <section className="md:mt-10 mt-6 mb-12">
        <div className="text-center">
          <span className="block w-16 h-2 bg-red-500 mx-auto mb-4 rounded-full"></span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Discover RARA Foods</h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">Australia's Premier Food Delivery Service</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {AboutData.map((item, i) => (
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center" key={i}>
              <CustomIcon size={60} color="red" icon={item.icon} />
              <h3 className="text-xl font-semibold mt-4 mb-2">{item.name}</h3>
              <p className="text-sm text-gray-600 text-center">{item.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 bg-white-100 py-12">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-center px-6">
            <div className="md:w-1/2 md:order-2 mb-6 md:mb-0">
              <img src="/loginbg.jpg" alt="img" className="object-cover w-full h-full rounded-lg shadow-md" />
            </div>
            <div className="md:w-1/2 md:order-1 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Our Vision</h2>
              <p className="text-lg md:text-xl text-gray-800 leading-relaxed mb-6">
                RARA Foods envisions a future where every Australian can access the best cuisine from local restaurants conveniently and affordably. Our internet-based application facilitates seamless meal ordering, secure payments, and reliable delivery services, enhancing the dining experience for individuals and groups alike.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
