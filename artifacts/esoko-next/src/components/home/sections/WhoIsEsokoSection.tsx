import { SiteLink } from "@/components/site/SiteLink";
import { StoryVideos } from "./StoryVideos";
import "./esoko-story.css";

export function WhoIsEsokoSection() {
  return (
    <section className="esoko-story-introduction" id="who-is-esoko" aria-labelledby="esoko-story-introduction-title">
      <div className="esoko-story-layout">
        <div className="esoko-story-copy">
          <h2 id="esoko-story-introduction-title">Who is Esoko?</h2>
          <p>
            Esoko was founded in 2008 to use the power of mobile phones to connect
            farmers to markets. Today, we are one of Africa’s leading agritech
            companies, helping organizations that work in rural communities with
            innovative technology.
          </p>
          <SiteLink className="esoko-story-about-link" href="/company/">
            Learn more about Esoko
          </SiteLink>
        </div>
        <StoryVideos />
      </div>
    </section>
  );
}
