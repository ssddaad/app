import { Header } from "@/components/header";
import { ServiceCards } from "@/components/service-cards";
import { WhyChooseUs } from "@/components/why-choose-us";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      <Header />
      <main className="flex-1 max-w-[1200px] mx-auto w-full px-5 py-5">
        <ServiceCards />
        <WhyChooseUs />
      </main>
    </div>
  );
}
