import React from "react";
import { SiDiscord, SiGithub } from "react-icons/si";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="flex grid-cols-2 gap-4">
                <SiDiscord className="icon"/>
                <SiGithub className="icon"/>
            </div>
            <div
                className="flex justify-center space-x-12 mx-auto text-md ">
                <Link href="/faq">FAQ</Link>
                <Link href="/courses">My Courses</Link>
                <Link href="/pathways">My Pathways</Link>
                <Link href="/courses/search">Search Courses</Link>
            </div>
        </footer>
    );

};


export default Footer;
