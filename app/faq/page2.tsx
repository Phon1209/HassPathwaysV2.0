import React from "react";
import NavigationBar from "../components/navigation/NavigationBar";
import Footer from "../components/navigation/Footer";
import { IFAQ } from "@/public/data/dataInterface";



async function getFAQ() {
    const res = await fetch("http://localhost:3000/api/faq");
    const faq = res.json();
    return faq;
}


const FAQ = async () => {
    const faqQuestions: Array<IFAQ> = await getFAQ();

    return (
        <div className = "flex flex-col min-h-screen">
            <NavigationBar className="flex"/>
            


            <Footer/>

        </div>
    );



};

export default FAQ;
