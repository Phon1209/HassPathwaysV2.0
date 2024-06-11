import Link from "next/link";
import Image from "next/image";

function HomeContent() {
  return (
    <main className="flex-1 flex flex-col-reverse md:flex-row px-8 justify-between gap-12 items-center mb-12 md:mb-0">
      <section className="grow-[1.5] basis-0">
        <div className="mb-5">
          <h1 className="title">Welcome to HASS Pathways!</h1>
          <h3 className="text-sm sm:text-md md:text-lg">
            Here you can explore the different pathways RPI has to offer. To
            get started choose from on of the options below and start
            exploring your options!
          </h3>
        </div>
        <div className="flex gap-x-9">
          <Link
            href="/pathways/search"
            className="home-button
              text-white border-primary-600 bg-primary-600
              hover:border-primary-700 hover:bg-primary-700"
          >
            Explore Pathways
          </Link>
          <Link
            href="/courses/search"
            className="home-button
            text-primary-700 border-primary-200 bg-primary-50
            hover:bg-primary-100 hover:text-primary-800"
          >
            Course Search
          </Link>
        </div>
      </section>
      <div className="block grow basis-0 max-w-lg">
        <Image
          src="/../public/assets/png/home.png"
          alt="home"
          width={480}
          height={412}
        ></Image>
      </div>
    </main>
  );
}

export default HomeContent;

