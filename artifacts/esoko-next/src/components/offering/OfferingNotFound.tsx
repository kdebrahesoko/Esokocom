import { SiteLink } from "@/components/site/SiteLink";
import { buttonClass } from "./button-styles";

export function SectorNotFound() {
  return <div className="esoko-home min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <h1 className="text-3xl font-bold mb-4">Sector not found</h1>
    <SiteLink href="/sectors" className={buttonClass()}>View all sectors</SiteLink>
  </div>;
}

export function SolutionNotFound() {
  return <div className="esoko-home min-h-screen flex flex-col">
    <main className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-heading font-bold mb-4">Solution not found</h1>
        <SiteLink href="/" className="text-brand hover:underline">Return home</SiteLink>
      </div>
    </main>
  </div>;
}
