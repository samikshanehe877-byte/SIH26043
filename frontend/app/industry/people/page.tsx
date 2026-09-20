import PeopleDirectory from "@/components/people/PeopleDirectory";

export default function IndustryPeoplePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">People</h1>
        <p className="mt-1 text-slate-500">
          Employees, mentors and experts across your business units, with the skills and problem areas each can help with.
        </p>
      </div>
      <PeopleDirectory />
    </div>
  );
}
