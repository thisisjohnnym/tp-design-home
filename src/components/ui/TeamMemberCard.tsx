import { memberDisplayName, memberInitials, type TeamMember } from "@/content/site";

export function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <article className="rule flex gap-4 border-t pt-6">
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink-100 font-coachtopia text-body-sm font-bold text-ink-700 dark:bg-ink-800 dark:text-ink-200"
        aria-hidden
      >
        {memberInitials(member.name)}
      </div>
      <div>
        <h3 className="font-coach text-headline font-bold">{memberDisplayName(member)}</h3>
        <p className="mt-1 font-coachtopia text-body text-ink-700 dark:text-ink-200">
          {member.title}
        </p>
        <p className="mt-1 font-coachtopia text-body-sm text-ink-500">{member.location}</p>
      </div>
    </article>
  );
}
