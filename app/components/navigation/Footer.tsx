import React from "react";
import { SiDiscord, SiGithub } from "react-icons/si";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="flex grid-cols-2 gap-4">
                <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
                    <SiDiscord className="icon"/>
                </a>
                <a href="https://github.com/anderm18/HassPathwaysV2.0" target="_blank" rel="noopener noreferrer">
                    <SiGithub className="icon"/>
                </a>
            </div>
            <div
                className="flex justify-center space-x-12 mx-auto text-md ">
                <Link href="/faq">FAQ</Link>
                <Link href="/courses">My Courses</Link>
                <Link href="/courses/search">Search Courses</Link>
                <Link href="/pathways">My Pathways</Link>
                <Link href="/pathways/search">Search Pathways</Link>
            </div>
        </footer>
    );

};

export default Footer;
