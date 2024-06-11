import HomeContent from "./homePage/HomePage";
import NavigationBar from "./components/navigation/NavigationBar";
import Footer from "./components/navigation/Footer";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <NavigationBar />
      <HomeContent />
      <Footer />
    </div>
  );
}


