const TEAM_BIO_PLACEHOLDER =
  "Approaching every project with deep user-centered insight and overt passion for the craft, Sean has been the fresh creative force behind market-defining experiences for Coach and Kate Spade. His raw ability in both graphic, product design and leadership have had a profound effect on Tapestry's philosophy, work and culture.";

export const site = {
  teamIntro:
    "We come from diverse backgrounds—with experience across startups, agencies, and in-house teams. Those different paths shape how we see problems, collaborate, and design. Together, we bring a wide range of perspectives to the table.",
  team: [
    {
      name: "Sean Kelly",
      title: "UX Director",
      location: "Chicago, IL",
      bio: TEAM_BIO_PLACEHOLDER,
      poster: "/team-posters/sean-kelly.jpg",
      photo: "/team-posters/sean-kelly-photo.png",
      hoverBio:
        "When I'm not at work, I'm exploring Chicago's architecture and hunting for the perfect deep dish.",
      posterLabel: "Bauhaus exhibition poster",
      email: "sean.kelly@tapestry.com",
    },
    {
      name: "Wendy Chan",
      title: "Sr. Manager, Digital Designer",
      location: "New York, NY",
      bio: TEAM_BIO_PLACEHOLDER,
      poster: "/team-posters/wendy-chan.jpg",
      photo: "/team-posters/wendy-chan-photo.png",
      hoverBio:
        "When I'm not at work, I'm wandering museum galleries and sketching the little details that catch my eye.",
      posterLabel: "Fluid wave stripes",
      email: "wendy.chan@tapestry.com",
    },
    {
      name: "Cong Kim",
      title: "Sr. Product Designer",
      location: "New York, NY",
      bio: TEAM_BIO_PLACEHOLDER,
      poster: "/team-posters/cong-kim.jpg",
      photo: "/team-posters/cong-kim-photo.png",
      hoverBio:
        "When I'm not at work, I'm trying a new café, people-watching, and collecting inspiration from everyday moments.",
      posterLabel: "Constructivist geometry",
      email: "cong.kim@tapestry.com",
    },
    {
      name: "Jonathan Martinez",
      title: "Sr. Product Designer",
      location: "Buenos Aires, Argentina",
      bio: TEAM_BIO_PLACEHOLDER,
      ic: true,
      poster: "/team-posters/jonathan-martinez.jpg",
      photo: "/team-posters/jonathan-martinez-photo.png",
      hoverBio:
        "When I'm not at work, I'm riding through the city, catching live music, and sharing mate with friends.",
      posterLabel: "Japanese GP poster",
      email: "jonathan.martinez@tapestry.com",
    },
    {
      name: "Mitra Raveendran",
      title: "UX Designer",
      location: "New York, NY",
      bio: TEAM_BIO_PLACEHOLDER,
      poster: "/team-posters/mitra-raveendran.jpg",
      photo: "/team-posters/mitra-raveendran-photo.png",
      hoverBio:
        "When I'm not at work, I'm cooking something new, dancing it out, and laughing with the people I love.",
      posterLabel: "Bauhaus bouquet",
      email: "mitra.raveendran@tapestry.com",
    },
    {
      name: "Juliana Botero",
      title: "Product Designer",
      location: "Sarasota, FL",
      bio: TEAM_BIO_PLACEHOLDER,
      poster: "/team-posters/juliana-botero.jpg",
      photo: "/team-posters/juliana-botero-photo.png",
      hoverBio:
        "When I'm not at work, I'm chasing sunsets and making memories outdoors with my son, Santi 💚",
      posterLabel: "CREATE typographic poster",
      email: "juliana.botero@tapestry.com",
    },
    {
      name: "Gulsheen Bhatia",
      title: "UX Designer",
      location: "New York, NY",
      bio: TEAM_BIO_PLACEHOLDER,
      poster: "/team-posters/gulsheen-bhatia.jpg",
      photo: "/team-posters/gulsheen-bhatia-photo.png",
      hoverBio:
        "When I'm not at work, I'm getting lost in a good book and finding calm in the middle of a busy city.",
      posterLabel: "Bauhaus bicycle",
      email: "gulsheen.bhatia@tapestry.com",
    },
    {
      name: "Kat Guzman",
      title: "UX Designer",
      location: "New York, NY",
      bio: TEAM_BIO_PLACEHOLDER,
      poster: "/team-posters/kat-guzman.jpg",
      photo: "/team-posters/kat-guzman-photo.png",
      hoverBio:
        "When I'm not at work, I'm at a concert, thrifting vinyl, and chasing the next creative rabbit hole.",
      posterLabel: "Music poster",
      email: "kat.guzman@tapestry.com",
    },
  ],
  nav: [
    { href: "#resources", label: "Resources" },
    { href: "#contact", label: "Contact" },
  ],
} as const;

export type TeamMember = (typeof site.team)[number];

export function memberDisplayName(member: TeamMember): string {
  return "ic" in member && member.ic ? `${member.name} (IC)` : member.name;
}
