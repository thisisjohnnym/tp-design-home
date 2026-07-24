export const site = {
  teamIntro:
    "We come from diverse backgrounds—with experience across startups, agencies, and in-house teams. Those different paths shape how we see problems, collaborate, and design. Together, we bring a wide range of perspectives to the table.",
  team: [
    {
      name: "Sean Kelly",
      title: "UX Director",
      location: "Chicago, IL",
      bio: "Sean leads Tapestry's design vision with a sharp eye for craft and a deep belief in user-centered thinking. From Coach to Kate Spade, he has shaped experiences that feel unmistakably on-brand while pushing the work forward. His leadership sets the bar for how the team thinks, collaborates, and ships.",
      poster: "/team-posters/sean-kelly.jpg",
      photo: "/team-posters/sean-kelly-photo.png",
      hoverBio:
        "When I'm not at work, I'm exploring Chicago's architecture and hunting for the perfect deep dish.",
      posterLabel: "Bauhaus exhibition poster",
      email: "sean.kelly@tapestry.com",
    },
    {
      name: "Wendy Chan",
      title: "UX Sr. Manager",
      location: "New York, NY",
      bio: "Wendy brings editorial sensibility and digital craft to every surface she touches. She bridges brand storytelling and product thinking, helping teams move from concept to polished execution without losing the idea along the way. Her work is as thoughtful in the details as it is bold in the big picture.",
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
      bio: "Cong designs with clarity and curiosity, turning complex flows into experiences that feel effortless. He is especially strong at systems thinking—connecting patterns across products so everything scales with intention. Teams rely on him to ask the right questions early and keep the work grounded in real user needs.",
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
      bio: "Jonathan brings a global perspective and a maker's mindset to product design. He moves quickly from sketch to prototype, testing ideas before they become expensive assumptions. Working across time zones, he keeps collaboration tight and outcomes sharp.",
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
      bio: "Mitra combines research instincts with a strong visual point of view. She is skilled at translating messy insights into clear journeys that teams can actually build. Her work balances empathy for users with practicality for the business.",
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
      bio: "Juliana designs with warmth and precision, finding the human moment inside every interaction. She is especially good at simplifying dense experiences into flows that feel intuitive on first use. Her collaborative style helps cross-functional partners stay aligned from exploration through launch.",
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
      bio: "Gulsheen approaches design as a problem-solving practice rooted in listening first. She builds strong information architecture and interaction models that hold up under real-world complexity. Calm under pressure, she is the person teams turn to when a experience needs to be untangled and rebuilt with care.",
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
      bio: "Kat brings energy and experimentation to every project, pushing ideas further without losing sight of usability. She has a knack for visual storytelling and motion that makes products feel alive. Her enthusiasm is contagious—and it shows up in work that is both polished and full of personality.",
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
