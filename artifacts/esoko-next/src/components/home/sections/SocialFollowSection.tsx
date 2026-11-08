import { SocialLinks } from "@/components/site/SocialLinks";

export function SocialFollowSection() {
  return (
    <section className="esoko-social-follow" aria-labelledby="social-follow-title">
      <div className="esoko-social-inner">
        <div className="esoko-social-intro">
          <p className="esoko-social-eyebrow">Stay close to the work</p>
          <h2 id="social-follow-title">Follow our work in the field</h2>
          <p className="esoko-social-description">
            See how Esoko connects farmers, field teams and organisations.
            Follow along for stories and updates from our work.
          </p>
        </div>
        <SocialLinks />
      </div>
    </section>
  );
}
