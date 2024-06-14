import * as Icon from "../components/utils/Icon";
import NavigationBar from "../components/navigation/NavigationBar";
import Footer from "../components/navigation/Footer";
import { IFAQ } from "@/public/data/dataInterface";
import jsonile from "../api/faq/faq.json";

async function getFAQ() {
  // console.log("hello");
  // const res = await fetch("http://localhost:3000/api/faq");
  // console.log("hello");
  // const faq = res.json();
  return jsonile;
}

const FAQ = async () => {
  const faqQuestions: Array<IFAQ> = await getFAQ();
  console.log("await");
  
  return (
    <div className="flex flex-col min-h-screen">
      <NavigationBar className="flex" />
      <main className="flex-1 flex flex-col px-8 items-center w-full">
        <header className="py-12 md:py-24 flex flex-col gap-6 items-center w-full">
          <section className="flex flex-col gap-3 items-center">
            <p className="text-primary-700 text-md font-semibold">FAQs</p>
            <h1 className="text-display-sm md:text-display-lg font-semibold">
              Frequently asked questions
            </h1>
          </section>
          <p className="text-center text-md md:text-xl">
            Have questions? We're here to help.
          </p>
        </header>
        <section className="flex justify-center items-start gap-x-8 gap-y-16 flex-wrap mb-24">
          {faqQuestions.map((question) => {
            const IconComponent = Icon[question.icon];

            return (
              <section
                key={question.question}
                className="w-[200px] md:w-[384px]"
              >
                <div className="mb-5 border-8 border-solid border-primary-50 bg-primary-100 rounded-full w-fit p-3 mx-auto flex items-center justify-center">
                  {IconComponent && (
                    <IconComponent className="w-6 h-6 path-primary-600" />
                  )}
                </div>
                <div>
                  <header className="text-md md:text-xl font-semibold text-center text-gray-900 md-2">
                    {question.question}
                  </header>
                  <p className="text-center text-sm md:text-md text-gray-600">
                    {question.answer}
                  </p>
                </div>
              </section>
            );
          })}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
